import uuid
import enum
from sqlalchemy import Column, Float, DateTime, JSON, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class MissionStatus(enum.Enum):
    scheduled = "scheduled"
    syncing = "syncing"
    processed = "processed"
    completed = "completed"

class Mission(Base):
    __tablename__ = "missions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    farm_id = Column(UUID(as_uuid=True), ForeignKey("farms.id"))
    drone_id = Column(UUID(as_uuid=True), ForeignKey("drones.id"))
    field_id = Column(UUID(as_uuid=True), ForeignKey("fields.id"), nullable=True)
    start_time = Column(DateTime, nullable=False, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    status = Column(Enum(MissionStatus), nullable=False)
    coverage_area_ha = Column(Float, nullable=False)
    sensors_used = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    farm = relationship("Farm", back_populates="missions")
    drone = relationship("Drone", back_populates="missions")
    field = relationship("Field", back_populates="missions")
    datasets = relationship("Dataset", back_populates="mission")
    predictions = relationship("Prediction", back_populates="mission")
    alerts = relationship("Alert", back_populates="mission")
