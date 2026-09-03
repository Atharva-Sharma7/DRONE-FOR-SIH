from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.field import Field
from app.models.terrain_metric import TerrainMetric
from app.models.prediction import Prediction
from app.models.mission import Mission
from app.schemas.field import FieldResponse, FieldLayersResponse
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.geometry_utils import wkb_to_geojson

router = APIRouter()

@router.get("/{id}", response_model=FieldResponse)
async def get_field(id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Field).where(Field.id == id))
    field = result.scalars().first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    return field

@router.get("/{id}/layers", response_model=FieldLayersResponse)
async def get_field_layers(id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Field).where(Field.id == id))
    field = result.scalars().first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")

    features = []
    # Add field boundary
    features.append({
        "type": "Feature",
        "geometry": wkb_to_geojson(field.boundary),
        "properties": {"layer": "boundary", "name": field.name}
    })

    # Get latest mission
    mission_res = await db.execute(
        select(Mission).where(Mission.field_id == id).order_by(Mission.start_time.desc()).limit(1)
    )
    mission = mission_res.scalars().first()

    if mission:
        # Get predictions for this mission
        pred_res = await db.execute(select(Prediction).where(Prediction.mission_id == mission.id))
        for pred in pred_res.scalars().all():
            features.append({
                "type": "Feature",
                "geometry": wkb_to_geojson(pred.geom),
                "properties": {
                    "layer": "disease",
                    "id": str(pred.id),
                    "disease_class": pred.disease_class,
                    "severity": pred.severity.value,
                    "confidence": pred.confidence,
                    "recommended_action": pred.recommended_action,
                }
            })

    # Get terrain metrics for this field
    terrain_res = await db.execute(select(TerrainMetric).where(TerrainMetric.field_id == id))
    for t in terrain_res.scalars().all():
        features.append({
            "type": "Feature",
            "geometry": wkb_to_geojson(t.geom),
            "properties": {
                "layer": "terrain",
                "metric_type": t.metric_type.value,
                "value": t.value,
                "description": t.description,
            }
        })

    return {"type": "FeatureCollection", "features": features}

