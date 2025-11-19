@echo off
echo ========================================
echo   VERIFICACION DE DOCKER COMPOSE
echo ========================================
echo.

echo [1/5] Verificando servicios corriendo...
docker-compose ps
echo.

echo [2/5] Estado de salud de los contenedores...
docker ps --filter "name=my-app" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo.

echo [3/5] Ultimas 20 lineas de logs del BACKEND...
echo ----------------------------------------
docker-compose logs --tail=20 backend
echo.

echo [4/5] Ultimas 20 lineas de logs del FRONTEND...
echo ----------------------------------------
docker-compose logs --tail=20 web
echo.

echo [5/5] Ultimas 10 lineas de logs de MYSQL...
echo ----------------------------------------
docker-compose logs --tail=10 db
echo.

echo ========================================
echo   PRUEBAS DE CONECTIVIDAD
echo ========================================
echo.

echo Probando Backend API...
curl -s http://localhost:8000/api/ >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend responde en http://localhost:8000/api/
) else (
    echo [ERROR] Backend NO responde
)
echo.

echo Probando Frontend...
curl -s http://localhost:3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend responde en http://localhost:3001
) else (
    echo [ERROR] Frontend NO responde
)
echo.

echo ========================================
echo   RESUMEN
echo ========================================
echo.
echo URLs de acceso:
echo   - Frontend: http://localhost:3001
echo   - Backend:  http://localhost:8000/api/
echo   - Admin:    http://localhost:8000/admin/
echo.
echo Para ver logs en tiempo real:
echo   docker-compose logs -f
echo.
echo Para ver logs de un servicio especifico:
echo   docker-compose logs -f backend
echo   docker-compose logs -f web
echo   docker-compose logs -f db
echo.

pause
