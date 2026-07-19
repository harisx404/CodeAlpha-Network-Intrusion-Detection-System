# API Reference

The NIDS backend exposes a RESTful API and a real-time WebSocket connection.
All REST responses use a shared envelope (`success`, `data`, `message`, `meta`).

## REST Endpoints (v1)

Base Path: `/api/v1`

### Authentication (`/auth`)
- `POST /auth/login`: OAuth2 password-form login (`username`, `password`); returns a JWT bearer token.
- `GET /auth/me`: Return the currently authenticated user's profile.

### Alerts (`/alerts`)
- `GET /alerts`: Retrieve paginated alerts.
  - Query params: `page`, `per_page` (max 100), `severity`, `status`, `src_ip`, `start_date`, `end_date`
- `GET /alerts/{id}`: Get a single alert by ID.
- `POST /alerts/{id}/acknowledge`: Mark an alert as acknowledged (analyst or above).
- `POST /alerts/{id}/resolve`: Mark an alert as resolved (analyst or above).

### Rules (`/rules`)
- `GET /rules`: List all detection rules.
- `POST /rules`: Create a new rule (admin).
- `PUT /rules/{id}`: Update an existing rule (admin).
- `DELETE /rules/{id}`: Delete a rule (admin).

### Statistics (`/statistics`)
- `GET /statistics/current` (alias `/statistics/summary`): Latest traffic and alert snapshot.
- `GET /statistics/dashboard`: Aggregated KPIs, severity breakdown, 24h trend, and top talkers.

### System (`/system`)
- `GET /system/health`: Liveness/readiness probe.
- `POST /system/suricata/restart`: Restart the Suricata engine (admin).
- `POST /system/suricata/reload`: Reload Suricata rules (admin).

### Reports (`/reports`)
- `GET /reports`: Placeholder endpoint; server-side report generation is not yet implemented.

---

## WebSocket Stream

Endpoint: `ws://localhost:8000/ws/events`

**Authentication**: Pass the JWT via the `token` query parameter — `ws://localhost:8000/ws/events?token=eyJ...`

**Payload Format (Server to Client)**:
```json
{
  "type": "new_alert",
  "data": {
    "id": 1,
    "timestamp": "2026-07-16T12:00:00Z",
    "src_ip": "192.168.1.10",
    "dst_ip": "10.0.0.5",
    "signature": "ET SCAN Nmap OS Detection Probe",
    "severity": "HIGH"
  }
}
```
