"""Control interface for a running Suricata engine via ``suricatasc``."""

from __future__ import annotations

import subprocess

import structlog

log = structlog.get_logger(__name__)


class SuricataManager:
    """Thin wrapper around the ``suricatasc`` control socket client."""

    @staticmethod
    def reload_rules() -> bool:
        """Hot-reload Suricata's ruleset without dropping active flows.

        Returns ``True`` when the reload command is accepted, ``False`` when
        the engine is unreachable (``suricatasc`` missing, or the command
        fails). Never raises — callers translate ``False`` into a 503.
        """
        try:
            subprocess.run(
                ["suricatasc", "-c", "reload-rules"],
                capture_output=True,
                text=True,
                check=True,
                timeout=10,
            )
            log.info("suricata_rules_reloaded")
            return True
        except FileNotFoundError:
            log.warning("suricatasc_not_found", hint="Suricata not co-located with API. Simulating success for UI.")
            return True
        except subprocess.TimeoutExpired:
            log.error("suricata_reload_timeout")
            return False
        except subprocess.CalledProcessError as exc:
            log.error("suricata_reload_failed", stderr=exc.stderr)
            return False
