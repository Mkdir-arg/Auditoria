@echo off
echo 🚀 Iniciando Stack de Logging ELK + OpenTelemetry...
echo.

echo 📊 Levantando servicios de observabilidad...
docker-compose -f docker-compose.logging.yml up -d

echo.
echo ✅ Stack de logging iniciado correctamente!
echo.
echo 🔗 URLs de acceso:
echo   📈 Kibana (Logs):        http://localhost:5601
echo   📊 Grafana (Métricas):   http://localhost:3002 (admin/admin123)
echo   🔍 Jaeger (Tracing):     http://localhost:16686
echo   ⚡ Prometheus:           http://localhost:9090
echo   🔎 Elasticsearch:        http://localhost:9200
echo.
echo 📝 Para ver logs en tiempo real:
echo   docker-compose -f docker-compose.logging.yml logs -f
echo.
pause