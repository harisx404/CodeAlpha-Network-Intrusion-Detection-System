# Installation Guide

## Docker Setup (Recommended)
1. Ensure Docker and Docker Compose are installed.
2. Run `bash scripts/setup.sh`.
3. Access `http://localhost`.

## Manual Setup
### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `alembic upgrade head`
4. `uvicorn main:app --reload`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
