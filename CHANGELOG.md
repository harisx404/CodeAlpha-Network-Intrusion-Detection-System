# Changelog

## [1.1.0] - 2026-07-20
### Added
- User bootstrap: `scripts/create_user.py` CLI plus an idempotent demo-admin seed on startup, gated by the `SEED_DEMO_USER` flag, so a fresh install has a working login.
- Documented "First login" credentials and "Run modes" (Docker/nginx vs local dev) in the README.
- Screenshot gallery placeholders in the README backed by the `assets/` folder.
- Frontend test suite (Jest + React Testing Library) covering severity styling, the alert store, and the SeverityBadge component, wired into CI as a `test-frontend` job.
- Backend unit tests for the user-bootstrap script.

### Changed
- `docker-compose.yml` no longer bind-mounts source code over the built images; live-reload dev mounts moved to `docker-compose.override.yml`.
- Removed the obsolete Compose `version:` key and added an explicit `networks:` block.

### Fixed
- Broken login journey caused by no user ever being created.
- Docker deployment failing because host `.next`/backend mounts shadowed the built images.

## [1.0.0] - 2026-07-16

### Added
- Complete Suricata EVE log integration
- FastAPI async backend with SQLite
- Next.js 14 SOC Dashboard
- Automated Webhook and Email response engines
- Docker Compose multi-container deployment
