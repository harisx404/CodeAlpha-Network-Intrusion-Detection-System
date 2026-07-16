#!/bin/bash
set -e

echo "Setting up NIDS Platform..."

# 1. Create necessary directories
mkdir -p suricata/logs
mkdir -p suricata/rules
mkdir -p suricata/config

# 2. Build and start containers
echo "Building Docker containers..."
docker-compose build

echo "Starting services..."
docker-compose up -d

echo "Running database migrations..."
docker-compose exec backend alembic upgrade head
docker-compose exec backend python -m database.seed

echo "Setup complete! Access the dashboard at http://localhost"
