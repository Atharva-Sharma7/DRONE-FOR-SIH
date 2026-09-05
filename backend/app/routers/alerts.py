from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.database import get_db
from app.models.alert import Alert
from app.schemas.alert import AlertListResponse, AlertResponse
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("", response_model=AlertListResponse)
async def list_alerts(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Alert).where(Alert.user_id == current_user.id).order_by(Alert.created_at.desc()))
    alerts = result.scalars().all()
    unread_count = sum(1 for a in alerts if not a.is_read)
    return {"alerts": alerts, "unread_count": unread_count}

@router.get("/summary", response_model=dict)
async def alert_summary(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Alert.severity, func.count()).where(Alert.user_id == current_user.id).group_by(Alert.severity)
    )
    summary = {row[0].value: row[1] for row in result.all()}
    return summary

@router.patch("/{id}/read", response_model=AlertResponse)
async def mark_read(id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Alert).where(Alert.id == id, Alert.user_id == current_user.id))
    alert = result.scalars().first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.is_read = True
    await db.commit()
    await db.refresh(alert)
    return alert
