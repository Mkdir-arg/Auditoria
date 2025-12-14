# Configuración de logging al final de settings.py
import os
from .logging_config import setup_logging, LOGGING_CONFIG

# Configurar OpenTelemetry y logging estructurado
setup_logging()

# Configuración de logging para Django
LOGGING = LOGGING_CONFIG

# Crear directorio de logs si no existe
os.makedirs('/app/logs', exist_ok=True)

# Configuración de métricas Prometheus
PROMETHEUS_METRICS_EXPORT_PORT = 8001
PROMETHEUS_METRICS_EXPORT_ADDRESS = '0.0.0.0'

# URLs de métricas
PROMETHEUS_EXPORT_MIGRATIONS = True