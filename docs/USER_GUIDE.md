# NIDS User Guide

Welcome to the CodeAlpha Network Intrusion Detection System (NIDS) User Guide. This document provides SOC Analysts and System Administrators with operational instructions for using the dashboard.

## 1. Accessing the Dashboard

Once the Docker containers are running (`docker-compose up -d`), navigate to the frontend portal:
**URL**: `http://localhost:3000`

### Authentication
If authentication is enabled, you will be redirected to the login page. Use your provisioned SOC Analyst credentials to authenticate. The session is managed securely via HttpOnly JWT cookies.

## 2. Navigating the Interface

### The Threat Dashboard (Home)
This is the high-level overview intended for SOC managers and tier-1 analysts.
- **Traffic Timeline**: Displays the volume of incoming packets over time.
- **Severity Donut**: A breakdown of alerts categorized by Critical, High, Medium, and Low.
- **Top Attackers**: Ranks external IP addresses currently generating the most alerts.

### Live Feed (Real-Time Monitoring)
This page is connected directly to the backend via WebSockets.
- As Suricata detects anomalies, they will appear here instantly.
- The interface automatically debounces rapid bursts (e.g., during a SYN flood) to prevent browser crashing.

### Alert Investigation
Clicking on an individual alert provides deep context:
- **Raw EVE JSON**: View the exact output from Suricata.
- **Threat Intelligence**: If configured, AbuseIPDB or VirusTotal scores will be displayed next to the source IP.
- **Actions**:
  - `Acknowledge`: Mark the alert as under investigation.
  - `Resolve`: Close the alert.
  - `Block IP`: (If Firewall integrations are enabled) Instantly ban the IP at the host firewall level.

## 3. Managing Suricata Rules

Rules define what Suricata considers an "attack". 
To view active rules, navigate to the **Rules** tab.

### Adding Custom Rules
As a System Administrator, you can add custom rules directly via the UI or by editing `suricata/rules/custom.rules` on the host machine.
If editing via the host machine, you must instruct Suricata to reload the rules:
```bash
docker-compose exec suricata suricatasc -c rule-reload
```

## 4. Troubleshooting

If you are not seeing alerts:
1. Ensure the `generate_traffic.py` script was run to simulate attacks.
2. Check the WebSocket connection indicator in the bottom-right corner of the UI. It should be **Green** (Connected).
3. Check the Suricata logs for rule parsing errors:
   `docker-compose logs -f suricata`
