# NIDS-Pro — Network Intrusion Detection System

<div align="center">

  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version" />
  <a href="https://github.com/harisx404/CodeAlpha-Network-Intrusion-Detection-System/actions/workflows/ci.yml">
    <img src="https://github.com/harisx404/CodeAlpha-Network-Intrusion-Detection-System/actions/workflows/ci.yml/badge.svg" alt="CI" />
  </a>
  <img src="https://img.shields.io/badge/python-3.11-blue.svg" alt="Python 3.11" />
  <img src="https://img.shields.io/badge/next.js-14-black.svg" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/suricata-7.0-red.svg" alt="Suricata 7.0" />
  <img src="https://img.shields.io/badge/docker-compose-2496ED.svg?logo=docker&logoColor=white" alt="Docker Compose" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />

</div>

<br/>

A **production-grade Security Operations Center (SOC) platform** built as part of the [CodeAlpha](https://www.codealpha.tech/) Cybersecurity Internship.

It orchestrates **Suricata** (deep packet inspection) with a real-time async **FastAPI** backend and a live **Next.js** dashboard — delivering instant threat visibility from raw packets to analyst screens.

---

## 🔑 First Login (Default Credentials)

Default Admin Credentials:
- **Username:** `admin`
- **Password:** `admin`

### 🚀 1-Click Threat Simulation (For Evaluators)
Want to see the real-time websocket dashboard light up instantly? Open a new terminal and run the threat simulation script to inject highly realistic malicious Suricata logs:
```bash
python scripts/generate_threats.py
```
Watch your dashboard immediately populate with volumetric DDoS alerts, Log4Shell probes, and Nmap Scans!

> ⚠️ For local/demo use only. Change these before any real deployment.

| Field    | Value           |
|----------|-----------------|
| URL      | `http://localhost` |
| Username | `admin`         |
| Password | `changeme123`   |
| API Docs | `http://localhost:8000/docs` |

Credentials are seeded automatically on first `docker compose up`.

---

## 🎯 What This Project Demonstrates

| Area | Skill |
|------|-------|
| **Async Python** | FastAPI + SQLAlchemy async sessions, `aiofiles` file tailing |
| **Real-time Systems** | WebSocket broadcast manager, auto-reconnecting client |
| **Security Engineering** | Suricata IDS integration, JWT auth, rate limiting, audit logging |
| **Data Engineering** | EVE JSON parsing pipeline, GeoIP enrichment, TTL deduplication |
| **Frontend** | Next.js 14, Zustand state management, interactive SOC dashboard |
| **DevOps** | Multi-stage Docker builds, nginx reverse proxy, GitHub Actions CI/CD |
| **Architecture** | Domain-Driven Design, repository pattern, event bus, response engine |

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
                  │  FastAPI Backend (Python 3.11 async)        │
                  │  · aiofiles tail loop → EVE parser          │
                  │  · GeoIP enrichment → deduplication         │
                  │  · SQLite/PostgreSQL persistence            │
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
                  │  NGINX (port 80)                            │
                  │  · Reverse proxies /api/ → backend :8000    │
                  │  · Proxies /ws/ → backend WebSocket         │
                  │  · Serves frontend on /                     │
                  └─────────────────────────────────────────────┘
```

---

## 🚀 Quickstart (5 Minutes)

### Prerequisites
- **Docker Desktop** ≥ 4.x with Docker Compose v2
- Git

### One-command setup

```bash
git clone https://github.com/harisx404/CodeAlpha-Network-Intrusion-Detection-System.git
cd CodeAlpha-Network-Intrusion-Detection-System

# Build and start all containers (first run seeds the database automatically)
docker compose up --build -d

# Watch the startup logs to confirm everything is healthy
docker compose logs -f backend
```

The SOC dashboard will be live at **http://localhost** in about 30 seconds.

> **Note for Windows users**: Suricata runs in `network_mode: host` and requires Linux capabilities. It will show as exited on Docker Desktop for Windows — this is expected. The rest of the stack (backend + frontend + nginx) works fully and the dashboard comes pre-populated with realistic sample alerts via the seed script.

### Useful commands

```bash
# Check all container health
docker compose ps

# View live backend logs
docker compose logs -f backend

# Rebuild a single service after code changes
docker compose up --build backend -d

# Stop everything
docker compose down

# Full reset (removes database volume too)
docker compose down -v
```

---

## 📐 API Reference

Interactive Swagger documentation is available at **http://localhost:8000/docs** while the stack is running.

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/login` | Authenticate → receive JWT |
| `GET` | `/api/v1/auth/me` | Get current user profile |
| `GET` | `/api/v1/alerts` | List alerts (filters: severity, status, src_ip, page) |
| `GET` | `/api/v1/alerts/{id}` | Get single alert with full detail |
| `POST` | `/api/v1/alerts/{id}/acknowledge` | Acknowledge an alert |
| `POST` | `/api/v1/alerts/{id}/resolve` | Resolve an alert |
| `GET` | `/api/v1/rules` | List detection rules |
| `POST` | `/api/v1/rules` | Create a new rule |
| `PUT` | `/api/v1/rules/{id}` | Update / toggle a rule |
| `DELETE` | `/api/v1/rules/{id}` | Delete a rule |
| `GET` | `/api/v1/statistics/dashboard` | Dashboard KPI stats |
| `GET` | `/api/v1/statistics/current` | Latest traffic stats snapshot |
| `GET` | `/api/v1/system/health` | Liveness probe |
| `POST` | `/api/v1/system/suricata/reload` | Hot-reload Suricata ruleset |
| `WS` | `/ws/events?token={jwt}` | Real-time alert WebSocket feed |

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

Custom rules can be added directly from the **Rules page** in the dashboard or by placing them in `suricata/rules/custom.rules`.

---

## 📡 Traffic Simulation

To trigger live alerts through the pipeline:

```bash
pip install -r backend/requirements-dev.txt

# Generate 60 seconds of attack-like traffic (requires root/admin)
sudo python scripts/generate_traffic.py --duration 60 --interface eth0
```

The alerts will flow from Suricata → Backend → WebSocket → Dashboard in real time.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Architecture Deep Dive](docs/ARCHITECTURE.md) | Data flow, queuing, state management |
| [API Reference](docs/API.md) | REST endpoints and WebSocket payload format |
| [Deployment Guide](docs/DEPLOYMENT.md) | PostgreSQL migration, cloud deployment |
| [Rule Writing Guide](docs/RULE_GUIDE.md) | Custom Suricata rule syntax and hot-reload |
| [User Guide](docs/USER_GUIDE.md) | Dashboard walkthrough for analysts |
| [FAQ](docs/FAQ.md) | Common questions and troubleshooting |

---

## 🧪 Running Tests

```bash
# Backend
pip install -r backend/requirements.txt -r backend/requirements-dev.txt
pytest tests/backend/ -v --cov=backend

# Frontend
cd frontend && npm ci && npm test
```

CI runs automatically on every pull request via GitHub Actions (`.github/workflows/ci.yml`).

---

## 🤝 Contributing

Please read the [Contributing Guide](CONTRIBUTING.md) before opening a pull request.

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
