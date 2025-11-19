# Sistema de Auditoría Nutricional - Guía de Implementación

## ✅ FASE 1 y 2 COMPLETADAS - Backend

### Estructura Creada

```
backend/src/
├── nutricion/          # App de catálogo nutricional
│   ├── models.py       # CategoriaAlimento, AlimentoNutricional
│   ├── serializers.py  # APIs REST
│   ├── views.py        # ViewSets con filtros
│   ├── urls.py
│   ├── admin.py
│   └── management/
│       └── commands/
│           └── importar_alimentos.py
│
└── auditoria/          # App de auditoría
    ├── models.py       # Institucion, VisitaAuditoria, PlatoObservado, IngredientePlato
    ├── serializers.py  # APIs REST
    ├── views.py        # ViewSets con cálculo automático
    ├── urls.py
    └── admin.py
```

## 🚀 Pasos para Activar el Sistema

### 1. Instalar Dependencias

```bash
cd backend
pip install -r requirements.txt
```

### 2. Crear Migraciones

```bash
python manage.py makemigrations nutricion auditoria
python manage.py migrate
```

### 3. Crear Superusuario (opcional)

```bash
python manage.py createsuperuser
```

### 4. Importar Alimentos desde JSON

```bash
# Con el JSON de ejemplo
python manage.py importar_alimentos --file ../data/alimentos_argenfood_ejemplo.json --truncate

# Cuando tengas el JSON completo
python manage.py importar_alimentos --file ruta/al/json/completo.json --truncate
```

### 5. Iniciar Servidor

```bash
python manage.py runserver
# O con Docker
docker-compose up
```

## 📡 APIs Disponibles

### Nutrición

- `GET /api/nutricion/categorias/` - Listar categorías
- `GET /api/nutricion/alimentos/` - Listar alimentos
  - Filtros: `?categoria=1&search=arroz`
  - Búsqueda: `?search=maiz`
- `GET /api/nutricion/alimentos/{id}/` - Detalle de alimento

### Auditoría

#### Instituciones
- `GET /api/auditoria/instituciones/` - Listar instituciones
- `POST /api/auditoria/instituciones/` - Crear institución
- `GET /api/auditoria/instituciones/{id}/` - Detalle
- `PUT /api/auditoria/instituciones/{id}/` - Actualizar
- `DELETE /api/auditoria/instituciones/{id}/` - Eliminar

#### Visitas
- `GET /api/auditoria/visitas/` - Listar visitas
  - Filtros: `?institucion=1&tipo_comida=almuerzo&fecha=2024-01-15`
- `POST /api/auditoria/visitas/` - Crear visita
- `GET /api/auditoria/visitas/{id}/` - Detalle con platos

#### Platos
- `GET /api/auditoria/platos/` - Listar platos
  - Filtros: `?visita=1`
- `POST /api/auditoria/platos/` - Crear plato
- `GET /api/auditoria/platos/{id}/` - Detalle con ingredientes
- `POST /api/auditoria/platos/{id}/recalcular/` - Recalcular totales

#### Ingredientes
- `GET /api/auditoria/ingredientes/` - Listar ingredientes
  - Filtros: `?plato=1`
- `POST /api/auditoria/ingredientes/` - Agregar ingrediente (calcula automáticamente)
- `PUT /api/auditoria/ingredientes/{id}/` - Actualizar (recalcula automáticamente)
- `DELETE /api/auditoria/ingredientes/{id}/` - Eliminar (recalcula plato)

## 🔄 Flujo de Trabajo

### Ejemplo: Registrar una visita con plato

```json
// 1. Crear visita
POST /api/auditoria/visitas/
{
  "institucion": 1,
  "fecha": "2024-01-15",
  "tipo_comida": "almuerzo",
  "observaciones": "Visita de rutina"
}

// 2. Crear plato
POST /api/auditoria/platos/
{
  "visita": 1,
  "nombre": "Polenta con queso",
  "tipo_plato": "principal",
  "porciones_servidas": 50
}

// 3. Agregar ingredientes (el sistema calcula automáticamente)
POST /api/auditoria/ingredientes/
{
  "plato": 1,
  "alimento": 12,  // ID del maíz/polenta
  "cantidad": 150,
  "unidad": "g",
  "orden": 1
}

POST /api/auditoria/ingredientes/
{
  "plato": 1,
  "alimento": 45,  // ID del queso
  "cantidad": 30,
  "unidad": "g",
  "orden": 2
}

// 4. Consultar plato con totales calculados
GET /api/auditoria/platos/1/
// Respuesta incluye:
// - energia_kcal_total
// - proteinas_g_total
// - grasas_totales_g_total
// - carbohidratos_g_total
// - fibra_g_total
// - sodio_mg_total
```

## 🎯 Características Implementadas

### ✅ Catálogo Nutricional
- Importación masiva desde JSON
- 40+ campos nutricionales por alimento
- Búsqueda y filtrado
- Categorización

### ✅ Sistema de Auditoría
- CRUD completo de instituciones
- Registro de visitas por fecha y tipo de comida
- Platos observados con ingredientes
- **Cálculo automático** de valores nutricionales
- Recálculo en tiempo real al agregar/modificar/eliminar ingredientes

### ✅ Optimizaciones
- Índices en BD para búsquedas rápidas
- `select_related` y `prefetch_related` para evitar N+1 queries
- Bulk create para importación masiva
- Transacciones atómicas

## 📝 Próximos Pasos

### FASE 3: Frontend (Pendiente)
- Interfaces React para instituciones
- Formularios de visitas y platos
- Selector de ingredientes con autocomplete
- Panel de totales nutricionales en tiempo real
- Dashboard de visitas

### FASE 4: Reportes (Pendiente)
- Consultas históricas
- Estadísticas por institución
- Exportación CSV/Excel
- Gráficos nutricionales

## 🐛 Testing

```bash
# Probar importación
python manage.py importar_alimentos --file ../data/alimentos_argenfood_ejemplo.json --truncate

# Verificar en Django Admin
# http://localhost:8000/admin/

# Probar APIs
curl http://localhost:8000/api/nutricion/alimentos/
curl http://localhost:8000/api/auditoria/instituciones/
```

## 📚 Modelos de Datos

### CategoriaAlimento
- codigo (único)
- nombre

### AlimentoNutricional
- codigo_argenfood (único)
- nombre
- categoria (FK)
- 40+ campos nutricionales

### Institucion
- codigo (único)
- nombre, tipo, dirección, barrio, comuna
- activo

### VisitaAuditoria
- institucion (FK)
- fecha, tipo_comida
- observaciones

### PlatoObservado
- visita (FK)
- nombre, tipo_plato
- porciones_servidas
- **Totales calculados**: energía, proteínas, grasas, carbohidratos, fibra, sodio

### IngredientePlato
- plato (FK)
- alimento (FK)
- cantidad, unidad, orden
- **Aportes calculados**: energía, proteínas, grasas, carbohidratos, fibra, sodio

## 🔧 Configuración

El sistema está configurado para:
- MySQL 8 (Docker)
- Paginación: 20 items por página
- JWT Authentication
- CORS habilitado
- Django Admin habilitado
