# 🌍 EcoGuard Colombia MVP

**Sistema de Predicción de Amenazas Ambientales para Nariño**

EcoGuard es una plataforma tecnológica diseñada para centralizar, procesar y visualizar datos ambientales críticos del departamento de Nariño, Colombia. Su objetivo principal es fortalecer la gestión del riesgo de desastres mediante el uso de datos abiertos, análisis geoespacial e Inteligencia Artificial.

---

## 📖 Descripción del Proyecto

EcoGuard integra múltiples fuentes de datos oficiales para ofrecer una visión holística de las amenazas naturales en la región. El sistema no solo visualiza eventos históricos, sino que sienta las bases para predecir futuros riesgos de deslizamientos e inundaciones utilizando modelos de Machine Learning.

### 🎯 Objetivos

1.  **Centralización**: Unificar datos dispersos (clima, eventos pasados, geografía) en una sola base de datos geoespacial.
2.  **Visualización**: Proveer mapas interactivos para identificar zonas críticas.
3.  **Predicción (Fase IA)**: Estimar la probabilidad de ocurrencia de fenómenos naturales.

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura modular moderna:

1.  **Capa de Datos (ETL)**: Scripts en Python que extraen, transforman y cargan datos desde APIs oficiales hacia la base de datos.
2.  **Base de Datos**: PostgreSQL con extensión PostGIS para manejo eficiente de datos geográficos.
3.  **Backend**: API RESTful construida con NestJS (Node.js) que expone los datos procesados.
4.  **Frontend (Próximamente)**: Interfaz de usuario en Next.js.
5.  **Servicio IA (Próximamente)**: Microservicio en Python (FastAPI) para modelos predictivos.

---

## 📊 Fuentes de Datos y Uso

El sistema se alimenta de datos abiertos gubernamentales y satelitales:

| Fuente de Datos           | Origen                           | Descripción                                                     | Uso en EcoGuard                                                                        |
| ------------------------- | -------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Fenómenos Naturales**   | Datos Abiertos Colombia (UNGRD)  | Histórico de eventos (deslizamientos, inundaciones) desde 2007. | Entrenamiento de modelos de IA y mapas de calor de riesgo histórico.                   |
| **Estaciones Climáticas** | IDEAM                            | Ubicación y tipo de estaciones meteorológicas.                  | Contexto climático y monitoreo de precipitaciones.                                     |
| **Municipios**            | DANE / IGAC                      | Geometrías oficiales de los 64 municipios de Nariño.            | Capa base para visualización y agregación de alertas.                                  |
| **Población**             | DANE                             | Censo poblacional (proyección 2024).                            | Estimación de población en riesgo y priorización de alertas.                           |
| **NDVI (Vegetación)**     | Google Earth Engine (Sentinel-2) | Índice de vegetación normalizada.                               | Detección de deforestación o cambios en cobertura vegetal que preceden deslizamientos. |
| **Amenazas (En proceso)** | CORPONARIÑO / SGC                | Mapas oficiales de zonificación de amenazas.                    | Validación de predicciones y capas de referencia oficial.                              |

---

## 🚀 Guía de Inicio y Testeo

Sigue estos pasos para levantar todo el entorno de desarrollo y probar el sistema.

### Requisitos Previos

- **Docker Desktop** instalado y corriendo.
- **Node.js** (v18 o superior).
- **Python** (v3.9 o superior).
- **Git**.

### Paso 1: Clonar y Configurar Entorno

1.  Clona el repositorio (si no lo has hecho):

    ```bash
    git clone <url-del-repo>
    cd ecoguard
    ```

2.  Configura las variables de entorno:
    - Copia `.env.example` a `.env` en la raíz.
    - Copia `backend/.env.example` a `backend/.env.development` (si aplica).
    - _Nota_: Las credenciales por defecto de Docker ya están configuradas.

### Paso 2: Levantar Base de Datos

Usamos Docker para la base de datos PostgreSQL + PostGIS.

1.  Inicia el contenedor:
    ```bash
    docker-compose up -d
    ```
2.  Verifica que esté corriendo:
    ```bash
    docker ps
    ```
    _(Deberías ver el contenedor `ecoguard-db` en el puerto 5435)_.

### Paso 3: Cargar Datos (ETL)

Si es la primera vez, necesitas poblar la base de datos.

1.  Instala dependencias de Python:
    ```bash
    cd etl
    pip install -r requirements.txt
    ```
2.  Ejecuta los loaders (asegúrate de estar en la carpeta raíz `ecoguard`):

    ```bash
    # Cargar Municipios
    python etl/loaders/municipios_loader.py

    # Cargar Fenómenos
    python etl/loaders/fenomenos_loader.py

    # Cargar Estaciones
    python etl/loaders/estaciones_loader.py

    # Cargar Población
    python etl/loaders/add_population.py
    ```

### Paso 4: Iniciar el Backend

1.  Navega al directorio del backend:
    ```bash
    cd backend
    ```
2.  Instala dependencias:
    ```bash
    npm install
    ```
3.  Inicia el servidor en modo desarrollo:
    ```bash
    npm run start:dev
    ```

### Paso 5: Testeo y Exploración

Una vez el backend esté corriendo, abre tu navegador en:

👉 **http://localhost:3000/api**

Aquí verás la documentación interactiva (Swagger) donde puedes probar los endpoints:

- **GET /municipios**: Verifica que carguen los 64 municipios.
- **GET /fenomenos**: Consulta los últimos desastres registrados.
- **GET /estaciones**: Revisa las estaciones de monitoreo disponibles.
- **GET /ndvi/latest**: Consulta los últimos datos de vegetación satelital.

---

## 🛠️ Estado del Desarrollo

- ✅ **Base de Datos**: Esquema PostGIS optimizado.
- ✅ **ETL**: Pipelines de extracción y carga funcionales.
- ✅ **Backend**: API REST operativa y documentada.
- 🚧 **Amenazas Oficiales**: En proceso de integración (CORPONARIÑO).
- 📅 **Próximos Pasos**: Desarrollo del servicio de IA y Frontend.

---
