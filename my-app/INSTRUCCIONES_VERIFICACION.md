# 📋 Instrucciones para Verificar el Sistema

## 🎯 Ejecuta estos comandos en orden

### 1. Ir al directorio del proyecto
```bash
cd c:\Users\usuar\Auditoria\my-app
```

### 2. Ver estado de los contenedores
```bash
docker-compose ps
```

**¿Qué deberías ver?**
- ✅ 3 contenedores: db, backend, web
- ✅ Estado "Up" en todos
- ✅ db y backend con "(healthy)"

---

### 3. Ver logs de TODOS los servicios
```bash
docker-compose logs
```

**Busca estos mensajes de ÉXITO:**

#### MySQL (db):
```
✅ "[Server] /usr/sbin/mysqld: ready for connections"
✅ "Version: '8.0"
```

#### Backend:
```
✅ "Database is ready!"
✅ "No migrations to apply" o "Applied X migrations"
✅ "Starting development server at http://0.0.0.0:8000/"
```

#### Frontend (web):
```
✅ "VITE v5.x.x ready"
✅ "Local:   http://localhost:3001/"
```

---

### 4. Ver logs SOLO del backend (más fácil de leer)
```bash
docker-compose logs backend
```

**Copia y pega aquí los últimos 30 líneas**

---

### 5. Probar las URLs

Abre tu navegador y prueba:

1. **Frontend**: http://localhost:3001
   - ¿Se ve la página de login?
   
2. **Backend API**: http://localhost:8000/api/
   - ¿Muestra un JSON con las rutas?
   
3. **Admin Django**: http://localhost:8000/admin/
   - ¿Se ve el panel de login de Django?

---

### 6. Si hay errores, ejecuta:

```bash
# Ver solo errores del backend
docker-compose logs backend | findstr /i "error"

# Ver solo errores del frontend
docker-compose logs web | findstr /i "error"

# Ver solo errores de MySQL
docker-compose logs db | findstr /i "error"
```

---

## 🔍 Qué buscar en los logs

### ✅ SEÑALES DE ÉXITO:

**MySQL:**
- "ready for connections"
- "port: 3306"

**Backend:**
- "Database is ready!"
- "Starting development server"
- "Watching for file changes"

**Frontend:**
- "VITE v5"
- "ready in"
- "Local: http://localhost:3001"

### ❌ SEÑALES DE ERROR:

**MySQL:**
- "ERROR" en mayúsculas
- "Can't start server"
- "InnoDB"

**Backend:**
- "Can't connect to MySQL"
- "OperationalError"
- "ModuleNotFoundError"
- "ImportError"

**Frontend:**
- "npm ERR!"
- "Cannot find module"
- "ENOENT"

---

## 📝 Reporte de Estado

Después de ejecutar los comandos, responde:

1. **¿Los 3 contenedores están "Up"?** (Sí/No)

2. **¿El backend muestra "Starting development server"?** (Sí/No)

3. **¿El frontend muestra "VITE ready"?** (Sí/No)

4. **¿Puedes acceder a http://localhost:3001?** (Sí/No)

5. **¿Hay algún ERROR en los logs?** (Sí/No)
   - Si sí, ¿cuál es el mensaje exacto?

---

## 🚀 Si todo funciona:

Ejecuta estos comandos para completar el setup:

```bash
# 1. Crear superusuario
docker exec -it my-app-backend-1 python src/manage.py createsuperuser

# 2. Importar datos de ejemplo
docker exec -it my-app-backend-1 python src/manage.py importar_alimentos --file /app/data/alimentos_argenfood_ejemplo.json --truncate

# 3. Verificar que se importaron
docker exec -it my-app-backend-1 python src/manage.py shell -c "from nutricion.models import AlimentoNutricional; print(f'Alimentos: {AlimentoNutricional.objects.count()}')"
```

---

## 📊 Script Automático

También puedes ejecutar:

```bash
check-status.bat
```

Esto te dará un reporte completo automático.
