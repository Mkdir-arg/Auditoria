# Deployment - Digital Ocean Quick Start

## 🚀 Deploy en 3 pasos

### Paso 1: Obtén los datos de tu Database Cluster

En Digital Ocean Console > Databases > Tu cluster > Connection Details:

Copia estos valores:
```
username = doadmin
password = ****** (tu contraseña)
host = db-mysql-nyc3-35371-do-user-30778760-0.j.db.ondigitalocean.com
port = 25060
database = defaultdb
```

### Paso 2: Crea el DATABASE_URL

Forma el URL así:
```
mysql://doadmin:your_password@db-mysql-nyc3-35371-do-user-30778760-0.j.db.ondigitalocean.com:25060/defaultdb
```

**⚠️ IMPORTANTE:** Reemplaza `your_password` con tu contraseña real.

### Paso 3: Configura en Digital Ocean App Platform

1. Ve a tu App en Digital Ocean
2. Ve a Settings > Environment
3. Añade estas variables:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | `mysql://doadmin:PASSWORD@db-mysql-nyc3-35371-do-user-30778760-0.j.db.ondigitalocean.com:25060/defaultdb` |
| `DJANGO_SECRET_KEY` | Genera uno seguro: [Django Secret Key Generator](https://djecrety.ir/) |
| `DJANGO_DEBUG` | `0` |

4. Haz deploy (redeploy si ya está deployado)

---

## ✅ Verificación

Después del deployment, los logs deberían mostrar:

```
==> Iniciando Auditoria
==> Database configuration found
  Using DATABASE_URL
==> Esperando base de datos...
✓ Database is available!
==> Migrando base de datos
==> Iniciando Gunicorn
```

---

## 🔧 Troubleshooting

### Error: "Can't connect to local server through socket"
**Problema:** Django intenta conectarse a un socket local en lugar de la BD remota.
**Solución:** Verifica que `DATABASE_URL` esté configurado en Digital Ocean (no `.env` local).

### Error: "Failed to connect after 30 attempts"
**Problema:** La BD no es accesible.
**Solución:** 
- Verifica que el puerto sea **25060** (no 3306)
- Verifica que la contraseña sea correcta
- Verifica que la App y BD estén en el mismo VPC
- Descarga el CA Certificate desde Digital Ocean y configúralo (si necesario)

### Error: "STRICT_TRANS_TABLES"
**Problema:** Configuración de SQL Mode incompatible.
**Solución:** El código ya lo maneja automáticamente. Si persiste, reinicia la app.

---

## 📝 Comandos Útiles

### Generar SECRET_KEY seguro localmente:
```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### Verificar conexión a BD localmente:
```bash
export DATABASE_URL="mysql://doadmin:password@host:25060/defaultdb"
python wait-db.py
```

### Ver logs en Digital Ocean:
```bash
# En la consola de Digital Ocean App Platform > Runtime logs
# O desde CLI:
doctl apps logs <app-id>
```

---

## 📚 Documentación Completa

Ver [DEPLOYMENT_DIGITALOCEAN.md](../../DEPLOYMENT_DIGITALOCEAN.md) para más detalles.
