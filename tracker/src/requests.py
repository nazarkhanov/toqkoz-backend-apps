from typing import Literal
from decimal import Decimal
from datetime import datetime
from pydantic import BaseModel


class SensorsOutputsIn(BaseModel):
    voltage: Decimal


class SearchFiltersIn(BaseModel):
    start_from: datetime
    end_to: datetime
    sensor_name: Literal['voltage']
    sort_type: Literal['asc', 'desc'] = 'asc'
