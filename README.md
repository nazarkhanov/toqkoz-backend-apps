# TOQKOZ SYSTEM

### Запуск

```sh
docker compose up -d   # запускаем все контейнеры

docker compose stop   # остановливаем все контейнеры
```

### Web API (Backend) & Web UI (Frontend)

##### Общие команды для web-api и web-ui

```sh
docker compose logs web-api -f   # следим за логами контейнера

docker compose exec web-api /bin/bash   # запускаем терминал контейнера
```

##### Специфические команды для api (внутри контейнера)

```sh
manage createsuperuser   # создаем суперпользователя

manage makemigrations   # создаем миграции

manage migrate   # применяем миграции
```

```sh
text index   # индексируем строки с переводами

text generate   # генерирует файлы с переводами
```
