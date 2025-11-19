# 🐳 Guía de Docker Setup

## ✅ Verificación Pre-Inicio

### Requisitos
- Docker Desktop instalado y corriendo
- Docker Compose v2+
- Puertos disponibles: 3308 (MySQL), 8000 (Backend), 3001 (Frontend)

### Verificar Docker
```bash
docker --version
docker-compose --version
```

---

## 🚀 Inicio Rápido

### 1. Verificar archivo .env
```bash
# Debe existir my-app/.env con estas variables:
cat .env
```

Contenido esperado:
```env
DJANGO_SECRET_KEY=changeme
DJANGO_DEBUG=1
DB_NAME=myapp_db
DB_USER=myapp_user
DB_PASSWORD=myapp_password
DB_HOST=db
DB_PORT=3306
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=myapp_db
MYSQL_USER=myapp_user
MYSQL_PASSWORD=myapp_password
```

### 2. Levantar servicios
```bash
cd my-app
docker-compose up -d
```

### 3. Ver logs
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f web
```

### 4. Verificar estado
```bash
docker-compose ps
```

Deberías ver:
```
NAME                STATUS              PORTS
my-app-db-1         Up (healthy)        0.0.0.0:3308->3306/tcp
my-app-backend-1    Up (healthy)        0.0.0.0:8000->8000/tcp
my-app-web-1        Up                  0.0.0.0:3001->3001/tcp
```

---

## 📊 Proceso de Inicio (Automático)

### Orden de Inicio
1. **MySQL (db)** - Se inicia primero
   - Espera healthcheck (30s)
   - Crea base de datos
   
2. **Backend (Django)** - Espera a MySQL
   - Ejecuta `wait-for-db.py` (espera conexión)
   - Ejecuta `makemigrations`
   - Ejecuta `migrate`
   - Inicia servidor en puerto 8000
   
3. **Frontend (React)** - Espera a Backend
   - Instala dependencias (si es necesario)
   - Inicia Vite dev server en puerto 3001

---

## 🔍 Verificación de Servicios

### MySQL
```bash
# Conectar a MySQL
docker exec -it my-app-db-1 mysql -u myapp_user -pmyapp_password myapp_db

# Ver tablas
SHOW TABLES;
```

### Backend
```bash
# Verificar API
curl http://localhost:8000/api/

# Entrar al contenedor
docker exec -it my-app-backend-1 bash

# Crear superusuario
docker exec -it my-app-backend-1 python src/manage.py createsuperuser
```

### Frontend
```bash
# Verificar frontend
curl http://localhost:3001

# Ver logs en tiempo real
docker-compose logs -f web
```

---

## 📥 Importar Datos de Ejemplo

### Opción 1: Desde el contenedor
```bash
docker exec -it my-app-backend-1 python src/manage.py importar_alimentos \
  --file /app/data/alimentos_argenfood_ejemplo.json \
  --truncate
```

### Opción 2: Desde el host
```bash
# Copiar JSON al contenedor
docker cp data/alimentos_argenfood_ejemplo.json my-app-backend-1:/tmp/

# Importar
docker exec -it my-app-backend-1 python src/manage.py importar_alimentos \
  --file /tmp/alimentos_argenfood_ejemplo.json \
  --truncate
```

---

## 🛠️ Comandos Útiles

### Reiniciar servicios
```bash
docker-compose restart
```

### Reconstruir imágenes
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Detener servicios
```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ BORRA DATOS)
```bash
docker-compose down -v
```

### Ver uso de recursos
```bash
docker stats
```

---

## 🐛 Troubleshooting

### Problema: Backend no inicia
```bash
# Ver logs detallados
docker-compose logs backend

# Verificar conexión a BD
docker exec -it my-app-backend-1 python /app/wait-for-db.py
```

### Problema: Frontend no carga
```bash
# Verificar logs
docker-compose logs web

# Reinstalar dependencias
docker-compose exec web npm install
docker-compose restart web
```

### Problema: Puerto ocupado
```bash
# Ver qué usa el puerto
netstat -ano | findstr :8000
netstat -ano | findstr :3001
netstat -ano | findstr :3308

# Cambiar puertos en docker-compose.yml
```

### Problema: MySQL no inicia
```bash
# Ver logs
docker-compose logs db

# Eliminar volumen y reiniciar
docker-compose down -v
docker-compose up -d
```

---

## 🔄 Actualizar Código

### Backend
```bash
# Los cambios se reflejan automáticamente (volume mount)
# Si cambias requirements.txt:
docker-compose build backend
docker-compose up -d backend
```

### Frontend
```bash
# Los cambios se reflejan automáticamente (HMR)
# Si cambias package.json:
docker-compose exec web npm install
docker-compose restart web
```

---

## 📊 Healthchecks

### MySQL
- Comando: `mysqladmin ping`
- Intervalo: 10s
- Start period: 30s

### Backend
- Comando: `curl http://localhost:8000/api/`
- Intervalo: 10s
- Start period: 30s

### Frontend
- Sin healthcheck (opcional)

---

## 🎯 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:3001 | Aplicación React |
| Backend API | http://localhost:8000/api/ | REST API |
| Django Admin | http://localhost:8000/admin/ | Panel admin |
| MySQL | localhost:3308 | Base de datos |

---

## 📝 Notas Importantes

1. **Primera vez**: El inicio puede tardar 2-3 minutos
2. **Migraciones**: Se ejecutan automáticamente
3. **Datos**: Persistentes en volumen `mysql_data`
4. **Hot reload**: Funciona en backend y frontend
5. **Logs**: Usar `docker-compose logs -f` para debug

---

## ✅ Checklist de Verificación

- [ ] Docker Desktop corriendo
- [ ] Archivo .env existe
- [ ] Puertos 3308, 8000, 3001 libres
- [ ] `docker-compose up -d` sin errores
- [ ] MySQL healthy (30s)
- [ ] Backend healthy (60s)
- [ ] Frontend accesible
- [ ] API responde en /api/
- [ ] Datos importados (opcional)

---

## 🚀 Siguiente Paso

Una vez todo levantado:
1. Acceder a http://localhost:3001
2. Crear superusuario si es necesario
3. Importar alimentos de ejemplo
4. ¡Empezar a usar el sistema!
