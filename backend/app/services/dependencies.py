from app.config import settings
from app.services.interfaces import SensorDataIngestor, InferenceService, TerrainProcessor, StorageService
from app.services.mock_sensor_ingestor import MockSensorDataIngestor
from app.services.mock_inference_service import MockInferenceService
from app.services.mock_terrain_processor import MockTerrainProcessor
from app.services.jetson_sensor_ingestor import JetsonSensorDataIngestor
from app.services.tensorrt_inference_service import TensorRTInferenceService
from app.services.lidar_terrain_processor import LiDARTerrainProcessor
from app.services.storage_service import MinIOStorageService
from app.services.lorawan_sensor_service import LoRaWANSensorService
from app.services.rtk_gnss_service import RTKGNSSService
from app.services.fpga_acceleration_service import FPGAAccelerationService

def get_sensor_ingestor() -> SensorDataIngestor:
    if settings.use_mock_drone:
        return MockSensorDataIngestor()
    return JetsonSensorDataIngestor()

def get_inference_service() -> InferenceService:
    if settings.use_mock_drone:
        return MockInferenceService()
    return TensorRTInferenceService()

def get_terrain_processor() -> TerrainProcessor:
    if settings.use_mock_drone:
        return MockTerrainProcessor()
    return LiDARTerrainProcessor()

def get_storage_service() -> StorageService:
    return MinIOStorageService()

def get_lorawan_service() -> LoRaWANSensorService:
    return LoRaWANSensorService()

def get_rtk_service() -> RTKGNSSService:
    return RTKGNSSService()

def get_fpga_service() -> FPGAAccelerationService:
    return FPGAAccelerationService()
