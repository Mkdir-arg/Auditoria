# MANUAL COMPLETO DEL SISTEMA DE AUDITORÍA NUTRICIONAL

## 📋 ÍNDICE

1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Módulos del Sistema](#módulos-del-sistema)
4. [Funcionalidades Detalladas](#funcionalidades-detalladas)
5. [Flujos de Trabajo](#flujos-de-trabajo)
6. [API y Endpoints](#api-y-endpoints)
7. [Base de Datos](#base-de-datos)
8. [Interfaz de Usuario](#interfaz-de-usuario)
9. [Casos de Uso](#casos-de-uso)
10. [Administración](#administración)

---

## 1. INTRODUCCIÓN

### 1.1 Propósito del Sistema

El Sistema de Auditoría Nutricional es una aplicación web full-stack diseñada para realizar auditorías nutricionales en instituciones públicas de Argentina (escuelas, CDI, hogares, geriátricos). Permite:

- Registrar visitas de auditoría
- Evaluar platos servidos
- Calcular valores nutricionales automáticamente
- Generar reportes con filtros dinámicos
- Gestionar catálogo de alimentos basado en Argenfood

### 1.2 Usuarios del Sistema

- **Auditores Nutricionales**: Realizan visitas y registran información
- **Supervisores**: Revisan reportes y estadísticas
- **Administradores**: Gestionan usuarios y configuración del sistema

### 1.3 Alcance

El sistema cubre:
- Gestión de instituciones (escuelas, CDI, hogares, geriátricos)
- Registro de visitas de auditoría
- Formularios de relevamiento (10 secciones)
- Gestión de platos e ingredientes
- Cálculo automático de valores nutricionales
- Reportes y estadísticas con filtros dinámicos
- Dashboard con métricas en tiempo real

---

## 2. ARQUITECTURA DEL SISTEMA

### 2.1 Stack Tecnológico

**Backend:**
- Django 4.2
- Django REST Framework
- MySQL 8.0
- JWT Authentication
- Gunicorn

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios

**Infraestructura:**
- Docker Compose
- Nginx (opcional)

### 2.2 Arquitectura de Capas

```
┌─────────────────────────────────────┐
│     FRONTEND (React + TypeScript)   │
│  - Componentes UI                   │
│  - Servicios API                    │
│  - Gestión de estado                │
└─────────────────────────────────────┘
              ↓ HTTP/REST
┌─────────────────────────────────────┐
│     BACKEND (Django REST API)       │
│  - Endpoints REST                   │
│  - Lógica de negocio                │
│  - Autenticación JWT                │
└─────────────────────────────────────┘
              ↓ ORM
┌─────────────────────────────────────┐
│     BASE DE DATOS (MySQL 8)         │
│  - Tablas relacionales              │
│  - Índices optimizados              │
│  - Datos JSON                       │
└─────────────────────────────────────┘
```

### 2.3 Módulos Principales

1. **Módulo Nutrición** (`nutricion/`)
   - Gestión de alimentos
   - Categorías nutricionales
   - Valores nutricionales

2. **Módulo Auditoría** (`auditoria/`)
   - Instituciones
   - Visitas
   - Platos e ingredientes
   - Formularios de relevamiento
   - Reportes

---

## 3. MÓDULOS DEL SISTEMA

### 3.1 Módulo Nutrición

#### 3.1.1 Gestión de Alimentos

**Propósito**: Mantener un catálogo de alimentos con sus valores nutricionales basado en la tabla Argenfood.

**Entidades:**
- `Alimento`: Representa un alimento con todos sus valores nutricionales
- `CategoriaAlimento`: Categorías de alimentos (cereales, carnes, lácteos, etc.)

**Funcionalidades:**
- ✅ Crear alimentos con código Argenfood
- ✅ Editar valores nutricionales
- ✅ Buscar alimentos por nombre o código
- ✅ Filtrar por categoría
- ✅ Importar alimentos desde JSON
- ✅ Exportar catálogo

**Campos Nutricionales:**
- Energía (kcal)
- Proteínas (g)
- Grasas totales (g)
- Carbohidratos totales (g)
- Agua (g)
- Fibra dietética (g)
- Cenizas (g)
- Calcio (mg)
- Hierro (mg)
- Sodio (mg)
- Y más de 30 campos adicionales

#### 3.1.2 Categorías de Alimentos

**Categorías disponibles:**
1. Cereales y derivados
2. Carnes y derivados
3. Leche y productos lácteos
4. Huevos
5. Aceites y grasas
6. Frutas
7. Hortalizas
8. Legumbres
9. Azúcares y dulces
10. Bebidas
11. Misceláneas

### 3.2 Módulo Auditoría

#### 3.2.1 Gestión de Instituciones

**Propósito**: Administrar las instituciones donde se realizan auditorías.

**Campos:**
- Nombre
- Tipo (escuela, CDI, hogar, geriátrico)
- Dirección
- Comuna
- Barrio
- Teléfono
- Email
- Responsable

**Funcionalidades:**
- ✅ CRUD completo
- ✅ Búsqueda por nombre
- ✅ Filtros por tipo, comuna, barrio
- ✅ Listado paginado
- ✅ Historial de visitas

#### 3.2.2 Gestión de Visitas

**Propósito**: Registrar cada visita de auditoría realizada.

**Campos:**
- Institución
- Fecha de visita
- Auditor
- Tipo de comida (desayuno, almuerzo, merienda, cena, vianda)
- Observaciones generales
- Formulario de relevamiento (JSON)

**Funcionalidades:**
- ✅ Crear nueva visita
- ✅ Editar visita
- ✅ Eliminar visita
- ✅ Ver detalle completo
- ✅ Completar formulario de relevamiento
- ✅ Agregar platos observados
- ✅ Generar reporte de visita

#### 3.2.3 Formulario de Relevamiento

**Propósito**: Capturar información detallada durante la auditoría.

**10 Secciones del Formulario:**

1. **Datos Generales**
   - Fecha y hora
   - Auditor
   - Tipo de comida
   - Cantidad de comensales

2. **Infraestructura**
   - Estado de cocina
   - Equipamiento
   - Limpieza
   - Ventilación

3. **Personal**
   - Cantidad de personal
   - Capacitación
   - Uso de EPP
   - Higiene personal

4. **Almacenamiento**
   - Condiciones de almacenamiento
   - Temperatura de heladeras/freezers
   - Rotación de stock
   - Etiquetado

5. **Preparación**
   - Procesos de cocción
   - Temperaturas de cocción
   - Tiempos de preparación
   - Higiene en preparación

6. **Servicio**
   - Temperatura de servicio
   - Porciones
   - Presentación
   - Horarios

7. **Menú**
   - Platos servidos
   - Variedad
   - Aceptación
   - Sobras

8. **Documentación**
   - Planillas de temperatura
   - Registros de limpieza
   - Certificados de personal
   - Facturas de compra

9. **Observaciones**
   - Hallazgos positivos
   - No conformidades
   - Recomendaciones
   - Acciones correctivas

10. **Conclusiones**
    - Calificación general
    - Cumplimiento normativo
    - Próximos pasos
    - Firma del auditor

**Almacenamiento**: Los datos se guardan en formato JSON en el campo `formulario_data` de la tabla `Visita`.

#### 3.2.4 Gestión de Platos

**Propósito**: Registrar los platos observados durante la visita.

**Campos:**
- Visita
- Nombre del plato
- Descripción
- Cantidad de porciones
- Observaciones
- Es plantilla (para reutilizar)

**Funcionalidades:**
- ✅ Agregar plato a visita
- ✅ Editar plato
- ✅ Eliminar plato
- ✅ Agregar ingredientes
- ✅ Cálculo automático de valores nutricionales
- ✅ Guardar como plantilla
- ✅ Cargar desde plantilla

#### 3.2.5 Gestión de Ingredientes

**Propósito**: Detallar los ingredientes de cada plato con sus cantidades.

**Campos:**
- Plato
- Alimento (referencia a catálogo)
- Cantidad (gramos)
- Valores nutricionales calculados

**Funcionalidades:**
- ✅ Agregar ingrediente
- ✅ Buscar alimento en catálogo
- ✅ Especificar cantidad
- ✅ **Cálculo automático de valores nutricionales**
- ✅ Editar cantidad
- ✅ Eliminar ingrediente
- ✅ Ver totales del plato

**Cálculo Automático:**
Cuando se agrega un ingrediente, el sistema:
1. Obtiene los valores nutricionales del alimento (por 100g)
2. Calcula proporcionalmente según la cantidad especificada
3. Guarda los valores calculados en el ingrediente
4. Suma todos los ingredientes para obtener totales del plato

Ejemplo:
```
Alimento: Arroz blanco
Valores por 100g: 339 kcal, 6.9g proteínas
Cantidad: 200g

Cálculo:
- Energía: 339 * (200/100) = 678 kcal
- Proteínas: 6.9 * (200/100) = 13.8g
```


#### 3.2.6 Reportes y Estadísticas

**Propósito**: Generar reportes y visualizar estadísticas del sistema.

**Tipos de Reportes:**

1. **Dashboard General**
   - Total de instituciones
   - Total de visitas
   - Total de platos registrados
   - Visitas por tipo de comida
   - Visitas por mes
   - Instituciones más auditadas

2. **Ranking de Instituciones**
   - Instituciones ordenadas por cantidad de visitas
   - Filtros por tipo, comuna, barrio
   - Promedio de calificación
   - Última visita

3. **Reportes con Filtros Dinámicos**
   - Filtrar por campos del formulario
   - Filtrar por rango de fechas
   - Filtrar por institución
   - Filtrar por auditor
   - Exportar resultados

4. **Análisis Nutricional**
   - Promedios nutricionales por tipo de comida
   - Cumplimiento de requerimientos
   - Comparativas entre instituciones
   - Tendencias temporales

---

## 4. FUNCIONALIDADES DETALLADAS

### 4.1 Autenticación y Autorización

#### 4.1.1 Sistema de Login

**Tecnología**: JWT (JSON Web Tokens)

**Flujo:**
1. Usuario ingresa credenciales
2. Backend valida y genera token JWT
3. Frontend almacena token en localStorage
4. Token se envía en cada petición (header Authorization)
5. Backend valida token en cada request

**Endpoints:**
- `POST /api/token/` - Obtener token
- `POST /api/token/refresh/` - Refrescar token
- `POST /api/token/verify/` - Verificar token

#### 4.1.2 Roles y Permisos

**Roles:**
- **Superusuario**: Acceso total
- **Auditor**: Crear/editar visitas y platos
- **Supervisor**: Ver reportes y estadísticas
- **Lector**: Solo lectura

**Permisos por módulo:**
- Instituciones: CRUD según rol
- Visitas: CRUD según rol
- Alimentos: Solo admin puede modificar
- Reportes: Todos pueden ver

### 4.2 Búsqueda y Filtros

#### 4.2.1 Búsqueda de Alimentos

**Características:**
- Búsqueda por nombre (case-insensitive)
- Búsqueda por código Argenfood
- Filtro por categoría
- Resultados paginados
- Debounce para optimizar peticiones

**Implementación:**
```typescript
// Frontend
const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 500)

useEffect(() => {
  fetchAlimentos(debouncedSearch)
}, [debouncedSearch])
```

#### 4.2.2 Filtros de Instituciones

**Filtros disponibles:**
- Por nombre
- Por tipo (escuela, CDI, hogar, geriátrico)
- Por comuna (1-15)
- Por barrio
- Combinación de filtros

#### 4.2.3 Filtros de Visitas

**Filtros disponibles:**
- Por institución
- Por rango de fechas
- Por tipo de comida
- Por auditor
- Por campos del formulario (dinámico)

**Filtros Dinámicos del Formulario:**
El sistema permite filtrar visitas por cualquier campo del formulario de relevamiento:

```json
{
  "infraestructura.estado_cocina": "bueno",
  "personal.cantidad": ">5",
  "servicio.temperatura": ">=65"
}
```

### 4.3 Cálculos Nutricionales

#### 4.3.1 Cálculo por Ingrediente

**Fórmula:**
```
Valor_calculado = Valor_por_100g * (Cantidad_g / 100)
```

**Ejemplo:**
```
Alimento: Pollo, pechuga, sin piel, cruda
Energía por 100g: 110 kcal
Cantidad: 150g

Energía calculada = 110 * (150/100) = 165 kcal
```

#### 4.3.2 Cálculo por Plato

**Proceso:**
1. Sumar todos los valores de ingredientes
2. Calcular totales por nutriente
3. Calcular por porción si se especifica

**Ejemplo:**
```
Plato: Arroz con pollo
Ingredientes:
- Arroz 200g: 678 kcal, 13.8g proteínas
- Pollo 150g: 165 kcal, 33g proteínas
- Aceite 10g: 90 kcal, 0g proteínas

Total: 933 kcal, 46.8g proteínas
Por porción (4 porciones): 233.25 kcal, 11.7g proteínas
```

#### 4.3.3 Promedios y Estadísticas

**Cálculos disponibles:**
- Promedio de energía por tipo de comida
- Promedio de macronutrientes
- Desviación estándar
- Valores mínimos y máximos
- Cumplimiento de requerimientos

### 4.4 Plantillas de Platos

#### 4.4.1 Crear Plantilla

**Proceso:**
1. Crear plato con ingredientes
2. Marcar como plantilla
3. Asignar nombre descriptivo
4. Guardar en biblioteca

**Uso:**
- Reutilizar platos comunes
- Agilizar carga de datos
- Estandarizar recetas
- Mantener consistencia

#### 4.4.2 Usar Plantilla

**Proceso:**
1. Seleccionar plantilla
2. Sistema copia plato e ingredientes
3. Ajustar cantidades si es necesario
4. Guardar en visita actual

### 4.5 Importación y Exportación

#### 4.5.1 Importar Alimentos

**Comando:**
```bash
docker exec -it my-app-backend-1 python src/manage.py importar_alimentos \
  --file /app/data/alimentos_argenfood_ejemplo.json \
  --truncate
```

**Formato JSON:**
```json
[
  {
    "codigo_argenfood": 484,
    "nombre": "Arroz, grano, blanco, pulido, crudo",
    "categoria": 1,
    "energia_kcal": 339.0,
    "proteinas_g": 6.9,
    "grasas_totales_g": 0.2,
    "carbohidratos_totales_g": 79.2
  }
]
```

**Opciones:**
- `--file`: Ruta del archivo JSON
- `--truncate`: Eliminar datos existentes antes de importar
- `--update`: Actualizar registros existentes

#### 4.5.2 Exportar Datos

**Formatos disponibles:**
- JSON
- CSV
- Excel (XLSX)
- PDF (reportes)

**Endpoints:**
- `/api/nutricion/alimentos/export/`
- `/api/auditoria/visitas/export/`
- `/api/auditoria/reportes/export/`

---

## 5. FLUJOS DE TRABAJO

### 5.1 Flujo Completo de Auditoría

```
1. PREPARACIÓN
   ↓
   - Crear/verificar institución en sistema
   - Asignar auditor
   - Programar fecha

2. CREAR VISITA
   ↓
   - Seleccionar institución
   - Ingresar fecha
   - Seleccionar tipo de comida
   - Guardar visita

3. COMPLETAR FORMULARIO
   ↓
   - Acceder a detalle de visita
   - Completar 10 secciones
   - Guardar progreso
   - Finalizar formulario

4. REGISTRAR PLATOS
   ↓
   - Agregar nuevo plato
   - Ingresar nombre y descripción
   - Especificar porciones

5. AGREGAR INGREDIENTES
   ↓
   - Buscar alimento en catálogo
   - Seleccionar alimento
   - Ingresar cantidad en gramos
   - Sistema calcula valores automáticamente
   - Repetir para cada ingrediente

6. REVISAR TOTALES
   ↓
   - Ver valores nutricionales del plato
   - Verificar cálculos
   - Ajustar si es necesario

7. GENERAR REPORTE
   ↓
   - Acceder a reportes
   - Aplicar filtros
   - Visualizar resultados
   - Exportar si es necesario

8. SEGUIMIENTO
   ↓
   - Revisar recomendaciones
   - Programar próxima visita
   - Actualizar estado
```

### 5.2 Flujo de Búsqueda de Alimentos

```
1. USUARIO INGRESA BÚSQUEDA
   ↓
2. DEBOUNCE (500ms)
   ↓
3. PETICIÓN AL BACKEND
   ↓
4. BACKEND BUSCA EN BD
   - Por nombre (LIKE)
   - Por código (EXACT)
   ↓
5. RESULTADOS PAGINADOS
   ↓
6. FRONTEND MUESTRA LISTA
   ↓
7. USUARIO SELECCIONA ALIMENTO
   ↓
8. CARGAR DATOS COMPLETOS
```

### 5.3 Flujo de Cálculo Nutricional

```
1. USUARIO AGREGA INGREDIENTE
   ↓
2. SELECCIONA ALIMENTO
   ↓
3. INGRESA CANTIDAD (gramos)
   ↓
4. BACKEND RECIBE PETICIÓN
   ↓
5. OBTIENE VALORES DEL ALIMENTO
   - Valores por 100g
   ↓
6. CALCULA PROPORCIONALMENTE
   - valor * (cantidad / 100)
   ↓
7. GUARDA EN INGREDIENTE
   - energia_kcal_calculada
   - proteinas_g_calculadas
   - etc.
   ↓
8. SUMA TOTALES DEL PLATO
   ↓
9. RETORNA RESULTADO
   ↓
10. FRONTEND ACTUALIZA UI
```

### 5.4 Flujo de Reportes con Filtros

```
1. USUARIO ACCEDE A REPORTES
   ↓
2. SELECCIONA TIPO DE REPORTE
   - Dashboard
   - Ranking
   - Filtros dinámicos
   ↓
3. APLICA FILTROS
   - Fechas
   - Institución
   - Tipo de comida
   - Campos del formulario
   ↓
4. BACKEND PROCESA FILTROS
   - Construye query dinámica
   - Aplica filtros JSON
   ↓
5. EJECUTA CONSULTA
   - Con índices optimizados
   ↓
6. CALCULA ESTADÍSTICAS
   - Promedios
   - Totales
   - Porcentajes
   ↓
7. RETORNA RESULTADOS
   ↓
8. FRONTEND VISUALIZA
   - Tablas
   - Gráficos
   - Métricas
   ↓
9. OPCIÓN DE EXPORTAR
```

---

## 6. API Y ENDPOINTS

### 6.1 Módulo Nutrición

#### 6.1.1 Alimentos

**Listar alimentos**
```
GET /api/nutricion/alimentos/
Query params:
  - search: búsqueda por nombre o código
  - categoria: filtro por categoría
  - page: número de página
  - page_size: tamaño de página

Response:
{
  "count": 100,
  "next": "url",
  "previous": "url",
  "results": [
    {
      "id": 1,
      "codigo_argenfood": 484,
      "nombre": "Arroz, grano, blanco...",
      "categoria": 1,
      "energia_kcal": 339.0,
      ...
    }
  ]
}
```

**Obtener alimento**
```
GET /api/nutricion/alimentos/{id}/

Response:
{
  "id": 1,
  "codigo_argenfood": 484,
  "nombre": "Arroz, grano, blanco, pulido, crudo",
  "categoria": 1,
  "energia_kcal": 339.0,
  "proteinas_g": 6.9,
  "grasas_totales_g": 0.2,
  "carbohidratos_totales_g": 79.2,
  "agua_g": 13.0,
  ...
}
```

**Crear alimento**
```
POST /api/nutricion/alimentos/
Body:
{
  "codigo_argenfood": 484,
  "nombre": "Arroz, grano, blanco, pulido, crudo",
  "categoria": 1,
  "energia_kcal": 339.0,
  "proteinas_g": 6.9,
  ...
}

Response: 201 Created
```

**Actualizar alimento**
```
PUT /api/nutricion/alimentos/{id}/
PATCH /api/nutricion/alimentos/{id}/

Body: campos a actualizar

Response: 200 OK
```

**Eliminar alimento**
```
DELETE /api/nutricion/alimentos/{id}/

Response: 204 No Content
```

#### 6.1.2 Categorías

```
GET /api/nutricion/categorias/

Response:
[
  {
    "id": 1,
    "nombre": "Cereales y derivados",
    "descripcion": "..."
  },
  ...
]
```

### 6.2 Módulo Auditoría

#### 6.2.1 Instituciones

**Listar instituciones**
```
GET /api/auditoria/instituciones/
Query params:
  - search: búsqueda por nombre
  - tipo: filtro por tipo
  - comuna: filtro por comuna
  - barrio: filtro por barrio

Response:
{
  "count": 50,
  "results": [
    {
      "id": 1,
      "nombre": "Escuela Primaria N°1",
      "tipo": "escuela",
      "direccion": "Av. Corrientes 1234",
      "comuna": 1,
      "barrio": "Constitución",
      ...
    }
  ]
}
```

**CRUD completo**: GET, POST, PUT, PATCH, DELETE

#### 6.2.2 Visitas

**Listar visitas**
```
GET /api/auditoria/visitas/
Query params:
  - institucion: filtro por institución
  - fecha_desde: fecha inicio
  - fecha_hasta: fecha fin
  - tipo_comida: filtro por tipo
  - auditor: filtro por auditor

Response:
{
  "count": 100,
  "results": [
    {
      "id": 1,
      "institucion": {...},
      "fecha": "2025-01-15",
      "auditor": "Juan Pérez",
      "tipo_comida": "almuerzo",
      "formulario_data": {...},
      "platos": [...]
    }
  ]
}
```

**Obtener visita con detalle**
```
GET /api/auditoria/visitas/{id}/

Response:
{
  "id": 1,
  "institucion": {
    "id": 1,
    "nombre": "Escuela Primaria N°1",
    ...
  },
  "fecha": "2025-01-15",
  "auditor": "Juan Pérez",
  "tipo_comida": "almuerzo",
  "observaciones": "...",
  "formulario_data": {
    "datos_generales": {...},
    "infraestructura": {...},
    ...
  },
  "platos": [
    {
      "id": 1,
      "nombre": "Arroz con pollo",
      "ingredientes": [...],
      "totales_nutricionales": {...}
    }
  ]
}
```

**CRUD completo**: GET, POST, PUT, PATCH, DELETE

#### 6.2.3 Platos

**Listar platos de una visita**
```
GET /api/auditoria/platos/
Query params:
  - visita: ID de visita

Response:
[
  {
    "id": 1,
    "visita": 1,
    "nombre": "Arroz con pollo",
    "descripcion": "...",
    "porciones": 50,
    "es_plantilla": false,
    "ingredientes": [...],
    "totales": {
      "energia_kcal": 933.0,
      "proteinas_g": 46.8,
      ...
    }
  }
]
```

**Crear plato**
```
POST /api/auditoria/platos/
Body:
{
  "visita": 1,
  "nombre": "Arroz con pollo",
  "descripcion": "Plato principal",
  "porciones": 50
}

Response: 201 Created
```

**CRUD completo**: GET, POST, PUT, PATCH, DELETE

#### 6.2.4 Ingredientes

**Agregar ingrediente**
```
POST /api/auditoria/ingredientes/
Body:
{
  "plato": 1,
  "alimento": 484,
  "cantidad_g": 200.0
}

Response:
{
  "id": 1,
  "plato": 1,
  "alimento": {
    "id": 484,
    "nombre": "Arroz, grano, blanco...",
    ...
  },
  "cantidad_g": 200.0,
  "energia_kcal_calculada": 678.0,
  "proteinas_g_calculadas": 13.8,
  ...
}
```

**Actualizar cantidad**
```
PATCH /api/auditoria/ingredientes/{id}/
Body:
{
  "cantidad_g": 250.0
}

Response: Valores recalculados automáticamente
```

**CRUD completo**: GET, POST, PUT, PATCH, DELETE

#### 6.2.5 Reportes

**Dashboard**
```
GET /api/auditoria/reportes/dashboard/

Response:
{
  "total_instituciones": 50,
  "total_visitas": 200,
  "total_platos": 500,
  "visitas_por_tipo_comida": {
    "desayuno": 40,
    "almuerzo": 80,
    "merienda": 50,
    "cena": 30
  },
  "visitas_por_mes": [...],
  "instituciones_mas_auditadas": [...]
}
```

**Ranking de instituciones**
```
GET /api/auditoria/reportes/ranking/
Query params:
  - tipo: filtro por tipo
  - comuna: filtro por comuna

Response:
[
  {
    "institucion": {...},
    "cantidad_visitas": 15,
    "ultima_visita": "2025-01-15",
    "promedio_calificacion": 8.5
  },
  ...
]
```

**Filtros dinámicos**
```
POST /api/auditoria/reportes/filtros-dinamicos/
Body:
{
  "fecha_desde": "2025-01-01",
  "fecha_hasta": "2025-01-31",
  "institucion": 1,
  "filtros_formulario": {
    "infraestructura.estado_cocina": "bueno",
    "personal.cantidad": ">5"
  }
}

Response:
{
  "count": 10,
  "visitas": [...],
  "estadisticas": {
    "promedio_energia": 850.5,
    "promedio_proteinas": 35.2,
    ...
  }
}
```


---

## 7. BASE DE DATOS

### 7.1 Modelo de Datos

#### 7.1.1 Diagrama Entidad-Relación

```
┌─────────────────────┐
│  CategoriaAlimento  │
│─────────────────────│
│ id (PK)             │
│ nombre              │
│ descripcion         │
└─────────────────────┘
          │
          │ 1:N
          ↓
┌─────────────────────┐
│     Alimento        │
│─────────────────────│
│ id (PK)             │
│ codigo_argenfood    │◄────┐
│ nombre              │     │
│ categoria (FK)      │     │
│ energia_kcal        │     │
│ proteinas_g         │     │
│ grasas_totales_g    │     │
│ carbohidratos_g     │     │
│ ... (30+ campos)    │     │
└─────────────────────┘     │
                            │
                            │ N:1
┌─────────────────────┐     │
│    Institucion      │     │
│─────────────────────│     │
│ id (PK)             │     │
│ nombre              │     │
│ tipo                │     │
│ direccion           │     │
│ comuna              │     │
│ barrio              │     │
│ telefono            │     │
│ email               │     │
│ responsable         │     │
└─────────────────────┘     │
          │                 │
          │ 1:N             │
          ↓                 │
┌─────────────────────┐     │
│       Visita        │     │
│─────────────────────│     │
│ id (PK)             │     │
│ institucion (FK)    │     │
│ fecha               │     │
│ auditor             │     │
│ tipo_comida         │     │
│ observaciones       │     │
│ formulario_data     │     │
│   (JSON)            │     │
└─────────────────────┘     │
          │                 │
          │ 1:N             │
          ↓                 │
┌─────────────────────┐     │
│       Plato         │     │
│─────────────────────│     │
│ id (PK)             │     │
│ visita (FK)         │     │
│ nombre              │     │
│ descripcion         │     │
│ porciones           │     │
│ es_plantilla        │     │
└─────────────────────┘     │
          │                 │
          │ 1:N             │
          ↓                 │
┌─────────────────────┐     │
│    Ingrediente      │     │
│─────────────────────│     │
│ id (PK)             │     │
│ plato (FK)          │     │
│ alimento (FK)       │─────┘
│ cantidad_g          │
│ energia_kcal_calc   │
│ proteinas_g_calc    │
│ grasas_g_calc       │
│ carbohidratos_g_calc│
│ ... (valores calc)  │
└─────────────────────┘
```

### 7.2 Tablas Principales

#### 7.2.1 Tabla: nutricion_categoriaalimento

```sql
CREATE TABLE nutricion_categoriaalimento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_categoria_nombre ON nutricion_categoriaalimento(nombre);
```

#### 7.2.2 Tabla: nutricion_alimento

```sql
CREATE TABLE nutricion_alimento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo_argenfood INT UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    categoria_id INT NOT NULL,
    
    -- Macronutrientes
    energia_kcal DECIMAL(10,2),
    proteinas_g DECIMAL(10,2),
    grasas_totales_g DECIMAL(10,2),
    carbohidratos_totales_g DECIMAL(10,2),
    
    -- Composición
    agua_g DECIMAL(10,2),
    fibra_dietetica_g DECIMAL(10,2),
    cenizas_g DECIMAL(10,2),
    
    -- Minerales
    calcio_mg DECIMAL(10,2),
    hierro_mg DECIMAL(10,2),
    sodio_mg DECIMAL(10,2),
    magnesio_mg DECIMAL(10,2),
    fosforo_mg DECIMAL(10,2),
    potasio_mg DECIMAL(10,2),
    zinc_mg DECIMAL(10,2),
    
    -- Vitaminas
    vitamina_a_ug DECIMAL(10,2),
    vitamina_c_mg DECIMAL(10,2),
    vitamina_d_ug DECIMAL(10,2),
    vitamina_e_mg DECIMAL(10,2),
    tiamina_mg DECIMAL(10,2),
    riboflavina_mg DECIMAL(10,2),
    niacina_mg DECIMAL(10,2),
    vitamina_b6_mg DECIMAL(10,2),
    folato_ug DECIMAL(10,2),
    vitamina_b12_ug DECIMAL(10,2),
    
    -- Lípidos
    acidos_grasos_saturados_g DECIMAL(10,2),
    acidos_grasos_monoinsaturados_g DECIMAL(10,2),
    acidos_grasos_poliinsaturados_g DECIMAL(10,2),
    colesterol_mg DECIMAL(10,2),
    
    -- Carbohidratos
    azucares_totales_g DECIMAL(10,2),
    almidon_g DECIMAL(10,2),
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (categoria_id) REFERENCES nutricion_categoriaalimento(id)
);

-- Índices optimizados
CREATE INDEX idx_alimento_codigo ON nutricion_alimento(codigo_argenfood);
CREATE INDEX idx_alimento_nombre ON nutricion_alimento(nombre);
CREATE INDEX idx_alimento_categoria ON nutricion_alimento(categoria_id);
CREATE FULLTEXT INDEX idx_alimento_nombre_fulltext ON nutricion_alimento(nombre);
```

#### 7.2.3 Tabla: auditoria_institucion

```sql
CREATE TABLE auditoria_institucion (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- escuela, cdi, hogar, geriatrico
    direccion VARCHAR(255),
    comuna INT,
    barrio VARCHAR(100),
    telefono VARCHAR(20),
    email VARCHAR(100),
    responsable VARCHAR(100),
    observaciones TEXT,
    activa BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_institucion_nombre ON auditoria_institucion(nombre);
CREATE INDEX idx_institucion_tipo ON auditoria_institucion(tipo);
CREATE INDEX idx_institucion_comuna ON auditoria_institucion(comuna);
CREATE INDEX idx_institucion_barrio ON auditoria_institucion(barrio);
CREATE INDEX idx_institucion_activa ON auditoria_institucion(activa);
```

#### 7.2.4 Tabla: auditoria_visita

```sql
CREATE TABLE auditoria_visita (
    id INT PRIMARY KEY AUTO_INCREMENT,
    institucion_id INT NOT NULL,
    fecha DATE NOT NULL,
    auditor VARCHAR(100) NOT NULL,
    tipo_comida VARCHAR(50) NOT NULL, -- desayuno, almuerzo, merienda, cena, vianda
    observaciones TEXT,
    formulario_data JSON, -- Almacena las 10 secciones del formulario
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (institucion_id) REFERENCES auditoria_institucion(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_visita_institucion ON auditoria_visita(institucion_id);
CREATE INDEX idx_visita_fecha ON auditoria_visita(fecha);
CREATE INDEX idx_visita_auditor ON auditoria_visita(auditor);
CREATE INDEX idx_visita_tipo_comida ON auditoria_visita(tipo_comida);
CREATE INDEX idx_visita_fecha_institucion ON auditoria_visita(fecha, institucion_id);
```

#### 7.2.5 Tabla: auditoria_plato

```sql
CREATE TABLE auditoria_plato (
    id INT PRIMARY KEY AUTO_INCREMENT,
    visita_id INT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    porciones INT,
    observaciones TEXT,
    es_plantilla BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (visita_id) REFERENCES auditoria_visita(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX idx_plato_visita ON auditoria_plato(visita_id);
CREATE INDEX idx_plato_nombre ON auditoria_plato(nombre);
CREATE INDEX idx_plato_plantilla ON auditoria_plato(es_plantilla);
```

#### 7.2.6 Tabla: auditoria_ingrediente

```sql
CREATE TABLE auditoria_ingrediente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plato_id INT NOT NULL,
    alimento_id INT NOT NULL,
    cantidad_g DECIMAL(10,2) NOT NULL,
    
    -- Valores nutricionales calculados
    energia_kcal_calculada DECIMAL(10,2),
    proteinas_g_calculadas DECIMAL(10,2),
    grasas_totales_g_calculadas DECIMAL(10,2),
    carbohidratos_totales_g_calculados DECIMAL(10,2),
    agua_g_calculada DECIMAL(10,2),
    fibra_dietetica_g_calculada DECIMAL(10,2),
    calcio_mg_calculado DECIMAL(10,2),
    hierro_mg_calculado DECIMAL(10,2),
    sodio_mg_calculado DECIMAL(10,2),
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (plato_id) REFERENCES auditoria_plato(id) ON DELETE CASCADE,
    FOREIGN KEY (alimento_id) REFERENCES nutricion_alimento(id)
);

-- Índices
CREATE INDEX idx_ingrediente_plato ON auditoria_ingrediente(plato_id);
CREATE INDEX idx_ingrediente_alimento ON auditoria_ingrediente(alimento_id);
```

### 7.3 Optimizaciones de Performance

#### 7.3.1 Índices Implementados

**Total: 18 índices**

1. Índices simples en claves foráneas
2. Índices en campos de búsqueda frecuente
3. Índices compuestos para queries complejas
4. Índice FULLTEXT para búsqueda de texto

#### 7.3.2 Queries Optimizadas

**Ejemplo 1: Listar visitas con institución**
```sql
-- Sin optimizar (N+1 queries)
SELECT * FROM auditoria_visita;
-- Luego para cada visita:
SELECT * FROM auditoria_institucion WHERE id = ?;

-- Optimizado (1 query)
SELECT v.*, i.nombre as institucion_nombre
FROM auditoria_visita v
INNER JOIN auditoria_institucion i ON v.institucion_id = i.id
WHERE v.fecha >= '2025-01-01';
```

**Ejemplo 2: Totales nutricionales de un plato**
```sql
SELECT 
    p.id,
    p.nombre,
    SUM(ing.energia_kcal_calculada) as total_energia,
    SUM(ing.proteinas_g_calculadas) as total_proteinas,
    SUM(ing.grasas_totales_g_calculadas) as total_grasas,
    SUM(ing.carbohidratos_totales_g_calculados) as total_carbohidratos
FROM auditoria_plato p
LEFT JOIN auditoria_ingrediente ing ON p.id = ing.plato_id
WHERE p.id = ?
GROUP BY p.id, p.nombre;
```

#### 7.3.3 Caché

**Estrategia de caché:**
- Catálogo de alimentos (TTL: 1 hora)
- Categorías (TTL: 24 horas)
- Dashboard (TTL: 5 minutos)
- Ranking (TTL: 15 minutos)

**Implementación:**
```python
from django.core.cache import cache

def get_alimentos_cached():
    key = 'alimentos_list'
    data = cache.get(key)
    if data is None:
        data = Alimento.objects.all()
        cache.set(key, data, 3600)  # 1 hora
    return data
```

### 7.4 Migraciones

#### 7.4.1 Crear Migraciones

```bash
# Crear migraciones
docker exec -it my-app-backend-1 python src/manage.py makemigrations

# Aplicar migraciones
docker exec -it my-app-backend-1 python src/manage.py migrate

# Ver estado de migraciones
docker exec -it my-app-backend-1 python src/manage.py showmigrations
```

#### 7.4.2 Migración Inicial

```python
# 0001_initial.py
from django.db import migrations, models

class Migration(migrations.Migration):
    initial = True
    
    dependencies = []
    
    operations = [
        migrations.CreateModel(
            name='CategoriaAlimento',
            fields=[
                ('id', models.AutoField(primary_key=True)),
                ('nombre', models.CharField(max_length=100)),
                ('descripcion', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Alimento',
            fields=[
                ('id', models.AutoField(primary_key=True)),
                ('codigo_argenfood', models.IntegerField(unique=True)),
                ('nombre', models.CharField(max_length=255)),
                ('categoria', models.ForeignKey(
                    on_delete=models.PROTECT,
                    to='nutricion.categoriaalimento'
                )),
                ('energia_kcal', models.DecimalField(
                    max_digits=10, decimal_places=2, null=True
                )),
                # ... más campos
            ],
        ),
        # ... más modelos
    ]
```

---

## 8. INTERFAZ DE USUARIO

### 8.1 Estructura de Páginas

#### 8.1.1 Layout Principal

```
┌─────────────────────────────────────────┐
│  Header                                 │
│  - Logo                                 │
│  - Navegación                           │
│  - Usuario                              │
├─────────────────────────────────────────┤
│                                         │
│  Sidebar          │  Contenido         │
│  - Dashboard      │                    │
│  - Instituciones  │  [Página actual]   │
│  - Visitas        │                    │
│  - Alimentos      │                    │
│  - Reportes       │                    │
│                   │                    │
└─────────────────────────────────────────┘
```

#### 8.1.2 Páginas Principales

1. **Dashboard** (`/`)
   - Métricas generales
   - Gráficos de visitas
   - Instituciones destacadas
   - Accesos rápidos

2. **Instituciones** (`/instituciones`)
   - Lista de instituciones
   - Búsqueda y filtros
   - Botón crear nueva
   - Acciones: ver, editar, eliminar

3. **Detalle Institución** (`/instituciones/:id`)
   - Información completa
   - Historial de visitas
   - Botón nueva visita
   - Estadísticas

4. **Visitas** (`/visitas`)
   - Lista de visitas
   - Filtros avanzados
   - Botón crear nueva
   - Acciones: ver, editar, eliminar

5. **Detalle Visita** (`/visitas/:id`)
   - Información de visita
   - Formulario de relevamiento
   - Lista de platos
   - Botón agregar plato

6. **Formulario de Relevamiento** (`/visitas/:id/formulario`)
   - 10 secciones
   - Navegación entre secciones
   - Guardar progreso
   - Finalizar

7. **Platos** (`/visitas/:id/platos`)
   - Lista de platos de la visita
   - Agregar nuevo plato
   - Ver ingredientes
   - Totales nutricionales

8. **Detalle Plato** (`/platos/:id`)
   - Información del plato
   - Lista de ingredientes
   - Agregar ingrediente
   - Totales calculados

9. **Alimentos** (`/alimentos`)
   - Catálogo completo
   - Búsqueda avanzada
   - Filtro por categoría
   - CRUD completo

10. **Reportes** (`/reportes`)
    - Dashboard de reportes
    - Ranking de instituciones
    - Filtros dinámicos
    - Exportar resultados

### 8.2 Componentes Principales

#### 8.2.1 Card

```tsx
interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  )
}
```

#### 8.2.2 SearchBar

```tsx
interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Buscar...'
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
    />
  )
}
```

#### 8.2.3 Table

```tsx
interface TableProps {
  columns: Array<{
    key: string
    label: string
    render?: (value: any, row: any) => React.ReactNode
  }>
  data: any[]
  onRowClick?: (row: any) => void
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  onRowClick
}) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          {columns.map(col => (
            <th key={col.key} className="text-left p-3">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr
            key={idx}
            onClick={() => onRowClick?.(row)}
            className="border-b hover:bg-gray-50 cursor-pointer"
          >
            {columns.map(col => (
              <td key={col.key} className="p-3">
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

#### 8.2.4 Modal

```tsx
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children
}) => {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
```

### 8.3 Formularios

#### 8.3.1 Formulario de Institución

```tsx
const InstitucionForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: '',
    direccion: '',
    comuna: '',
    barrio: '',
    telefono: '',
    email: '',
    responsable: ''
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/api/auditoria/instituciones/', formData)
      // Éxito
    } catch (error) {
      // Error
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Nombre *</label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({...formData, nombre: e.target.value})}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Tipo *</label>
        <select
          value={formData.tipo}
          onChange={(e) => setFormData({...formData, tipo: e.target.value})}
          className="w-full px-3 py-2 border rounded-lg"
          required
        >
          <option value="">Seleccionar</option>
          <option value="escuela">Escuela</option>
          <option value="cdi">CDI</option>
          <option value="hogar">Hogar</option>
          <option value="geriatrico">Geriátrico</option>
        </select>
      </div>
      
      {/* Más campos... */}
      
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Guardar
      </button>
    </form>
  )
}
```

#### 8.3.2 Formulario de Ingrediente

```tsx
const IngredienteForm = ({ platoId }: { platoId: number }) => {
  const [search, setSearch] = useState('')
  const [alimentos, setAlimentos] = useState([])
  const [selectedAlimento, setSelectedAlimento] = useState(null)
  const [cantidad, setCantidad] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/auditoria/ingredientes/', {
        plato: platoId,
        alimento: selectedAlimento.id,
        cantidad_g: parseFloat(cantidad)
      })
      // Valores calculados automáticamente en response.data
    } catch (error) {
      // Error
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Buscar Alimento</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nombre o código..."
          className="w-full px-3 py-2 border rounded-lg"
        />
        {/* Lista de resultados */}
      </div>
      
      {selectedAlimento && (
        <>
          <div className="p-3 bg-blue-50 rounded">
            <strong>{selectedAlimento.nombre}</strong>
            <p className="text-sm text-gray-600">
              Por 100g: {selectedAlimento.energia_kcal} kcal, 
              {selectedAlimento.proteinas_g}g proteínas
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Cantidad (gramos) *</label>
            <input
              type="number"
              step="0.01"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Agregar Ingrediente
          </button>
        </>
      )}
    </form>
  )
}
```

### 8.4 Responsive Design

#### 8.4.1 Breakpoints

```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Móvil grande */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop grande */
2xl: 1536px /* Desktop extra grande */
```

#### 8.4.2 Adaptaciones Móviles

- Sidebar colapsable
- Tablas con scroll horizontal
- Formularios en columna única
- Botones de tamaño táctil (min 44px)
- Menús desplegables optimizados


---

## 9. CASOS DE USO

### 9.1 Caso de Uso 1: Registrar Nueva Auditoría

**Actor**: Auditor Nutricional

**Precondiciones**:
- Usuario autenticado
- Institución existe en el sistema

**Flujo Principal**:

1. Auditor accede a "Visitas" → "Nueva Visita"
2. Selecciona institución del dropdown
3. Ingresa fecha de visita (hoy por defecto)
4. Ingresa su nombre como auditor
5. Selecciona tipo de comida (almuerzo)
6. Agrega observaciones generales (opcional)
7. Hace clic en "Guardar"
8. Sistema crea la visita y redirige al detalle

**Postcondiciones**:
- Visita creada en BD
- Auditor puede completar formulario
- Auditor puede agregar platos

**Flujo Alternativo 1**: Institución no existe
- En paso 2, auditor hace clic en "Nueva Institución"
- Completa formulario de institución
- Guarda y vuelve al formulario de visita

**Flujo Alternativo 2**: Error de validación
- Sistema muestra mensajes de error
- Auditor corrige campos
- Reintenta guardar

### 9.2 Caso de Uso 2: Completar Formulario de Relevamiento

**Actor**: Auditor Nutricional

**Precondiciones**:
- Visita creada
- Usuario en detalle de visita

**Flujo Principal**:

1. Auditor hace clic en "Completar Formulario"
2. Sistema muestra Sección 1: Datos Generales
3. Auditor completa campos de la sección
4. Hace clic en "Siguiente"
5. Sistema guarda progreso y muestra Sección 2
6. Repite pasos 3-5 para las 10 secciones
7. En Sección 10, hace clic en "Finalizar"
8. Sistema guarda formulario completo

**Postcondiciones**:
- Formulario guardado en campo JSON
- Estado de visita actualizado
- Datos disponibles para reportes

**Flujo Alternativo 1**: Guardar progreso
- En cualquier sección, auditor hace clic en "Guardar y Salir"
- Sistema guarda progreso actual
- Auditor puede continuar después

**Flujo Alternativo 2**: Navegar entre secciones
- Auditor usa menú lateral para saltar a sección específica
- Sistema muestra sección seleccionada
- Datos previos se mantienen

### 9.3 Caso de Uso 3: Registrar Plato con Ingredientes

**Actor**: Auditor Nutricional

**Precondiciones**:
- Visita creada
- Catálogo de alimentos disponible

**Flujo Principal**:

1. Auditor accede a detalle de visita
2. Hace clic en "Agregar Plato"
3. Ingresa nombre del plato: "Arroz con pollo"
4. Ingresa descripción (opcional)
5. Ingresa cantidad de porciones: 50
6. Hace clic en "Guardar"
7. Sistema crea plato y muestra detalle
8. Auditor hace clic en "Agregar Ingrediente"
9. Busca "arroz" en el catálogo
10. Selecciona "Arroz, grano, blanco, pulido, crudo"
11. Ingresa cantidad: 200g
12. Hace clic en "Agregar"
13. Sistema calcula valores nutricionales automáticamente
14. Muestra ingrediente con valores calculados
15. Repite pasos 8-14 para cada ingrediente
16. Sistema muestra totales del plato

**Postcondiciones**:
- Plato creado con todos sus ingredientes
- Valores nutricionales calculados
- Totales disponibles para reportes

**Flujo Alternativo 1**: Alimento no encontrado
- En paso 9, búsqueda no arroja resultados
- Auditor puede crear nuevo alimento (si tiene permisos)
- O selecciona alimento similar

**Flujo Alternativo 2**: Usar plantilla
- En paso 2, auditor selecciona "Cargar desde Plantilla"
- Elige plantilla existente
- Sistema copia plato e ingredientes
- Auditor ajusta cantidades si es necesario

### 9.4 Caso de Uso 4: Generar Reporte con Filtros

**Actor**: Supervisor

**Precondiciones**:
- Usuario autenticado
- Existen visitas en el sistema

**Flujo Principal**:

1. Supervisor accede a "Reportes"
2. Selecciona "Filtros Dinámicos"
3. Selecciona rango de fechas: 01/01/2025 - 31/01/2025
4. Selecciona tipo de institución: "Escuela"
5. Agrega filtro de formulario: "infraestructura.estado_cocina = bueno"
6. Hace clic en "Generar Reporte"
7. Sistema procesa filtros
8. Muestra lista de visitas que cumplen criterios
9. Muestra estadísticas agregadas:
   - Total de visitas: 25
   - Promedio energía: 850 kcal
   - Promedio proteínas: 35g
10. Supervisor hace clic en "Exportar a Excel"
11. Sistema genera archivo y descarga

**Postcondiciones**:
- Reporte generado
- Archivo exportado
- Datos disponibles para análisis

**Flujo Alternativo 1**: Sin resultados
- En paso 8, no hay visitas que cumplan criterios
- Sistema muestra mensaje "No se encontraron resultados"
- Supervisor ajusta filtros

**Flujo Alternativo 2**: Ver detalle de visita
- En paso 8, supervisor hace clic en una visita
- Sistema muestra detalle completo
- Supervisor puede volver al reporte

### 9.5 Caso de Uso 5: Importar Catálogo de Alimentos

**Actor**: Administrador

**Precondiciones**:
- Usuario con permisos de administrador
- Archivo JSON con formato correcto

**Flujo Principal**:

1. Administrador prepara archivo JSON con alimentos
2. Copia archivo al contenedor Docker
3. Ejecuta comando de importación:
   ```bash
   docker exec -it my-app-backend-1 python src/manage.py importar_alimentos \
     --file /app/data/alimentos.json --truncate
   ```
4. Sistema valida formato del archivo
5. Sistema elimina alimentos existentes (--truncate)
6. Sistema procesa cada alimento del JSON
7. Sistema crea registros en BD
8. Sistema muestra resumen:
   - Alimentos importados: 500
   - Errores: 0
   - Tiempo: 5.2s

**Postcondiciones**:
- Catálogo actualizado
- Alimentos disponibles para uso
- Log de importación generado

**Flujo Alternativo 1**: Error de formato
- En paso 4, archivo tiene formato incorrecto
- Sistema muestra error detallado
- Administrador corrige archivo
- Reintenta importación

**Flujo Alternativo 2**: Actualizar sin eliminar
- En paso 3, administrador omite --truncate
- Sistema actualiza alimentos existentes
- Agrega nuevos alimentos
- Mantiene alimentos no incluidos en archivo

### 9.6 Caso de Uso 6: Crear Plantilla de Plato

**Actor**: Auditor Nutricional

**Precondiciones**:
- Plato creado con ingredientes
- Usuario en detalle del plato

**Flujo Principal**:

1. Auditor revisa plato completo
2. Hace clic en "Guardar como Plantilla"
3. Sistema muestra diálogo de confirmación
4. Ingresa nombre descriptivo: "Arroz con pollo estándar"
5. Hace clic en "Guardar"
6. Sistema marca plato como plantilla
7. Sistema muestra mensaje de éxito

**Postcondiciones**:
- Plantilla creada
- Disponible para reutilizar
- Aparece en lista de plantillas

**Uso Posterior**:
1. En nueva visita, auditor crea plato
2. Selecciona "Cargar desde Plantilla"
3. Elige "Arroz con pollo estándar"
4. Sistema copia estructura completa
5. Auditor ajusta cantidades según necesidad

### 9.7 Caso de Uso 7: Consultar Dashboard

**Actor**: Supervisor / Administrador

**Precondiciones**:
- Usuario autenticado
- Existen datos en el sistema

**Flujo Principal**:

1. Usuario accede a página principal (Dashboard)
2. Sistema carga métricas en tiempo real:
   - Total instituciones: 50
   - Total visitas: 200
   - Total platos: 500
3. Sistema muestra gráfico de visitas por tipo de comida
4. Sistema muestra gráfico de visitas por mes
5. Sistema muestra ranking de instituciones más auditadas
6. Usuario puede hacer clic en cualquier métrica para ver detalle

**Postcondiciones**:
- Usuario tiene visión general del sistema
- Puede identificar tendencias
- Puede acceder a detalles específicos

**Interacciones**:
- Clic en "Total Visitas" → Lista de visitas
- Clic en institución del ranking → Detalle de institución
- Clic en mes del gráfico → Visitas de ese mes

### 9.8 Caso de Uso 8: Editar Valores Nutricionales

**Actor**: Administrador

**Precondiciones**:
- Usuario con permisos de administrador
- Alimento existe en catálogo

**Flujo Principal**:

1. Administrador accede a "Alimentos"
2. Busca alimento específico
3. Hace clic en "Editar"
4. Sistema carga formulario con datos actuales
5. Administrador modifica valores nutricionales
6. Hace clic en "Actualizar"
7. Sistema valida datos
8. Sistema guarda cambios
9. Sistema muestra mensaje de éxito

**Postcondiciones**:
- Alimento actualizado
- Nuevos valores disponibles para cálculos futuros
- Ingredientes existentes mantienen valores calculados previamente

**Nota Importante**:
Los cambios en el catálogo NO afectan ingredientes ya registrados, ya que estos tienen valores calculados guardados.

### 9.9 Caso de Uso 9: Eliminar Visita

**Actor**: Auditor / Administrador

**Precondiciones**:
- Visita existe
- Usuario tiene permisos

**Flujo Principal**:

1. Usuario accede a lista de visitas
2. Hace clic en "Eliminar" en visita específica
3. Sistema muestra diálogo de confirmación:
   "¿Eliminar esta visita? Se eliminarán también todos los platos e ingredientes asociados."
4. Usuario confirma
5. Sistema elimina visita (CASCADE)
6. Sistema elimina platos asociados
7. Sistema elimina ingredientes asociados
8. Sistema muestra mensaje de éxito
9. Sistema actualiza lista de visitas

**Postcondiciones**:
- Visita eliminada
- Platos eliminados
- Ingredientes eliminados
- Institución se mantiene

**Flujo Alternativo**: Usuario cancela
- En paso 4, usuario hace clic en "Cancelar"
- Sistema cierra diálogo
- No se elimina nada

### 9.10 Caso de Uso 10: Búsqueda Avanzada de Alimentos

**Actor**: Auditor Nutricional

**Precondiciones**:
- Usuario agregando ingrediente
- Catálogo de alimentos disponible

**Flujo Principal**:

1. Usuario ingresa texto en búsqueda: "pollo"
2. Sistema espera 500ms (debounce)
3. Sistema busca en BD:
   - Por nombre (LIKE '%pollo%')
   - Por código Argenfood
4. Sistema retorna resultados ordenados por relevancia
5. Usuario ve lista de resultados:
   - Pollo, pechuga, sin piel, cruda
   - Pollo, muslo, con piel, crudo
   - Pollo, entero, asado
   - ...
6. Usuario puede filtrar por categoría: "Carnes"
7. Sistema actualiza resultados
8. Usuario selecciona alimento deseado
9. Sistema carga datos completos del alimento

**Postcondiciones**:
- Alimento seleccionado
- Listo para especificar cantidad
- Datos nutricionales disponibles

**Optimizaciones**:
- Debounce evita peticiones excesivas
- Índice FULLTEXT acelera búsqueda
- Caché reduce carga en BD

---

## 10. ADMINISTRACIÓN

### 10.1 Panel de Administración Django

#### 10.1.1 Acceso

**URL**: http://localhost:8000/admin/

**Credenciales**: Superusuario creado con `createsuperuser`

#### 10.1.2 Modelos Registrados

1. **Nutrición**
   - Categorías de Alimentos
   - Alimentos

2. **Auditoría**
   - Instituciones
   - Visitas
   - Platos
   - Ingredientes

#### 10.1.3 Funcionalidades

- CRUD completo de todos los modelos
- Búsqueda y filtros avanzados
- Acciones en lote
- Exportar a CSV
- Historial de cambios
- Permisos granulares

### 10.2 Gestión de Usuarios

#### 10.2.1 Crear Superusuario

```bash
docker exec -it my-app-backend-1 python src/manage.py createsuperuser

# Ingresar:
# - Username
# - Email
# - Password
```

#### 10.2.2 Crear Usuario Regular

**Opción 1: Desde Django Admin**
1. Acceder a /admin/
2. Auth → Users → Add User
3. Completar datos
4. Asignar grupos/permisos
5. Guardar

**Opción 2: Desde API**
```bash
POST /api/auth/register/
Body:
{
  "username": "auditor1",
  "email": "auditor1@example.com",
  "password": "password123",
  "first_name": "Juan",
  "last_name": "Pérez"
}
```

#### 10.2.3 Grupos y Permisos

**Grupos sugeridos**:

1. **Auditores**
   - Ver instituciones
   - Crear/editar/eliminar visitas propias
   - Ver alimentos
   - Crear/editar platos e ingredientes

2. **Supervisores**
   - Ver todo
   - Generar reportes
   - Exportar datos
   - No puede modificar

3. **Administradores**
   - Acceso total
   - Gestionar usuarios
   - Modificar catálogo
   - Configuración del sistema

### 10.3 Backup y Restauración

#### 10.3.1 Backup de Base de Datos

```bash
# Backup completo
docker exec my-app-db-1 mysqldump -u root -proot auditoria_db > backup_$(date +%Y%m%d).sql

# Backup solo estructura
docker exec my-app-db-1 mysqldump -u root -proot --no-data auditoria_db > estructura.sql

# Backup solo datos
docker exec my-app-db-1 mysqldump -u root -proot --no-create-info auditoria_db > datos.sql
```

#### 10.3.2 Restaurar Base de Datos

```bash
# Restaurar desde backup
docker exec -i my-app-db-1 mysql -u root -proot auditoria_db < backup_20250114.sql

# Restaurar tabla específica
docker exec -i my-app-db-1 mysql -u root -proot auditoria_db < tabla_backup.sql
```

#### 10.3.3 Backup Automático

**Script de backup automático**:

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="auditoria_backup_$DATE.sql"

# Crear backup
docker exec my-app-db-1 mysqldump -u root -proot auditoria_db > "$BACKUP_DIR/$FILENAME"

# Comprimir
gzip "$BACKUP_DIR/$FILENAME"

# Eliminar backups antiguos (más de 30 días)
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete

echo "Backup completado: $FILENAME.gz"
```

**Programar con cron**:
```bash
# Ejecutar diariamente a las 2 AM
0 2 * * * /path/to/backup.sh
```

### 10.4 Monitoreo y Logs

#### 10.4.1 Ver Logs

```bash
# Logs de todos los servicios
docker-compose logs -f

# Logs del backend
docker-compose logs -f backend

# Logs de la base de datos
docker-compose logs -f db

# Logs del frontend
docker-compose logs -f frontend

# Últimas 100 líneas
docker-compose logs --tail=100 backend
```

#### 10.4.2 Logs de Django

**Ubicación**: `/app/logs/` dentro del contenedor

**Configuración** (`settings.py`):
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': '/app/logs/django.log',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

#### 10.4.3 Métricas de Performance

**Queries lentas**:
```python
# settings.py
LOGGING['loggers']['django.db.backends'] = {
    'handlers': ['console'],
    'level': 'DEBUG',
}
```

**Tiempo de respuesta**:
```python
# middleware personalizado
class PerformanceMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        start_time = time.time()
        response = self.get_response(request)
        duration = time.time() - start_time
        
        if duration > 1.0:  # Más de 1 segundo
            logger.warning(f"Slow request: {request.path} took {duration:.2f}s")
        
        return response
```

### 10.5 Mantenimiento

#### 10.5.1 Limpiar Datos Antiguos

```python
# management/commands/limpiar_datos_antiguos.py
from django.core.management.base import BaseCommand
from datetime import datetime, timedelta
from auditoria.models import Visita

class Command(BaseCommand):
    help = 'Elimina visitas antiguas'
    
    def add_arguments(self, parser):
        parser.add_argument('--days', type=int, default=365)
    
    def handle(self, *args, **options):
        days = options['days']
        fecha_limite = datetime.now() - timedelta(days=days)
        
        visitas = Visita.objects.filter(fecha__lt=fecha_limite)
        count = visitas.count()
        visitas.delete()
        
        self.stdout.write(f"Eliminadas {count} visitas antiguas")
```

**Uso**:
```bash
docker exec -it my-app-backend-1 python src/manage.py limpiar_datos_antiguos --days=730
```

#### 10.5.2 Optimizar Base de Datos

```sql
-- Analizar tablas
ANALYZE TABLE nutricion_alimento;
ANALYZE TABLE auditoria_visita;
ANALYZE TABLE auditoria_plato;
ANALYZE TABLE auditoria_ingrediente;

-- Optimizar tablas
OPTIMIZE TABLE nutricion_alimento;
OPTIMIZE TABLE auditoria_visita;
OPTIMIZE TABLE auditoria_plato;
OPTIMIZE TABLE auditoria_ingrediente;

-- Ver estadísticas de índices
SHOW INDEX FROM nutricion_alimento;
```

#### 10.5.3 Actualizar Sistema

```bash
# 1. Backup de base de datos
docker exec my-app-db-1 mysqldump -u root -proot auditoria_db > backup_pre_update.sql

# 2. Detener servicios
docker-compose down

# 3. Actualizar código (git pull, etc.)
git pull origin main

# 4. Reconstruir imágenes
docker-compose build

# 5. Aplicar migraciones
docker-compose up -d db
docker exec -it my-app-backend-1 python src/manage.py migrate

# 6. Iniciar todos los servicios
docker-compose up -d

# 7. Verificar logs
docker-compose logs -f
```

### 10.6 Solución de Problemas

#### 10.6.1 Error de Conexión a Base de Datos

**Síntoma**: `OperationalError: (2003, "Can't connect to MySQL server")`

**Solución**:
```bash
# Verificar que MySQL está corriendo
docker-compose ps

# Reiniciar servicio de BD
docker-compose restart db

# Verificar logs
docker-compose logs db

# Verificar variables de entorno
docker exec my-app-backend-1 env | grep DB
```

#### 10.6.2 Migraciones Pendientes

**Síntoma**: `You have X unapplied migration(s)`

**Solución**:
```bash
# Ver migraciones pendientes
docker exec -it my-app-backend-1 python src/manage.py showmigrations

# Aplicar migraciones
docker exec -it my-app-backend-1 python src/manage.py migrate

# Si hay conflictos, hacer merge
docker exec -it my-app-backend-1 python src/manage.py makemigrations --merge
```

#### 10.6.3 Puerto en Uso

**Síntoma**: `Error starting userland proxy: listen tcp 0.0.0.0:3001: bind: address already in use`

**Solución**:
```bash
# Windows: Ver qué proceso usa el puerto
netstat -ano | findstr :3001

# Matar proceso
taskkill /PID <PID> /F

# O cambiar puerto en docker-compose.yml
ports:
  - "3002:3000"  # Usar 3002 en lugar de 3001
```

#### 10.6.4 Contenedor No Inicia

**Síntoma**: Contenedor se detiene inmediatamente

**Solución**:
```bash
# Ver logs del contenedor
docker logs my-app-backend-1

# Ver últimos logs antes de crash
docker logs --tail=50 my-app-backend-1

# Iniciar en modo interactivo para debug
docker run -it --rm my-app-backend-1 /bin/bash
```

#### 10.6.5 Problemas de Performance

**Síntoma**: Respuestas lentas

**Diagnóstico**:
```bash
# Ver queries lentas en MySQL
docker exec -it my-app-db-1 mysql -u root -proot -e "
  SELECT * FROM information_schema.processlist 
  WHERE command != 'Sleep' 
  ORDER BY time DESC;
"

# Habilitar query log
docker exec -it my-app-db-1 mysql -u root -proot -e "
  SET GLOBAL slow_query_log = 'ON';
  SET GLOBAL long_query_time = 1;
"
```

**Solución**:
- Revisar índices faltantes
- Optimizar queries N+1
- Implementar caché
- Aumentar recursos del contenedor

---

## 11. SEGURIDAD

### 11.1 Autenticación

- JWT con expiración configurable
- Refresh tokens
- Logout invalida tokens
- Passwords hasheados con bcrypt

### 11.2 Autorización

- Permisos basados en roles
- Validación en backend
- Protección de endpoints sensibles
- CORS configurado

### 11.3 Validación de Datos

- Validación en frontend y backend
- Sanitización de inputs
- Protección contra SQL injection (ORM)
- Protección contra XSS

### 11.4 Buenas Prácticas

- Variables de entorno para secretos
- HTTPS en producción
- Rate limiting en API
- Logs de auditoría
- Backups regulares

---

## 12. DESPLIEGUE EN PRODUCCIÓN

### 12.1 Checklist Pre-Producción

- [ ] Cambiar SECRET_KEY de Django
- [ ] Configurar DEBUG = False
- [ ] Configurar ALLOWED_HOSTS
- [ ] Configurar base de datos de producción
- [ ] Configurar HTTPS/SSL
- [ ] Configurar dominio
- [ ] Configurar email (SMTP)
- [ ] Configurar backups automáticos
- [ ] Configurar monitoreo
- [ ] Configurar logs centralizados
- [ ] Revisar permisos de archivos
- [ ] Configurar firewall
- [ ] Documentar procedimientos

### 12.2 Variables de Entorno Producción

```env
# Django
SECRET_KEY=<generar-clave-segura>
DEBUG=False
ALLOWED_HOSTS=tudominio.com,www.tudominio.com

# Base de Datos
DB_HOST=db-produccion.example.com
DB_PORT=3306
DB_NAME=auditoria_prod
DB_USER=auditoria_user
DB_PASSWORD=<password-seguro>

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=sistema@tudominio.com
EMAIL_HOST_PASSWORD=<password-email>

# Seguridad
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### 12.3 Nginx como Reverse Proxy

```nginx
server {
    listen 80;
    server_name tudominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tudominio.com;
    
    ssl_certificate /etc/ssl/certs/tudominio.crt;
    ssl_certificate_key /etc/ssl/private/tudominio.key;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Static files
    location /static/ {
        alias /var/www/auditoria/static/;
    }
    
    # Media files
    location /media/ {
        alias /var/www/auditoria/media/;
    }
}
```

---

## 13. CONCLUSIÓN

Este manual cubre todas las funcionalidades del Sistema de Auditoría Nutricional, desde la arquitectura técnica hasta los casos de uso prácticos. El sistema está diseñado para ser:

- **Completo**: Cubre todo el flujo de auditoría nutricional
- **Eficiente**: Optimizado con índices y caché
- **Escalable**: Arquitectura modular y desacoplada
- **Mantenible**: Código limpio y documentado
- **Seguro**: Autenticación, autorización y validación
- **Usable**: Interfaz intuitiva y responsive

Para soporte adicional, consultar:
- [README.md](README.md) - Inicio rápido
- [ARQUITECTURA.md](ARQUITECTURA.md) - Detalles técnicos
- Código fuente con comentarios
- Logs del sistema

**Versión del Manual**: 1.0  
**Fecha**: Enero 2025  
**Sistema**: Auditoría Nutricional v2.0
