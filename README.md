# CodeAlpha Network Intrusion Detection System (NIDS)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![Next.js](https://img.shields.io/badge/next.js-14-black.svg)
![Suricata](https://img.shields.io/badge/suricata-7.0-red.svg)

A professional, production-grade Network Intrusion Detection System built for the CodeAlpha Cybersecurity Internship.

## Overview
This platform acts as a modern Security Operations Center (SOC) dashboard. It uses **Suricata** as the core detection engine, a **FastAPI** backend to parse and enrich EVE logs, and a **Next.js** frontend for real-time visualization via WebSockets.

## Architecture
- **Detection Layer**: Suricata engine capturing packets and outputting EVE JSON.
- **Backend Layer**: Python (FastAPI, SQLAlchemy, asyncio) for log parsing, GeoIP enrichment, and alerting.
- **Frontend Layer**: React (Next.js, Tailwind CSS, Shadcn) for real-time dashboards.
- **Response Layer**: Automated webhooks, logging, and email alerts.

## Quickstart
```bash
git clone https://github.com/harisx404/CodeAlpha-Network-Intrusion-Detection-System.git
cd CodeAlpha-Network-Intrusion-Detection-System
bash scripts/setup.sh
```

## Documentation
- [Installation Guide](docs/INSTALLATION.md)
- [API Reference](docs/API.md)
- [Architecture Details](docs/ARCHITECTURE.md)

## Contributing
Please see `CONTRIBUTING.md` for guidelines.

## License
MIT License
