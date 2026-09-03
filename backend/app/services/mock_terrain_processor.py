import asyncio
import random
from app.services.interfaces import TerrainProcessor
from typing import Dict, Any

class MockTerrainProcessor(TerrainProcessor):
    async def process_lidar(self, las_path: str) -> Dict[str, Any]:
        await asyncio.sleep(random.uniform(1.0, 2.0))
        return {
            "status": "processed",
            "points_count": random.randint(1000000, 5000000),
            "avg_slope": round(random.uniform(1.0, 15.0), 2),
            "water_pooling_risk": random.choice(["low", "medium", "high"])
        }
