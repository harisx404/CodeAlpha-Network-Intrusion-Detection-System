from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional

class Settings(BaseSettings):
    """System-wide configuration settings loaded from environment variables."""
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore")

    APP_ENV: str = Field("development", description="Environment: development, staging, or production")
    PROJECT_NAME: str = "CodeAlpha NIDS API"
    VERSION: str = "1.0.0"
    
    # Database
    DATABASE_URL: str = Field(..., description="PostgreSQL or SQLite async connection string")
    
    # Security
    JWT_SECRET_KEY: str = Field(..., description="Secret key for JWT generation")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # Suricata integration
    EVE_LOG_PATH: str = Field("/var/log/suricata/eve.json", description="Path to Suricata EVE log file")
    
    # Threat Intelligence
    ABUSEIPDB_API_KEY: Optional[str] = None
    
    # GeoIP
    GEOIP_DB_PATH: Optional[str] = Field(None, description="Path to MaxMind GeoLite2 City database")

settings = Settings()
