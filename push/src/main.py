import json
from uuid import UUID
from fastapi import FastAPI, Response
from firebase_admin import initialize_app, credentials, messaging
from schemas import UserInfoIn, PushInfoIn



TITLE = 'PUSH'
DESCRIPTION = 'The service is designed to send push notifications'


app = FastAPI(title=TITLE, description=DESCRIPTION)


class LocaleStorage:
    def __init__(self) -> None:
        self.values = {}

        with open('src/storage.json', 'r+') as f:
            try:
                self.values = json.load(f)
            except:
                pass
    
    def read(self, key):
        return self.values.get(key)

    def write(self, key, value):
        self.values[key] = value
        with open('src/storage.json', 'w+') as f:
            f.write(json.dumps(self.values))


storage = LocaleStorage()
cred = credentials.Certificate('src/creds.json')
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
    storage.write(str(info.id), info.token)
    return Response(status_code=204)


@app.post('/')
async def send_push_notification_to_device(info: PushInfoIn):
    if token := storage.read(str(info.user_id)):
        push(token, info.title, info.content)
        return Response(status_code=204)

    return Response(status_code=404)
