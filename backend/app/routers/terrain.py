from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.terrain_metric import TerrainMetric
from app.schemas.terrain import TerrainResponse
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/{field_id}", response_model=TerrainResponse)
async def get_terrain(field_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TerrainMetric).where(TerrainMetric.field_id == field_id))
    metrics = result.scalars().all()
    
    return {
        "metrics": metrics,
        "potree_url": "http://mock-potree.droneplatform.in/viewer.html"
    }
