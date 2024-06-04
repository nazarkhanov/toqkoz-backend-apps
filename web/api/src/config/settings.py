from os import environ
from pathlib import Path
from datetime import timedelta
from django.core.management.commands.runserver import Command

Command.default_addr = environ.get('API_HOST', 'web-api')
Command.default_port = environ.get('API_PORT', 6000)


BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = environ.get('API_SECRET_KEY', 'django-insecure-n+t^(pva=s9dr%!3q97xij^4ynm5-+)5@g)0!enexc++y37681')

DEBUG = True

ALLOWED_HOSTS = environ.get('API_ALLOWED_HOSTS', '*').split(',')

if API_CORS_ALLOWED_ORIGINS := environ.get('API_CORS_ALLOWED_ORIGINS'):
    CORS_ALLOWED_ORIGINS = API_CORS_ALLOWED_ORIGINS.split(',')
else:
    CORS_ALLOW_ALL_ORIGINS = True


INSTALLED_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'rest_framework',
    'djoser',
    'corsheaders',
    'system',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': environ.get('POSTGRES_DB', 'local'),
        'USER': environ.get('POSTGRES_USER', 'local'),
        'PASSWORD': environ.get('POSTGRES_PASSWORD', 'local'),
        'HOST': environ.get('POSTGRES_HOST', 'db'),
        'PORT': environ.get('POSTGRES_PORT', '5432'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'ru'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'system.User'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('Bearer', ),
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1, seconds=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7, seconds=5),
}

DJOSER = {
    'LOGIN_FIELD': 'email',
}
