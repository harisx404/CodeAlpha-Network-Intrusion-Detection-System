"""Seed the database with a default admin user, sample alerts, and detection rules.

Idempotent: running it repeatedly will not create duplicates.
Intended for local development, demos, and Docker first-run bootstrapping.
"""

from __future__ import annotations

import asyncio
import random
import re
from datetime import UTC, datetime, timedelta
from pathlib import Path

from backend.core.constants import AlertStatus, Severity
from backend.core.database import AsyncSessionLocal
from backend.core.security import get_password_hash, verify_password
from backend.models import Alert, User
from backend.models.rule import DetectionRule
from sqlalchemy import func, select

# ── Default credentials (dev/demo only) ───────────────────────────────────────
DEFAULT_ADMIN_USERNAME = "admin"
DEFAULT_ADMIN_EMAIL = "admin@nids.local"
DEFAULT_ADMIN_PASSWORD = "admin"  # noqa: S105 — dev-only default, see README

SAMPLE_ALERT_COUNT = 50

# ── Rules file to import ───────────────────────────────────────────────────────
# Try common paths: inside container (/app/rules) and local repo path.
_RULES_SEARCH_PATHS = [
    Path("/app/rules/custom.rules"),
    Path("suricata/rules/custom.rules"),
    Path("../suricata/rules/custom.rules"),
]

_SIGNATURES = [
    ("ET SCAN Potential SSH Scan OUTBOUND", "Attempted Information Leak", Severity.LOW),
    (
        "ET MALWARE Cobalt Strike Beacon Observed",
        "A Network Trojan was Detected",
        Severity.CRITICAL,
    ),
    (
        "ET EXPLOIT Possible SQL Injection Attempt",
        "Web Application Attack",
        Severity.HIGH,
    ),
    (
        "ET POLICY DNS Query to .onion Domain",
        "Potentially Bad Traffic",
        Severity.MEDIUM,
    ),
    (
        "ET INFO Observed DNS Query to Public Resolver",
        "Not Suspicious Traffic",
        Severity.INFO,
    ),
    (
        "ET DOS Possible NTP Amplification Attack",
        "Attempted Denial of Service",
        Severity.HIGH,
    ),
]
_PROTOCOLS = ["TCP", "UDP", "ICMP"]

# ── Severity mapping from Suricata classtype keyword ──────────────────────────
_CLASSTYPE_SEVERITY: dict[str, str] = {
    "attempted-admin": "CRITICAL",
    "attempted-user": "CRITICAL",
    "web-application-attack": "HIGH",
    "network-scan": "HIGH",
    "attempted-recon": "MEDIUM",
    "suspicious-login": "MEDIUM",
    "bad-unknown": "MEDIUM",
    "attempted-login": "LOW",
    "not-suspicious": "LOW",
    "policy-violation": "INFO",
}


def _parse_rules_file(path: Path) -> list[dict]:
    """Parse a Suricata .rules file into structured dicts for DB insertion."""
    rules: list[dict] = []
    sid_counter = 0
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue

        # Extract msg (rule name)
        msg_match = re.search(r'msg:"([^"]+)"', line)
        if not msg_match:
            continue
        name = msg_match.group(1)

        # Extract SID
        sid_match = re.search(r"\bsid:(\d+)\b", line)
        if not sid_match:
            continue
        sid = int(sid_match.group(1))

        # Extract classtype for severity mapping
        classtype_match = re.search(r"\bclasstype:([^;]+)\b", line)
        classtype = classtype_match.group(1).strip() if classtype_match else ""
        severity = _CLASSTYPE_SEVERITY.get(classtype, "MEDIUM")

        # Derive category from classtype (title-cased)
        category = classtype.replace("-", " ").title() if classtype else "Misc"

        rules.append(
            {
                "sid": sid,
                "name": name,
                "body": line,
                "severity": severity,
                "category": category,
                "is_active": True,
            }
        )
        sid_counter += 1

    return rules


async def _seed_admin(session) -> None:
    """Create the default admin user if it does not already exist.

    If the user already exists but the stored hash does not match the expected
    password (e.g. because bcrypt parameters changed between builds), the hash
    is silently refreshed so login always works in development.
    """
    existing = await session.scalar(
        select(User).where(User.username == DEFAULT_ADMIN_USERNAME)
    )
    if existing:
        # Refresh hash if it no longer verifies — keeps dev login reliable
        if not verify_password(DEFAULT_ADMIN_PASSWORD, existing.hashed_password):
            existing.hashed_password = get_password_hash(DEFAULT_ADMIN_PASSWORD)
            await session.commit()
            print(
                f"Admin password hash refreshed — "
                f"login: {DEFAULT_ADMIN_USERNAME} / {DEFAULT_ADMIN_PASSWORD}"
            )
        else:
            print(
                f"Admin user '{DEFAULT_ADMIN_USERNAME}' already exists — "
                f"login: {DEFAULT_ADMIN_USERNAME} / {DEFAULT_ADMIN_PASSWORD}"
            )
        return

    session.add(
        User(
            username=DEFAULT_ADMIN_USERNAME,
            email=DEFAULT_ADMIN_EMAIL,
            hashed_password=get_password_hash(DEFAULT_ADMIN_PASSWORD),
            role="admin",
            is_active=True,
        )
    )
    await session.commit()
    print(
        f"✅ Admin user created  —  "
        f"username: {DEFAULT_ADMIN_USERNAME}  /  password: {DEFAULT_ADMIN_PASSWORD}"
    )


async def _seed_alerts(session) -> None:
    """Populate sample alerts or refresh existing alert timestamps to today."""
    existing_alerts = (await session.scalars(select(Alert).order_by(Alert.id))).all()
    now = datetime.now(UTC)
    if existing_alerts:
        for i, alert in enumerate(existing_alerts):
            alert.timestamp = now - timedelta(minutes=i * 5)
        await session.commit()
        print(
            f"✅ Refreshed timestamps for {len(existing_alerts)} existing alerts to today."
        )
        return

    rng = random.Random(42)  # deterministic sample data
    alerts = []
    for i in range(SAMPLE_ALERT_COUNT):
        signature, category, severity = rng.choice(_SIGNATURES)
        alerts.append(
            Alert(
                timestamp=now - timedelta(minutes=i * 5),
                severity=severity.value,
                status=AlertStatus.NEW.value,
                category=category,
                signature_id=2001234 + i,
                signature=f"{signature} #{i}",
                src_ip=f"203.0.113.{10 + (i % 40)}",
                src_port=rng.randint(1024, 65535),
                dst_ip=f"10.0.0.{5 + (i % 10)}",
                dst_port=rng.choice([80, 443, 22, 3389, 53]),
                protocol=rng.choice(_PROTOCOLS),
                geo_country=rng.choice(["US", "RU", "CN", "DE", "BR", "IN"]),
                raw_eve={"event_type": "alert", "alert": {"signature": signature}},
            )
        )

    session.add_all(alerts)
    await session.commit()
    print(f"✅ Created {len(alerts)} sample alerts.")


async def _seed_stats(session) -> None:
    """Insert or update traffic statistics snapshot for live monitoring indicators."""
    from backend.models.statistics import TrafficStatistics

    now = datetime.now(UTC).replace(microsecond=0)
    stats = TrafficStatistics(
        timestamp=now,
        alerts_total=50,
        alerts_critical=12,
        alerts_high=28,
        bytes_in=10485760,  # 10 MB
        bytes_out=5242880,  # 5 MB
        packets_in=12450,
        packets_out=8920,
    )
    session.add(stats)
    try:
        await session.commit()
        print("✅ Created traffic statistics snapshot for monitoring dashboard.")
    except Exception:
        await session.rollback()


async def _seed_rules(session) -> None:
    """Import Suricata rules from custom.rules into the rules table if empty."""
    existing_count = await session.scalar(
        select(func.count()).select_from(DetectionRule)
    )
    if existing_count:
        print(f"Rules table already has {existing_count} rows — skipping.")
        return

    # Find the rules file
    rules_path: Path | None = None
    for candidate in _RULES_SEARCH_PATHS:
        if candidate.exists():
            rules_path = candidate
            break

    if rules_path is None:
        print("Rules file not found in search paths — skipping rule seeding.")
        return

    parsed = _parse_rules_file(rules_path)
    if not parsed:
        print("No valid rules parsed from file — skipping.")
        return

    for r in parsed:
        session.add(
            DetectionRule(
                sid=r["sid"],
                name=r["name"],
                body=r["body"],
                severity=r["severity"],
                category=r["category"],
                is_active=r["is_active"],
            )
        )
    await session.commit()
    print(f"✅ Imported {len(parsed)} detection rules from {rules_path}.")


async def seed_db() -> None:
    """Seed the database with default data, creating tables first if needed."""
    from backend.core.database import create_tables

    await create_tables()
    async with AsyncSessionLocal() as session:
        await _seed_admin(session)
        await _seed_alerts(session)
        await _seed_rules(session)
        await _seed_stats(session)


if __name__ == "__main__":
    print("Seeding database...")
    asyncio.run(seed_db())
    print("Database seeding complete.")
