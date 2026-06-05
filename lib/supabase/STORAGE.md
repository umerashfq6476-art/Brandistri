# Supabase Storage — Brandistri buckets

Three public-read / admin-write buckets back the admin panel's image uploads.

| Bucket          | Used by                       | Public read | Max file size | Allowed MIME types                                  |
| --------------- | ----------------------------- | ----------- | ------------- | --------------------------------------------------- |
| `blog-covers`   | Blog post cover images        | Yes         | 5 MB          | `image/jpeg`, `image/png`, `image/webp`, `image/avif` |
| `project-images`| Project covers + galleries    | Yes         | 10 MB         | `image/jpeg`, `image/png`, `image/webp`, `image/avif` |
| `brand-assets`  | Logos, OG images, downloadable assets | Yes  | 20 MB         | `image/jpeg`, `image/png`, `image/webp`, `image/avif`, `image/svg+xml`, `application/pdf` |

The RLS policies in `schema.sql` already grant the right access on
`storage.objects` for these three bucket IDs. You only need to create the
buckets themselves.

## Option A — Create the buckets in the dashboard

1. Open your project at <https://supabase.com/dashboard>.
2. Go to **Storage → New bucket**.
3. For each row in the table above:
   - Name: the bucket ID (e.g. `blog-covers`).
   - Public bucket: **on**.
   - File size limit: match the row.
   - Allowed MIME types: paste the comma-separated list.

## Option B — Create the buckets from SQL

Run this once in the SQL editor (idempotent):

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('blog-covers',    'blog-covers',    true,  5242880,
   array['image/jpeg','image/png','image/webp','image/avif']),
  ('project-images', 'project-images', true, 10485760,
   array['image/jpeg','image/png','image/webp','image/avif']),
  ('brand-assets',   'brand-assets',   true, 20971520,
   array['image/jpeg','image/png','image/webp','image/avif','image/svg+xml','application/pdf'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
```

## Option C — Create the buckets from a script

Use the service-role client from `lib/supabase/server.ts`:

```ts
import { getSupabaseAdminClient } from "@/lib/supabase/server";

const admin = getSupabaseAdminClient();

await admin.storage.createBucket("blog-covers", {
  public: true,
  fileSizeLimit: 5 * 1024 * 1024,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
});
```

## Uploading from the admin panel

`uploadImage()` in `lib/supabase/helpers.ts` handles upload + public-URL
resolution. It takes a `File` (e.g. from `react-dropzone`) and the bucket
name, and returns the public URL you can store on the row.

## Next.js image domain

To render uploaded images with `next/image`, add your Supabase project's
storage hostname to `next.config.mjs`:

```js
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "<your-project-ref>.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};
export default nextConfig;
```
