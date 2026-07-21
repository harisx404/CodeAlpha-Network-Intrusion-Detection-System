import os
import sys
import traceback

os.environ["VERCEL"] = "1"

try:
    from backend.main import app
except Exception as e:
    # If the app crashes on import, define a dummy ASGI app that returns the error.
    error_trace = traceback.format_exc()
    async def app(scope, receive, send):
        assert scope["type"] == "http"
        await send({
            "type": "http.response.start",
            "status": 200,
            "headers": [(b"content-type", b"text/plain")],
        })
        await send({
            "type": "http.response.body",
            "body": error_trace.encode("utf-8"),
        })
