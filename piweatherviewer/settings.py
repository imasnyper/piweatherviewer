"""
Django settings for piweatherviewer project.

Generated by 'django-admin startproject' using Django 2.0.1.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.0/ref/settings/
"""

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '!7$=ny0zxjp8a)gkb!b4-+&8mdn7m7kf#_cz1zk%xejmo8k6i9'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

if DEBUG:
    ALLOWED_HOSTS = ["140.82.60.64", "wasaweather.com", "www.wasaweather.com", "*", "localhost", "127.0.0.1", ""]
else:
    ALLOWED_HOSTS = ["140.82.60.64", "wasaweather.com", "www.wasaweather.com"]



INTERNAL_IPS = (
    '127.0.0.1',
)
# Application definition

INSTALLED_APPS = [
    'viewer',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'storages',
    'rest_framework',
    'rest_framework.authtoken',
    'autofixture',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'piweatherviewer.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['./templates',],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.template.context_processors.media',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'piweatherviewer.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'wasaweather',
        'USER': 'daniel',
        'PASSWORD': os.environ.get("WASA_WEATHER_DB_PASS", ""),
        'HOST': '',
        'PORT': '',
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.0/ref/settings/#auth-password-validators

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

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    )
}

LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'

# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/Toronto'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/

if not DEBUG:
    AWS_ACCESS_KEY_ID = os.environ.get("AWS_S3_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY = os.environ.get("AWS_S3_SECRET_ACCESS_KEY", "")

    # AWS Acess Key ID and secret access key are also stored in ~/.aws/credentials
    # for photo uploads to work. see stack overflow post here: https://goo.gl/9k2ssf

    AWS_STORAGE_BUCKET_NAME = 'piweatherstation'
    AWS_S3_CUSTOM_DOMAIN = '%s.s3.amazonaws.com' % AWS_STORAGE_BUCKET_NAME

    AWS_S3_OBJECT_PARAMETERS = {
        'CacheControl': 'max-age=86400'
    }

    AWS_LOCATION = 'static'
    STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'

    STATIC_URL = 'https://%s/%s/' % (AWS_S3_CUSTOM_DOMAIN, AWS_LOCATION)

    DEFAULT_FILE_STORAGE = 'piweatherviewer.storage_backends.MediaStorage'

    MEDIA_ROOT = 'media'

    MEDIA_URL = 'https://%s/%s/' % (AWS_S3_CUSTOM_DOMAIN, MEDIA_ROOT)

else:
    STATIC_URL = '/static/'
    STATIC_ROOT = 'static'
    MEDIA_ROOT = 'static/media'
    MEDIA_URL = '/media/'
