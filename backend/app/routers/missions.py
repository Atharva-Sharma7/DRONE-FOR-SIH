from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional, List
from app.database import get_db
from app.models.mission import Mission, MissionStatus
from app.schemas.mission import MissionCreate, MissionResponse, MissionSyncRequest
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.config import settings
import boto3

router = APIRouter()

@router.get("", response_model=List[MissionResponse])
async def list_missions(
    farm_id: Optional[str] = None,
    status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Mission)
    if farm_id:
        query = query.where(Mission.farm_id == farm_id)
    if status:
        query = query.where(Mission.status == status)
    
    result = await db.execute(query)
    return result.scalars().all()

@router.post("", response_model=dict)
async def create_mission(req: MissionCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    new_mission = Mission(
        farm_id=req.farm_id,
        drone_id=req.drone_id,
        field_id=req.field_id,
        status=MissionStatus.scheduled,
        coverage_area_ha=0.0,
        sensors_used=req.sensors_used
    )
    db.add(new_mission)
    await db.commit()
    await db.refresh(new_mission)

    s3_client = boto3.client(
        "s3",
        endpoint_url=settings.minio_endpoint,
        aws_access_key_id=settings.minio_root_user,
        aws_secret_access_key=settings.minio_root_password
    )
    presigned_urls = {}
    for sensor in req.sensors_used:
        key = f"missions/{new_mission.id}/{sensor}.dat"
        url = s3_client.generate_presigned_url(
            "put_object",
            Params={"Bucket": settings.minio_bucket_name, "Key": key},
            ExpiresIn=3600
        )
        presigned_urls[sensor] = url

    return {"mission_id": new_mission.id, "upload_urls": presigned_urls}

@router.get("/{id}", response_model=MissionResponse)
async def get_mission(id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Mission).where(Mission.id == id))
    mission = result.scalars().first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return mission

@router.put("/{id}/sync", response_model=dict)
async def sync_mission(id: str, req: MissionSyncRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Mission).where(Mission.id == id))
    mission = result.scalars().first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    
    if settings.use_mock_drone:
        mission.status = MissionStatus.syncing
        if req.chunk_index == req.total_chunks - 1:
            mission.status = MissionStatus.processed
        await db.commit()
        return {"status": "syncing in progress"}
    
    return {"status": "syncing"}
