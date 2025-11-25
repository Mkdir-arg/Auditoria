#!/bin/bash

echo "🍽️  Importando todos los alimentos desde /app/data/"
echo "=================================================="

# Limpiar base de datos en la primera importación
docker exec -it my-app-backend-1 python src/manage.py importar_alimentos \
  --file /app/data/cereales.json --truncate

# Importar el resto sin truncate
docker exec -it my-app-backend-1 python src/manage.py importar_alimentos \
  --file /app/data/fruta.json

docker exec -it my-app-backend-1 python src/manage.py importar_alimentos \
  --file /app/data/vegetales.json

docker exec -it my-app-backend-1 python src/manage.py importar_alimentos \
  --file "/app/data/GRASASyACEITES.json"

docker exec -it my-app-backend-1 python src/manage.py importar_alimentos \
  --file "/app/data/PESCADOS MARISCOS Y CONSERVAS.json"

echo ""
echo "✅ Importación completada"
