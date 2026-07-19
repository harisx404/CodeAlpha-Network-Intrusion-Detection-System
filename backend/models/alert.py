"""Alert ORM model — primary security event record."""
from __future__ import annotations
from typing import TYPE_CHECKING, Optional
from sqlalchemy import (
    Boolean, DateTime, Float, ForeignKey, Index,
    Integer, JSON, String, Text, func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.core.database import Base
from backend.models.base import TimestampMixin

if TYPE_CHECKING:
    from backend.models.user import User


class Alert(Base, TimestampMixin):
    """Network intrusion alert detected by Suricata."""

    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    timestamp: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    severity: Mapped[str] = mapped_column(String(10), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="NEW", index=True)
    category: Mapped[Optional[str]] = mapped_column(String(50), nullable=True, index=True)
    signature_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    signature: Mapped[str] = mapped_column(String(512), nullable=False)
    src_ip: Mapped[str] = mapped_column(String(45), nullable=False, index=True)
    src_port: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    dst_ip: Mapped[str] = mapped_column(String(45), nullable=False)
    dst_port: Mapped[Optional[int]] = mapped_column(Integer, nullable=True, index=True)
    protocol: Mapped[Optional[str]] = mapped_column(String(10), nullable=True, index=True)
    flow_id: Mapped[Optional[str]] = mapped_column(String(32), nullable=True, index=True)
    geo_country: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    geo_city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    geo_lat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    geo_lon: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    geo_org: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    raw_eve: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    notes: Mapped[str] = mapped_column(Text, default="", nullable=False)
    acknowledged_by: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    acknowledged_at: Mapped[Optional[DateTime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Relationships
    acknowledged_by_user: Mapped[Optional["User"]] = relationship(
        "User", foreign_keys=[acknowledged_by], lazy="selectin"
    )

    # Composite index for dashboard KPI queries
    __table_args__ = (
        Index("idx_alerts_timestamp_severity", "timestamp", "severity"),
        Index("idx_alerts_status_partial", "status"),
    )

    def __repr__(self) -> str:
        return f"<Alert id={self.id} severity={self.severity} src={self.src_ip}>"
