# API Documentation
The backend exposes a FastAPI OpenAPI schema.
When the application is running, navigate to: `http://localhost:8000/docs`.

### Key Endpoints
- `POST /api/v1/auth/login`: JWT Authentication.
- `GET /api/v1/alerts`: Paginated list of recent alerts.
- `WS /api/v1/ws`: WebSocket endpoint for live alert streaming.
