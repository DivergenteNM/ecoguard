# 🌿 EcoGuard - Sistema Inteligente de Análisis y Predicción de Amenazas Ambientales

<div align="center">

![Status](https://img.shields.io/badge/status-Active-success?style=for-the-badge)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?style=for-the-badge&logo=postgresql)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi)

**Sistema completo de análisis geoespacial, monitoreo y predicción de amenazas ambientales para el departamento de Nariño, Colombia**

[Características](#-características-principales) • [Instalación](#-instalación-rápida) • [Arquitectura](#-arquitectura-del-sistema) • [API](#-api-rest)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción-del-proyecto)
- [Características](#-características-principales)
- [Requisitos](#-requisitos-previos)
- [Instalación Rápida](#-instalación-rápida)
- [Configuración de Entorno](#-configuración-de-entorno)
- [Arquitectura](#-arquitectura-del-sistema)
- [Fuentes de Datos](#-fuentes-de-datos)
- [API REST](#-api-rest)
- [Modelo de IA](#-modelo-de-ia)
- [Frontend](#-frontend-dashboard)
- [Desarrollo](#-desarrollo)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Descripción del Proyecto

**EcoGuard** es una plataforma integral de análisis geoespacial y predicción de amenazas ambientales diseñada específicamente para el departamento de Nariño, Colombia. El sistema integra múltiples fuentes de datos gubernamentales y satelitales para proporcionar análisis en tiempo real, visualizaciones interactivas y predicciones de riesgos naturales basadas en inteligencia artificial.

### Problemática que Resuelve

Nariño es una región altamente vulnerable a desastres naturales (deslizamientos, inundaciones, sismos) debido a:
- Topografía montañosa y compleja
- Alta precipitación anual
- Crecimiento urbano no planificado
- Cambio climático

EcoGuard centraliza datos históricos, análisis satelital y modelos predictivos para apoyar la toma de decisiones en gestión de riesgos.

---

## ✨ Características Principales

### 🌐 Frontend Interactivo (Next.js 14)
- **Dashboard principal** con estadísticas en tiempo real
- **Mapa interactivo** con Leaflet mostrando fenómenos y zonas de riesgo
- **Sistema de alertas inteligente** con predicciones de IA
- **Filtros avanzados** por municipio, tipo de fenómeno, fecha
- **Gráficos dinámicos** de series temporales y distribuciones
- **Interfaz responsive** optimizada para móviles y tablets
- **Modo oscuro** y temas personalizables

### 🗺️ Análisis Geoespacial
- **64 municipios** con geometrías precisas (MultiPolygon) y datos demográficos
- **356+ fenómenos naturales** georeferenciados (deslizamientos, inundaciones, sismos, etc.)
- **24 zonas de amenaza** clasificadas por nivel de riesgo (SGC) con geometrías detalladas
- **5 estaciones meteorológicas** activas con datos históricos (IDEAM)
- **Búsqueda espacial** por radio, bounding box y municipio
- **Heatmaps** de densidad de eventos

### 🛰️ Datos Satelitales
- **NDVI (Índice de Vegetación)** desde Google Earth Engine (MODIS MOD13Q1)
- **Resolución**: 250 metros
- **Análisis temporal**: Cobertura vegetal 2024 (expandible a años anteriores)
- **Series temporales** de cambios en vegetación
- **Detección de deforestación** y cambios en uso del suelo

### 🤖 Inteligencia Artificial
- **Modelo Random Forest** optimizado con 200 árboles de decisión
- **8 features geoespaciales** cuidadosamente seleccionadas
- **356 eventos históricos** de entrenamiento (UNGRD 2012-2025)
- **3 categorías de predicción**: Deslizamiento, Inundación, Otro
- **64% de accuracy** en conjunto de prueba con validación cruzada
- **API REST** para predicciones en tiempo real
- **Explicabilidad** con importancia de features

### 📊 API REST Completa
- **30+ endpoints** documentados con Swagger/OpenAPI 3.0
- **Paginación automática** en todas las consultas
- **Respuestas GeoJSON** para integración con mapas
- **Estadísticas agregadas** y series temporales
- **Búsquedas avanzadas** con múltiples filtros
- **CORS habilitado** para integraciones externas

---

## 🔧 Requisitos Previos

### Software Obligatorio
- **Docker Desktop** 20.10+ ([Descargar](https://www.docker.com/products/docker-desktop))
- **Docker Compose** 2.0+ (incluido en Docker Desktop)
- **Python** 3.11+ ([Descargar](https://www.python.org/downloads/))
- **Node.js** 18+ LTS ([Descargar](https://nodejs.org/))
- **Git** 2.30+ ([Descargar](https://git-scm.com/downloads))

### Recursos Mínimos Recomendados
- **RAM**: 8 GB (16 GB recomendado)
- **Disco**: 10 GB de espacio libre
- **CPU**: 4 cores
- **SO**: Windows 10/11, macOS 11+, Linux (Ubuntu 20.04+)

### Verificación de Requisitos
```powershell
# Verificar versiones instaladas
docker --version
docker-compose --version
python --version
node --version
git --version
```

---

## 🚀 Instalación Rápida

### Opción 1: Setup Automático con Script Maestro (⭐ Recomendado)

El script maestro automatiza todo el proceso de configuración:

```powershell
# Clonar el repositorio
git clone https://github.com/DivergenteNM/ecoguard.git
cd ecoguard

# Dar permisos de ejecución al script (PowerShell)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process

# Ejecutar setup completo
.\setup.ps1
```

**El script automáticamente:**
1. ✅ Verifica requisitos del sistema
2. ✅ Elimina contenedores/volúmenes anteriores
3. ✅ Crea contenedor PostgreSQL + PostGIS
4. ✅ Ejecuta todos los scripts SQL de inicialización
5. ✅ Instala dependencias Python
6. ✅ Extrae datos desde fuentes externas (opcional)
7. ✅ Transforma y limpia datos
8. ✅ Carga datos a PostgreSQL
9. ✅ Valida integridad de datos

**Opciones del script:**
```powershell
# Omitir extracción de datos (usar archivos existentes)
.\setup.ps1 -SkipExtraction

# Omitir creación de contenedores (si ya existen)
.\setup.ps1 -SkipDocker

# Modo verbose para debugging
.\setup.ps1 -Verbose
```

**⏱️ Tiempo estimado:** 5-10 minutos

---

## 🔐 Configuración de Entorno

Antes de iniciar los servicios, debes crear los archivos de configuración necesarios:

### 1. Backend - Archivo `.env.development`

Crear en `backend/.env.development`:

```env
# ============================================
# DATABASE CONFIGURATION
# ============================================
DB_HOST=localhost
DB_PORT=5435
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecoguard

# ============================================
# AI SERVICE CONFIGURATION
# ============================================
AI_SERVICE_URL=http://localhost:8001
AI_SERVICE_TIMEOUT=5000

# ============================================
# APPLICATION CONFIGURATION
# ============================================
PORT=3000
NODE_ENV=development

# ============================================
# CORS CONFIGURATION
# ============================================
CORS_ORIGIN=http://localhost:3001
CORS_CREDENTIALS=true

# ============================================
# API CONFIGURATION
# ============================================
API_PREFIX=api
SWAGGER_ENABLED=true
SWAGGER_PATH=api

# ============================================
# LOGGING
# ============================================
LOG_LEVEL=debug
```

### 2. ETL - Archivo `db_config.env`

Crear en `etl/db_config.env`:

```env
# ============================================
# POSTGRESQL CONFIGURATION
# ============================================
DB_HOST=localhost
DB_PORT=5435
DB_NAME=ecoguard
DB_USER=postgres
DB_PASSWORD=postgres

# ============================================
# GOOGLE EARTH ENGINE (Opcional)
# ============================================
# GEE_SERVICE_ACCOUNT=your-service-account@project.iam.gserviceaccount.com
# GEE_PRIVATE_KEY_PATH=path/to/private-key.json
```

### 3. Frontend - Archivo `.env.local`

Crear en `frontend/.env.local`:

```env
# ============================================
# BACKEND API CONFIGURATION
# ============================================
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_API_TIMEOUT=10000

# ============================================
# MAP CONFIGURATION
# ============================================
NEXT_PUBLIC_MAP_CENTER_LAT=1.2
NEXT_PUBLIC_MAP_CENTER_LNG=-77.3
NEXT_PUBLIC_MAP_DEFAULT_ZOOM=8

# ============================================
# APPLICATION CONFIGURATION
# ============================================
NEXT_PUBLIC_APP_NAME=EcoGuard
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 4. AI Service - Archivo `.env`

Crear en `ai-service/.env`:

```env
# ============================================
# AI SERVICE CONFIGURATION
# ============================================
HOST=0.0.0.0
PORT=8001
DEBUG=False

# ============================================
# MODEL CONFIGURATION
# ============================================
MODEL_PATH=models/model_riesgo.pkl
ENCODER_PATH=models/label_encoder.pkl
ZONA_ENCODER_PATH=models/zona_encoder.pkl
METADATA_PATH=models/metadata.pkl
```

### 5. Docker Compose - Variables de Entorno (Opcional)

Las variables para Docker están en `docker-compose.yml`. Si necesitas personalizarlas, crea un archivo `.env` en la raíz:

```env
# ============================================
# POSTGRESQL DOCKER CONFIGURATION
# ============================================
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ecoguard
POSTGRES_PORT=5435

# ============================================
# AI SERVICE DOCKER CONFIGURATION
# ============================================
AI_SERVICE_PORT=8001
```

### ⚠️ Importante

- **NO** subas estos archivos a Git (ya están en `.gitignore`)
- Para producción, usa variables de entorno del sistema o servicios como AWS Secrets Manager
- Cambia las contraseñas por defecto en entornos productivos
- El script `setup.ps1` puede crear automáticamente algunos de estos archivos

---

### Opción 2: Setup Manual Paso a Paso

<details>
<summary><b>📖 Expandir para ver instrucciones manuales</b></summary>

#### 1. Iniciar Base de Datos

```powershell
# Iniciar PostgreSQL con PostGIS
docker-compose up -d postgres

# Esperar a que esté listo (30-60 segundos)
docker logs -f ecoguard_postgres
# Presionar Ctrl+C cuando veas "database system is ready to accept connections"
```

#### 2. Ejecutar Scripts SQL

```powershell
# Script de inicialización
docker exec -i ecoguard_postgres psql -U postgres -d ecoguard < database/init/01_init.sql

# Agregar columnas de población
docker exec -i ecoguard_postgres psql -U postgres -d ecoguard < database/scripts/02_add_population.sql

# Crear tabla de amenazas
docker exec -i ecoguard_postgres psql -U postgres -d ecoguard < database/scripts/03_create_amenazas_table.sql

# Crear tabla NDVI
docker exec -i ecoguard_postgres psql -U postgres -d ecoguard < database/scripts/05_create_ndvi_table.sql
```

#### 3. Instalar Dependencias Python

```powershell
cd etl
python -m pip install -r requirements.txt
cd ..
```

#### 4. Extracción de Datos (Opcional)

```powershell
# Estaciones meteorológicas
python etl/extractors/estaciones_extractor.py

# Fenómenos naturales
python etl/extractors/fenomenos_extractor.py

# Zonas de amenaza
python etl/extractors/amenazas_sgc_extractor.py
```

#### 5. Transformación de Datos

```powershell
# Limpiar estaciones
python etl/transformers/estaciones_transformer.py

# Limpiar fenómenos
python etl/transformers/fenomenos_transformer.py
```

#### 6. Carga de Datos

```powershell
# Cargar municipios
python etl/loaders/municipios_loader.py

# Cargar estaciones
python etl/loaders/estaciones_loader.py

# Cargar fenómenos
python etl/loaders/fenomenos_loader.py

# Actualizar población
python etl/loaders/add_population.py

# Cargar amenazas
python etl/loaders/amenazas_loader.py

# Cargar NDVI
python etl/loaders/ndvi_loader.py
```

</details>

---

### Post-Instalación: Iniciar Servicios

#### 1. Servicio de IA (FastAPI)

```powershell
# Iniciar contenedor de IA
docker-compose up -d ai-service

# Verificar logs
docker logs -f ecoguard_ai_service

# Probar endpoint
curl http://localhost:8001/info
```

**Salida esperada:**
```json
{
  "status": "online",
  "service": "EcoGuard AI",
  "version": "3.0 - Optimized with Class Grouping",
  "model_loaded": true,
  "features": 8,
  "classes": 3,
  "accuracy_test": "63.89%",
  "accuracy_cv": "48.05%"
}
```

#### 2. Backend (NestJS)

```powershell
cd backend

# Instalar dependencias
npm install

# Crear archivo de configuración (si no existe)
# Copiar el contenido de la sección "Configuración de Entorno"
notepad .env.development

# Iniciar en modo desarrollo
npm run start:dev
```

**Salida esperada:**
```
[Nest] INFO [NestApplication] Nest application successfully started
[Nest] INFO [RoutesResolver] FenomenosController {/fenomenos}:
[Nest] INFO [RoutesResolver] Mapped {/fenomenos, GET} route
[Nest] INFO [NestApplication] Application is running on: http://localhost:3000
```

#### 3. Frontend (Next.js)

```powershell
cd frontend

# Instalar dependencias
npm install

# Crear archivo de configuración (si no existe)
notepad .env.local

# Iniciar en modo desarrollo
npm run dev
```

**Salida esperada:**
```
▲ Next.js 14.0.0
- Local:        http://localhost:3001
- ready started server on 0.0.0.0:3001
```

#### 4. Verificar Integración Completa

```powershell
# Probar API Backend
curl http://localhost:3000

# Ver documentación Swagger
start http://localhost:3000/api

# Ver Frontend
start http://localhost:3001

# Probar predicción de IA
curl -X POST http://localhost:3000/api/predictions/risk -H "Content-Type: application/json" -d "{\"latitud\":1.2,\"longitud\":-77.3,\"mes\":11}"
```

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND (Next.js 14 + TypeScript)             │
│                      [Puerto 3001]                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Pages:                                                │  │
│  │ • Dashboard (estadísticas generales)                 │  │
│  │ • Fenómenos (histórico + filtros + gráficos)        │  │
│  │ • Municipios (búsqueda + detalles)                  │  │
│  │ • Mapa (visualización geoespacial)                  │  │
│  │ • Alertas (predicciones IA + alertas activas)      │  │
│  └──────────────────────────────────────────────────────┘  │
│  Components:                                               │
│  • Leaflet Maps (react-leaflet)                          │
│  • Recharts (gráficos interactivos)                      │
│  • TanStack Query (cache + estado)                       │
│  • Tailwind CSS (estilos)                                │
└────────────────────────┬───────────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────▼────────────────────────────────────┐
│              BACKEND API (NestJS + TypeORM)                 │
│                      [Puerto 3000]                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Modules:                                              │  │
│  │ • fenomenos    (356+ eventos con geo)               │  │
│  │ • estaciones   (5 estaciones IDEAM)                 │  │
│  │ • municipios   (64 con geometrías)                  │  │
│  │ • amenazas     (24 zonas SGC)                       │  │
│  │ • ndvi         (datos satelitales)                  │  │
│  │ • stats        (agregaciones)                       │  │
│  │ • map          (heatmaps + GeoJSON)                 │  │
│  │ • predictions  (proxy a AI service)                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  Features:                                                 │
│  • Swagger/OpenAPI docs                                   │
│  • Paginación automática                                 │
│  • Validación con class-validator                        │
│  • CORS + Rate limiting                                  │
└────────┬──────────────────────────────┬────────────────────┘
         │                              │ HTTP
         │ SQL                    ┌─────▼──────────┐
         │                        │  AI SERVICE    │
┌────────▼──────────┐            │   (FastAPI)     │
│   PostgreSQL 15   │            │                 │
│   + PostGIS 3.3   │            │ • Random Forest │
│  [Puerto 5435]    │            │   (200 trees)   │
│                   │            │ • 8 Features    │
│ Schemas:          │            │ • 64% Accuracy  │
│ • public          │            │ • joblib models │
│   - fenomenos     │            │                 │
│   - estaciones    │            │ [Puerto 8001]   │
│ • geo             │            └─────────────────┘
│   - municipios    │
│   - amenazas      │                   ▲
│   - ndvi          │                   │
│ • ia              │                   │ Python
│   - predictions   │                   │
└───────────────────┘         ┌─────────┴────────┐
                              │  ETL PIPELINE    │
┌──────────────────────────────────────────────────────────────┐
│                   ETL PIPELINE (Python 3.11)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Extractors  │→ │ Transformers │→ │   Loaders    │      │
│  │              │  │              │  │              │      │
│  │ • UNGRD API  │  │ • Limpieza   │  │ • PostgreSQL │      │
│  │ • IDEAM API  │  │ • Normaliza  │  │ • Validación │      │
│  │ • SGC GeoSv  │  │ • Geo parse  │  │ • Bulk insert│      │
│  │ • GEE Python │  │ • Encoding   │  │              │      │
│  │ • DANE       │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  Data Sources (Externas):                                    │
│  • UNGRD (datos.gov.co) - Fenómenos históricos             │
│  • IDEAM (dhime.ideam.gov.co) - Estaciones clima           │
│  • SGC (sgc.gov.co) - Zonas de amenaza                     │
│  • Google Earth Engine - NDVI satelital                    │
│  • DANE - Población municipal                              │
└──────────────────────────────────────────────────────────────┘
```

### Stack Tecnológico Completo

| Capa | Tecnologías | Versión |
|------|-------------|---------|
| **Frontend** | Next.js, TypeScript, Tailwind CSS | 14.0, 5.3, 3.4 |
| **Mapas** | Leaflet, react-leaflet | 1.9, 4.2 |
| **Gráficos** | Recharts, lucide-react | 2.9, 0.294 |
| **Estado** | TanStack Query, Zustand | 5.8, 4.4 |
| **Backend** | NestJS, TypeORM, TypeScript | 10.0, 0.3, 5.3 |
| **Base de Datos** | PostgreSQL, PostGIS | 15.5, 3.3 |
| **IA/ML** | FastAPI, scikit-learn, pandas, NumPy | 0.104, 1.3, 2.1, 1.26 |
| **ETL** | Python, requests, GeoPandas, psycopg2 | 3.11, 2.31, 0.14, 2.9 |
| **Satelital** | Google Earth Engine API, earthengine-api | 0.1.384 |
| **Contenedores** | Docker, Docker Compose | 24.0, 2.23 |
| **Documentación** | Swagger/OpenAPI | 3.0 |

---

## 📡 Fuentes de Datos

### 1. UNGRD (Unidad Nacional para la Gestión del Riesgo de Desastres)
- **Endpoint**: `https://apiv2.datos.gov.co/`
- **Datos**: Fenómenos naturales históricos (1993-2025)
- **Frecuencia**: Actualización continua
- **Cobertura**: Nacional (filtrado por Nariño)
- **Uso**: Entrenamiento del modelo de IA, análisis histórico

### 2. IDEAM (Instituto de Hidrología, Meteorología y Estudios Ambientales)
- **Endpoint**: `http://dhime.ideam.gov.co/`
- **Datos**: Estaciones meteorológicas, precipitación, temperatura
- **Frecuencia**: Datos horarios
- **Cobertura**: 5 estaciones en Nariño
- **Uso**: Monitoreo climático, contexto de eventos

### 3. SGC (Servicio Geológico Colombiano)
- **Endpoint**: `https://www2.sgc.gov.co/`
- **Datos**: Zonas de amenaza por movimientos en masa
- **Formato**: GeoJSON con geometrías poligonales
- **Niveles**: MUY ALTA, ALTA, MEDIA, BAJA
- **Uso**: Validación de predicciones, capas de referencia

### 4. Google Earth Engine
- **API**: Earth Engine Python API
- **Datos**: NDVI (MODIS MOD13Q1)
- **Resolución**: 250m
- **Cobertura**: 2024 (expandible)
- **Uso**: Análisis de cobertura vegetal, deforestación

### 5. DANE (Departamento Administrativo Nacional de Estadística)
- **Datos**: Población municipal (proyección 2024)
- **Cobertura**: 64 municipios de Nariño
- **Uso**: Estimación de población en riesgo

---

## 📚 API REST

### Documentación Interactiva

Una vez el backend esté corriendo, accede a la documentación completa:

🔗 **Swagger UI**: [http://localhost:3000/api](http://localhost:3000/api)

### Endpoints Principales

#### 📍 Fenómenos Naturales
```http
GET /fenomenos?page=1&limit=10
GET /fenomenos/stats
GET /fenomenos/:id
```

**Ejemplo de respuesta:**
```json
{
  "data": [
    {
      "id": 1,
      "fecha": "2024-11-15",
      "tipoFenomenoNormalizado": "DESLIZAMIENTO",
      "municipio": "PASTO",
      "latitud": 1.2136,
      "longitud": -77.2811,
      "descripcion": "Deslizamiento en zona urbana",
      "afectados": 25
    }
  ],
  "meta": {
    "total": 356,
    "page": 1,
    "limit": 10,
    "totalPages": 36
  }
}
```

#### 🌡️ Estaciones Meteorológicas
```http
GET /estaciones?page=1&limit=10
GET /estaciones/stats
GET /estaciones/:id
```

#### 🏘️ Municipios
```http
GET /municipios?page=1&limit=10
GET /municipios/stats
GET /municipios/:id
```

#### ⚠️ Zonas de Amenaza
```http
GET /amenazas?page=1&limit=10
GET /amenazas/stats
GET /amenazas/:id
```

#### 🛰️ Datos NDVI
```http
GET /ndvi
GET /ndvi/latest
GET /ndvi/stats
```

#### 📊 Estadísticas
```http
GET /api/stats/dashboard
GET /api/stats/timeline
```

#### 🗺️ Mapas
```http
GET /api/map/fenomenos
GET /api/map/amenazas
GET /api/map/heatmap
```

#### 🤖 Predicciones de IA
```http
POST /api/predictions/risk
GET /api/predictions/model-info
```

**Ejemplo de predicción:**
```json
// Request
POST /api/predictions/risk
{
  "latitud": 1.2,
  "longitud": -77.3,
  "mes": 11
}

// Response
{
  "riesgo": "INUNDACION",
  "probabilidad": 0.485,
  "top_3_predicciones": [
    {"riesgo": "INUNDACION", "probabilidad": 0.485},
    {"riesgo": "OTRO", "probabilidad": 0.360},
    {"riesgo": "DESLIZAMIENTO", "probabilidad": 0.155}
  ],
  "features_utilizadas": 8,
  "modelo_version": "3.0 - Optimized",
  "detalles": "Predicción con 8 features (accuracy: 64%)"
}
```

#### 🔍 Filtros Avanzados

Todos los endpoints principales soportan filtros mediante query parameters:

```http
# Fenómenos por municipio y tipo
GET /fenomenos?municipio=PASTO&tipo=DESLIZAMIENTO&page=1&limit=10

# Fenómenos por rango de fechas
GET /fenomenos?fechaInicio=2024-01-01&fechaFin=2024-12-31

# Búsqueda en municipios
GET /municipios?search=pas&page=1&limit=10

# Estaciones por código
GET /estaciones?codigo=5207501
```

---

## 🎨 Frontend Dashboard

### Páginas Principales

#### 1. **Dashboard Principal** (`/dashboard`)

Vista general con estadísticas clave:

- **Tarjetas de estadísticas**:
  - Total de fenómenos registrados
  - Municipios con mayor actividad
  - Eventos este mes
  - Alertas activas

- **Gráficos dinámicos**:
  - Serie temporal de eventos (últimos 6 meses)
  - Distribución por tipo de fenómeno
  - Top 5 municipios más afectados

- **Actualizaciones en tiempo real** con TanStack Query

#### 2. **Fenómenos Naturales** (`/dashboard/fenomenos`)

Exploración detallada del histórico:

- **Lista paginada** con 10, 25, 50 o 100 resultados por página
- **Filtros avanzados**:
  - Por tipo de fenómeno (dropdown con 7+ categorías)
  - Por municipio (búsqueda con autocompletado)
  - Por rango de fechas (date pickers)
- **Tarjetas de estadísticas**:
  - Total de eventos
  - Promedio mensual
  - Tipo más común
- **Gráficos interactivos**:
  - **Timeline**: Serie temporal mostrando eventos por mes
  - **Distribución por severidad**: Gráfico de barras por tipo
- **Tabla responsiva** con columnas:
  - Fecha | Tipo | Municipio | Coordenadas | Afectados

#### 3. **Municipios** (`/dashboard/municipios`)

Directorio municipal interactivo:

- **Búsqueda en tiempo real**: Busca por nombre con backend search (LIKE query)
- **Lista de tarjetas** con información clave:
  - Nombre y código DANE
  - Población proyectada 2024
  - Número de fenómenos registrados
  - Coordenadas del centroide
- **Paginación** con navegación rápida
- **Vista de mapa** (clic para ver ubicación)

#### 4. **Mapa Interactivo** (`/dashboard/map`)

Visualización geoespacial completa:

- **Capa base**: OpenStreetMap
- **Marcadores de eventos**:
  - Color por tipo (rojo=deslizamiento, azul=inundación, etc.)
  - Popups con detalles del evento
  - Clustering para alta densidad
- **Geometrías de municipios**: Polígonos con bordes
- **Zonas de amenaza**: Polígonos coloreados por nivel de riesgo
- **Controles**:
  - Zoom in/out
  - Fullscreen
  - Layers toggle (activar/desactivar capas)
- **Click events**: Información detallada al hacer clic
- **Heatmap mode**: Densidad de eventos por área

#### 5. **Sistema de Alertas IA** (`/dashboard/alerts`)

Panel de predicción y monitoreo:

- **Estadísticas del modelo**:
  - Accuracy del modelo (64%)
  - Número de features (8)
  - Tipos de riesgo detectados (3)
  - Datos de entrenamiento (356 eventos)

- **Formulario de predicción**:
  - **Mapa interactivo**: Click para seleccionar ubicación (lat/lng)
  - **Selector de mes**: Dropdown 1-12
  - **Botón "Predecir Riesgo"**: Ejecuta modelo de IA
  - **Resultado inmediato**:
    - Tipo de riesgo predicho
    - Probabilidad (%)
    - Top 3 predicciones alternativas
    - Nivel de confianza

- **Lista de alertas activas**:
  - Tarjetas con código de colores (crítico, alto, medio, bajo)
  - Ubicación y tipo de riesgo
  - Probabilidad y tiempo transcurrido
  - Acciones recomendadas

- **Mapa de alertas**:
  - Círculos proporcionales a la probabilidad
  - Colores por nivel de riesgo
  - Popups informativos

- **Explicación del modelo**:
  - Componente educativo sobre cómo funciona el Random Forest
  - Descripción de features utilizadas
  - Fuentes de datos y metodología
  - Limitaciones y transparencia

### Componentes Reutilizables

#### UI Components
- `Skeleton`: Loading placeholders animados
- `Pagination`: Navegación entre páginas
- `SearchBar`: Búsqueda con debounce
- `FilterGroup`: Filtros agrupados
- `StatCard`: Tarjetas de estadísticas

#### Chart Components (Recharts)
- `FenomenosTimeline`: Gráfico de línea temporal
- `FenomenosSeverityChart`: Gráfico de barras
- `MunicipalitiesChart`: Top municipios

#### Map Components (Leaflet)
- `MapSelector`: Selector interactivo de ubicación (clic en mapa)
- `AlertsMapContent`: Visualización de alertas con círculos
- `FenomenosMap`: Mapa de eventos históricos

#### Hooks Personalizados
```typescript
// Fenómenos
useFenomenos(page, limit, filters)
useFenomenosStats()

// Municipios
useMunicipios(page, limit, search)
useMunicipiosStats()

// Alertas
useModelInfo()
usePredictRisk()
```

### Features del Frontend

✅ **Server-Side Rendering (SSR)** con Next.js App Router  
✅ **Client-Side Rendering** para componentes interactivos (mapas)  
✅ **Dynamic Imports** para Leaflet (evita errores SSR)  
✅ **TanStack Query** para cache y sincronización  
✅ **TypeScript estricto** para type safety  
✅ **Responsive design** con Tailwind CSS breakpoints  
✅ **Loading states** con Skeletons  
✅ **Error handling** con boundaries  
✅ **Tooltips explicativos** en features técnicas  
✅ **Optimización de imágenes** con Next/Image  
✅ **SEO-friendly** con metadatos dinámicos  

---

## 🤖 Modelo de IA

### Arquitectura del Modelo

- **Algoritmo**: Random Forest Classifier
- **Framework**: scikit-learn 1.3.0
- **Features**: 8 variables geoespaciales y temporales
- **Clases**: 3 categorías agrupadas (DESLIZAMIENTO, INUNDACION, OTRO)
- **Accuracy**: 64% en test set, 48% en cross-validation

### Features Utilizadas

1. **latitud**: Coordenada Y del evento
2. **longitud**: Coordenada X del evento
3. **mes**: Mes del año (1-12)
4. **trimestre**: Trimestre del año (1-4)
5. **distancia_centro**: Distancia euclidiana al centroide de Nariño
6. **zona_encoded**: Zona geográfica codificada (Costa, Norte, Centro, Sur)
7. **lat_mes**: Interacción latitud × mes
8. **lon_mes**: Interacción longitud × mes

### Importancia de Features

| Feature | Importancia |
|---------|-------------|
| latitud | 20.0% |
| longitud | 17.8% |
| distancia_centro | 14.6% |
| zona_encoded | 13.2% |
| mes | 12.1% |
| lat_mes | 10.7% |
| lon_mes | 6.9% |
| trimestre | 4.7% |

### Métricas de Desempeño

- **Accuracy (Test)**: 63.89% - Rendimiento en datos no vistos
- **Accuracy (CV 5-fold)**: 48.05% ± 11.0% - Validación cruzada
- **Accuracy (Train)**: 93.66% - Datos de entrenamiento
- **Precision (Promedio)**: ~60% por clase
- **Recall (Promedio)**: ~58% por clase
- **F1-Score**: Balance entre precisión y recall

### Proceso de Entrenamiento

1. **Extracción de datos** desde PostgreSQL con query optimizado
2. **Agrupación de clases**: 15+ tipos → 3 categorías (mejora balance)
3. **Ingeniería de features**: 8 variables calculadas
4. **Encoding**: Label encoding para zona geográfica
5. **Split**: 80% train, 20% test (estratificado)
6. **Hiperparámetros optimizados**:
   - `n_estimators`: 200 árboles
   - `max_depth`: 12 niveles
   - `min_samples_split`: 5
   - `min_samples_leaf`: 2
   - `class_weight`: 'balanced' (compensa desbalance)
7. **Validación cruzada** con 5 folds
8. **Serialización** con joblib

### Agrupación de Clases

Para mejorar la precisión, se agrupan fenómenos similares:

| Clase Original | Clase Agrupada |
|----------------|----------------|
| Deslizamiento, Remoción en masa, Socavación | **DESLIZAMIENTO** |
| Inundación, Avenida torrencial, Creciente | **INUNDACION** |
| Vendaval, Vientos fuertes, Huracán | **VENDAVAL** |
| Incendio forestal, Incendio estructural | **INCENDIO** |
| Sequía, Desertificación | **SEQUIA** |
| Sismo, Terremoto, Temblor | **SISMO** |
| Granizada, Helada, Tormenta eléctrica, etc. | **OTRO** |

**Distribución final**:
- DESLIZAMIENTO: ~78%
- INUNDACION: ~14%
- OTRO: ~8%

### Limitaciones Conocidas y Mejoras Futuras

#### Limitaciones Actuales
- **Dataset desbalanceado**: 78% deslizamientos, requiere más variedad
- **Features limitadas**: Faltan datos climáticos en tiempo real (precipitación, humedad, temperatura)
- **Ausencia de datos geológicos**: Tipo de suelo, pendiente, geomorfología
- **Cobertura temporal**: Solo 356 eventos desde 2012, necesita más históricos
- **Sin variables socioeconómicas**: Urbanización, infraestructura, población
- **Modelo estático**: No se actualiza automáticamente con nuevos eventos

#### Mejoras Planificadas
- [x] Agrupación de clases similares (implementado)
- [ ] Integración con IDEAM para datos meteorológicos en tiempo real
- [ ] Features de elevación y pendiente desde DEM (Digital Elevation Model)
- [ ] Re-entrenamiento automático mensual
- [ ] Ensemble con XGBoost y Gradient Boosting
- [ ] Análisis de series temporales con LSTM
- [ ] API de explicabilidad (SHAP values)
- [ ] Dashboard de monitoreo del modelo (drift detection)

---

## 💻 Desarrollo

### Estructura del Proyecto

```
ecoguard/
├── frontend/                # Next.js 14 Dashboard
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── page.tsx              # Dashboard principal
│   │   │   ├── fenomenos/            # Histórico de eventos
│   │   │   ├── municipios/           # Directorio municipal
│   │   │   ├── map/                  # Mapa interactivo
│   │   │   └── alerts/               # Sistema de alertas IA
│   │   ├── layout.tsx                # Layout con sidebar
│   │   └── globals.css
│   ├── components/
│   │   ├── alerts/                   # Componentes de alertas
│   │   │   ├── PredictionForm.tsx
│   │   │   ├── AlertsList.tsx
│   │   │   ├── ModelStats.tsx
│   │   │   ├── ModelExplanation.tsx
│   │   │   ├── MapSelector.tsx
│   │   │   └── AlertsMapContent.tsx
│   │   ├── fenomenos/                # Componentes de fenómenos
│   │   │   ├── FenomenosStats.tsx
│   │   │   ├── FenomenosTimeline.tsx
│   │   │   └── FenomenosSeverityChart.tsx
│   │   ├── ui/                       # Componentes base
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── SearchBar.tsx
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       └── Header.tsx
│   ├── lib/
│   │   ├── api/                      # Cliente API
│   │   │   ├── fenomenos.ts
│   │   │   ├── municipios.ts
│   │   │   └── predictions.ts
│   │   ├── hooks/                    # Hooks personalizados
│   │   │   ├── useFenomenos.ts
│   │   │   ├── useMunicipios.ts
│   │   │   └── usePredictions.ts
│   │   └── types/                    # Tipos TypeScript
│   │       ├── fenomeno.types.ts
│   │       ├── municipio.types.ts
│   │       └── prediction.types.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── fenomenos/
│   │   │   │   ├── fenomenos.controller.ts
│   │   │   │   ├── fenomenos.service.ts
│   │   │   │   ├── fenomenos.module.ts
│   │   │   │   └── entities/
│   │   │   │       └── fenomeno.entity.ts
│   │   │   ├── estaciones/
│   │   │   │   ├── estaciones.controller.ts
│   │   │   │   ├── estaciones.service.ts
│   │   │   │   ├── estaciones.module.ts
│   │   │   │   └── entities/
│   │   │   │       └── estacion.entity.ts
│   │   │   ├── municipios/
│   │   │   │   ├── municipios.controller.ts
│   │   │   │   ├── municipios.service.ts
│   │   │   │   ├── municipios.module.ts
│   │   │   │   └── entities/
│   │   │   │       └── municipio.entity.ts
│   │   │   ├── amenazas/            # Zonas de amenaza SGC
│   │   │   ├── ndvi/                # Datos satelitales
│   │   │   ├── stats/               # Estadísticas agregadas
│   │   │   ├── map/                 # Endpoints de mapas
│   │   │   └── predictions/         # Proxy a AI service
│   │   │       ├── predictions.controller.ts
│   │   │       ├── predictions.service.ts
│   │   │       ├── predictions.module.ts
│   │   │       └── dto/
│   │   │           ├── risk-prediction.dto.ts
│   │   │           └── model-info.dto.ts
│   │   ├── common/                  # Utilidades compartidas
│   │   │   ├── pagination/
│   │   │   ├── filters/
│   │   │   └── decorators/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   │   ├── app.e2e-spec.ts
│   │   └── jest-e2e.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .env.development          # Configuración de entorno
│
├── ai-service/              # FastAPI ML Service
│   ├── main.py                      # API FastAPI
│   ├── train_model.py               # Script de entrenamiento
│   ├── check_model.py               # Validación del modelo
│   ├── test_db.py                   # Pruebas de conexión
│   ├── models/                      # Modelos serializados
│   │   ├── model_riesgo.pkl
│   │   ├── label_encoder.pkl
│   │   ├── zona_encoder.pkl
│   │   ├── scaler.pkl
│   │   └── metadata.pkl
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env                         # Configuración del servicio
│
├── etl/                     # Pipeline ETL Python
│   ├── extractors/
│   │   ├── estaciones_extractor.py     # IDEAM API
│   │   ├── fenomenos_extractor.py      # UNGRD API
│   │   ├── amenazas_sgc_extractor.py   # SGC GeoServicios
│   │   ├── ndvi_extractor.py           # Google Earth Engine
│   │   └── poblacion_extractor.py      # DANE
│   ├── transformers/
│   │   ├── estaciones_transformer.py   # Limpieza estaciones
│   │   └── fenomenos_transformer.py    # Limpieza fenómenos
│   ├── loaders/
│   │   ├── municipios_loader.py        # Carga geometrías
│   │   ├── estaciones_loader.py
│   │   ├── fenomenos_loader.py
│   │   ├── amenazas_loader.py
│   │   ├── ndvi_loader.py
│   │   └── add_population.py           # Actualización población
│   ├── tests/
│   │   ├── audit_database.py           # Validación integridad
│   │   ├── test_estaciones_api.py
│   │   ├── test_fenomenos_api.py
│   │   └── test_gee.py                 # Test Google Earth Engine
│   ├── requirements.txt
│   └── db_config.env                   # Configuración DB
│
├── database/                # Scripts SQL
│   ├── init/
│   │   └── 01_init.sql                 # Esquemas + tablas
│   └── scripts/
│       ├── 02_add_population.sql       # Columnas población
│       ├── 03_create_amenazas_table.sql
│       └── 05_create_ndvi_table.sql
│
├── datasets/                # Datos crudos y procesados
│   ├── raw/
│   │   ├── estaciones_ideam_narino.csv
│   │   ├── fenomenos_naturales_narino.csv
│   │   ├── amenazas/
│   │   │   └── amenazas_sgc_layer0_*.geojson
│   │   ├── municipios/
│   │   │   └── colombia_municipios_completo.json
│   │   ├── ndvi/
│   │   │   └── ndvi_narino_2024_*.json
│   │   └── poblacion/
│   └── processed/
│       ├── estaciones_ideam_clean.csv
│       └── fenomenos_naturales_clean.csv
│
├── docs/                    # Documentación adicional
│   ├── API.md                          # Documentación de endpoints
│   ├── ETL_PROCESS.md                  # Flujo ETL detallado
│   ├── MODEL_TRAINING.md               # Guía de entrenamiento
│   └── DEPLOYMENT.md                   # Guía de despliegue
│
├── docker-compose.yml       # Orquestación de servicios
├── setup.ps1                # Script maestro de instalación
├── .gitignore
├── .env.example             # Template de variables
└── README.md                # Este archivo
```

### Variables de Entorno

#### Backend (.env.development)
```env
# Database
DB_HOST=localhost
DB_PORT=5435
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecoguard

# AI Service
AI_SERVICE_URL=http://localhost:8001

# Application
PORT=3000
NODE_ENV=development
```

#### ETL (db_config.env)
```env
DB_HOST=localhost
DB_PORT=5435
DB_NAME=ecoguard
DB_USER=postgres
DB_PASSWORD=postgres
```

### Comandos Útiles

```powershell
# ===========================================
# DOCKER
# ===========================================

# Iniciar todos los servicios
docker-compose up -d

# Iniciar solo PostgreSQL
docker-compose up -d postgres

# Iniciar solo AI Service
docker-compose up -d ai-service

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (limpieza completa)
docker-compose down -v

# Ver logs en tiempo real
docker-compose logs -f postgres
docker-compose logs -f ai-service

# Ver estado de contenedores
docker-compose ps

# Reiniciar un servicio específico
docker-compose restart postgres

# Reconstruir imágenes
docker-compose build --no-cache

# ===========================================
# BASE DE DATOS
# ===========================================

# Conectar a PostgreSQL
docker exec -it ecoguard_postgres psql -U postgres -d ecoguard

# Ejecutar query desde CLI
docker exec ecoguard_postgres psql -U postgres -d ecoguard -c "SELECT COUNT(*) FROM public.fenomenos_naturales;"

# Listar todas las tablas
docker exec ecoguard_postgres psql -U postgres -d ecoguard -c "\dt public.*"
docker exec ecoguard_postgres psql -U postgres -d ecoguard -c "\dt geo.*"

# Describir estructura de una tabla
docker exec ecoguard_postgres psql -U postgres -d ecoguard -c "\d+ geo.municipios"

# Backup de la base de datos
docker exec ecoguard_postgres pg_dump -U postgres ecoguard > backup_$(Get-Date -Format "yyyyMMdd").sql

# Restaurar desde backup
Get-Content backup_20241130.sql | docker exec -i ecoguard_postgres psql -U postgres -d ecoguard

# Ver uso de espacio
docker exec ecoguard_postgres psql -U postgres -d ecoguard -c "SELECT pg_size_pretty(pg_database_size('ecoguard'));"

# ===========================================
# BACKEND (NestJS)
# ===========================================

cd backend

# Instalar dependencias
npm install

# Modo desarrollo (hot reload)
npm run start:dev

# Modo producción
npm run build
npm run start:prod

# Tests unitarios
npm run test

# Tests E2E
npm run test:e2e

# Cobertura de tests
npm run test:cov

# Linter
npm run lint

# Formatear código
npm run format

# Generar nuevo módulo
nest g module nombre
nest g controller nombre
nest g service nombre

# Ver rutas disponibles
npm run start:dev | Select-String "Mapped"

# ===========================================
# FRONTEND (Next.js)
# ===========================================

cd frontend

# Instalar dependencias
npm install

# Modo desarrollo (hot reload)
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm run start

# Linter
npm run lint

# Analizar bundle
npm run analyze

# ===========================================
# AI SERVICE (FastAPI)
# ===========================================

cd ai-service

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar servicio local (sin Docker)
python main.py

# Entrenar modelo
python train_model.py

# Verificar modelo
python check_model.py

# Probar conexión a base de datos
python test_db.py

# Ver información del modelo
curl http://localhost:8001/info

# Hacer predicción
curl -X POST http://localhost:8001/predict -H "Content-Type: application/json" -d "{\"latitud\":1.2,\"longitud\":-77.3,\"mes\":11}"

# ===========================================
# ETL PIPELINE
# ===========================================

cd etl

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar extractores
python extractors/estaciones_extractor.py
python extractors/fenomenos_extractor.py
python extractors/amenazas_sgc_extractor.py
python extractors/ndvi_extractor.py

# Ejecutar transformers
python transformers/estaciones_transformer.py
python transformers/fenomenos_transformer.py

# Ejecutar loaders
python loaders/municipios_loader.py
python loaders/estaciones_loader.py
python loaders/fenomenos_loader.py
python loaders/amenazas_loader.py
python loaders/ndvi_loader.py
python loaders/add_population.py

# Auditoría de base de datos
python tests/audit_database.py

# Tests de APIs externas
python tests/test_estaciones_api.py
python tests/test_fenomenos_api.py
python tests/test_gee.py

# ===========================================
# MONITOREO Y DEBUGGING
# ===========================================

# Ver uso de puertos
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :5435
netstat -ano | findstr :8001

# Ver procesos de Node
Get-Process node

# Matar proceso por puerto (PowerShell)
$port = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port) { Stop-Process -Id $port.OwningProcess -Force }

# Ver logs de Docker
docker logs ecoguard_postgres --tail 100
docker logs ecoguard_ai_service --tail 100

# Ver estadísticas de contenedores
docker stats

# Limpiar caché de Docker
docker system prune -a

# ===========================================
# GIT
# ===========================================

# Ver cambios
git status
git diff

# Commit cambios
git add .
git commit -m "feat: descripción del cambio"

# Push a repositorio
git push origin main

# Pull cambios
git pull origin main

# Ver historial
git log --oneline --graph --decorate

# Crear rama
git checkout -b feature/nueva-funcionalidad

# Cambiar de rama
git checkout main
```

---

## 🐛 Troubleshooting

### Problema: Docker no inicia

**Síntomas**: Error al ejecutar `docker-compose up`

**Soluciones**:
1. Verificar que Docker Desktop esté corriendo
2. Reiniciar Docker Desktop
3. Verificar puertos no estén ocupados:
   ```powershell
   netstat -ano | findstr :5435
   netstat -ano | findstr :3000
   netstat -ano | findstr :8001
   ```

### Problema: Base de datos vacía

**Síntomas**: Endpoints retornan arrays vacíos

**Soluciones**:
1. Verificar que los loaders se ejecutaron:
   ```powershell
   docker exec ecoguard_postgres psql -U postgres -d ecoguard -c "SELECT COUNT(*) FROM public.fenomenos_naturales;"
   ```
2. Re-ejecutar setup completo:
   ```powershell
   .\setup.ps1
   ```

### Problema: Backend no conecta a BD

**Síntomas**: Error `ECONNREFUSED` o `Connection timeout`

**Soluciones**:
1. Verificar variables de entorno en `.env.development`
2. Verificar que PostgreSQL esté healthy:
   ```powershell
   docker ps
   docker logs ecoguard_postgres
   ```

### Problema: Modelo de IA no carga

**Síntomas**: Error `Modelo no disponible` en `/predict`

**Soluciones**:
1. Verificar que los archivos .pkl existan en `ai-service/models/`
2. Reconstruir contenedor:
   ```powershell
   docker-compose build ai-service
   docker-compose up -d ai-service
   ```

### Problema: NDVI no se extrae

**Síntomas**: Error de autenticación con Google Earth Engine

**Soluciones**:
1. Autenticar con GEE:
   ```powershell
   cd etl
   python -c "import ee; ee.Authenticate()"
   ```
2. Usar datos pre-extraídos (incluidos en `datasets/raw/ndvi/`)

---

## 🎓 Proyecto Académico

### Universidad de Nariño

**EcoGuard** es un proyecto desarrollado por estudiantes de la Universidad de Nariño como parte de la participación en la **Convocatoria Datos Abiertos 2025**.

### Fuentes de Datos Abiertos

Este proyecto utiliza exclusivamente datos abiertos proporcionados por entidades gubernamentales colombianas:

- **UNGRD** (Unidad Nacional para la Gestión del Riesgo de Desastres) - Fenómenos naturales históricos
- **IDEAM** (Instituto de Hidrología, Meteorología y Estudios Ambientales) - Datos meteorológicos
- **SGC** (Servicio Geológico Colombiano) - Zonas de amenaza geológica  
- **DANE** (Departamento Administrativo Nacional de Estadística) - Información demográfica
- **Google Earth Engine** - Datos satelitales de vegetación (NDVI)
- **OpenStreetMap** - Cartografía base

### Objetivo del Proyecto

Desarrollar una herramienta tecnológica que contribuya a la gestión del riesgo de desastres en el departamento de Nariño, utilizando análisis de datos, inteligencia artificial y visualizaciones geoespaciales para apoyar la toma de decisiones en prevención y respuesta a amenazas ambientales.

---

<div align="center">

### 🌿 Desarrollado para Nariño, Colombia 🇨🇴

**Universidad de Nariño - Convocatoria Datos Abiertos 2025**

---

*Noviembre 2025*

</div>
