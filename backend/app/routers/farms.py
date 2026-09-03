from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.farm import Farm
from app.models.field import Field
from app.models.user import User
from app.schemas.farm import FarmCreate, FarmResponse
from app.schemas.field import FieldCreate, FieldResponse
from app.auth.dependencies import get_current_user
import shapely.geometry
from geoalchemy2.elements import WKTElement
import json

router = APIRouter()

@router.get("", response_model=list[FarmResponse])
async def list_farms(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Farm).where(Farm.user_id == current_user.id))
    return result.scalars().all()

@router.post("", response_model=FarmResponse)
async def create_farm(farm_req: FarmCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    geom_shape = shapely.geometry.shape(farm_req.boundary["geometry"])
    wkt_geom = WKTElement(geom_shape.wkt, srid=4326)
    
    new_farm = Farm(
        user_id=current_user.id,
        name=farm_req.name,
        location_name=farm_req.location_name,
        boundary=wkt_geom
    )
    db.add(new_farm)
    await db.commit()
    await db.refresh(new_farm)
    return new_farm

@router.get("/{id}", response_model=FarmResponse)
async def get_farm(id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Farm).where(Farm.id == id, Farm.user_id == current_user.id))
    farm = result.scalars().first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    return farm

@router.get("/{id}/fields", response_model=list[FieldResponse])
async def list_fields(id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Field).where(Field.farm_id == id))
    return result.scalars().all()

@router.post("/{id}/fields", response_model=FieldResponse)
async def create_field(id: str, field_req: FieldCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    geom_shape = shapely.geometry.shape(field_req.boundary["geometry"])
    wkt_geom = WKTElement(geom_shape.wkt, srid=4326)
    
    new_field = Field(
        farm_id=id,
        name=field_req.name,
        crop_type=field_req.crop_type,
        boundary=wkt_geom
    )
    db.add(new_field)
    await db.commit()
    await db.refresh(new_field)
    return new_field
