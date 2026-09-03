from abc import ABC, abstractmethod
from typing import List, Dict, Any

class SensorDataIngestor(ABC):
    @abstractmethod
    async def ingest(self, mission_id: str, payload: bytes) -> Dict[str, Any]:
        pass

class InferenceService(ABC):
    @abstractmethod
    async def run_inference(self, image_tile_path: str) -> List[Dict[str, Any]]:
        pass

class TerrainProcessor(ABC):
    @abstractmethod
    async def process_lidar(self, las_path: str) -> Dict[str, Any]:
        pass

class StorageService(ABC):
    @abstractmethod
    async def upload_file(self, key: str, data: bytes) -> str:
        pass
    
    @abstractmethod
    async def get_presigned_url(self, key: str) -> str:
        pass
