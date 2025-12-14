# 🔍 Sistema de Logging y Observabilidad

## 🎯 Stack Implementado

### **ELK Stack + OpenTelemetry + Jaeger**
- **Elasticsearch**: Almacenamiento de logs
- **Logstash**: Procesamiento de logs
- **Kibana**: Visualización de logs
- **Jaeger**: Distributed tracing
- **Prometheus**: Métricas de sistema
- **Grafana**: Dashboards de métricas
- **Filebeat**: Recolección de logs

## 🚀 Inicio Rápido

### 1. Levantar Stack de Logging
```bash
# Opción 1: Script automático
start-logging.bat

# Opción 2: Manual
docker-compose -f docker-compose.logging.yml up -d
```

### 2. URLs de Acceso
- **📈 Kibana (Logs)**: http://localhost:5601
- **📊 Grafana (Métricas)**: http://localhost:3002 (admin/admin123)
- **🔍 Jaeger (Tracing)**: http://localhost:16686
- **⚡ Prometheus**: http://localhost:9090
- **🔎 Elasticsearch**: http://localhost:9200

## 📊 Configuración Backend

### 1. Instalar Dependencias
```bash
docker exec my-app-backend-1 pip install -r requirements.txt
```

### 2. Actualizar settings.py
```python
# Agregar al final de settings.py
from .logging_config import setup_logging, LOGGING_CONFIG

# Configurar logging
setup_logging()
LOGGING = LOGGING_CONFIG

# Agregar middleware
MIDDLEWARE = [
    'config.middleware.LoggingMiddleware',
    'config.middleware.TransactionLoggingMiddleware',
    # ... resto de middleware
]

# Métricas de Prometheus
INSTALLED_APPS += ['django_prometheus']
MIDDLEWARE = ['django_prometheus.middleware.PrometheusBeforeMiddleware'] + MIDDLEWARE
MIDDLEWARE += ['django_prometheus.middleware.PrometheusAfterMiddleware']
```

## 🎯 Tipos de Logs Capturados

### **Backend (Django)**
- ✅ **Requests/Responses** con timing
- ✅ **Errores y excepciones** con stack trace
- ✅ **Transacciones de negocio** (CRUD operaciones)
- ✅ **Queries de base de datos** con performance
- ✅ **Autenticación y autorización**
- ✅ **Distributed tracing** con correlation IDs

### **Frontend (React)**
- ✅ **Errores de JavaScript** con stack trace
- ✅ **Interacciones de usuario** (clicks, navegación)
- ✅ **Llamadas a API** con timing
- ✅ **Performance metrics** (load times)
- ✅ **User journey tracking**

### **Sistema**
- ✅ **Logs de contenedores Docker**
- ✅ **Métricas de CPU/Memoria/Disco**
- ✅ **Network traffic**
- ✅ **Health checks**

## 📈 Dashboards Disponibles

### **Kibana - Análisis de Logs**
1. **Dashboard Principal**: Overview de todos los logs
2. **Errores**: Filtro por errores y excepciones
3. **Performance**: Análisis de tiempos de respuesta
4. **Usuarios**: Actividad por usuario
5. **Transacciones**: Operaciones de auditoría

### **Grafana - Métricas de Sistema**
1. **Sistema**: CPU, RAM, Disco, Network
2. **Django**: Requests/sec, Response times, Errors
3. **Base de Datos**: Queries, Connections, Performance
4. **Docker**: Contenedores, Recursos

### **Jaeger - Distributed Tracing**
1. **Request Flow**: Seguimiento completo de requests
2. **Performance**: Identificación de cuellos de botella
3. **Dependencies**: Mapa de dependencias entre servicios
4. **Errors**: Traces con errores

## 🔧 Uso Práctico

### **Logging en Código**
```python
# Backend - Django
import structlog
logger = structlog.get_logger(__name__)

# Log de transacción
logger.info("Institución creada", 
    institucion_id=institucion.id,
    user=request.user.username,
    correlation_id=request.correlation_id
)

# Log de error
logger.error("Error al crear institución",
    error=str(e),
    correlation_id=request.correlation_id,
    exc_info=True
)
```

```javascript
// Frontend - React
import Logger from './logger';

// Log de transacción
Logger.transaction('crear_institucion', {
  institucionId: response.data.id,
  userId: user.id
});

// Log de error
Logger.error('Error en API call', error);
```

### **Búsquedas en Kibana**
```
# Errores de los últimos 15 minutos
level:ERROR AND @timestamp:[now-15m TO now]

# Transacciones de un usuario específico
user:"admin" AND transaction_type:crear_institucion

# Requests lentos (>2 segundos)
duration_ms:>2000

# Errores por correlation ID
correlation_id:"abc-123-def" AND level:ERROR
```

## 🚨 Alertas Configuradas

### **Automáticas**
- ✅ **Error Rate > 5%** en 5 minutos
- ✅ **Response Time > 2s** promedio en 5 minutos
- ✅ **CPU > 80%** por 10 minutos
- ✅ **Memoria > 90%** por 5 minutos
- ✅ **Disco > 85%** 
- ✅ **Contenedor Down** inmediato

### **Notificaciones**
- 📧 **Email** para errores críticos
- 💬 **Slack** para alertas de performance
- 📱 **SMS** para servicios down

## 🔍 Troubleshooting

### **Problemas Comunes**
```bash
# Ver logs del stack
docker-compose -f docker-compose.logging.yml logs -f

# Reiniciar servicios
docker-compose -f docker-compose.logging.yml restart

# Verificar salud de Elasticsearch
curl http://localhost:9200/_cluster/health

# Verificar índices
curl http://localhost:9200/_cat/indices
```

### **Performance**
- **Elasticsearch**: Requiere mínimo 2GB RAM
- **Logstash**: Procesa ~1000 logs/segundo
- **Retención**: 30 días por defecto
- **Espacio**: ~100MB/día para aplicación mediana

## 📚 Recursos Adicionales

- **Kibana Query DSL**: https://www.elastic.co/guide/en/kibana/current/kuery-query.html
- **Grafana Dashboards**: https://grafana.com/grafana/dashboards/
- **OpenTelemetry**: https://opentelemetry.io/docs/
- **Jaeger**: https://www.jaegertracing.io/docs/

---

## 🎉 ¡Sistema de Observabilidad Completo!

**Ahora tienes visibilidad total de:**
- 📊 **Logs** en tiempo real
- 📈 **Métricas** de performance  
- 🔍 **Tracing** distribuido
- 🚨 **Alertas** proactivas
- 📱 **Dashboards** interactivos