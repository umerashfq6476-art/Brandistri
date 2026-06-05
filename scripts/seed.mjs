/**
 * One-off content seeder for the Brandistri Supabase project.
 *
 * Reads scripts/seed-data.json and upserts it into the projects, services,
 * posts, and packages tables using the service-role key (bypasses RLS).
 * Safe to re-run: rows are upserted on their natural unique key.
 *
 *   node scripts/seed.mjs
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// ── Load env from .env.local (Node doesn't read it automatically) ──────────────
function loadEnv() {
  const env = {};
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !line.trim().startsWith("#")) env[m[1]] = m[2];
    }
  } catch {
    /* fall back to process.env */
  }
  return { ...env, ...process.env };
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const data = JSON.parse(readFileSync(join(__dirname, "seed-data.json"), "utf8"));

async function upsert(table, rows, conflictKey) {
  const { error } = await supabase
    .from(table)
    .upsert(rows, conflictKey ? { onConflict: conflictKey } : undefined);
  if (error) {
    console.error(`✗ ${table}: ${error.message}`);
    throw error;
  }
  console.log(`✓ ${table}: ${rows.length} row(s) upserted`);
}

async function main() {
  // Remove the malformed test service ("brand-identiy") if it's still around.
  const { error: delErr } = await supabase
    .from("services")
    .delete()
    .eq("slug", "brand-identiy");
  if (delErr) console.warn(`! could not remove test service: ${delErr.message}`);
  else console.log("✓ removed test service 'brand-identiy' (if present)");

  await upsert("services", data.services, "slug");
  await upsert("projects", data.projects, "slug");
  await upsert("posts", data.posts, "slug");

  // packages has no natural unique key — only insert if the table is empty so
  // re-runs don't create duplicates.
  const { count } = await supabase
    .from("packages")
    .select("*", { count: "exact", head: true });
  if ((count ?? 0) === 0) {
    await upsert("packages", data.packages);
  } else {
    console.log(`• packages: ${count} row(s) already exist — skipping`);
  }

  console.log("\nDone. Content seeded successfully.");
}

main().catch(() => process.exit(1));
