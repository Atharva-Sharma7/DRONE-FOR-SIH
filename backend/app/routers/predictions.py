from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional
from app.database import get_db
from app.models.prediction import Prediction
from app.schemas.prediction import PaginatedPredictionsResponse
from app.auth.dependencies import get_current_user
from app.models.user import User
from sqlalchemy import func
from geoalchemy2.functions import ST_Intersects, ST_MakeEnvelope

router = APIRouter()

@router.get("", response_model=PaginatedPredictionsResponse)
async def list_predictions(
    mission_id: Optional[str] = None,
    disease_class: Optional[str] = None,
    severity: Optional[str] = None,
    bbox: Optional[str] = Query(None, description="minx,miny,maxx,maxy"),
    page: int = 1,
    page_size: int = 10,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Prediction)
    count_query = select(func.count()).select_from(Prediction)

    if mission_id:
        query = query.where(Prediction.mission_id == mission_id)
        count_query = count_query.where(Prediction.mission_id == mission_id)
    if disease_class:
        query = query.where(Prediction.disease_class == disease_class)
        count_query = count_query.where(Prediction.disease_class == disease_class)
    if severity:
        query = query.where(Prediction.severity == severity)
        count_query = count_query.where(Prediction.severity == severity)
    if bbox:
        minx, miny, maxx, maxy = map(float, bbox.split(","))
        geom_filter = ST_Intersects(Prediction.geom, ST_MakeEnvelope(minx, miny, maxx, maxy, 4326))
        query = query.where(geom_filter)
        count_query = count_query.where(geom_filter)

    total = await db.scalar(count_query)
    
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    items = result.scalars().all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size
    }
