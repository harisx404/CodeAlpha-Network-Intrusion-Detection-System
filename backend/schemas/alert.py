"""Pydantic schemas for alert data — mirror backend/models/alert.py and frontend/types/alert.ts."""

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, model_validator


class AlertBase(BaseModel):
    timestamp: datetime
    severity: str
    status: str = "NEW"
    category: str | None = None
    signature_id: int | None = None
    signature: str
    src_ip: str
    src_port: int | None = None
    dst_ip: str
    dst_port: int | None = None
    protocol: str | None = None
    flow_id: str | None = None


class AlertCreate(AlertBase):
    geo_country: str | None = None
    geo_city: str | None = None
    geo_lat: float | None = None
    geo_lon: float | None = None
    geo_org: str | None = None
    raw_eve: dict[str, Any] = Field(default_factory=dict)


class AlertFilter(BaseModel):
    severity: str | None = None
    status: str | None = None
    src_ip: str | None = None
    start_date: str | None = None
    end_date: str | None = None


class AlertUpdate(BaseModel):
    status: str | None = None
    notes: str | None = None
    acknowledged_by: int | None = None
    acknowledged_at: datetime | None = None


class GeoData(BaseModel):
    country: str | None = None
    city: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    org: str | None = None


class AlertResponse(AlertBase):
    id: int
    geo: GeoData | None = None
    raw_eve: dict[str, Any] = Field(default_factory=dict)
    notes: str = ""
    acknowledged_by: int | None = None
    acknowledged_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def _assemble_geo(cls, data: Any) -> Any:
        """Collapse the flat geo_* ORM columns into a nested geo object."""
        if isinstance(data, dict):
            return data
        country = getattr(data, "geo_country", None)
        city = getattr(data, "geo_city", None)
        lat = getattr(data, "geo_lat", None)
        lon = getattr(data, "geo_lon", None)
        org = getattr(data, "geo_org", None)
        geo = None
        if any(v is not None for v in (country, city, lat, lon, org)):
            geo = GeoData(
                country=country, city=city, latitude=lat, longitude=lon, org=org
            )
        # Build a plain dict so the nested geo object is picked up alongside ORM attrs.
        return {
            "id": data.id,
            "timestamp": data.timestamp,
            "severity": data.severity,
            "status": data.status,
            "category": data.category,
            "signature_id": data.signature_id,
            "signature": data.signature,
            "src_ip": data.src_ip,
            "src_port": data.src_port,
            "dst_ip": data.dst_ip,
            "dst_port": data.dst_port,
            "protocol": data.protocol,
            "flow_id": data.flow_id,
            "geo": geo,
            "raw_eve": getattr(data, "raw_eve", {}) or {},
            "notes": data.notes,
            "acknowledged_by": data.acknowledged_by,
            "acknowledged_at": data.acknowledged_at,
            "created_at": data.created_at,
            "updated_at": data.updated_at,
        }
