from uuid import UUID
from pydantic import BaseModel


class UserInfoIn(BaseModel):
    id: UUID
    token: str


class PushInfoIn(BaseModel):
    user_id: UUID
    title: str
    content: str
