import uuid
import enum
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, BigInteger
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class DatasetType(enum.Enum):
    rgb = "rgb"
    lidar = "lidar"
    multispectral = "multispectral"
    ndvi = "ndvi"

class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mission_id = Column(UUID(as_uuid=True), ForeignKey("missions.id"))
    type = Column(Enum(DatasetType), nullable=False)
    s3_url = Column(String, nullable=False)
    file_size_bytes = Column(BigInteger, nullable=False)
    checksum_sha256 = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    mission = relationship("Mission", back_populates="datasets")
