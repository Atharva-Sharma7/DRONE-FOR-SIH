import asyncio
import random
from app.services.interfaces import SensorDataIngestor
from typing import Dict, Any

class MockSensorDataIngestor(SensorDataIngestor):
    async def ingest(self, mission_id: str, payload: bytes) -> Dict[str, Any]:
        await asyncio.sleep(random.uniform(0.1, 0.5))
        return {
            "status": "success",
            "bytes_processed": len(payload),
            "mission_id": mission_id,
            "processing_time_ms": random.randint(100, 500)
        }
