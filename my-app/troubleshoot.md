# 🔍 Guía de Troubleshooting

## Cómo Verificar que Todo Funciona

### 1. Ejecutar Script de Verificación

```bash
# Windows
check-status.bat

# Linux/Mac
chmod +x check-status.sh
./check-status.sh
```

---

## 2. Verificación Manual

### Paso 1: Ver Estado de Contenedores
```bash
docker-compose ps
```

**Resultado esperado:**
```
NAME                STATUS              PORTS
my-app-db-1         Up (healthy)        0.0.0.0:3308->3306/tcp
my-app-backend-1    Up (healthy)        0.0.0.0:8000->8000/tcp
my-app-web-1        Up                  0.0.0.0:3001->3001/tcp
```

### Paso 2: Ver Logs Completos
```bash
# Todos los servicios
docker-compose logs

# Solo errores recientes
docker-compose logs --tail=50

# Seguir logs en tiempo real
docker-compose logs -f
```

---

## 3. Problemas Comunes y Soluciones

### ❌ PROBLEMA: Backend no inicia

**Síntomas:**
```
backend-1  | Error: Can't connect to MySQL server
backend-1  | Database connection failed
```

**Solución:**
```bash
# 1. Verificar que MySQL esté healthy
docker-compose ps db

# 2. Ver logs de MySQL
docker-compose logs db

# 3. Reiniciar servicios
docker-compose restart db
docker-compose restart backend
```

---

### ❌ PROBLEMA: Error de migraciones

**Síntomas:**
```
backend-1  | django.db.utils.OperationalError: no such table
backend-1  | Migration failed
```

**Solución:**
```bash
# Ejecutar migraciones manualmente
docker exec -it my-app-backend-1 python src/manage.py makemigrations
docker exec -it my-app-backend-1 python src/manage.py migrate

# Reiniciar backend
docker-compose restart backend
```

---

### ❌ PROBLEMA: Frontend no carga

**Síntomas:**
```
web-1  | Error: Cannot find module
web-1  | npm ERR!
```

**Solución:**
```bash
# Reinstalar dependencias
docker-compose exec web npm install

# Reiniciar frontend
docker-compose restart web

# Si persiste, reconstruir
docker-compose build web
docker-compose up -d web
```

---

### ❌ PROBLEMA: Puerto ocupado

**Síntomas:**
```
Error: bind: address already in use
```

**Solución:**
```bash
# Ver qué proceso usa el puerto
netstat -ano | findstr :8000
netstat -ano | findstr :3001
netstat -ano | findstr :3308

# Matar proceso (Windows)
taskkill /PID <PID> /F

# O cambiar puerto en docker-compose.yml
```

---

### ❌ PROBLEMA: MySQL no inicia

**Síntomas:**
```
db-1  | [ERROR] InnoDB: Cannot allocate memory
db-1  | mysqld: Can't start server
```

**Solución:**
```bash
# Eliminar volumen y reiniciar
docker-compose down -v
docker-compose up -d

# Verificar espacio en disco
docker system df
```

---

## 4. Comandos de Diagnóstico

### Ver logs específicos
```bash
# Últimas 50 líneas del backend
docker-compose logs --tail=50 backend

# Últimas 50 líneas del frontend
docker-compose logs --tail=50 web

# Últimas 50 líneas de MySQL
docker-compose logs --tail=50 db
```

### Entrar a un contenedor
```bash
# Backend
docker exec -it my-app-backend-1 bash

# Frontend
docker exec -it my-app-web-1 sh

# MySQL
docker exec -it my-app-db-1 bash
```

### Verificar conectividad
```bash
# Probar API
curl http://localhost:8000/api/

# Probar frontend
curl http://localhost:3001

# Probar MySQL
docker exec -it my-app-db-1 mysql -u myapp_user -pmyapp_password -e "SHOW DATABASES;"
```

---

## 5. Checklist de Verificación

### ✅ MySQL (db)
- [ ] Contenedor corriendo
- [ ] Estado: healthy
- [ ] Puerto 3308 accesible
- [ ] Base de datos creada
- [ ] Logs sin errores críticos

**Comando:**
```bash
docker-compose logs db | grep -i error
```

### ✅ Backend (Django)
- [ ] Contenedor corriendo
- [ ] Estado: healthy
- [ ] Puerto 8000 accesible
- [ ] Migraciones ejecutadas
- [ ] API responde en /api/
- [ ] Sin errores en logs

**Comando:**
```bash
curl http://localhost:8000/api/
docker-compose logs backend | grep -i error
```

### ✅ Frontend (React)
- [ ] Contenedor corriendo
- [ ] Puerto 3001 accesible
- [ ] Vite dev server iniciado
- [ ] Sin errores de compilación

**Comando:**
```bash
curl http://localhost:3001
docker-compose logs web | grep -i error
```

---

## 6. Logs Esperados (Sin Errores)

### MySQL
```
db-1  | [Server] /usr/sbin/mysqld: ready for connections
db-1  | [Server] Version: '8.0.x' socket: '/var/run/mysqld/mysqld.sock' port: 3306
```

### Backend
```
backend-1  | Database is ready!
backend-1  | No changes detected
backend-1  | Operations to perform:
backend-1  | Running migrations: No migrations to apply.
backend-1  | Starting development server at http://0.0.0.0:8000/
backend-1  | Quit the server with CONTROL-C.
```

### Frontend
```
web-1  | VITE v5.x.x ready in xxx ms
web-1  | ➜  Local:   http://localhost:3001/
web-1  | ➜  Network: http://0.0.0.0:3001/
```

---

## 7. Reinicio Completo (Último Recurso)

```bash
# 1. Detener todo
docker-compose down

# 2. Eliminar volúmenes (⚠️ BORRA DATOS)
docker-compose down -v

# 3. Limpiar imágenes
docker-compose build --no-cache

# 4. Iniciar de nuevo
docker-compose up -d

# 5. Ver logs
docker-compose logs -f
```

---

## 8. Verificar Optimizaciones

### Connection Pooling
```bash
# Ver configuración
docker exec -it my-app-backend-1 grep -A 5 "CONN_MAX_AGE" src/config/settings.py
```

Debe mostrar: `'CONN_MAX_AGE': 600`

### Caché
```bash
# Ver configuración de caché
docker exec -it my-app-backend-1 grep -A 10 "CACHES" src/config/settings.py
```

### Rate Limiting
```bash
# Probar límite (debe dar 429 después de muchos requests)
for i in {1..150}; do curl -s http://localhost:8000/api/ > /dev/null; done
curl -v http://localhost:8000/api/
```

---

## 9. Contacto y Soporte

Si después de seguir esta guía sigues teniendo problemas:

1. Ejecuta: `docker-compose logs > logs.txt`
2. Revisa el archivo `logs.txt`
3. Busca líneas con `ERROR` o `CRITICAL`
4. Comparte los errores específicos

---

## 10. Comandos Rápidos de Referencia

```bash
# Estado
docker-compose ps

# Logs en tiempo real
docker-compose logs -f

# Reiniciar un servicio
docker-compose restart backend

# Reconstruir
docker-compose build --no-cache

# Limpiar todo
docker-compose down -v

# Iniciar
docker-compose up -d

# Ver recursos
docker stats
```
