# Dockerfile para el Servicio de IA de EcoGuard
FROM python:3.11-slim

# Establecer directorio de trabajo
WORKDIR /app

# Copiar requirements
COPY requirements.txt .

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código de la aplicación
COPY main.py .
COPY train_model.py .
COPY check_model.py .
COPY test_db.py .

# Copiar modelos pre-entrenados (si existen)
COPY models/ ./models/

# Exponer puerto
EXPOSE 8001

# Variable de entorno para Python
ENV PYTHONUNBUFFERED=1

# Comando para iniciar la aplicación
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]
