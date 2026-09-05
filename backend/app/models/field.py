import uuid
import enum
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from geoalchemy2 import Geometry
from app.database import Base

class CropType(enum.Enum):
    cotton = "cotton"
    soybean = "soybean"
    mixed = "mixed"

class Field(Base):
    __tablename__ = "fields"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id"))
    name = Column(String, nullable=False)
    crop_type = Column(Enum(CropType), nullable=False)
    boundary = Column(Geometry('POLYGON', srid=4326))
    created_at = Column(DateTime, default=datetime.utcnow)

    farm = relationship("Farm", back_populates="fields")
    terrain_metrics = relationship("TerrainMetric", back_populates="field")
    missions = relationship("Mission", back_populates="field")
    soil_sensors = relationship("SoilSensorStation", back_populates="field")

Index('ix_fields_boundary_gist', Field.boundary, postgresql_using='gist')
