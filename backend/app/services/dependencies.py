from app.config import settings
from app.services.interfaces import SensorDataIngestor, InferenceService, TerrainProcessor, StorageService
from app.services.mock_sensor_ingestor import MockSensorDataIngestor
from app.services.mock_inference_service import MockInferenceService
from app.services.mock_terrain_processor import MockTerrainProcessor
from app.services.storage_service import MinIOStorageService

def get_sensor_ingestor() -> SensorDataIngestor:
    if settings.use_mock_drone:
        return MockSensorDataIngestor()
    # In a real scenario, return real implementation
    return MockSensorDataIngestor()

def get_inference_service() -> InferenceService:
    if settings.use_mock_drone:
        return MockInferenceService()
    return MockInferenceService()

def get_terrain_processor() -> TerrainProcessor:
    if settings.use_mock_drone:
        return MockTerrainProcessor()
    return MockTerrainProcessor()

def get_storage_service() -> StorageService:
    return MinIOStorageService()
