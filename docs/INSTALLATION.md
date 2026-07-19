# Installation Guide

## Docker Setup (Recommended)
1. Ensure Docker and Docker Compose are installed.
2. Run `bash scripts/setup.sh`.
3. Access the dashboard at `http://localhost:3000` (API docs at `http://localhost:8000/docs`).

## Manual Setup
### Backend
Run these from the repository root (the app module is `backend.main` and `alembic.ini` lives at the root):
1. `pip install -r backend/requirements.txt`
2. Create `backend/.env` (copy from `backend/.env.example`).
3. `alembic upgrade head`
4. `uvicorn backend.main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
