from uuid import uuid4
from datetime import datetime
from fastapi import FastAPI, Request, Response, Depends
from fastapi.security import HTTPBearer
from httpx import AsyncClient
from requests import CredentialsIn, TokensIn, ProfileIn
from responses import NotificationsOut, TrackerOut, TokenOut, ProfileOut



TITLE = 'ANDROID'
DESCRIPTION = 'The service is designed to communicate with mobile client'


app = FastAPI(title=TITLE, description=DESCRIPTION, root_path='/android')


@app.get('/notifications')
async def read_notifications():
    return [
        NotificationsOut(
            id=uuid4(),
            title='#559723 РП3: Обесточен',
            description='Подстанция: РП3\nСостояние: Рабочее\nАдрес: г.Алматы, ул. Момышулы 24',
            created_at=datetime.now(),
            latest_at=datetime.now(),
            status='Неисправность',
            count=12,
        ),
        NotificationsOut(
            id=uuid4(),
            title='#559723 РП3: Обесточен',
            description='Подстанция: РП3\nСостояние: Рабочее\nАдрес: г.Алматы, ул. Момышулы 24',
            created_at=datetime.now(),
            latest_at=datetime.now(),
            status='Неисправность',
            count=12,
        ),
        NotificationsOut(
            id=uuid4(),
            title='#559723 РП3: Обесточен',
            description='Подстанция: РП3\nСостояние: Рабочее\nАдрес: г.Алматы, ул. Момышулы 24',
            created_at=datetime.now(),
            latest_at=datetime.now(),
            status='Неисправность',
            count=12,
        ),
    ]


@app.get('/trackers')
async def read_trackers():
    return [
        TrackerOut(
            id=uuid4(),
            title='#689254 РП3: ВВОД 1',
            description='Трекер: ToqkozV1-Arduino\nПодстанция: РП3\nСостояние: Рабочее\nАдрес: г.Алматы, ул. Момышулы 24',
            created_at=datetime.now(),
            latest_at=datetime.now(),
            status='Активен',
        ),
        TrackerOut(
            id=uuid4(),
            title='#345975 РП3: ВВОД 2',
            description='Трекер: ToqkozV1-Arduino\nПодстанция: РП3\nСостояние: Рабочее\nАдрес: г.Алматы, ул. Момышулы 24',
            created_at=datetime.now(),
            latest_at=datetime.now(),
            status='Активен',
        ),
        TrackerOut(
            id=uuid4(),
            title='#235495 РП10: ВВОД 1',
            description='Трекер: ToqkozV1-Arduino\nПодстанция: РП3\nСостояние: Рабочее\nАдрес: г.Алматы, ул. Момышулы 24',
            created_at=datetime.now(),
            latest_at=datetime.now(),
            status='Активен',
        ),
    ]


@app.post('/login')
async def login_users(credentials: CredentialsIn):
    async with AsyncClient() as client:
        response = await client.post('http://web-api:6000/api/auth/jwt/create/', json={
            'email': credentials.email,
            'password': credentials.password,
        })

        if response.status_code != 200:
            return Response(status_code=response.status_code)

        tokens = TokensIn(**response.json())
        return TokenOut(token=tokens.access)


@app.get('/profile')
async def view_profile(request: Request, token: str = Depends(HTTPBearer())):
    print(token)
    async with AsyncClient() as client:
        response = await client.get('http://web-api:6000/api/auth/users/me/', headers=request.headers)

        if response.status_code != 200:
            return Response(status_code=response.status_code)

        info = ProfileIn(**response.json())
        return ProfileOut(**info.model_dump())
