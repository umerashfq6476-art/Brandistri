-- =============================================================================
-- Brandistri — Supabase schema
-- -----------------------------------------------------------------------------
-- Run this file once in the Supabase SQL editor against a fresh project. It is
-- idempotent: every CREATE uses IF NOT EXISTS and policies are dropped before
-- being recreated, so you can re-apply it after edits.
--
-- Tables: posts, projects, services, packages, messages, settings
-- Security model:
--   * anon role can SELECT only the published rows of public content tables
--     and INSERT into messages.
--   * authenticated role has full CRUD across every table (treated as admin).
--   * Settings and messages are never readable by anon.
-- =============================================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "citext";     -- case-insensitive email column


-- ─── Shared trigger: keep updated_at fresh on every row touch ───────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;


-- =============================================================================
-- POSTS — long-form blog content
-- =============================================================================
create table if not exists public.posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  excerpt         text,
  content         text not null default '',         -- markdown or HTML body
  cover_image     text,                              -- public storage URL
  category        text not null default 'Insights'
                  check (category in (
                    'Branding','Strategy','Web','Social','Video','Insights','Case Study'
                  )),
  tags            text[] not null default '{}',
  author_id       uuid references auth.users(id) on delete set null,
  author_name     text,
  read_time       int not null default 5
                  check (read_time between 1 and 120),
  featured        boolean not null default false,
  published       boolean not null default false,
  seo_title       text,
  seo_description text,
  seo_keywords    text[] not null default '{}',
  published_at    timestamptz,
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now())
);

create index if not exists posts_published_idx
  on public.posts (published, published_at desc);
create index if not exists posts_category_idx on public.posts (category);
create index if not exists posts_featured_idx
  on public.posts (featured) where featured;
create index if not exists posts_tags_idx on public.posts using gin (tags);

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();


-- =============================================================================
-- PROJECTS — portfolio case studies
-- =============================================================================
create table if not exists public.projects (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  client          text not null,
  category        text not null
                  check (category in (
                    'Brand Identity','Web Design','Social Branding',
                    'Video Content','Brand Strategy'
                  )),
  tags            text[] not null default '{}',
  description     text not null default '',
  challenge       text,
  solution        text,
  results         text,
  cover_image     text,
  gallery_images  text[] not null default '{}',
  accent_color    text not null default '#6366F1'
                  check (accent_color ~* '^#[0-9a-f]{6}$'),
  featured        boolean not null default false,
  published       boolean not null default false,
  year            int not null default extract(year from now())::int
                  check (year between 2000 and 2100),
  duration        text,
  services        text[] not null default '{}',     -- slugs from services table
  metrics         jsonb not null default '[]'::jsonb,
  testimonial     jsonb,
  display_order   int not null default 0,
  published_at    timestamptz,
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now())
);

create index if not exists projects_published_idx
  on public.projects (published, display_order, published_at desc);
create index if not exists projects_category_idx on public.projects (category);
create index if not exists projects_featured_idx
  on public.projects (featured) where featured;
create index if not exists projects_tags_idx on public.projects using gin (tags);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();


-- =============================================================================
-- SERVICES — agency offerings
-- =============================================================================
create table if not exists public.services (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  title           text not null,
  tagline         text,
  summary         text,
  description     text not null default '',
  icon            text,                              -- lucide icon name
  deliverables    text[] not null default '{}',
  process         jsonb not null default '[]'::jsonb, -- ProcessStep[]
  benefits        jsonb not null default '[]'::jsonb, -- ServiceBenefit[] { title, description }
  starting_price  numeric(12,2)
                  check (starting_price is null or starting_price >= 0),
  price_label     text,                              -- e.g. "from $4,500"
  display_order   int not null default 0,
  active          boolean not null default true,
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now())
);

create index if not exists services_active_idx
  on public.services (active, display_order);

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();


-- =============================================================================
-- PACKAGES — pricing tiers shown on the pricing page
-- =============================================================================
create table if not exists public.packages (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  description     text,
  price           numeric(12,2)
                  check (price is null or price >= 0),
  price_label     text,                              -- override for "Custom" etc.
  price_period    text not null default 'one-time'
                  check (price_period in ('one-time','monthly','yearly','custom')),
  features        text[] not null default '{}',
  popular         boolean not null default false,
  active          boolean not null default true,
  display_order   int not null default 0,
  cta_label       text,
  cta_url         text,
  created_at      timestamptz not null default timezone('utc', now()),
  updated_at      timestamptz not null default timezone('utc', now())
);

create index if not exists packages_active_idx
  on public.packages (active, display_order);

drop trigger if exists packages_set_updated_at on public.packages;
create trigger packages_set_updated_at
  before update on public.packages
  for each row execute function public.set_updated_at();


-- =============================================================================
-- MESSAGES — contact / newsletter / service inquiry submissions
-- =============================================================================
create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           citext not null,
  phone           text,
  company         text,
  project_type    text,
  service_type    text,
  budget          text,
  timeline        text,
  message         text not null,
  source          text not null default 'contact'
                  check (source in ('contact','newsletter','service','package')),
  read            boolean not null default false,
  read_at         timestamptz,
  replied         boolean not null default false,
  replied_at      timestamptz,
  archived        boolean not null default false,
  received_at     timestamptz not null default timezone('utc', now())
);

-- If you provisioned the project before the replied columns existed, this
-- block adds them in place (safe to re-run).
alter table public.messages
  add column if not exists replied    boolean not null default false;
alter table public.messages
  add column if not exists replied_at timestamptz;

create index if not exists messages_unread_idx
  on public.messages (read, received_at desc) where not read;
create index if not exists messages_received_idx
  on public.messages (received_at desc);


-- =============================================================================
-- SETTINGS — typed key/value store for site-wide configuration
-- =============================================================================
create table if not exists public.settings (
  key             text primary key,
  value           jsonb not null,
  description     text,
  updated_at      timestamptz not null default timezone('utc', now())
);

drop trigger if exists settings_set_updated_at on public.settings;
create trigger settings_set_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();


-- =============================================================================
-- ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------
-- Every table has RLS enabled. The anon role only sees the rows the public
-- website is allowed to read; the authenticated role is treated as admin
-- and gets full CRUD. Tighten further (e.g. role claims) when you add
-- multiple admin tiers.
-- =============================================================================

alter table public.posts     enable row level security;
alter table public.projects  enable row level security;
alter table public.services  enable row level security;
alter table public.packages  enable row level security;
alter table public.messages  enable row level security;
alter table public.settings  enable row level security;

-- ── posts ──────────────────────────────────────────────────────────────────
drop policy if exists "Public can read published posts"      on public.posts;
drop policy if exists "Admins can manage posts"              on public.posts;

create policy "Public can read published posts"
  on public.posts for select
  to anon, authenticated
  using (published = true or auth.role() = 'authenticated');

create policy "Admins can manage posts"
  on public.posts for all
  to authenticated
  using (true)
  with check (true);

-- ── projects ───────────────────────────────────────────────────────────────
drop policy if exists "Public can read published projects"   on public.projects;
drop policy if exists "Admins can manage projects"           on public.projects;

create policy "Public can read published projects"
  on public.projects for select
  to anon, authenticated
  using (published = true or auth.role() = 'authenticated');

create policy "Admins can manage projects"
  on public.projects for all
  to authenticated
  using (true)
  with check (true);

-- ── services ───────────────────────────────────────────────────────────────
drop policy if exists "Public can read active services"      on public.services;
drop policy if exists "Admins can manage services"           on public.services;

create policy "Public can read active services"
  on public.services for select
  to anon, authenticated
  using (active = true or auth.role() = 'authenticated');

create policy "Admins can manage services"
  on public.services for all
  to authenticated
  using (true)
  with check (true);

-- ── packages ───────────────────────────────────────────────────────────────
drop policy if exists "Public can read active packages"      on public.packages;
drop policy if exists "Admins can manage packages"           on public.packages;

create policy "Public can read active packages"
  on public.packages for select
  to anon, authenticated
  using (active = true or auth.role() = 'authenticated');

create policy "Admins can manage packages"
  on public.packages for all
  to authenticated
  using (true)
  with check (true);

-- ── messages ───────────────────────────────────────────────────────────────
-- Anyone may submit a message via the contact form. Only authenticated
-- admins can read, update, or delete.
drop policy if exists "Public can submit messages"           on public.messages;
drop policy if exists "Admins can read messages"             on public.messages;
drop policy if exists "Admins can update messages"           on public.messages;
drop policy if exists "Admins can delete messages"           on public.messages;

create policy "Public can submit messages"
  on public.messages for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read messages"
  on public.messages for select
  to authenticated
  using (true);

create policy "Admins can update messages"
  on public.messages for update
  to authenticated
  using (true)
  with check (true);

create policy "Admins can delete messages"
  on public.messages for delete
  to authenticated
  using (true);

-- ── settings ───────────────────────────────────────────────────────────────
-- Settings are never readable by anonymous users. Read them from the server
-- with the service-role client when you need them on a public page.
drop policy if exists "Admins can manage settings"           on public.settings;

create policy "Admins can manage settings"
  on public.settings for all
  to authenticated
  using (true)
  with check (true);


-- =============================================================================
-- STORAGE POLICIES
-- -----------------------------------------------------------------------------
-- Buckets themselves must be created in the dashboard (or via the JS admin
-- client) — see lib/supabase/STORAGE.md. These policies grant the expected
-- "public read, admin write" semantics once the buckets exist.
-- =============================================================================

drop policy if exists "Public read for public buckets"   on storage.objects;
drop policy if exists "Admins can upload to public buckets" on storage.objects;
drop policy if exists "Admins can update public buckets"   on storage.objects;
drop policy if exists "Admins can delete from public buckets" on storage.objects;

create policy "Public read for public buckets"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id in ('blog-covers','project-images','brand-assets'));

create policy "Admins can upload to public buckets"
  on storage.objects for insert
  to authenticated
  with check (bucket_id in ('blog-covers','project-images','brand-assets'));

create policy "Admins can update public buckets"
  on storage.objects for update
  to authenticated
  using (bucket_id in ('blog-covers','project-images','brand-assets'))
  with check (bucket_id in ('blog-covers','project-images','brand-assets'));

create policy "Admins can delete from public buckets"
  on storage.objects for delete
  to authenticated
  using (bucket_id in ('blog-covers','project-images','brand-assets'));


-- =============================================================================
-- SEED — default settings rows. Safe to re-run; uses ON CONFLICT.
-- =============================================================================
insert into public.settings (key, value, description) values
  ('site.contact_email', '"hello@brandistri.com"',     'Where contact form messages are delivered.'),
  ('site.business_name', '"Brandistri"',                'Public business name.'),
  ('site.tagline',       '"A modern branding studio."', 'Short tagline used in metadata.'),
  ('site.social',        '{"instagram":"","x":"","linkedin":"","dribbble":""}', 'Social profile URLs.'),
  ('seo.default_title',  '"Brandistri — Branding, design, and digital systems."', 'Default <title> when a page does not provide one.'),
  ('seo.default_description', '"We build brand systems, websites, and content that last."', 'Default meta description.')
on conflict (key) do nothing;
