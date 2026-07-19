"""Pydantic schemas for alert data — mirror backend/models/alert.py and frontend/types/alert.ts."""
from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict, Field, model_validator


class AlertBase(BaseModel):
    timestamp: datetime
    severity: str
    status: str = "NEW"
    category: Optional[str] = None
    signature_id: Optional[int] = None
    signature: str
    src_ip: str
    src_port: Optional[int] = None
    dst_ip: str
    dst_port: Optional[int] = None
    protocol: Optional[str] = None
    flow_id: Optional[str] = None


class AlertCreate(AlertBase):
    geo_country: Optional[str] = None
    geo_city: Optional[str] = None
    geo_lat: Optional[float] = None
    geo_lon: Optional[float] = None
    geo_org: Optional[str] = None
    raw_eve: Dict[str, Any] = Field(default_factory=dict)


class AlertFilter(BaseModel):
    severity: Optional[str] = None
    status: Optional[str] = None
    src_ip: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class AlertUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    acknowledged_by: Optional[int] = None
    acknowledged_at: Optional[datetime] = None


class GeoData(BaseModel):
    country: Optional[str] = None
    city: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    org: Optional[str] = None


class AlertResponse(AlertBase):
    id: int
    geo: Optional[GeoData] = None
    notes: str = ""
    acknowledged_by: Optional[int] = None
    acknowledged_at: Optional[datetime] = None
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
            geo = GeoData(country=country, city=city, latitude=lat, longitude=lon, org=org)
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
            "notes": data.notes,
            "acknowledged_by": data.acknowledged_by,
            "acknowledged_at": data.acknowledged_at,
            "created_at": data.created_at,
            "updated_at": data.updated_at,
        }
