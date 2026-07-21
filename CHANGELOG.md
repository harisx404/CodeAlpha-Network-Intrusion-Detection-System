# Changelog

All notable changes to NIDS-Pro are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.2.0] - 2026-07-21

### Added
- **Vercel Serverless Deployment** — The full stack now deploys to Vercel with zero-infrastructure overhead. FastAPI runs as a Python Serverless Function (`api/index.py`); Next.js is served from Vercel's global CDN edge network.
- **Neon PostgreSQL Support** — Production database runs on Neon's serverless-compatible PostgreSQL with `asyncpg`, eliminating the need for a managed database server.
- **Idempotent seed endpoint** (`GET /api/v1/system/seed`) — Safely bootstraps the admin user and sample data on fresh deployments without requiring direct DB access.
- **`pyproject.toml`** at repository root — Declares all Python runtime dependencies for `uv`-based Vercel builds.
- **`.python-version`** — Pins the runtime to Python 3.12 for both local `pyenv` environments and Vercel's build system.
- Live demo URL added to README and repository description.

### Changed
- **Python version upgraded from 3.11 → 3.12** across CI, Docker images, and Vercel config.
- **`next.config.mjs`** — Removed `output: "standalone"` (incompatible with Vercel's managed Next.js builder). API proxy rewrite now only applies in `NODE_ENV=development`.
- **`vercel.json`** — Uses explicit `builds` array with `@vercel/python` and `@vercel/next` to guarantee both runtimes compile in the same deployment.
- **CI workflow** — Updated all `working-directory` references from `frontend/` to the repository root (post-monorepo merge). Node cache path updated to root `package-lock.json`.
- **README** overhauled to document both local (Docker + manual) and production (Vercel) deployment paths.

### Fixed
- `vercel_login.html` (debugging artifact) removed from version control.
- `nids_dev.db` excluded from git via `.gitignore` (`*.db` rule).
- Background task cancellation error on shutdown — `EVELogWatcher.stop()` is now guarded to only run when the watcher was actually started.
- Application startup crash on Vercel caused by `os.makedirs` calls on the read-only filesystem.
- Python Serverless Function silently discarded due to size limit — `node_modules` and `.next` are now explicitly excluded from the Python function bundle.

---

## [1.1.0] - 2026-07-20

### Added
- User bootstrap: `scripts/create_user.py` CLI plus an idempotent demo-admin seed on startup, gated by the `SEED_DEMO_DATA` env var, so a fresh install has a working login.
- Documented "First login" credentials and "Run modes" (Docker/nginx vs local dev) in the README.
- Frontend test suite (Jest + React Testing Library) covering severity styling, the alert store, and the SeverityBadge component, wired into CI as a `test-frontend` job.
- Backend unit tests for the user-bootstrap script.

### Changed
- `docker-compose.yml` no longer bind-mounts source code over the built images; live-reload dev mounts moved to `docker-compose.override.yml`.
- Removed the obsolete Compose `version:` key and added an explicit `networks:` block.

### Fixed
- Broken login journey caused by no user ever being created.
- Docker deployment failing because host `.next`/backend mounts shadowed the built images.

---

## [1.0.0] - 2026-07-16

### Added
- Complete Suricata EVE log integration with real-time `aiofiles` tail loop.
- FastAPI async backend with SQLAlchemy 2.0 async sessions.
- Next.js 14 SOC Dashboard with Zustand state management.
- JWT authentication with refresh token rotation.
- Rate limiting middleware and structured audit logging.
- GeoIP enrichment via MaxMind GeoLite2.
- Alert management (acknowledge / resolve) with WebSocket live feed.
- Detection rule CRUD via the dashboard UI.
- Docker Compose multi-container deployment (Suricata + Backend + Frontend + NGINX).
- GitHub Actions CI/CD pipeline with Python linting, type checking, and test coverage.
