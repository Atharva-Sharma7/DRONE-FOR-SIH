from pydantic import BaseModel
from typing import List
import uuid
from datetime import datetime
from app.models.alert import AlertSeverity

class AlertResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    mission_id: uuid.UUID | None
    severity: AlertSeverity
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class AlertListResponse(BaseModel):
    alerts: List[AlertResponse]
    unread_count: int
