import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  BUDGET_OPTIONS,
  EMAIL_REGEX,
  SERVICE_OPTIONS,
  TIMELINE_OPTIONS,
  escapeHtml,
  sanitize,
  type BudgetOption,
  type ContactPayload,
  type ServiceOption,
  type TimelineOption,
} from "@/lib/contact";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS, getSiteSettings, type SiteSettings } from "@/lib/settings";
import type { MessageInsert } from "@/lib/supabase/types";

export const runtime = "nodejs";

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 5;
const rateLimitStore = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

function checkRateLimit(ip: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const history = (rateLimitStore.get(ip) ?? []).filter(
    (ts) => now - ts < RATE_WINDOW_MS,
  );
  if (history.length >= RATE_MAX) {
    const retryAfter = Math.ceil(
      (RATE_WINDOW_MS - (now - history[0])) / 1000,
    );
    rateLimitStore.set(ip, history);
    return { ok: false, retryAfter };
  }
  history.push(now);
  rateLimitStore.set(ip, history);
  return { ok: true };
}

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!raw || typeof raw !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const body = raw as Record<string, unknown>;
  const service = sanitize(body.service, 80);
  const name = sanitize(body.name, 120);
  const email = sanitize(body.email, 200).toLowerCase();
  const company = sanitize(body.company, 160);
  const website = sanitize(body.website, 300);
  const budget = sanitize(body.budget, 80);
  const timeline = sanitize(body.timeline, 80);
  const description = sanitize(body.description, 5000);

  if (!service || !SERVICE_OPTIONS.includes(service as ServiceOption)) {
    return NextResponse.json(
      { error: "Please select a valid service.", field: "service" },
      { status: 422 },
    );
  }
  if (!name) {
    return NextResponse.json(
      { error: "Name is required.", field: "name" },
      { status: 422 },
    );
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "A valid email is required.", field: "email" },
      { status: 422 },
    );
  }
  if (!budget || !BUDGET_OPTIONS.includes(budget as BudgetOption)) {
    return NextResponse.json(
      { error: "Please choose a budget range.", field: "budget" },
      { status: 422 },
    );
  }
  if (!timeline || !TIMELINE_OPTIONS.includes(timeline as TimelineOption)) {
    return NextResponse.json(
      { error: "Please choose a timeline.", field: "timeline" },
      { status: 422 },
    );
  }
  if (!description || description.length < 20) {
    return NextResponse.json(
      { error: "Please share a few more details about your project.", field: "description" },
      { status: 422 },
    );
  }

  const ip = getClientIp(request);
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfter) },
      },
    );
  }

  const payload: ContactPayload = {
    service: service as ServiceOption,
    name,
    email,
    company: company || undefined,
    website: website || undefined,
    budget: budget as BudgetOption,
    timeline: timeline as TimelineOption,
    description,
  };

  // ── Load site settings (service-role: settings are not anon-readable) ──
  let settings: SiteSettings = DEFAULT_SETTINGS;
  let admin: ReturnType<typeof getSupabaseAdminClient> | null = null;
  try {
    admin = getSupabaseAdminClient();
    settings = await getSiteSettings(admin);
  } catch (err) {
    // Missing service-role env or read failure — fall back to defaults and
    // skip the DB save rather than failing the whole submission.
    console.warn("[contact] settings/admin client unavailable", err);
  }

  if (!settings.contact.formActive) {
    return NextResponse.json(
      { error: "The contact form is currently closed. Please email us directly." },
      { status: 503 },
    );
  }

  // ── Persist to the messages inbox first, so admins never lose a lead ──
  // The website has no column of its own, so fold it into the message body.
  const messageBody = website
    ? `${description}\n\nWebsite: ${website}`
    : description;

  let saved = false;
  if (admin) {
    const insert: MessageInsert = {
      name,
      email,
      company: company || null,
      service_type: service,
      budget,
      timeline,
      message: messageBody,
      source: "contact",
    };
    const { error: insertError } = await admin.from("messages").insert(insert);
    if (insertError) {
      console.error("[contact] failed to save message", insertError);
    } else {
      saved = true;
    }
  }

  // ── Email notification + auto-reply (best-effort) ──
  const apiKey = process.env.RESEND_API_KEY;
  const to =
    settings.contact.notificationEmail ||
    settings.business.contactEmail ||
    process.env.CONTACT_EMAIL ||
    "mashab@brandistri.com";
  const fromAddress = process.env.RESEND_FROM_EMAIL || "Brandistri <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn(
      "[contact] RESEND_API_KEY missing — skipping email send. Payload:",
      { service, name, email },
    );
    // The submission was still captured if the DB save succeeded.
    if (saved) return NextResponse.json({ ok: true, emailed: false, saved });
    return NextResponse.json(
      { error: "We couldn't process your message right now. Please email us directly." },
      { status: 502 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const [notification, autoReply] = await Promise.allSettled([
      resend.emails.send({
        from: fromAddress,
        to,
        reply_to: email,
        subject: `New Project Inquiry — ${service} from ${name}`,
        html: notificationHtml(payload),
        text: notificationText(payload),
      }),
      resend.emails.send({
        from: fromAddress,
        to: email,
        subject: "We received your inquiry — Brandistri",
        html: autoReplyHtml(payload, settings.contact.autoReply),
        text: autoReplyText(payload, settings.contact.autoReply),
      }),
    ]);

    if (notification.status === "rejected") {
      console.error("[contact] notification failed", notification.reason);
    }
    if (autoReply.status === "rejected") {
      console.error("[contact] auto-reply failed", autoReply.reason);
    }

    return NextResponse.json({ ok: true, emailed: true, saved });
  } catch (err) {
    console.error("[contact] send error", err);
    // If we at least saved the message, treat the submission as a success.
    if (saved) return NextResponse.json({ ok: true, emailed: false, saved });
    return NextResponse.json(
      { error: "We couldn't send your message right now. Please try again." },
      { status: 502 },
    );
  }
}

function notificationHtml(p: ContactPayload): string {
  const rows: Array<[string, string]> = [
    ["Service", p.service],
    ["Name", p.name],
    ["Email", p.email],
    ["Company", p.company || "—"],
    ["Website", p.website || "—"],
    ["Budget", p.budget],
    ["Timeline", p.timeline],
  ];

  return wrapEmail(`
    <tr>
      <td style="padding:0 32px 8px;">
        <div style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#888;">New inquiry</div>
        <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:28px;line-height:1.15;color:#fff;font-weight:600;">
          ${escapeHtml(p.service)} — from ${escapeHtml(p.name)}
        </h1>
      </td>
    </tr>
    <tr><td style="padding:24px 32px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0;border:1px solid #222;border-radius:14px;overflow:hidden;">
        ${rows
          .map(
            ([label, value], i) => `
          <tr>
            <td style="padding:14px 18px;background:#111;border-bottom:${i < rows.length - 1 ? "1px solid #222" : "none"};width:140px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#888;">${escapeHtml(label)}</td>
            <td style="padding:14px 18px;background:#111;border-bottom:${i < rows.length - 1 ? "1px solid #222" : "none"};font-size:14px;color:#fff;">${escapeHtml(value)}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </td></tr>
    <tr><td style="padding:24px 32px 0;">
      <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#888;">Project description</div>
      <div style="margin-top:10px;padding:16px 18px;background:#111;border:1px solid #222;border-radius:14px;font-size:15px;line-height:1.6;color:#eee;white-space:pre-wrap;">${escapeHtml(p.description)}</div>
    </td></tr>
    <tr><td style="padding:28px 32px 8px;">
      <a href="mailto:${escapeHtml(p.email)}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#6366F1;color:#fff;text-decoration:none;font-size:13px;font-weight:500;">Reply to ${escapeHtml(p.name.split(" ")[0])}</a>
    </td></tr>
  `);
}

function notificationText(p: ContactPayload): string {
  return [
    `New Project Inquiry — ${p.service}`,
    "",
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    `Company: ${p.company || "—"}`,
    `Website: ${p.website || "—"}`,
    `Budget: ${p.budget}`,
    `Timeline: ${p.timeline}`,
    "",
    "Description:",
    p.description,
  ].join("\n");
}

function autoReplyHtml(p: ContactPayload, intro?: string): string {
  const firstName = escapeHtml(p.name.split(" ")[0]);
  const introHtml = intro
    ? escapeHtml(intro)
    : `We&rsquo;ve received your project details for <strong style="color:#fff;">${escapeHtml(p.service)}</strong> and one of our strategists is reviewing it now. You can expect a personal reply within the next 24 hours.`;
  const steps: Array<[string, string]> = [
    ["01", "We review your brief and project context."],
    ["02", "We schedule a 30-minute strategy call."],
    ["03", "You receive a tailored proposal and timeline."],
  ];

  return wrapEmail(`
    <tr><td style="padding:0 32px 8px;">
      <div style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#ADFF2F;">Inquiry received</div>
      <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:28px;line-height:1.2;color:#fff;font-weight:600;">
        Thanks, ${firstName}.
      </h1>
    </td></tr>
    <tr><td style="padding:16px 32px 0;">
      <p style="margin:0;font-size:15px;line-height:1.65;color:#bbb;">
        ${introHtml}
      </p>
    </td></tr>
    <tr><td style="padding:28px 32px 0;">
      <div style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#888;">What happens next</div>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;border-collapse:separate;border-spacing:0;border:1px solid #222;border-radius:14px;overflow:hidden;">
        ${steps
          .map(
            ([num, text], i) => `
          <tr>
            <td style="padding:16px 18px;background:#111;border-bottom:${i < steps.length - 1 ? "1px solid #222" : "none"};width:50px;font-family:Georgia,serif;font-size:22px;color:#6366F1;font-weight:600;">${num}</td>
            <td style="padding:16px 18px;background:#111;border-bottom:${i < steps.length - 1 ? "1px solid #222" : "none"};font-size:14px;color:#eee;">${text}</td>
          </tr>`,
          )
          .join("")}
      </table>
    </td></tr>
    <tr><td style="padding:28px 32px 0;">
      <p style="margin:0;font-size:14px;line-height:1.65;color:#888;">
        In the meantime, feel free to reply to this email with any extra context
        — moodboards, competitors you admire, deadlines, anything that helps us
        prepare for the call.
      </p>
    </td></tr>
    <tr><td style="padding:28px 32px 8px;">
      <p style="margin:0;font-size:14px;color:#fff;">— The Brandistri team</p>
    </td></tr>
  `);
}

function autoReplyText(p: ContactPayload, intro?: string): string {
  const firstName = p.name.split(" ")[0];
  return [
    `Thanks, ${firstName}.`,
    "",
    intro || `We've received your inquiry for ${p.service} and will reply within 24 hours.`,
    "",
    "What happens next:",
    "01  We review your brief and project context.",
    "02  We schedule a 30-minute strategy call.",
    "03  You receive a tailored proposal and timeline.",
    "",
    "— The Brandistri team",
  ].join("\n");
}

function wrapEmail(inner: string): string {
  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Brandistri</title>
  </head>
  <body style="margin:0;padding:0;background:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#fff;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;">
      <tr><td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#0A0A0A;border:1px solid #222;border-radius:24px;overflow:hidden;">
          <tr><td style="padding:32px 32px 0;">
            <div style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.01em;">
              BRANDISTRI<span style="color:#ADFF2F;">.</span>
            </div>
          </td></tr>
          ${inner}
          <tr><td style="padding:36px 32px;border-top:1px solid #222;">
            <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#555;">Brandistri Studio</div>
            <div style="margin-top:6px;font-size:12px;color:#888;">Strategic branding &middot; mashab@brandistri.com</div>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>
  `.trim();
}
