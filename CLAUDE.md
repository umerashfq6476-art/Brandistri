# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Brandistri is a marketing/portfolio site for a branding agency, plus a self-serve `/admin` CMS. Next.js 14 App Router + TypeScript, Supabase (Postgres + Auth + Storage) for data, Resend for transactional email, Tailwind for styling. Path alias `@/*` maps to the repo root.

## Commands

```bash
npm run dev      # next dev (localhost:3000)
npm run build    # next build
npm run start    # serve the production build
npm run lint     # next lint (eslint-config-next, core-web-vitals)
node scripts/seed.mjs   # upsert seed-data.json into Supabase (uses service-role key from .env.local)
```

There is no test runner configured. Type-checking happens through `next build` (tsconfig is `noEmit`/`strict`).

## Environment

Copy `.env.local.example` to `.env.local`. Required: the three Supabase keys (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`), `RESEND_API_KEY`, and `NEXT_PUBLIC_SITE_URL`. Without Supabase env the middleware fails open (lets requests through) so the real error surfaces in dev.

## Architecture

### Data flow: DB rows → view models → presentational components

The presentational components were built against rich hand-authored TypeScript shapes that still live in `lib/data/projects.ts`, `lib/data/services.ts`, and `lib/data/blog.ts`. Those files export the **view-model types** (`Project`, `Service`, `Tier`, `Metric`, etc.) and legacy static content. Components import and render these shapes — do **not** make components query Supabase directly.

Live data is bridged through `lib/data/adapters.ts`: `dbProjectToView`, `dbServiceToView`, and `dbPackageToTier` map raw `*Row` types (from `lib/supabase/types.ts`) onto the view-model shapes. Public pages fetch rows via helpers, run them through an adapter, then pass the result to components. When the DB lacks a field the view model wants, the adapter fills a sensible default (e.g. an accent-gradient cover, a derived color palette). When adding a DB field that should reach the UI, wire it through the adapter — that is the single seam.

### Supabase client selection (this matters for correctness)

`lib/supabase/server.ts` exports five distinct clients; pick deliberately:

- `getSupabasePublicClient()` — anon, **no cookies**. Use for public content reads in Server Components. Because it never calls `cookies()`, pages stay statically renderable so `export const revalidate` (ISR) works. This is the default client inside `lib/supabase/helpers.ts`.
- `getSupabaseServerClient()` — anon, reads cookies (cookie writes are no-ops). For Server Components that need the logged-in user.
- `getSupabaseRouteClient()` — anon, **can write cookies**. Use in Route Handlers and Server Actions for sign-in/out/session rotation.
- `getSupabaseAdminClient()` — **service-role, bypasses RLS**. Server-only; never import from a Client Component. Used by the seed script, the contact route, and settings reads.
- `getSupabaseBrowserClient()` (`lib/supabase/client.ts`) — singleton browser client for Client Components.

`lib/supabase/helpers.ts` is the typed data-access layer (pagination, filtering, `generateUniqueSlug`, `submitContactMessage`). Public read helpers swallow errors and degrade to empty content via `ensureOk` so a transient read failure at ISR time doesn't take down the page.

### Public vs. admin rendering

- **Public pages** (`/`, `/work`, `/services`, `/blog`, etc.) use `export const revalidate = 60` (ISR). They read with the cookie-less public client and only ever see published/active rows (enforced both in the helper queries and by RLS).
- **Admin pages** (`app/admin/**`) use `export const dynamic = "force-dynamic"`. Each section has an `actions.ts` of `"use server"` Server Actions returning a discriminated `ActionResult<T>` (`{ ok: true, data? } | { ok: false, error }`). Mutations call `revalidatePath(...)` (and `revalidateTag(SETTINGS_CACHE_TAG)` for settings) so public ISR pages refresh on publish.

### Auth

`middleware.ts` runs only on `/admin/:path*`. It refreshes the Supabase session cookie, redirects unauthenticated users to `/admin/login?redirectTo=...`, and bounces already-signed-in users off the login page. RLS policies (see below) gate "admin" writes — there is no separate role table; the policies key off authenticated users.

### Settings

The `settings` table is **not** anon-readable. `lib/settings-server.ts` reads it with the admin client wrapped in `unstable_cache` (tag `site-settings`) so public pages (footer, contact) stay static; admin mutations revalidate that tag. Never import `lib/settings-server.ts` from a Client Component (it pulls in the service-role client).

### Database & storage

`lib/supabase/schema.sql` is the source of truth: tables `posts`, `projects`, `services`, `packages`, `messages`, `settings`, plus RLS policies and storage-object policies. `lib/supabase/types.ts` holds the hand-maintained `Database` type and the `*Row`/`*Insert`/`*Update` aliases — keep it in sync with `schema.sql` by hand (no codegen wired up). Three public-read/admin-write storage buckets (`blog-covers`, `project-images`, `brand-assets`) must be created manually; see `lib/supabase/STORAGE.md`. Client-safe upload/slug helpers live in `lib/supabase/storage.ts` (no `next/headers` import) and are re-exported from `helpers.ts`.

### Contact & email

`app/api/contact/route.ts` (Node runtime) validates with helpers from `lib/contact.ts`, applies an in-memory per-IP rate limit (5/hour — resets on redeploy, not durable), inserts the message via the admin client, and sends notification email through Resend. `lib/contact.ts` holds the shared payload type, validation regexes, sanitizers, and the dropdown option enums used by both the form and the route.

## Conventions

- Components default to Server Components; add `"use client"` only when needed (interactivity, hooks, `@hello-pangea/dnd`, tiptap editors).
- Rich text in the admin uses tiptap (`components/admin/RichTextEditor.tsx`); blog content is stored/rendered as HTML.
- Public site components live under `components/<section>/`; admin UI under `components/admin/` (with shared primitives in `components/admin/ui/`).
- When editing slugged content, use `generateUniqueSlug(title, { table, ignoreId })` so a row's own slug isn't counted as a collision against itself.
