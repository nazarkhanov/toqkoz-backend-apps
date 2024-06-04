from uuid import UUID
from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel


class SensorOutputOut(BaseModel):
    created_at: datetime
    request_id: UUID
    value: Decimal
