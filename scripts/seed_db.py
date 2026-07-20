import argparse
import asyncio
import os
import random
import sys
from datetime import datetime, timedelta, timezone

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

# Append the repository root to the path so ``backend`` imports resolve whether
# this script is run from the repo root or the scripts/ directory.
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from backend.core.config import settings
from backend.models.alert import Alert


# Simple progress bar function
def print_progress_bar(iteration, total, prefix='', suffix='', decimals=1, length=50, fill='█', print_end="\r"):
    percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    filled_length = int(length * iteration // total)
    bar = fill * filled_length + '-' * (length - filled_length)
    print(f'\r{prefix} |{bar}| {percent}% {suffix}', end=print_end)
    if iteration == total: 
        print()

async def seed_alerts(count):
    print(f"Connecting to database at {settings.DATABASE_URL}...")
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    print(f"Generating {count} sample alerts...")
    
    # Match the values the API reads/writes. Severity strings map to the
    # backend Severity enum; INFO is included so charts show the full range.
    severities = ["INFO", "LOW", "MEDIUM", "HIGH", "CRITICAL"]
    statuses = ["NEW", "ACKNOWLEDGED", "RESOLVED", "FALSE_POSITIVE", "ESCALATED"]
    categories = [
        "Attempted Information Leak",
        "Web Application Attack",
        "Network Scan",
        "Misc Activity",
        "A Network Trojan was Detected",
    ]
    signatures = [
        "ET SCAN Nmap OS Detection Probe",
        "ET WEB_SERVER Possible SQL Injection Attempt GET",
        "ET INFO Suspicious DNS TXT Record Response",
        "ET EXPLOIT Possible Log4Shell JNDI Injection Attempt",
    ]

    async with async_session() as session:
        print_progress_bar(0, count, prefix='Progress:', suffix='Complete', length=50)
        for i in range(count):
            signature = random.choice(signatures)
            alert = Alert(
                timestamp=datetime.now(timezone.utc) - timedelta(hours=random.randint(0, 168)),
                src_ip=f"{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}",
                src_port=random.randint(1024, 65535),
                dst_ip="192.168.1.100",
                dst_port=random.choice([80, 443, 22, 53]),
                protocol=random.choice(["TCP", "UDP"]),
                signature_id=2000000 + i,
                signature=signature,
                severity=random.choice(severities),
                category=random.choice(categories),
                status=random.choice(statuses),
                raw_eve={"event_type": "alert", "alert": {"signature": signature}},
            )
            session.add(alert)

            if (i + 1) % 100 == 0:
                await session.commit()

            print_progress_bar(i + 1, count, prefix='Progress:', suffix='Complete', length=50)

        await session.commit()
    
    print("Database seeding completed successfully.")

def main():
    parser = argparse.ArgumentParser(description="Seed the NIDS database with dummy alerts.")
    parser.add_argument("--count", type=int, default=100, help="Number of dummy alerts to insert.")
    args = parser.parse_args()

    asyncio.run(seed_alerts(args.count))

if __name__ == "__main__":
    main()
