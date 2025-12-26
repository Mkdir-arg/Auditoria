#!/bin/bash
set -e

echo "==> Starting Auditoria"

# Validate that database environment variables are configured.
# If DATABASE_URL is a template that was not resolved, ignore it.
if [ -n "$DATABASE_URL" ] && [[ "$DATABASE_URL" == *'${'* ]]; then
    echo "WARNING: DATABASE_URL looks like an unresolved template, ignoring it."
    DATABASE_URL=""
fi

if [ -z "$DATABASE_URL" ] && [ -z "$DB_HOST" ] && [ -z "$DATABASE_HOST" ]; then
    echo "WARNING: No database configuration found (DATABASE_URL, DB_HOST, or DATABASE_HOST not set)"
    echo "Using SQLite as fallback database."
else
    echo "==> Database configuration found"
    if [ -n "$DATABASE_URL" ]; then
        echo "  Using DATABASE_URL"
    elif [ -n "$DATABASE_HOST" ]; then
        echo "  Using DATABASE_* environment variables"
        echo "  DATABASE_HOST: $DATABASE_HOST"
        echo "  DATABASE_PORT: ${DATABASE_PORT:-3306}"
        echo "  DATABASE_NAME: $DATABASE_NAME"
    else
        echo "  Using DB_* environment variables"
        echo "  DB_HOST: $DB_HOST"
        echo "  DB_PORT: ${DB_PORT:-3306}"
        echo "  DB_NAME: $DB_NAME"
    fi

    echo "==> Waiting for database (max 30 attempts)..."
    python wait-db.py || echo "WARNING: Database wait timeout, attempting migration anyway"
fi

echo "==> Migrating database"
python backend/manage.py migrate --noinput

echo "==> Loading fixtures (if any)"
if python - <<'PY'
import os
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django
django.setup()

from nutricion.models import CategoriaAlimento

sys.exit(0 if CategoriaAlimento.objects.exists() else 1)
PY
then
    echo "Fixtures already loaded, skipping."
else
    python backend/manage.py loaddata backend/fixtures/*.json || true
fi

echo "==> Collecting static files"
python backend/manage.py collectstatic --noinput

echo "==> Starting Gunicorn"
exec gunicorn backend.src.config.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 3 \
  --timeout 120
