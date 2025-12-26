FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# instalar dependencias
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copiar backend
COPY backend/ backend/

# copiar entrypoint y wait-db
COPY entrypoint.sh .
COPY wait-db.py .

ENV PYTHONPATH=/app/backend/src

RUN chmod +x entrypoint.sh
RUN chmod +x wait-db.py

EXPOSE 8000

CMD ["./entrypoint.sh"]
