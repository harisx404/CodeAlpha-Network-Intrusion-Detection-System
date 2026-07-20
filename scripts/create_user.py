"""Create (or update) a NIDS user account from the command line.

This is the recommended way to bootstrap the first login for a fresh
deployment. It ensures the database tables exist, hashes the password with
the same bcrypt settings the API uses, and inserts the user — skipping if the
username already exists (unless ``--force`` is given to reset the password).

Usage examples
---------------
Interactive (prompts for a hidden password)::

    python scripts/create_user.py --username admin --email admin@nids.local --role admin

Non-interactive (password supplied via environment variable)::

    NIDS_USER_PASSWORD=... python scripts/create_user.py --username analyst \
        --email analyst@nids.local --role analyst

Security note
-------------
No password is ever hard-coded here. The password is read, in order of
precedence, from ``--password``, the ``NIDS_USER_PASSWORD`` environment
variable, or an interactive hidden prompt. Prefer the env var or prompt so the
secret never lands in shell history.
"""

from __future__ import annotations

import argparse
import asyncio
import getpass
import os
import sys
from pathlib import Path

# Make the repository root importable so ``backend`` resolves whether the
# script is run from the repo root or the scripts/ directory.
_REPO_ROOT = Path(__file__).resolve().parent.parent
if str(_REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(_REPO_ROOT))

from backend.core.database import AsyncSessionLocal, create_tables  # noqa: E402
from backend.core.security import get_password_hash  # noqa: E402
from backend.models.user import User  # noqa: E402
from sqlalchemy import select  # noqa: E402

VALID_ROLES = ("admin", "analyst")


def _resolve_password(cli_password: str | None) -> str:
    """Resolve the password from CLI arg, env var, or an interactive prompt."""
    if cli_password:
        return cli_password

    env_password = os.getenv("NIDS_USER_PASSWORD")
    if env_password:
        return env_password

    password = getpass.getpass("Password: ")
    confirm = getpass.getpass("Confirm password: ")
    if password != confirm:
        raise SystemExit("Passwords do not match — aborting.")
    return password


async def _create_user(
    *, username: str, email: str, password: str, role: str, force: bool
) -> None:
    if role not in VALID_ROLES:
        raise SystemExit(f"Invalid role '{role}'. Choose from: {', '.join(VALID_ROLES)}")
    if len(password) < 8:
        raise SystemExit("Password must be at least 8 characters long.")

    await create_tables()

    async with AsyncSessionLocal() as session:
        existing = await session.scalar(
            select(User).where(User.username == username)
        )
        if existing:
            if not force:
                print(
                    f"User '{username}' already exists — skipping. "
                    "Pass --force to reset the password."
                )
                return
            existing.hashed_password = get_password_hash(password)
            existing.email = email
            existing.role = role
            existing.is_active = True
            await session.commit()
            print(f"User '{username}' updated (password reset, role={role}).")
            return

        session.add(
            User(
                username=username,
                email=email,
                hashed_password=get_password_hash(password),
                role=role,
                is_active=True,
            )
        )
        await session.commit()
        print(f"User '{username}' created successfully (role={role}).")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Create or update a NIDS user account."
    )
    parser.add_argument("--username", default="admin", help="Login username.")
    parser.add_argument(
        "--email", default="admin@nids.local", help="User email address."
    )
    parser.add_argument(
        "--password",
        default=None,
        help="Password. If omitted, uses NIDS_USER_PASSWORD env var or prompts.",
    )
    parser.add_argument(
        "--role",
        default="admin",
        choices=VALID_ROLES,
        help="User role (admin or analyst).",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Reset the password if the user already exists.",
    )
    args = parser.parse_args()

    password = _resolve_password(args.password)

    asyncio.run(
        _create_user(
            username=args.username,
            email=args.email,
            password=password,
            role=args.role,
            force=args.force,
        )
    )


if __name__ == "__main__":
    main()
