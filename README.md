# tcm-warehouse

Nuxt 3 SSR warehouse dashboard monolith using Supabase (Postgres + Auth + Storage), Nuxt UI, Tailwind, and GSAP.

## Features

- Role-based app sections:
  - `/admin/**` for admins
  - `/tenant/**` for tenants
  - `/guard/**` for guards
- Supabase Auth + `profiles` RBAC
- Tenant booking flow with Storage document upload
- Admin zone/user/settings/closures/notification/audit pages
- Guard zone selection and today booking state transitions
- XLSX export endpoint: `/api/export`
- GSAP subtle animations:
  - animated counters
  - animated chart entrance
  - staggered activity feed items
- Postgres-enforced booking constraints via triggers/functions
- RLS policies across domain tables and storage buckets

## Sensible Defaults Chosen

- Same-day express fee is set to `settings.hourly_penalty`.
- Debt formula: `sum(bookings.penalty_amount + bookings.express_fee where status not in rejected/cancelled) - sum(payments.amount)`.
- Guard selected zone is persisted by updating `profiles.zone_id` when guard selects a zone card.
- Default zones `Zone 1`, `Zone 2`, `Zone 3` are inserted in migration.

## Environment Variables

Create `.env` from `.env.example`:

```bash
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_KEY=YOUR_PUBLIC_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
SUPABASE_REDIRECT_URL=http://localhost:3000
```

## Supabase Setup

1. Create Supabase project.
2. Run SQL migration from `supabase/migrations/001_init.sql` in Supabase SQL editor.
3. Confirm buckets exist: `documents`, `templates`.
4. Create at least one admin auth user in **Authentication > Users**.
5. Assign admin role in SQL (replace user UUID):

```sql
insert into public.profiles (id, role, full_name)
values ('YOUR_AUTH_USER_UUID', 'admin', 'System Admin')
on conflict (id) do update set role = 'admin';
```

## Local Run

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Build and Run (SSR)

```bash
npm run build
npm run start
```

This starts Node server from `.output/server/index.mjs`.

## VPS Deploy (PM2)

1. Install Node.js 20+ and PM2.
2. Copy project to VPS.
3. Set production env vars in `.env`.
4. Install and build:

```bash
npm ci
npm run build
```

5. Run with PM2:

```bash
pm2 start .output/server/index.mjs --name tcm-warehouse
pm2 save
pm2 startup
```

### PM2 Useful Commands

```bash
pm2 status
pm2 logs tcm-warehouse
pm2 restart tcm-warehouse
pm2 delete tcm-warehouse
```

## Optional Nginx Reverse Proxy

```nginx
server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Then reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Nginx Site Enable (Ubuntu)

```bash
sudo nano /etc/nginx/sites-available/tcm-warehouse
sudo ln -s /etc/nginx/sites-available/tcm-warehouse /etc/nginx/sites-enabled/tcm-warehouse
sudo nginx -t
sudo systemctl restart nginx
```

## HTTPS (Let's Encrypt / Certbot)

```bash
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
sudo systemctl status certbot.timer
```

## Deployment Checklist

1. Supabase migration executed (`supabase/migrations/001_init.sql`)
2. `.env` exists on server with production Supabase keys
3. `npm ci && npm run build` completed without errors
4. PM2 process running and saved (`pm2 save`)
5. Nginx proxy active and reloaded
6. HTTPS certificate issued (recommended)

## Notes

- `/api/admin/*` routes require authenticated admin + `SUPABASE_SERVICE_ROLE_KEY`.
- Bulk user upload expected columns: `email, password, role, full_name, phone, zone_name, tenant_code`.
- Tenant export endpoint returns fixed columns:
  - `[id, date, status, created_at, updated_at, logged_in, logged_out, driver_name, driver_passport, driver_number]`
