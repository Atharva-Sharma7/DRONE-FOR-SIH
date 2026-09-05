import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from geoalchemy2 import Geometry
from app.database import Base

class SoilSensorStation(Base):
    __tablename__ = "soil_sensor_stations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    field_id = Column(UUID(as_uuid=True), ForeignKey("fields.id"), nullable=False)
    station_code = Column(String, nullable=False, unique=True)
    location = Column(Geometry("POINT", srid=4326), nullable=False)
    soil_type = Column(String, default="Black Cotton Soil (Vertisol)")
    created_at = Column(DateTime, default=datetime.utcnow)

    field = relationship("Field", back_populates="soil_sensors")
    readings = relationship("SoilMetricReading", back_populates="station", cascade="all, delete-orphan")


class SoilMetricReading(Base):
    __tablename__ = "soil_metric_readings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    station_id = Column(UUID(as_uuid=True), ForeignKey("soil_sensor_stations.id"), nullable=False)
    moisture_percentage = Column(Float, nullable=False)
    temperature_celsius = Column(Float, nullable=False)
    nitrogen_mg_kg = Column(Float, nullable=False)
    phosphorus_mg_kg = Column(Float, nullable=False)
    potassium_mg_kg = Column(Float, nullable=False)
    ec_ds_m = Column(Float, nullable=False)  # Electrical Conductivity
    recorded_at = Column(DateTime, default=datetime.utcnow)

    station = relationship("SoilSensorStation", back_populates="readings")
