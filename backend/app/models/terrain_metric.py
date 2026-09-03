import uuid
import enum
from sqlalchemy import Column, Float, DateTime, ForeignKey, Enum, Text, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from geoalchemy2 import Geometry
from app.database import Base

class MetricType(enum.Enum):
    slope = "slope"
    water_risk = "water_risk"
    drainage = "drainage"

class TerrainMetric(Base):
    __tablename__ = "terrain_metrics"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    field_id = Column(UUID(as_uuid=True), ForeignKey("fields.id"))
    metric_type = Column(Enum(MetricType), nullable=False)
    value = Column(Float, nullable=False)
    description = Column(Text, nullable=False)
    geom = Column(Geometry('POLYGON', srid=4326))
    created_at = Column(DateTime, default=datetime.utcnow)

    field = relationship("Field", back_populates="terrain_metrics")

Index('ix_terrain_metrics_geom_gist', TerrainMetric.geom, postgresql_using='gist')
