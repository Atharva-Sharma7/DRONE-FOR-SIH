import uuid
import enum
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Enum, Text, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from geoalchemy2 import Geometry
from app.database import Base

class SeverityEnum(enum.Enum):
    mild = "mild"
    moderate = "moderate"
    severe = "severe"

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mission_id = Column(UUID(as_uuid=True), ForeignKey("missions.id"))
    disease_class = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    severity = Column(Enum(SeverityEnum), nullable=False)
    affected_area_ha = Column(Float, nullable=False)
    geom = Column(Geometry('POLYGON', srid=4326))
    recommended_action = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    mission = relationship("Mission", back_populates="predictions")

Index('ix_predictions_geom_gist', Prediction.geom, postgresql_using='gist')
