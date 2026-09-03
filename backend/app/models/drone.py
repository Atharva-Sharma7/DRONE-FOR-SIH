import uuid
import enum
from sqlalchemy import Column, String, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class DroneStatus(enum.Enum):
    active = "active"
    inactive = "inactive"
    maintenance = "maintenance"

class Drone(Base):
    __tablename__ = "drones"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mac_address = Column(String, unique=True, index=True, nullable=False)
    model = Column(String, nullable=False)
    firmware_version = Column(String, nullable=True)
    status = Column(Enum(DroneStatus), nullable=False, default=DroneStatus.inactive)

    missions = relationship("Mission", back_populates="drone")
