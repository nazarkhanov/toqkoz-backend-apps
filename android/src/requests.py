from uuid import UUID
from pydantic import BaseModel


class CredentialsIn(BaseModel):
    email: str
    password: str


class TokensIn(BaseModel):
    access: str
    refresh: str


class ProfileIn(BaseModel):
    id: UUID
    role: str
    email: str
    first_name: str
    last_name: str
    position: str
