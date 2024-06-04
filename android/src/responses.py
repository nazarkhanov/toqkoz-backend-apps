from datetime import datetime
from uuid import UUID
from pydantic import BaseModel


class NotificationsOut(BaseModel):
    id: UUID
    title: str
    description: str
    created_at: datetime
    latest_at: datetime
    status: str
    count: int


class TrackerOut(BaseModel):
    id: UUID
    title: str
    description: str
    created_at: datetime
    latest_at: datetime
    status: str


class TokenOut(BaseModel):
    token: str


class ProfileOut(BaseModel):
    id: UUID
    email: str
    first_name: str
    last_name: str
    position: str
