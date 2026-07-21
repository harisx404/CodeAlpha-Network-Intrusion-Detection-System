# Deployment Guide

This document covers all supported deployment targets for NIDS-Pro.

---

## Option 1 — Vercel (Recommended for Demos & Evaluators)

NIDS-Pro is pre-configured for zero-config deployment to Vercel as a hybrid application:

- **Frontend** → Vercel Edge CDN (Next.js)
- **Backend** → Vercel Python Serverless Function (`api/index.py`)
- **Database** → [Neon](https://neon.tech) — serverless PostgreSQL

### Steps

1. **Fork the repository** to your GitHub account.

2. **Create a Neon database** at [neon.tech](https://neon.tech) (free tier available). Copy the connection string — it looks like:
   ```
   postgresql://user:pass@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

3. **Import the project on Vercel:**
   - Go to [vercel.com](https://vercel.com) → New Project → Import your fork.
   - Set the **Framework Preset** to **Other** (important — prevents the Next.js-only builder from skipping Python).

4. **Set Environment Variables** in the Vercel Dashboard (`Settings → Environment Variables`):

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | `postgresql+asyncpg://user:pass@host/db?ssl=require` |
   | `JWT_SECRET_KEY` | A random 64+ character string (e.g. `openssl rand -hex 64`) |
   | `APP_ENV` | `production` |
   | `CORS_ORIGINS` | `https://your-project.vercel.app` |

5. **Deploy** — Push any commit to `main` or click "Redeploy" in the Vercel Dashboard.

6. **Seed the database** (one-time, idempotent):
   ```
   https://your-project.vercel.app/api/v1/system/seed
   ```
   You should see: `{"status": "success", "message": "Database seeded successfully"}`

7. **Log in** at `https://your-project.vercel.app/login` with `admin` / `admin`.

---

## Option 2 — Docker Compose (Self-Hosted)

For full-stack local or server deployments with Suricata integration.

### Prerequisites

- Docker Desktop ≥ 4.x with Compose v2
- A Linux host (or WSL2 on Windows) for Suricata's `network_mode: host`

### Steps

```bash
git clone https://github.com/harisx404/CodeAlpha-Network-Intrusion-Detection-System.git
cd CodeAlpha-Network-Intrusion-Detection-System

# Copy and edit the backend environment file
cp backend/.env.example backend/.env
# Set: JWT_SECRET_KEY, DATABASE_URL (defaults to SQLite for local), etc.

# Build and start all services
docker compose up --build -d

# Verify all containers are running
docker compose ps

# Watch backend logs
docker compose logs -f backend
```

The SOC dashboard is available at **http://localhost**.

### Switching to PostgreSQL

In `backend/.env`, change:
```
DATABASE_URL=postgresql+asyncpg://nids:nids@localhost:5432/nids
```

Add a `postgres` service to your `docker-compose.override.yml`:
```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: nids
      POSTGRES_PASSWORD: nids
      POSTGRES_DB: nids
    volumes:
      - pg_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  pg_data:
```

---

## Option 3 — Manual (Development)

See the [README — Option B](../README.md#option-b--manual-local-development) for the step-by-step manual setup guide.

---

## Production Hardening Checklist

Before exposing NIDS-Pro to the internet:

- [ ] Change `admin` password immediately after first login
- [ ] Set a strong, unique `JWT_SECRET_KEY` (minimum 64 characters)
- [ ] Set `APP_ENV=production` (disables debug SQL logging and auto-migration)
- [ ] Configure `CORS_ORIGINS` to your exact domain only
- [ ] Enable HTTPS (handled automatically by Vercel / your reverse proxy)
- [ ] Rotate GeoLite2 database regularly (MaxMind updates monthly)
- [ ] Review `SECURITY.md` for the vulnerability disclosure policy
