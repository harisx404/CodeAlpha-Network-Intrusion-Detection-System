# CodeAlpha Network Intrusion Detection System (NIDS)

<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version" />
  <a href="https://github.com/harisx404/CodeAlpha-Network-Intrusion-Detection-System/actions/workflows/ci.yml">
    <img src="https://github.com/harisx404/CodeAlpha-Network-Intrusion-Detection-System/actions/workflows/ci.yml/badge.svg" alt="CI" />
  </a>
  <img src="https://img.shields.io/badge/python-3.11-blue.svg" alt="Python 3.11" />
  <img src="https://img.shields.io/badge/next.js-14-black.svg" alt="Next.js" />
  <img src="https://img.shields.io/badge/suricata-7.0-red.svg" alt="Suricata" />
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
</div>

<br/>

A professional, production-grade **Network Intrusion Detection System (NIDS)** engineered for the CodeAlpha Cybersecurity Internship. This platform functions as a modern Security Operations Center (SOC) dashboard, orchestrating Suricata for deep packet inspection, a high-throughput async Python backend, and a real-time React frontend.

---

## 📸 Screenshots

> Add product screenshots to the `assets/` folder and reference them here. Suggested captures: the login screen, the populated dashboard (KPI cards + charts), the alerts table, the rules manager, and the live monitoring view.

| Login | Dashboard |
| :---: | :---: |
| ![Login](assets/login.png) | ![Dashboard](assets/dashboard.png) |

| Alerts | Rules |
| :---: | :---: |
| ![Alerts](assets/alerts.png) | ![Rules](assets/rules.png) |

---


## 🎯 Executive Summary

The modern threat landscape requires network defenses that are not just accurate, but highly observable. Traditional NIDS setups often relegate analysts to archaic terminal interfaces or slow-polling dashboards. 

This project bridges that gap by providing a **real-time, asynchronous pipeline** that ingests raw network packets, parses Suricata EVE logs instantaneously, enriches the data via Threat Intelligence APIs, and pushes the alerts directly to a high-performance Next.js dashboard via WebSockets.

---

## 🏗️ System Architecture

This repository strictly adheres to a **Layered Domain-Driven Design (DDD)**, ensuring separation of concerns, scalability, and testability.

### 1. Detection Engine (Suricata)
Running in a privileged Docker container bound to the host network interface, Suricata acts as the frontline packet sniffer. It utilizes a combination of Emerging Threats (ET) rules and custom `.rules` files to detect anomalies ranging from nmap scans to SQL injections. Detections are written as line-delimited JSON to `eve.json`.

### 2. The Asynchronous Backend (FastAPI)
The core of the system is a Python 3.11 API built around non-blocking I/O so ingestion doesn't stall request handling. The backend employs:
- **`aiofiles` Tailing**: A background async task tails `eve.json` non-blockingly, parsing new lines as they're written rather than blocking the event loop on I/O.
- **SQLAlchemy (Async)**: Alerts are persisted through an async session to SQLite (or PostgreSQL).
- **FastAPI WebSockets**: A broadcast manager pushes validated `Alert` payloads to every connected client as soon as they are ingested.

### 3. The Frontend App (Next.js 14)
Built with React, TailwindCSS, and Zustand. Key choices:
- **Zustand State Stores**: Alerts land in a shared store, keeping prop-drilling out of the component tree.
- **Auto-reconnecting WebSocket**: A `useWebSocket` hook maintains the live feed with exponential backoff (1s up to 32s) and dispatches incoming alerts straight into the store.

---

## 🚀 Quickstart Guide

### Prerequisites
- Docker & Docker Compose
- Python 3.11+ (for local development)
- Node.js 20+ (for local UI compilation)

### One-Command Setup
We provide an automated bootstrap script that checks dependencies, builds the containers, generates environment files, and runs database migrations.

```bash
git clone https://github.com/harisx404/CodeAlpha-Network-Intrusion-Detection-System.git
cd CodeAlpha-Network-Intrusion-Detection-System

# Run the unified setup script
bash scripts/setup.sh
```

The SOC Dashboard will be immediately available at `http://localhost:3000`. The API Swagger documentation is at `http://localhost:8000/docs`.

### Run Modes

The project supports two ways to run the full stack:

**1. Docker (recommended — nginx-fronted).** A single command brings up Suricata, the backend, the frontend, and an nginx reverse proxy:

```bash
docker compose -f docker-compose.yml up --build
```

Then open **`http://localhost/`** (port 80, via nginx). The API docs are at `http://localhost/docs`. In this mode the browser talks to everything through nginx, so the frontend is configured with `NEXT_PUBLIC_API_URL=http://localhost/api/v1`.

> Running plain `docker compose up` (without `-f`) also loads `docker-compose.override.yml`, which enables live-reload bind mounts for local development. Use the explicit `-f docker-compose.yml` form for a clean, production-style run.

**2. Local dev (no Docker).** Run the backend and frontend directly:

```bash
# Backend (from repo root)
python -c "import secrets; print(secrets.token_hex(32))"   # put this in backend/.env as JWT_SECRET_KEY
cp backend/.env.example backend/.env
cd backend && pip install -r requirements.txt
cd .. && PYTHONPATH=. uvicorn backend.main:app --reload

# Frontend (in a second terminal)
cd frontend && npm ci && npm run dev
```

In local dev the frontend runs on `http://localhost:3000` and talks to the backend directly at `http://localhost:8000/api/v1` (set in `frontend/.env.local`).

### First Login

The stack seeds a demo admin user on first startup when `SEED_DEMO_USER=true` (the default in `backend/.env.example` and in Docker). Log in with:

| Field | Value |
| --- | --- |
| Username | `admin` |
| Password | `changeme123` |

> **Change this before any public/production deployment.** For a non-demo setup, set `SEED_DEMO_USER=false` and create users explicitly:
>
> ```bash
> # Prompts for a password (nothing sensitive is committed)
> PYTHONPATH=. python scripts/create_user.py --username admin --email admin@example.com --role admin
> ```

---


## 🛡️ Penetration Testing & Simulation

To exercise the pipeline end to end, we include a traffic-generation script that uses `scapy` to craft attack-like packets against the local interface. `scapy` ships in the dev requirements:

```bash
pip install -r backend/requirements-dev.txt

# Generate 60 seconds of attack-like traffic (requires root/admin privileges)
sudo python scripts/generate_traffic.py --duration 60 --interface eth0
```
*This will immediately trigger Suricata alerts, which will cascade through the async backend and flash red on your Next.js dashboard.*

---

## 📚 Comprehensive Documentation

For engineers looking to extend this system, please review our deep-dive documentation:

- **[Architecture Deep Dive](docs/ARCHITECTURE.md)**: Explore the data flow, queuing systems, and state management.
- **[API Reference](docs/API.md)**: Details on REST endpoints and WebSocket payloads.
- **[Deployment Guide](docs/DEPLOYMENT.md)**: Instructions for moving from SQLite to PostgreSQL and deploying to AWS/DigitalOcean.
- **[Rule Writing Guide](docs/RULE_GUIDE.md)**: How to write and load custom Suricata rules dynamically.

---

## 🤝 Contributing

CI runs on every pull request. The blocking checks are:
1. `ruff` — Python linting.
2. `black --check` — Python formatting.
3. `tsc --noEmit` — TypeScript type checking.
4. `pytest` — backend test suite.

`mypy` and `eslint` also run but are currently non-blocking.

Please read `CONTRIBUTING.md` for branch naming conventions and issue templates.

## 📄 License & Contact

This project is licensed under the **MIT License**.

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
