"""Unit tests for the scripts/create_user.py bootstrap helper.

These cover the password-resolution precedence and input validation, which are
the parts of the script that are safe to exercise without touching the real
database engine.
"""

import importlib.util
import os
from pathlib import Path

import pytest

_REPO_ROOT = Path(__file__).resolve().parents[3]
_SCRIPT_PATH = _REPO_ROOT / "scripts" / "create_user.py"


def _load_script_module():
    """Import scripts/create_user.py as a module for testing."""
    spec = importlib.util.spec_from_file_location("create_user", _SCRIPT_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


create_user = _load_script_module()


def test_resolve_password_prefers_cli_arg(monkeypatch):
    monkeypatch.setenv("NIDS_USER_PASSWORD", "from-env")
    assert create_user._resolve_password("from-cli") == "from-cli"


def test_resolve_password_falls_back_to_env(monkeypatch):
    monkeypatch.setenv("NIDS_USER_PASSWORD", "from-env")
    assert create_user._resolve_password(None) == "from-env"


def test_resolve_password_prompts_when_missing(monkeypatch):
    monkeypatch.delenv("NIDS_USER_PASSWORD", raising=False)
    prompts = iter(["prompted-pass", "prompted-pass"])
    monkeypatch.setattr(create_user.getpass, "getpass", lambda _: next(prompts))
    assert create_user._resolve_password(None) == "prompted-pass"


def test_resolve_password_mismatch_aborts(monkeypatch):
    monkeypatch.delenv("NIDS_USER_PASSWORD", raising=False)
    prompts = iter(["one", "two"])
    monkeypatch.setattr(create_user.getpass, "getpass", lambda _: next(prompts))
    with pytest.raises(SystemExit):
        create_user._resolve_password(None)


@pytest.mark.asyncio
async def test_create_user_rejects_invalid_role():
    with pytest.raises(SystemExit):
        await create_user._create_user(
            username="x",
            email="x@example.com",
            password="longenough",
            role="superuser",
            force=False,
        )


@pytest.mark.asyncio
async def test_create_user_rejects_short_password():
    with pytest.raises(SystemExit):
        await create_user._create_user(
            username="x",
            email="x@example.com",
            password="short",
            role="admin",
            force=False,
        )


def test_valid_roles_are_admin_and_analyst():
    assert create_user.VALID_ROLES == ("admin", "analyst")


def test_script_file_exists():
    assert os.path.exists(_SCRIPT_PATH)
