# Deploying Brandistri to a Hostinger VPS

This guide deploys the Next.js app to a **Hostinger VPS** (KVM plan, Ubuntu) and
points `brandistri.com` to it, replacing the old WordPress site. Email stays on
Hostinger — we never touch the MX records.

> Requires a **VPS** plan (root SSH access). Shared/WordPress hosting cannot run
> Next.js.

---

## 0. What you need before starting

- A Hostinger **VPS** with Ubuntu 22.04 (or similar) and its **IP address**.
- SSH access (Hostinger shows the root password / lets you set an SSH key in hPanel → VPS → SSH Access).
- This project pushed to a **GitHub** repo (recommended) so you can `git clone` it on the server.
- Your production secrets ready: Supabase URL + anon + service-role keys, Resend API key.

---

## 1. Push the code to GitHub (from your Windows PC)

```powershell
# in C:\Users\MHC\Desktop\Brandistri
git add .
git commit -m "Prepare for deploy"
# create an empty repo on github.com first, then:
git remote add origin https://github.com/<you>/brandistri.git
git push -u origin main
```

> ⚠️ Do NOT commit `.env.local` (it holds secrets). It's already in `.gitignore`.
> You'll recreate it on the server in step 5.

---

## 2. Connect to the VPS

```bash
ssh root@YOUR_VPS_IP
```

---

## 3. Install Node.js 20 + tools

```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git nginx
node -v   # should print v20.x
```

---

## 4. Get the code onto the server

```bash
cd /var/www
git clone https://github.com/<you>/brandistri.git
cd brandistri
npm install
```

---

## 5. Create the production env file

```bash
nano .env.local
```

Paste this (use your real values; note the **production site URL**):

```
NEXT_PUBLIC_SUPABASE_URL=https://lyqbipqciibyyukfcwhc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...your anon key...
SUPABASE_SERVICE_ROLE_KEY=...your service-role key...
RESEND_API_KEY=...your resend key...
RESEND_FROM_EMAIL=Brandistri <mashab@brandistri.com>
CONTACT_EMAIL=mashab@brandistri.com
NEXT_PUBLIC_SITE_URL=https://brandistri.com
```

Save: `Ctrl+O`, `Enter`, `Ctrl+X`.

> `RESEND_FROM_EMAIL` only works once the `brandistri.com` domain is **Verified**
> in Resend (see `RESEND_SETUP` steps). Until then, keep it as
> `Brandistri <onboarding@resend.dev>`.

---

## 6. Build and run with PM2

```bash
npm run build
npm install -g pm2
pm2 start npm --name brandistri -- start
pm2 save
pm2 startup        # run the command it prints, so the app restarts on reboot
```

The app is now running on `http://localhost:3000` on the server.

---

## 7. Put Nginx in front (port 80 → 3000)

```bash
nano /etc/nginx/sites-available/brandistri
```

Paste:

```nginx
server {
    listen 80;
    server_name brandistri.com www.brandistri.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:

```bash
ln -s /etc/nginx/sites-available/brandistri /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t          # test config
systemctl restart nginx
```

---

## 8. Point the domain at the VPS (replaces WordPress)

In **hPanel → Domains → brandistri.com → DNS / Nameservers → DNS Records**:

- Edit the **A** record `@` → set value to **YOUR_VPS_IP** (was the old WordPress/shared IP).
- Edit/add the **A** record `www` → **YOUR_VPS_IP** (or CNAME `www` → `brandistri.com`).
- **Do NOT change MX records or any email TXT/DKIM records** — email keeps working.

DNS can take minutes to a few hours to update.

> If `brandistri.com` currently uses Hostinger's **nameservers**, editing the A
> records here is enough. If it points elsewhere, change the A records wherever
> the nameservers actually are.

---

## 9. Add HTTPS (free SSL)

Once the domain resolves to the VPS:

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d brandistri.com -d www.brandistri.com
```

Follow the prompts. Certbot installs the certificate and auto-renews it.

---

## 10. Future updates

When you change code, redeploy with:

```bash
cd /var/www/brandistri
git pull
npm install
npm run build
pm2 restart brandistri
```

---

## Quick troubleshooting

- **502 Bad Gateway** → the Node app isn't running. Check `pm2 status` and `pm2 logs brandistri`.
- **Site shows old WordPress** → DNS hasn't propagated, or A record still points to the old IP. Verify with `nslookup brandistri.com`.
- **Emails not arriving** → Resend domain not verified yet, or `RESEND_FROM_EMAIL` set to your domain before verification. Temporarily use `onboarding@resend.dev`.
- **Env changes not taking effect** → you must `pm2 restart brandistri` after editing `.env.local`.
