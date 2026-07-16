from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.core.config import settings
from backend.api.v1.api import api_router
from backend.core.exceptions import NotFoundError, ValidationException, UnauthorizedException

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="CodeAlpha Network Intrusion Detection System API",
    openapi_url="/api/v1/openapi.json"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
@app.exception_handler(NotFoundError)
async def not_found_exception_handler(request: Request, exc: NotFoundError):
    return JSONResponse(status_code=exc.status_code, content={"error": "Not Found", "detail": exc.detail})

@app.exception_handler(ValidationException)
async def validation_exception_handler(request: Request, exc: ValidationException):
    return JSONResponse(status_code=exc.status_code, content={"error": "Validation Error", "detail": exc.detail})

@app.exception_handler(UnauthorizedException)
async def unauthorized_exception_handler(request: Request, exc: UnauthorizedException):
    return JSONResponse(
        status_code=exc.status_code, 
        content={"error": "Unauthorized", "detail": exc.detail},
        headers=exc.headers
    )

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/health", tags=["system"])
async def health_check():
    """System health check endpoint."""
    return {"status": "ok", "version": settings.VERSION}
