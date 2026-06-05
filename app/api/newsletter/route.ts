import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EMAIL_REGEX, escapeHtml, sanitize } from "@/lib/contact";

export const runtime = "nodejs";

const DATA_FILE = path.join(process.cwd(), "data", "newsletter.json");
const memorySubscribers = new Set<string>();

type Store = { emails: string[] };

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<Store>;
    const emails = Array.isArray(parsed.emails) ? parsed.emails : [];
    return { emails };
  } catch {
    return { emails: Array.from(memorySubscribers) };
  }
}

async function writeStore(store: Store): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), "utf8");
    return true;
  } catch (err) {
    console.warn("[newsletter] persist failed, using in-memory fallback", err);
    store.emails.forEach((e) => memorySubscribers.add(e));
    return false;
  }
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

  const email = sanitize((raw as { email?: unknown }).email, 200).toLowerCase();
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 422 },
    );
  }

  const store = await readStore();
  if (store.emails.includes(email) || memorySubscribers.has(email)) {
    return NextResponse.json({ ok: true, already: true });
  }

  store.emails.push(email);
  await writeStore(store);
  memorySubscribers.add(email);

  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress =
    process.env.RESEND_FROM_EMAIL || "Brandistri <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn(
      "[newsletter] RESEND_API_KEY missing — skipping welcome email for",
      email,
    );
    return NextResponse.json({ ok: true, emailed: false });
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: "Welcome to Brandistri",
      html: welcomeHtml(email),
      text: welcomeText(),
    });
    if ((result as { error?: unknown }).error) {
      console.error("[newsletter] welcome send error", result);
    }
  } catch (err) {
    console.error("[newsletter] welcome send threw", err);
  }

  return NextResponse.json({ ok: true, emailed: true });
}

function welcomeHtml(email: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://brandistri.com";
  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>Welcome to Brandistri</title>
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
          <tr><td style="padding:24px 32px 0;">
            <div style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#ADFF2F;">You&rsquo;re in</div>
            <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:28px;line-height:1.2;color:#fff;font-weight:600;">
              Welcome to Brandistri.
            </h1>
          </td></tr>
          <tr><td style="padding:18px 32px 0;">
            <p style="margin:0;font-size:15px;line-height:1.65;color:#bbb;">
              Thanks for subscribing with <strong style="color:#fff;">${escapeHtml(email)}</strong>.
              Once or twice a month we&rsquo;ll share field notes from the studio
              &mdash; behind-the-scenes case studies, brand teardowns, and a few
              things we&rsquo;re learning.
            </p>
          </td></tr>
          <tr><td style="padding:28px 32px 0;">
            <a href="${siteUrl}/work" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#ADFF2F;color:#0A0A0A;text-decoration:none;font-size:13px;font-weight:600;">See selected work</a>
          </td></tr>
          <tr><td style="padding:36px 32px;border-top:1px solid #222;margin-top:32px;">
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

function welcomeText(): string {
  return [
    "Welcome to Brandistri.",
    "",
    "Thanks for subscribing. Once or twice a month we'll share field notes from the studio.",
    "",
    "— The Brandistri team",
  ].join("\n");
}
