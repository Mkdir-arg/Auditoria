# Sistema de Auditoría Nutricional

## 🎯 Descripción

Sistema web para que auditores del Gobierno evalúen si las comidas servidas en instituciones (escuelas, hogares, geriátricos, etc.) cumplen con criterios nutricionales mínimos.

## ✅ Estado del Proyecto

- ✅ **FASE 1**: Catálogo Nutricional (Backend) - COMPLETADA
- ✅ **FASE 2**: Sistema de Auditoría (Backend) - COMPLETADA
- ✅ **FASE 3**: Frontend React - COMPLETADA
- ✅ **FASE 4**: Reportes y Estadísticas - COMPLETADA
- ✅ **FASE 5**: Aplicación Móvil React Native - COMPLETADA
- ✅ **FASE 6**: Diseño Responsive - COMPLETADA

🎉 **PROYECTO 100% COMPLETO - WEB Y MÓVIL - RESPONSIVE**

## 🚀 Inicio Rápido

### Requisitos Previos
- Docker y Docker Compose
- Puertos libres: 3308, 8000, 3001

### 1. Verificar Setup

```bash
cd my-app

# Verificar que .env existe (si no, se copia de .env.example)
ls .env
```

### 2. Iniciar con Docker (TODO AUTOMÁTICO)

```bash
docker-compose up -d
```

**Esto hace automáticamente:**
- ✅ Levanta MySQL
- ✅ Ejecuta migraciones
- ✅ Inicia backend Django
- ✅ Inicia frontend React

### 3. Ver Logs

```bash
docker-compose logs -f
```

### 4. Crear Superusuario (Opcional)

```bash
docker exec -it my-app-backend-1 python src/manage.py createsuperuser
```

### 5. Importar Alimentos de Ejemplo

```bash
docker exec -it my-app-backend-1 python src/manage.py importar_alimentos \
  --file /app/data/alimentos_argenfood_ejemplo.json --truncate
```

### 6. Acceder al Sistema

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000/api/
- **Django Admin**: http://localhost:8000/admin/

## 📚 Documentación

### Implementación
- [Implementación Completa](my-app/IMPLEMENTACION.md)
- [Resumen de Implementación](my-app/RESUMEN_IMPLEMENTACION.md)
- [Frontend - Fase 3](my-app/FASE3_FRONTEND.md)
- [Reportes - Fase 4](my-app/FASE4_REPORTES.md)
- [Móvil - Fase 5](my-app/FASE5_MOBILE.md)
- [Diseño Responsive - Fase 6](my-app/RESPONSIVE_DESIGN.md) 📱
- [Ejemplos Responsive](my-app/RESPONSIVE_EXAMPLES.md) 💡

### Performance y Docker
- [Análisis de Performance](my-app/ANALISIS_PERFORMANCE.md)
- [Optimizaciones Aplicadas](my-app/OPTIMIZACIONES_APLICADAS.md) ⭐
- [Guía Docker Setup](my-app/DOCKER_SETUP.md) 🐳

## 🎯 Funcionalidades Principales

### Gestión de Instituciones
- CRUD completo de instituciones
- Búsqueda y filtros
- Tipos: escuela, CDI, hogar, geriátrico

### Registro de Visitas
- Crear visitas de auditoría
- Asociar a instituciones
- Tipos de comida: desayuno, almuerzo, merienda, cena, vianda

### Gestión de Platos e Ingredientes
- Agregar platos observados
- Búsqueda inteligente de alimentos
- Agregar ingredientes con cantidades
- **Cálculo automático de valores nutricionales** ⚡

### Catálogo Nutricional
- Base de datos Argenfood
- 40+ campos nutricionales por alimento
- Búsqueda y filtrado

### Reportes y Estadísticas
- Dashboard con métricas generales
- Ranking de instituciones por visitas
- Reportes detallados por institución
- Promedios nutricionales automáticos
- Filtros por período

## 🔌 APIs Disponibles

### Nutrición

```
GET /api/nutricion/categorias/
GET /api/nutricion/alimentos/?search=arroz
```

### Auditoría

```
GET /api/auditoria/instituciones/
POST /api/auditoria/instituciones/
GET /api/auditoria/visitas/
POST /api/auditoria/visitas/
GET /api/auditoria/visitas/{id}/
POST /api/auditoria/platos/
POST /api/auditoria/ingredientes/
```

### Reportes

```
GET /api/auditoria/reportes/dashboard/
GET /api/auditoria/reportes/ranking/
GET /api/auditoria/reportes/institucion/{id}/
GET /api/auditoria/reportes/visitas-periodo/
POST /api/auditoria/reportes/comparativa/
```

## 🛠️ Stack Tecnológico

### Backend
- Django 4.2+ REST Framework
- MySQL 8
- JWT Authentication
- django-filter

### Frontend Web
- React 18 + TypeScript
- Vite
- React Router v6
- Tailwind CSS (Responsive)
- Axios
- Zustand
- Mobile-First Design

### Frontend Móvil
- React Native 0.72
- Expo ~49.0
- React Navigation v6
- TypeScript
- Axios

### Infraestructura
- Docker Compose
- Gunicorn

## 📊 Estructura del Proyecto

```
my-app/
├── backend/
│   └── src/
│       ├── nutricion/      # Catálogo de alimentos
│       ├── auditoria/      # Sistema de visitas
│       ├── core/           # App base
│       └── config/         # Settings Django
├── apps/
│   └── web/               # Frontend React
│       └── src/
│           ├── pages/     # Páginas principales
│           ├── components/ # Componentes UI
│           ├── services/  # APIs
│           └── router/    # Navegación
├── data/
│   └── alimentos_argenfood_ejemplo.json
└── docker-compose.yml
```

## 🎓 Uso del Sistema

### Flujo de Trabajo

1. **Crear Institución**
   - Ir a "Instituciones"
   - Agregar nueva institución

2. **Registrar Visita**
   - Ir a "Visitas"
   - Crear nueva visita
   - Seleccionar institución y fecha

3. **Agregar Platos**
   - En detalle de visita
   - Agregar plato observado

4. **Agregar Ingredientes**
   - Buscar alimento en catálogo
   - Ingresar cantidad
   - Ver totales calculados automáticamente ✨

## 🔧 Comandos Útiles

### Backend
```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Importar alimentos
python manage.py importar_alimentos --file ruta/al/json --truncate

# Crear superusuario
python manage.py createsuperuser
```

### Frontend
```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview
npm run preview
```

### Docker
```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 📝 Licencia

MIT

## 👥 Contribuidores

Sistema desarrollado para auditorías nutricionales en instituciones públicas.
