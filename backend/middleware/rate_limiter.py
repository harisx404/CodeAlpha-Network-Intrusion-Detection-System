"""Simple in-memory, per-client fixed-window rate limiter.

Suitable for a single-process deployment. For multi-process or multi-instance
setups this should be backed by a shared store (e.g. Redis).
"""

import time

from backend.core.config import settings
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

# Paths that must never be throttled (liveness/readiness probes).
_SKIP_PATHS = frozenset({"/api/v1/system/health"})


class RateLimiterMiddleware(BaseHTTPMiddleware):
    def __init__(self, app) -> None:
        super().__init__(app)
        # client_ip -> (request_count, window_start_time)
        self._cache: dict[str, tuple[int, float]] = {}
        self._window = float(settings.RATE_LIMIT_WINDOW_SECONDS)
        self._max_requests = settings.RATE_LIMIT_REQUESTS

    def _evict_expired(self, now: float) -> None:
        """Drop entries whose window has elapsed to keep the cache bounded."""
        expired = [
            ip for ip, (_, start) in self._cache.items() if now - start > self._window
        ]
        for ip in expired:
            del self._cache[ip]

    async def dispatch(self, request: Request, call_next) -> Response:
        if request.url.path in _SKIP_PATHS:
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown"
        now = time.time()

        count, start_time = self._cache.get(client_ip, (0, now))
        if now - start_time > self._window:
            # Window expired for this client; also opportunistically evict others.
            self._evict_expired(now)
            count = 0
            start_time = now

        count += 1
        self._cache[client_ip] = (count, start_time)

        if count > self._max_requests:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Too Many Requests",
                    "message": "Rate limit exceeded. Please try again later.",
                    "retry_after": int(self._window - (now - start_time)),
                },
            )

        return await call_next(request)
