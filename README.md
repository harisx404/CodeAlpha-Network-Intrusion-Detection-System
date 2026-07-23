# IntruShield NIDS — Autonomous Network Intrusion Detection & Threat Intelligence Platform

<div align="center">

  <img src="https://img.shields.io/badge/version-1.3.0-blue.svg" alt="Version" />
  <a href="https://github.com/harisx404/intrushield-nids/actions/workflows/ci.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/harisx404/intrushield-nids/ci.yml?branch=main&label=CI" alt="CI Status" />
  </a>
  <img src="https://img.shields.io/badge/python-3.12-blue.svg" alt="Python 3.12" />
  <img src="https://img.shields.io/badge/next.js-14-black.svg" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/suricata-7.0-red.svg" alt="Suricata 7.0" />
  <img src="https://img.shields.io/badge/deployed-Vercel-000000?logo=vercel" alt="Deployed on Vercel" />
  <img src="https://img.shields.io/badge/docker-compose-2496ED.svg?logo=docker&logoColor=white" alt="Docker Compose" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />

</div>

<br/>

**IntruShield NIDS** is an **enterprise-grade Security Operations Center (SOC) platform and threat telemetry engine** designed and built by **[Muhammad Haris](https://github.com/harisx404)**.

It seamlessly orchestrates **Suricata** (deep packet inspection engine) with a high-performance, real-time async **FastAPI** backend and a responsive **Next.js 14** analytics dashboard — delivering instant threat visibility from raw network wire traffic to analyst screens.

> 🌐 **Live Production Demo:** [https://intrushield-nids.vercel.app](https://intrushield-nids.vercel.app)

---

## 🔑 Quick Login

| Field    | Value           |
|----------|-----------------|
| Username | `admin`         |
| Password | `admin`         |
| API Docs | `/docs`         |

> ⚠️ Change credentials before any real production use.

---

## 🎯 What This Project Demonstrates

| Area | Skill |
|------|-------|
| **Async Python** | FastAPI + SQLAlchemy async sessions, `aiofiles` file tailing |
| **Real-time Systems** | WebSocket broadcast manager, auto-reconnecting client |
| **Security Engineering** | Suricata IDS integration, JWT auth, rate limiting, audit logging |
| **Data Engineering** | EVE JSON parsing pipeline, GeoIP enrichment, TTL deduplication |
| **Frontend** | Next.js 14, Zustand state management, interactive SOC dashboard |
| **DevOps** | Multi-stage Docker builds, Vercel Serverless, GitHub Actions CI/CD |
| **Architecture** | Domain-Driven Design, repository pattern, event bus, response engine |

---

## 📸 Platform Screenshots

<div align="center">
  <h3>Security Command — Real-Time SOC Dashboard</h3>
  <img src="docs/screenshots/intrushield-nids-dashboard.png" alt="Security Command SOC Dashboard" width="100%" />

  <br/><br/>

  <h3>Alert Center — Live Incident Log & Filtering</h3>
  <img src="docs/screenshots/intrushield-nids-alerts.png" alt="Alert Center Incident Log" width="100%" />

  <br/><br/>

  <h3>Detection Rules — Suricata Signature Management</h3>
  <img src="docs/screenshots/intrushield-nids-rules.png" alt="Suricata Detection Rules" width="100%" />

  <br/><br/>

  <h3>System Monitoring — Traffic Throughput & Component Metrics</h3>
  <img src="docs/screenshots/intrushield-nids-monitoring.png" alt="System Monitoring Metrics" width="100%" />
</div>

---

## 🏗️ System Architecture

```
                 ┌─────────────────────────────────────────────┐
  Raw Network ──▶│  Suricata 7 (privileged, host network mode) │
  Packets         │  · Deep packet inspection                   │
                  │  · Custom + ET ruleset                      │
                  │  · Writes alerts to eve.json                │
                  └─────────────────┬───────────────────────────┘
                                    │ eve.json (shared volume)
                  ┌─────────────────▼───────────────────────────┐
                  │  FastAPI Backend (Python 3.12 async)        │
                  │  · aiofiles tail loop → EVE parser          │
                  │  · GeoIP enrichment → deduplication         │
                  │  · PostgreSQL/SQLite persistence            │
                  │  · WebSocket broadcast manager              │
                  │  · REST API  /api/v1/*                      │
                  └─────────────────┬───────────────────────────┘
                                    │ REST + WebSocket
                  ┌─────────────────▼───────────────────────────┐
                  │  Next.js 14 Frontend (React, Zustand)       │
                  │  · Real-time alert feed via WebSocket       │
                  │  · Dashboard KPIs, charts, Top Attackers    │
                  │  · Alert management (ack, resolve, filter)  │
                  │  · Suricata rule CRUD                       │
                  └─────────────────┬───────────────────────────┘
                                    │
                  ┌─────────────────▼───────────────────────────┐
                  │  NGINX / Vercel Edge                        │
                  │  · Reverse proxies /api/ → backend          │
                  │  · Proxies /ws/ → backend WebSocket         │
                  │  · Serves frontend on /                     │
                  └─────────────────────────────────────────────┘
```

---

## 🚀 Running Locally (5 Minutes)

### Option A — Docker Compose (Recommended)

**Prerequisites:** Docker Desktop ≥ 4.x with Compose v2, Git

```bash
git clone https://github.com/harisx404/intrushield-nids.git
cd intrushield-nids

# Build and start all containers (first run seeds the database automatically)
docker compose up --build -d

# Watch the startup logs
docker compose logs -f backend
```

The SOC dashboard will be live at **http://localhost** in ~30 seconds.

> **Windows users:** Suricata runs in `network_mode: host` and requires Linux kernel capabilities. It will show as exited on Docker Desktop for Windows — this is expected. The rest of the stack works fully, and the dashboard comes pre-populated with 50 realistic sample alerts via the seed script.

#### Useful Commands

```bash
docker compose ps                          # Check all container health
docker compose logs -f backend             # View live backend logs
docker compose up --build backend -d       # Rebuild a single service
docker compose down                        # Stop everything
docker compose down -v                     # Full reset (removes database volume)
```

---

### Option B — Manual Local Development

**Prerequisites:** Python 3.12+, Node.js 20+

```bash
# 1. Clone
git clone https://github.com/harisx404/intrushield-nids.git
cd intrushield-nids

# 2. Backend — create virtual environment and install dependencies
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r backend/requirements.txt

# 3. Configure backend environment
cp backend/.env.example backend/.env
# Edit backend/.env — set a strong JWT_SECRET_KEY and your DATABASE_URL

# 4. Seed the database (creates admin user + sample data)
python -m backend.database.seed

# 5. Start the FastAPI backend
uvicorn backend.main:app --reload --port 8000

# 6. In a second terminal — start the Next.js frontend
npm install
npm run dev
```

The dashboard will be available at **http://localhost:3000** and the API at **http://localhost:8000/docs**.

---

## 🌐 Production Deployment

The application is deployed as a **hybrid Vercel Serverless** application:

- **Frontend:** Next.js → Vercel Edge CDN
- **Backend:** FastAPI → Vercel Python Serverless Function (`api/index.py`)
- **Database:** Neon PostgreSQL (serverless-compatible asyncpg)

### Required Environment Variables (Vercel Dashboard)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://user:pass@host/db` |
| `JWT_SECRET_KEY` | Minimum 64-character random string |
| `APP_ENV` | `production` |
| `VERCEL` | `1` (set automatically by Vercel) |
| `CORS_ORIGINS` | Your Vercel domain (e.g. `https://intrushield-nids.vercel.app`) |

After setting environment variables, trigger a new Vercel deployment, then visit:

```
https://your-domain.vercel.app/api/v1/system/seed
```

This idempotent endpoint creates the default admin user and sample data on first run.

> See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the full production guide.

---

## 📐 API Reference

Interactive Swagger documentation is available at **/docs** while the app is running.

### Core Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/v1/auth/login` | ❌ | Authenticate → receive JWT |
| `GET` | `/api/v1/auth/me` | ✅ | Get current user profile |
| `GET` | `/api/v1/alerts` | ✅ | List alerts (filters: severity, status, src_ip, page) |
| `GET` | `/api/v1/alerts/{id}` | ✅ | Get single alert with full detail |
| `POST` | `/api/v1/alerts/{id}/acknowledge` | ✅ | Acknowledge an alert |
| `POST` | `/api/v1/alerts/{id}/resolve` | ✅ | Resolve an alert |
| `GET` | `/api/v1/rules` | ✅ | List detection rules |
| `POST` | `/api/v1/rules` | ✅ | Create a new rule |
| `PUT` | `/api/v1/rules/{id}` | ✅ | Update / toggle a rule |
| `DELETE` | `/api/v1/rules/{id}` | ✅ | Delete a rule |
| `GET` | `/api/v1/statistics/dashboard` | ✅ | Dashboard KPI stats |
| `GET` | `/api/v1/statistics/current` | ✅ | Latest traffic stats snapshot |
| `GET` | `/api/v1/system/health` | ❌ | Liveness probe |
| `GET` | `/api/v1/system/seed` | ❌ | Idempotent DB seed (first run only) |
| `WS` | `/ws/events?token={jwt}` | ✅ | Real-time alert WebSocket feed |

---

## 🛡️ Detection Rules

The platform ships with **10 production-quality Suricata rules** covering:

| # | Rule | Technique |
|---|------|-----------|
| 1 | SSH Brute Force Detection | Threshold tracking by source IP |
| 2 | SQL Injection (OR 1=1) | HTTP URI content matching |
| 3 | SQL Injection (UNION SELECT) | Multi-content HTTP match |
| 4 | Nmap OS Detection Probe | TCP flag combination |
| 5 | Log4Shell (CVE-2021-44228) | JNDI string detection |
| 6 | XSS Probe | `<script>` in HTTP URI |
| 7 | Reverse Shell | Outbound `/bin/bash -i` detection |
| 8 | DNS Exfiltration | Large TXT record anomaly |
| 9 | ICMP Ping Sweep | Threshold-based scan detection |
| 10 | Directory Traversal | `/etc/passwd` in URI |

Custom rules can be added from the **Rules** page in the dashboard or by editing `suricata/rules/custom.rules`.

---

## 📡 Traffic Simulation

To generate realistic attack traffic through the Suricata pipeline:

```bash
# Requires root/admin and a running Suricata instance
sudo python scripts/generate_traffic.py --duration 60 --interface eth0
```

For a demo without Suricata, run the built-in threat simulator:

```bash
python scripts/generate_threats.py
```

Alerts will flow from Suricata → Backend → WebSocket → Dashboard in real time.

---

## 🧪 Running Tests

```bash
# Backend unit + integration tests
pip install -r backend/requirements.txt -r backend/requirements-dev.txt
pytest tests/backend/ -v --cov=backend

# Frontend component tests
npm test
```

CI runs automatically on every push and pull request via GitHub Actions.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Architecture Deep Dive](docs/ARCHITECTURE.md) | Data flow, queuing, state management |
| [API Reference](docs/API.md) | REST endpoints and WebSocket payload format |
| [Deployment Guide](docs/DEPLOYMENT.md) | Vercel, PostgreSQL, Docker cloud deployment |
| [Rule Writing Guide](docs/RULE_GUIDE.md) | Custom Suricata rule syntax and hot-reload |
| [User Guide](docs/USER_GUIDE.md) | Dashboard walkthrough for SOC analysts |
| [FAQ](docs/FAQ.md) | Common questions and troubleshooting |

---

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

CI blocking checks:
1. `ruff` — Python linting
2. `black --check` — Python formatting
3. `tsc --noEmit` — TypeScript type checking
4. `pytest` — Backend test suite

---

## 📄 License & Contact

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

<div align="center">
  <h3>Developed & Maintained By</h3>
  <h2>Muhammad Haris</h2>
  <br />

  <a href="https://github.com/harisx404">
    <img src="https://img.shields.io/badge/GitHub-harisx404-181717?style=for-the-badge&logo=github" alt="GitHub Profile" />
  </a>
  <a href="https://linkedin.com/in/harisx404">
    <img src="https://img.shields.io/badge/LinkedIn-harisx404-0A66C2?style=for-the-badge&logo=linkedin" alt="LinkedIn Profile" />
  </a>
  <a href="mailto:itsharis.tech@gmail.com">
    <img src="https://img.shields.io/badge/Email-itsharis.tech@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email Contact" />
  </a>
</div>
