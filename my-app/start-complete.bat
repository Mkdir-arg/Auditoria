@echo off
echo 🚀 Iniciando Sistema Completo de Auditoría + Logging...
echo.

echo 📊 1. Levantando aplicación principal...
docker-compose up -d

echo.
echo 📈 2. Levantando stack de observabilidad...
docker-compose -f docker-compose.logging.yml up -d

echo.
echo ⏳ 3. Esperando que los servicios estén listos...
timeout /t 30 /nobreak > nul

echo.
echo ✅ Sistema completo iniciado!
echo.
echo 🔗 URLs de la aplicación:
echo   🌐 Frontend:             http://localhost:3001
echo   🔧 Backend API:          http://localhost:8000/api/
echo   👤 Django Admin:         http://localhost:8000/admin/
echo.
echo 📊 URLs de observabilidad:
echo   📈 Kibana (Logs):        http://localhost:5601
echo   📊 Grafana (Métricas):   http://localhost:3002 (admin/admin123)
echo   🔍 Jaeger (Tracing):     http://localhost:16686
echo   ⚡ Prometheus:           http://localhost:9090
echo   🔎 Elasticsearch:        http://localhost:9200
echo.
echo 📝 Para ver logs en tiempo real:
echo   docker-compose logs -f
echo   docker-compose -f docker-compose.logging.yml logs -f
echo.
pause