# Guía de Deployment en Digital Ocean

## Problema Original

El error `AttributeError: 'NoneType' object has no attribute 'startswith'` ocurrió porque no había configuradas variables de entorno para la base de datos.

## Solución Implementada

El código ahora:
1. Soporta `DATABASE_URL` para conexiones a bases de datos remotas (recomendado para managed DB de Digital Ocean)
2. Soporta variables individuales `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
3. **Cae atrás a SQLite** si ninguna de las anteriores está configurada
4. Incluye un script `wait-db.py` que espera a que la BD esté lista antes de ejecutar migraciones

## Pasos para Deployar en Digital Ocean

### ✅ RECOMENDADO: Opción A - Usando Database Cluster Managed de Digital Ocean

**Paso 1:** Ya tienes tu Database Cluster creado ✓

Detalles de conexión:
- **Username**: doadmin
- **Host**: db-mysql-nyc3-35371-do-user-30778760-0.j.db.ondigitalocean.com
- **Port**: 25060 (IMPORTANTE - no es 3306)
- **Database**: defaultdb
- **SSL Mode**: REQUIRED

**Paso 2:** En Digital Ocean App Platform, configura esta variable de entorno:

```yaml
env:
  - key: DATABASE_URL
    scope: RUN_AND_BUILD_TIME
    value: "mysql://doadmin:your_password@db-mysql-nyc3-35371-do-user-30778760-0.j.db.ondigitalocean.com:25060/defaultdb"
  - key: DJANGO_SECRET_KEY
    scope: RUN_AND_BUILD_TIME
    value: "tu-clave-secreta-aqui-cambiar-en-produccion"
  - key: DJANGO_DEBUG
    scope: RUN_AND_BUILD_TIME
    value: "0"
```

⚠️ **IMPORTANTE:**
- Reemplaza `your_password` con la contraseña real de doadmin
- **NO pongas la contraseña en GitHub** - úsala solo en Digital Ocean
- El port **25060** es crucial (no uses 3306)

**Paso 3:** Asegúrate de que tu App tenga acceso a la BD:
- En Digital Ocean, verifica que la App y la BD estén en el mismo VPC
- El firewall de la BD debe permitir conexiones desde la App
- Normalmente está configurado automáticamente si están en el mismo cluster

---

### Opción B: Usando variables individuales DB_*

Si prefieres usar variables separadas (menos recomendado):

```yaml
env:
  - key: DB_HOST
    scope: RUN_AND_BUILD_TIME
    value: "db-mysql-nyc3-12345.ondigitalocean.com"
  - key: DB_PORT
    scope: RUN_AND_BUILD_TIME
    value: "25060"
  - key: DB_NAME
    scope: RUN_AND_BUILD_TIME
    value: "audit_db"
  - key: DB_USER
    scope: RUN_AND_BUILD_TIME
    value: "doadmin"
  - key: DB_PASSWORD
    scope: RUN_AND_BUILD_TIME
    value: "your_password"
  - key: DJANGO_SECRET_KEY
    scope: RUN_AND_BUILD_TIME
    value: "tu-clave-secreta-aqui"
  - key: DJANGO_DEBUG
    scope: RUN_AND_BUILD_TIME
    value: "0"
```

---

### Opción C: SQLite (Solo para Testing)

Si no configuras ninguna de las opciones anteriores, la app usará SQLite automáticamente.

⚠️ **NO usar en producción** - SQLite con múltiples workers causará problemas de concurrencia.

---

## Cambios Realizados

### 1. `wait-db.py` (NUEVO)
- Script que verifica si la BD está disponible
- Reintentos automáticos (hasta 30 intentos)
- Compatible con DATABASE_URL de Digital Ocean
- Se ejecuta antes de las migraciones

### 2. `entrypoint.sh` (MEJORADO)
- Validación de variables de entorno al inicio
- Logging claro de qué configuración se está usando
- Llama a `wait-db.py` para esperar a que la BD esté lista
- Maneja gracefully si la espera falla

### 3. `settings.py` (MEJORADO)
- Parse robusto de `DATABASE_URL`
- Manejo correcto de puerto (default 3306)
- Extracción correcta del nombre de BD desde la ruta
- Logging de debug para diagnosticar problemas
- Configuración SQL mode para MySQL

### 4. `Dockerfile` (ACTUALIZADO)
- Incluye `wait-db.py` en la imagen
- Hace ejecutable el script

### 5. `.env.example` (ACTUALIZADO)
- Documentación clara de ambas opciones
- Ejemplos con valores reales de Digital Ocean

---

## Testing Local

Para probar localmente que funciona:

```bash
# Con SQLite (sin BD)
export DJANGO_SECRET_KEY="test-key"
export DJANGO_DEBUG=1
python backend/manage.py migrate --noinput

# Con MySQL local
export DATABASE_URL="mysql://root:password@localhost:3306/test_audit"
export DJANGO_SECRET_KEY="test-key"
python backend/manage.py migrate --noinput

# O con variables separadas
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=
export DB_NAME=test_audit
export DJANGO_SECRET_KEY="test-key"
python backend/manage.py migrate --noinput
```

---

## Troubleshooting

### "Can't connect to local server through socket"
**Causa:** Django intenta conectarse a un socket local MySQL en lugar de la URL remota
**Solución:** Verifica que `DATABASE_URL` esté configurado correctamente en Digital Ocean

### "Failed to connect after 30 attempts"
**Causa:** La BD no está accesible o el firewall bloquea la conexión
**Solución:** 
- Verifica que el Database Cluster esté en el mismo VPC
- Comprueba las credenciales en DATABASE_URL
- Revisa el logs del Database Cluster en Digital Ocean

### "No database configuration found"
**Causa:** Ni DATABASE_URL ni DB_HOST están configurados
**Solución:** Configura una de las opciones anteriores. Por ahora usa SQLite temporalmente.

---

## Environment Variables Finales

Para un deployment exitoso en Digital Ocean, necesitas:

| Variable | Requerida | Ejemplo |
|----------|-----------|---------|
| `DATABASE_URL` | ✅ (O usar DB_HOST) | `mysql://user:pass@host:port/dbname` |
| `DJANGO_SECRET_KEY` | ✅ | `your-secret-key-here` |
| `DJANGO_DEBUG` | ❌ | `0` (producción) |

O alternativamente:

| Variable | Requerida | Ejemplo |
|----------|-----------|---------|
| `DB_HOST` | ✅ (O usar DATABASE_URL) | `db.example.com` |
| `DB_PORT` | ❌ | `3306` |
| `DB_NAME` | ❌ | `audit_db` |
| `DB_USER` | ❌ | `root` |
| `DB_PASSWORD` | ❌ | `password` |
| `DJANGO_SECRET_KEY` | ✅ | `your-secret-key-here` |
| `DJANGO_DEBUG` | ❌ | `0` |
