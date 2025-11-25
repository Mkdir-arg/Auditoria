@echo off
echo Importando todos los alimentos desde /app/data/
echo ==================================================

REM Limpiar base de datos en la primera importacion
docker exec -it my-app-backend-1 python src/manage.py importar_alimentos --file /app/data/cereales.json --truncate

REM Importar el resto sin truncate
docker exec -it my-app-backend-1 python src/manage.py importar_alimentos --file /app/data/fruta.json

docker exec -it my-app-backend-1 python src/manage.py importar_alimentos --file /app/data/vegetales.json

docker exec -it my-app-backend-1 python src/manage.py importar_alimentos --file "/app/data/GRASASyACEITES.json"

docker exec -it my-app-backend-1 python src/manage.py importar_alimentos --file "/app/data/PESCADOS MARISCOS Y CONSERVAS.json"

echo.
echo Importacion completada
pause
