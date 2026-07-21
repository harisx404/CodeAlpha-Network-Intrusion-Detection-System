"""
Asyncio-based file tail for Suricata EVE JSON output.

Monitors eve.json in real-time, parses each line as a JSON event,
and forwards to the AlertManager. Handles file-not-found gracefully,
supports log rotation, and never blocks the asyncio event loop.
"""

from __future__ import annotations

import asyncio
import json
import os
from collections.abc import Awaitable, Callable

import aiofiles
import structlog
from backend.detection.eve_parser import EVEEvent, EVEParser

log = structlog.get_logger(__name__)

# How long to sleep when no new data is available (100ms)
POLL_INTERVAL_SECONDS: float = 0.1
# Maximum events to process per read cycle (prevents starvation)
BATCH_SIZE: int = 50
# How long to wait for file to appear on startup (Suricata may not be running yet)
FILE_WAIT_INTERVAL_SECONDS: float = 5.0


class EVELogWatcher:
    """Watches Suricata's EVE JSON log file and processes new events.

    Designed to be resilient:
    - File not existing: waits and retries every 5 seconds
    - File rotation (Suricata logrotate): detects inode change, reopens
    - Malformed JSON lines: logs warning and skips, never crashes
    - Asyncio event loop: all I/O is non-blocking via aiofiles
    """

    def __init__(
        self,
        filepath: str,
        alert_manager: Callable[[EVEEvent], Awaitable[None]],
    ) -> None:
        self._filepath = filepath
        self._alert_manager = alert_manager
        self._running = False
        self._last_inode: int | None = None

    def stop(self) -> None:
        """Signal the watcher loop to stop gracefully."""
        self._running = False

    async def start(self) -> None:
        """Begin watching the EVE log file. Runs indefinitely until stop() called."""
        self._running = True
        log.info("eve_watcher_starting", filepath=self._filepath)

        while self._running:
            if not os.path.exists(self._filepath):
                log.warning(
                    "eve_log_not_found",
                    filepath=self._filepath,
                    message="Waiting for Suricata to create eve.json...",
                )
                await asyncio.sleep(FILE_WAIT_INTERVAL_SECONDS)
                continue

            await self._tail_file()

    async def _tail_file(self) -> None:
        """Open and tail the EVE log file until rotation or stop signal."""
        try:
            current_inode = os.stat(self._filepath).st_ino
            async with aiofiles.open(self._filepath, mode="r", encoding="utf-8") as f:
                # On startup: seek to end so we don't replay historical events
                await f.seek(0, 2)
                self._last_inode = current_inode
                log.info("eve_watcher_tailing", filepath=self._filepath)

                while self._running:
                    lines = await f.readlines()
                    if lines:
                        await self._process_batch(lines[:BATCH_SIZE])
                    else:
                        # Check for log rotation
                        try:
                            new_inode = os.stat(self._filepath).st_ino
                            if new_inode != self._last_inode:
                                log.info("eve_log_rotated_detected")
                                return  # Will reopen from outer loop
                        except FileNotFoundError:
                            log.warning("eve_log_disappeared")
                            return
                        await asyncio.sleep(POLL_INTERVAL_SECONDS)

        except PermissionError:
            log.error("eve_log_permission_denied", filepath=self._filepath)
            await asyncio.sleep(FILE_WAIT_INTERVAL_SECONDS)
        except Exception as exc:
            log.exception("eve_watcher_unexpected_error", error=str(exc))
            await asyncio.sleep(FILE_WAIT_INTERVAL_SECONDS)

    async def _process_batch(self, lines: list[str]) -> None:
        """Parse and process a batch of EVE JSON lines.

        Only ``alert`` events are forwarded to the alert manager; other event
        types (dns, http, flow, stats) are parsed but not persisted as alerts.
        """
        for line in lines:
            line = line.strip()
            if not line:
                continue
            try:
                raw = json.loads(line)
                event = EVEParser.parse(raw)
                if event is not None and event.event_type == "alert":
                    await self._alert_manager(event)
            except json.JSONDecodeError:
                log.warning("eve_invalid_json", line_preview=line[:100])
            except Exception:
                log.exception("eve_processing_error")
