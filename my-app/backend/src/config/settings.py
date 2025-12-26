import os
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'changeme')

DEBUG = os.getenv('DJANGO_DEBUG', '0') == '1'

ALLOWED_HOSTS = ['*']

# Trust DigitalOcean/App Platform domains (and any custom domain) for CSRF.
csrf_env = os.getenv("CSRF_TRUSTED_ORIGINS", "")
CSRF_TRUSTED_ORIGINS = [origin.strip() for origin in csrf_env.split(",") if origin.strip()]

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    'core',
    'nutricion',
    'auditoria',
]

MIDDLEWARE = [
    'django.middleware.gzip.GZipMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
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
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL and "${" in DATABASE_URL:
    print("[Django] DATABASE_URL appears to be an unresolved template, ignoring it.")
    DATABASE_URL = None

if DATABASE_URL:
    url = urlparse(DATABASE_URL)
    
    # Handle port - Digital Ocean uses 25060, standard MySQL uses 3306
    port = url.port if url.port else 3306
    
    # Extract database name from path
    db_name = url.path.lstrip('/') if url.path else "audit_db"
    hostname = url.hostname or "localhost"
    
    # Log database configuration for debugging
    print(f"[Django] Using DATABASE_URL: {url.scheme}://{hostname}:{port}/{db_name}")
    
    # Prepare database options
    db_options = {
        "charset": "utf8mb4",
        "init_command": "SET sql_mode='STRICT_TRANS_TABLES'",
    }
    
    # Add SSL options for Digital Ocean managed databases
    if 'ondigitalocean.com' in hostname:
        print(f"[Django] Digital Ocean database detected, enabling SSL")
        db_options['ssl'] = {
            'key': None,
            'cert': None,
            'ca': None,
            'check_hostname': False,
            'ssl_verify_cert': False,
            'ssl_verify_identity': False,
        }
    
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.mysql",
            "NAME": db_name,
            "USER": url.username or "root",
            "PASSWORD": url.password or "",
            "HOST": hostname,
            "PORT": port,
            "OPTIONS": db_options,
        }
    }
else:
    # Use environment variables with sensible defaults
    db_host = os.getenv("DB_HOST") or os.getenv("DATABASE_HOST")
    db_port = os.getenv("DB_PORT") or os.getenv("DATABASE_PORT") or "3306"
    db_name = os.getenv("DB_NAME") or os.getenv("DATABASE_NAME") or "audit_db"
    db_user = os.getenv("DB_USER") or os.getenv("DATABASE_USER") or "root"
    db_password = os.getenv("DB_PASSWORD") or os.getenv("DATABASE_PASSWORD") or ""
    
    # Only use MySQL if HOST is explicitly configured
    if db_host:
        if os.getenv("DATABASE_HOST"):
            print(
                "[Django] Using DATABASE_* variables: "
                f"host={db_host}, port={db_port}, db={db_name}"
            )
        else:
            print(f"[Django] Using DB_* variables: host={db_host}, port={db_port}, db={db_name}")
        
        # Prepare database options
        db_options = {
            "charset": "utf8mb4",
            "init_command": "SET sql_mode='STRICT_TRANS_TABLES'",
        }
        
        # Add SSL options if Digital Ocean is detected
        if 'ondigitalocean.com' in db_host:
            print(f"[Django] Digital Ocean database detected, enabling SSL")
            db_options['ssl'] = {
                'key': None,
                'cert': None,
                'ca': None,
                'check_hostname': False,
                'ssl_verify_cert': False,
                'ssl_verify_identity': False,
            }
        
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.mysql",
                "NAME": db_name,
                "USER": db_user,
                "PASSWORD": db_password,
                "HOST": db_host,
                "PORT": int(db_port),
                "OPTIONS": db_options,
            }
        }
    else:
        # Fallback to SQLite if no database is configured
        print("[Django] Using SQLite (fallback - no DATABASE_URL or DB_HOST configured)")
        DATABASES = {
            "default": {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
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

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
WHITENOISE_MANIFEST_STRICT = False

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
    'PAGE_SIZE': 20,
    'MAX_PAGE_SIZE': 100,
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_THROTTLE_CLASSES': [],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '10000/hour',
        'user': '10000/hour',
        'reports': '1000/hour',
        'bulk': '500/hour',
    },
    'COMPACT_JSON': True,
    'EXCEPTION_HANDLER': 'rest_framework.views.exception_handler',
    'NON_FIELD_ERRORS_KEY': 'error',
}

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}

CORS_ALLOW_ALL_ORIGINS = True

# Cache Configuration
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
        'OPTIONS': {
            'MAX_ENTRIES': 1000
        }
    }
}
