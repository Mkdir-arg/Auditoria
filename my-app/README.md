# Auditoria

Monorepo con React + TypeScript + Tailwind CSS + Django REST Framework + MySQL + Docker.

## Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Django + Django REST Framework
- **Base de datos**: MySQL
- **Containerización**: Docker + Docker Compose

## Instalación

1. Copiar variables de entorno:
```bash
cp .env.example .env
```

2. Construir y levantar servicios:
```bash
docker-compose build
docker-compose up -d
```

3. Aplicar migraciones:
```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

## URLs

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000/api/
- **Admin Django**: http://localhost:8000/admin/