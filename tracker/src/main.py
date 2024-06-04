from uuid import UUID, uuid4
from datetime import datetime
from contextlib import asynccontextmanager

from os import environ
from httpx import AsyncClient
from aiochclient import ChClient
from fastapi import FastAPI, Request, Depends, status
from requests import SensorsOutputsIn, SearchFiltersIn
from responses import SensorOutputOut


TITLE = 'TRACKER'
DESCRIPTION = 'The service is designed to communicate with tracker devices'


@asynccontextmanager
async def life_span(
    app: FastAPI,
):
    http = AsyncClient()
    click = ChClient(
        http,
        url=environ.get('CLICKHOUSE_URL'),
        user=environ.get('CLICKHOUSE_USER'),
        password=environ.get('CLICKHOUSE_PASSWORD'),
        database=environ.get('CLICKCHOUSE_DATABASE')
    )
    await click.execute(
        'CREATE TABLE IF NOT EXISTS out ('
        '  created_at DateTime,'
        '  request_id UUID,'
        '  tracker_id UUID,'
        '  sensor_name String,'
        '  sensor_value Decimal64(9)'
        ') ENGINE = MergeTree()'
        'ORDER BY (created_at, tracker_id, sensor_name)'
    )
    yield {
        'click': click
    }
    await http.aclose()


app = FastAPI(
    title=TITLE,
    description=DESCRIPTION,
    lifespan=life_span,
    root_path='/tracker'
)


@app.post('/{tracker_id}', status_code=status.HTTP_204_NO_CONTENT)
async def write(
    request: Request,
    tracker_id: UUID,
    outputs: SensorsOutputsIn,
):
    created_at = datetime.utcnow().timestamp()
    request_id = uuid4()

    batch = [
        (created_at, request_id, tracker_id, sensor_name, sensor_output)        
        for sensor_name, sensor_output in outputs.model_dump().items()
    ]

    await request.state.click.execute(
        'INSERT INTO out VALUES',
        *batch
    )


@app.get('/{tracker_id}')
async def read(
    request: Request,
    tracker_id: UUID,
    filters: SearchFiltersIn = Depends(),
):
    outputs = await request.state.click.fetch(
        'SELECT created_at, request_id, sensor_value FROM out WHERE'
        f'  tracker_id = \'{tracker_id}\' AND'
        f'  created_at >= {filters.start_from.timestamp()} AND'
        f'  created_at <= {filters.end_to.timestamp()} AND'
        f'  sensor_name = \'{filters.sensor_name}\''
        f'ORDER BY created_at {filters.sort_type.upper()}'
    )

    return [
        SensorOutputOut(
            created_at=o['created_at'],
            request_id=o['request_id'],
            value=o['sensor_value'],
        )
        for o in outputs
    ]
