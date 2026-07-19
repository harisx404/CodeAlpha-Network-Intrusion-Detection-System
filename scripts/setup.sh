#!/bin/bash
#
# NIDS setup — build and start the full stack with Docker Compose, then run
# database migrations and seed a default admin user.
#
# Prerequisites: Docker and Docker Compose. Run from the repository root.
#
set -euo pipefail

GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'
NC='\033[0m'

# Resolve the repo root so the script works regardless of the caller's CWD.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${REPO_ROOT}"

# Pick the available compose command (v2 plugin or the legacy binary).
if docker compose version >/dev/null 2>&1; then
    COMPOSE="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE="docker-compose"
else
    echo -e "${RED}Docker Compose is required but was not found.${NC}" >&2
    echo    "Install Docker Desktop or the docker-compose plugin, then re-run." >&2
    exit 1
fi

command -v docker >/dev/null 2>&1 || {
    echo -e "${RED}Docker is required but was not found.${NC}" >&2
    exit 1
}

echo -e "${GREEN}==> Preparing environment files${NC}"
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "    created backend/.env from example"
    echo -e "${YELLOW}    NOTE: set a strong JWT_SECRET_KEY in backend/.env before exposing this service.${NC}"
fi
if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.local.example frontend/.env.local
    echo "    created frontend/.env.local from example"
fi

echo -e "${GREEN}==> Building and starting containers${NC}"
${COMPOSE} up -d --build

echo -e "${GREEN}==> Waiting for the backend to become healthy${NC}"
backend_ready=""
for _ in $(seq 1 30); do
    if curl -fs http://localhost:8000/api/v1/system/health >/dev/null 2>&1; then
        backend_ready="yes"
        break
    fi
    sleep 2
done

if [ -z "${backend_ready}" ]; then
    echo -e "${RED}Backend did not report healthy within the timeout.${NC}" >&2
    echo    "Check the logs with: ${COMPOSE} logs backend" >&2
    exit 1
fi
echo "    backend is up"

echo -e "${GREEN}==> Applying database migrations${NC}"
${COMPOSE} exec -T backend alembic upgrade head

echo -e "${GREEN}==> Seeding the default admin user and sample data${NC}"
${COMPOSE} exec -T backend python -m backend.database.seed

echo
echo -e "${GREEN}Setup complete.${NC}"
echo "  Dashboard:  http://localhost:3000"
echo "  API (proxy): http://localhost/api/v1"
echo "  API docs:   http://localhost:8000/docs"
echo
echo "Default login is printed by the seed step above. Change it before any real use."
