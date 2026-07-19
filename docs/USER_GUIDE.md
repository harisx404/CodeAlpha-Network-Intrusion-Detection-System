# NIDS User Guide

Welcome to the CodeAlpha Network Intrusion Detection System (NIDS) User Guide. This document provides SOC analysts and system administrators with operational instructions for using the dashboard.

## 1. Accessing the Dashboard

Once the Docker containers are running (`docker-compose up -d`), open the frontend:
**URL**: `http://localhost:3000`

### Authentication
You will be redirected to the login page. Sign in with your provisioned credentials. On success the backend issues a JWT bearer token, which the frontend stores in the browser and attaches to every API request.

## 2. Navigating the Interface

A live connection indicator sits in the top header: it reads **Live** (green) when the WebSocket is connected and **Disconnected** (red) otherwise.

### Dashboard (Home)
The high-level overview:
- **KPI Cards**: Total alerts today, critical/high count, active rules, and packets analyzed.
- **Alert Feed**: The most recent alerts, updated live over the WebSocket.
- **Severity Donut**: Alert breakdown by severity.
- **Traffic Timeline**: Alert volume over the last 24 hours.
- **Top Attackers**: Source IPs generating the most alerts.

### Alerts
The Alert Center lists detected threats in a table with timestamp, severity, signature, source, destination, and protocol. New alerts arriving over the WebSocket are reflected in the shared alert store.

### Rules
Navigate to the **Rules** tab to view detection rules. Administrators can create, edit, and delete rules from this page.

### Monitoring
Live traffic-throughput and alert-volume metrics, plus an engine-health indicator, refreshed on a short interval.

### Reports
Export the current alert set as CSV or JSON for offline analysis. Scheduled server-side report generation is planned but not yet available.

### Settings
Restart the Suricata engine or reload its rules, and review response-handler configuration.

## 3. Managing Suricata Rules

Rules define what Suricata treats as an attack. View active rules under the **Rules** tab.

### Adding Custom Rules
Administrators can add rules via the UI, or by editing `suricata/rules/custom.rules` on the host. If editing on the host, reload the rules from the Settings page or on the command line:
```bash
docker-compose exec suricata suricatasc -c rule-reload
```

## 4. Troubleshooting

If you are not seeing alerts:
1. Run `scripts/generate_traffic.py` to simulate attack traffic (see the README).
2. Check the connection indicator in the top header — it should read **Live**.
3. Check the Suricata logs for rule-parsing errors:
   `docker-compose logs -f suricata`
