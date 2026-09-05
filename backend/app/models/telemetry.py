import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from geoalchemy2 import Geometry
from app.database import Base

class DroneTelemetryLog(Base):
    __tablename__ = "drone_telemetry_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    drone_id = Column(UUID(as_uuid=True), ForeignKey("drones.id"), nullable=False)
    mission_id = Column(UUID(as_uuid=True), ForeignKey("missions.id"), nullable=True)
    location = Column(Geometry("POINT", srid=4326), nullable=False)
    altitude_m = Column(Float, nullable=False)
    velocity_m_s = Column(Float, default=0.0)
    heading_deg = Column(Float, default=0.0)
    pitch_deg = Column(Float, default=0.0)
    roll_deg = Column(Float, default=0.0)
    battery_percentage = Column(Float, nullable=False)
    rtk_fix_status = Column(String, default="FIXED_4D")  # FIXED_4D, FLOAT, NONE
    signal_rssi_dbm = Column(Float, default=-65.0)
    jetson_temp_celsius = Column(Float, default=45.2)
    telemetry_metadata = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    drone = relationship("Drone")
    mission = relationship("Mission")
