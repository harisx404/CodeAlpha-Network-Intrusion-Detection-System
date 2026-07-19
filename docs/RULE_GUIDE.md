# Suricata Rule Writing Guide

This system detects network anomalies based on signatures loaded by Suricata. Rules are placed in `suricata/rules/custom.rules`.

## Rule Anatomy

```text
action protocol source_ip source_port -> dest_ip dest_port (options)
```

**Example (SQL Injection)**:
```text
alert tcp $EXTERNAL_NET any -> $HTTP_SERVERS $HTTP_PORTS (msg:"Possible SQL Injection Attempt"; flow:established,to_server; content:"' OR 1=1"; http_uri; classtype:web-application-attack; sid:1000001; rev:1;)
```

### 1. Action
Usually `alert`, `drop`, `pass`, or `reject`. We use `alert` exclusively since our architecture relies on the Python backend Response Engine to drop packets or trigger firewalls via webhook.

### 2. Protocol
`tcp`, `udp`, `icmp`, `ip`, or application layer protocols like `http`, `dns`, `tls`.

### 3. Source & Destination
Suricata allows variables (defined in `suricata.yaml`):
- `$HOME_NET`: The internal network you are protecting.
- `$EXTERNAL_NET`: Everything outside `$HOME_NET`.
- `any`: Any IP address or port.

### 4. Options (The most important part)
- `msg`: The human-readable string that appears in the dashboard.
- `flow`: E.g., `established,to_server` ensures the rule only fires on valid, completed handshakes.
- `content`: The exact payload signature to match.
- `classtype`: Categories (e.g., `web-application-attack`, `trojan-activity`). This heavily influences the severity mapped in the backend.
- `sid`: Signature ID. Custom rules must be > 1000000.
- `rev`: Revision number. Increment when modifying a rule.

## Loading Rules

After modifying `custom.rules`, you must tell Suricata to reload them:

```bash
docker-compose exec suricata suricatasc -c rule-reload
```
Or via the API (requires an admin bearer token):
```bash
curl -X POST http://localhost:8000/api/v1/system/suricata/reload \
  -H "Authorization: Bearer <token>"
```
