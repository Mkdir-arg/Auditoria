#!/bin/bash

echo "🔍 Verificando Docker Setup..."
echo ""

# Verificar Docker
echo "1️⃣ Verificando Docker..."
if command -v docker &> /dev/null; then
    echo "✅ Docker instalado: $(docker --version)"
else
    echo "❌ Docker no encontrado"
    exit 1
fi

# Verificar Docker Compose
echo ""
echo "2️⃣ Verificando Docker Compose..."
if command -v docker-compose &> /dev/null; then
    echo "✅ Docker Compose instalado: $(docker-compose --version)"
else
    echo "❌ Docker Compose no encontrado"
    exit 1
fi

# Verificar archivo .env
echo ""
echo "3️⃣ Verificando archivo .env..."
if [ -f ".env" ]; then
    echo "✅ Archivo .env existe"
else
    echo "⚠️  Archivo .env no encontrado, copiando desde .env.example..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
fi

# Verificar puertos
echo ""
echo "4️⃣ Verificando puertos disponibles..."

check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "⚠️  Puerto $1 en uso"
        return 1
    else
        echo "✅ Puerto $1 disponible"
        return 0
    fi
}

check_port 3308
check_port 8000
check_port 3001

# Verificar servicios corriendo
echo ""
echo "5️⃣ Verificando servicios Docker..."
if docker-compose ps | grep -q "Up"; then
    echo "✅ Servicios corriendo:"
    docker-compose ps
else
    echo "⚠️  No hay servicios corriendo"
    echo "   Ejecuta: docker-compose up -d"
fi

echo ""
echo "✅ Verificación completada"
echo ""
echo "📝 Próximos pasos:"
echo "   1. docker-compose up -d"
echo "   2. docker-compose logs -f"
echo "   3. Acceder a http://localhost:3001"
