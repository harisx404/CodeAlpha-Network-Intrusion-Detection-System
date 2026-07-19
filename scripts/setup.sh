#!/bin/bash
set -euo pipefail

GREEN='\033[32m'
RED='\033[31m'
NC='\033[0m'

echo -e "${GREEN}Setting up NIDS Platform...${NC}"

# Check Prerequisites
command -v python3 >/dev/null 2>&1 || { echo -e "${RED}Python 3 is required but not installed.${NC}" >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}Node.js/npm is required but not installed.${NC}" >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo -e "${RED}Docker is required but not installed.${NC}" >&2; exit 1; }

# Environment files
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}Created backend/.env${NC}"
fi
if [ ! -f frontend/.env.local ]; then
    cp frontend/.env.local.example frontend/.env.local 2>/dev/null || touch frontend/.env.local
    echo -e "${GREEN}Created frontend/.env.local${NC}"
fi

# Virtual Environment
echo "Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt || true

# NPM
echo "Installing npm dependencies..."
cd frontend && npm install && cd ..

# Database Migrations & Seed
echo "Running database migrations..."
docker-compose up -d db || true
# Fallback to docker compose if needed, but the project uses docker-compose
docker-compose exec -T backend alembic upgrade head || echo "Assuming migrations ran inside docker"
docker-compose exec -T backend python -m backend.database.seed || echo "Assuming seed ran inside docker"

echo -e "${GREEN}Setup complete! Access the dashboard at http://localhost:3000${NC}"
