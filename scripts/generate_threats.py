import json
import time
import random
from datetime import datetime, timezone
import os

# Point this to the live Suricata log file mounted in the container
EVE_PATH = os.path.join("suricata", "logs", "eve.json")

# A set of mock alerts mimicking common attacks
alerts = [
    {
        "event_type": "alert",
        "src_ip": "192.168.1.100",
        "dest_ip": "10.0.0.5",
        "alert": {
            "signature": "ET SCAN Nmap OS Detection Probe",
            "severity": 1,
            "category": "Network Scan"
        }
    },
    {
        "event_type": "alert",
        "src_ip": "45.33.32.156",
        "dest_ip": "10.0.0.10",
        "alert": {
            "signature": "Possible SQL Injection (UNION SELECT)",
            "severity": 1,
            "category": "Web Application Attack"
        }
    },
    {
        "event_type": "alert",
        "src_ip": "10.0.0.50",
        "dest_ip": "10.0.0.1",
        "alert": {
            "signature": "Possible Reverse Shell (/bin/bash outbound)",
            "severity": 2,
            "category": "Suspicious Login"
        }
    },
    {
        "event_type": "alert",
        "src_ip": "8.8.8.8",
        "dest_ip": "192.168.1.15",
        "alert": {
            "signature": "Suspicious Large DNS TXT Query",
            "severity": 2,
            "category": "Bad Unknown"
        }
    },
    {
        "event_type": "alert",
        "src_ip": "114.114.114.114",
        "dest_ip": "10.0.0.100",
        "alert": {
            "signature": "Log4Shell JNDI Injection Attempt",
            "severity": 1,
            "category": "Attempted Admin"
        }
    }
]

print("🚨 Initiating Threat Simulation. Press Ctrl+C to stop.")
print(f"[*] Writing to {EVE_PATH}...")

# Ensure the log file exists
os.makedirs(os.path.dirname(EVE_PATH), exist_ok=True)

try:
    with open(EVE_PATH, "a") as f:
        while True:
            # Pick a random alert template
            alert = random.choice(alerts).copy()
            # Insert the current UTC timestamp
            alert["timestamp"] = datetime.now(timezone.utc).isoformat()
            
            # Write out to the eve.json
            f.write(json.dumps(alert) + "\n")
            f.flush()
            
            print(f"[*] Injected: {alert['alert']['signature']} from {alert['src_ip']}")
            
            # Random delay between 0.5s and 2.5s for realism
            time.sleep(random.uniform(0.5, 2.5))
except KeyboardInterrupt:
    print("\n✅ Simulation Terminated.")
