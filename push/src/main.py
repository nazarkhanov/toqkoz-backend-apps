from uuid import UUID
from fastapi import FastAPI, Response
from firebase_admin import initialize_app, credentials, messaging
from schemas import UserInfoIn, PushInfoIn



TITLE = 'PUSH'
DESCRIPTION = 'The service is designed to send push notifications'


app = FastAPI(title=TITLE, description=DESCRIPTION, root_path='/android')


user_firebase_token = {}
cred = credentials.Certificate('creds.json')
initialize_app(cred)


def push(token: str, title: str, body: str):
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        token=token,
    )

    messaging.send(message)


@app.post('/token')
async def save_user_device_token(info: UserInfoIn):
    user_firebase_token[UUID(info.id)] = info.token
    return Response(status_code=204)


@app.post('/')
async def send_push_notification(info: PushInfoIn):
    if token := user_firebase_token[UUID(info.user_id)]:
        push(token, info.title, info.content)
        return Response(status_code=204)

    return Response(status_code=404)


push('cwd_ZzbrStaFXi-eHfu0wp:APA91bFvyPXf-KKWIcYu2RoPu16EGVS8ApTHA5f20MlCsqHe9iAuPu1rLTaHFUzCX2eVqJCK_f3je42q37yF55tH-9aCsKKy5wMflUU2il74X2eeWLA7FcF_fMdnnzQu54_mm-Mg_ix3', 'Предупреждение', 'Тестовое оповещение')
