# 📝 Changelog - EcoGuard

Todos los cambios notables del proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2024-11-30

### 🎉 Lanzamiento Inicial

Primera versión funcional completa de EcoGuard con frontend, backend, modelo de IA y pipeline ETL.

### ✨ Added (Agregado)

#### Frontend (Next.js 14)
- **Dashboard principal** con estadísticas en tiempo real
  - Tarjetas de métricas clave
  - Gráficos de series temporales
  - Vista general del sistema
- **Página de Fenómenos Naturales**
  - Lista paginada con 356+ eventos históricos
  - Filtros por tipo, municipio y fecha
  - Gráficos: Timeline y distribución por severidad
  - Tarjetas de estadísticas agregadas
  - Búsqueda en tiempo real
- **Página de Municipios**
  - Directorio de 64 municipios de Nariño
  - Búsqueda con backend query (LIKE)
  - Información demográfica y geográfica
  - Paginación optimizada
- **Mapa Interactivo**
  - Visualización con Leaflet
  - Marcadores de eventos con colores por tipo
  - Geometrías de municipios y zonas de amenaza
  - Popups informativos
  - Controles de capas
- **Sistema de Alertas Inteligente**
  - Formulario de predicción con IA
  - Mapa selector interactivo (clic para ubicación)
  - Resultados en tiempo real con top 3 predicciones
  - Lista de alertas activas con niveles de riesgo
  - Mapa de alertas con círculos proporcionales
  - Componente de explicación del modelo (transparencia)
  - Estadísticas del modelo: accuracy, features, performance
- **Componentes UI reutilizables**
  - Skeleton loaders para estados de carga
  - Pagination component con navegación
  - SearchBar con debounce
  - FilterGroup para múltiples filtros
  - StatCard para métricas
- **Hooks personalizados**
  - `useFenomenos`: Fetch fenómenos con filtros
  - `useMunicipios`: Fetch municipios con búsqueda
  - `useModelInfo`: Información del modelo de IA
  - `usePredictRisk`: Realizar predicciones
- **Integración TanStack Query**
  - Cache automático de peticiones
  - Revalidación inteligente
  - Optimistic updates
  - Loading y error states
- **Responsive design** optimizado para móvil, tablet y desktop
- **TypeScript estricto** en todo el frontend
- **Dynamic imports** para Leaflet (evita errores SSR)

#### Backend (NestJS 11)
- **Módulo Fenómenos**
  - CRUD completo
  - Paginación automática
  - Filtros: tipo, municipio, fecha
  - Estadísticas agregadas
  - Búsqueda espacial
- **Módulo Estaciones**
  - Lista de estaciones IDEAM
  - Datos históricos de clima
  - Estadísticas por estación
- **Módulo Municipios**
  - CRUD con geometrías PostGIS
  - Búsqueda por nombre (ILIKE)
  - Información demográfica
  - Centroides calculados
- **Módulo Amenazas**
  - Zonas de amenaza SGC
  - Filtros por nivel de riesgo
  - Respuestas GeoJSON
- **Módulo NDVI**
  - Datos satelitales de vegetación
  - Series temporales
  - Estadísticas agregadas
- **Módulo Stats**
  - Dashboard aggregations
  - Timeline data
  - Distribuciones por tipo
- **Módulo Map**
  - Endpoints para mapas
  - Heatmap data
  - GeoJSON features
- **Módulo Predictions**
  - Proxy a AI Service
  - POST /api/predictions/risk
  - GET /api/predictions/model-info
  - Validación de inputs
  - Timeout configurado (5s)
- **Documentación Swagger/OpenAPI**
  - 30+ endpoints documentados
  - Schemas de request/response
  - Ejemplos de uso
  - Try-it-out integrado
- **CORS habilitado** para frontend
- **Validación de DTOs** con class-validator
- **TypeORM entities** con decoradores PostGIS
- **Variables de entorno** con dotenv

#### AI Service (FastAPI)
- **Modelo Random Forest v3.0**
  - 200 árboles de decisión
  - 8 features geoespaciales
  - 3 clases agrupadas
  - 64% accuracy en test set
  - Validación cruzada 5-fold
- **Endpoints**
  - GET / - Health check
  - GET /info - Metadata del modelo
  - POST /predict - Realizar predicción
- **Features calculadas**
  - latitud, longitud
  - mes, trimestre
  - distancia_centro
  - zona_encoded (Costa, Norte, Sur, Centro)
  - lat_mes, lon_mes (interacciones estacionales)
- **Serialización con joblib**
  - model_riesgo.pkl
  - label_encoder.pkl
  - zona_encoder.pkl
  - metadata.pkl
- **Script de entrenamiento** (train_model.py)
  - Extracción desde PostgreSQL
  - Agrupación de clases similares
  - Feature engineering
  - Hiperparámetros optimizados
  - Métricas de evaluación
  - Análisis de importancia
- **Dockerizado** para fácil despliegue

#### Pipeline ETL (Python)
- **Extractores**
  - `estaciones_extractor.py`: API de IDEAM
  - `fenomenos_extractor.py`: API de UNGRD
  - `amenazas_sgc_extractor.py`: SGC Geoservicios
  - `ndvi_extractor.py`: Google Earth Engine
  - `poblacion_extractor.py`: DANE
- **Transformers**
  - `estaciones_transformer.py`: Limpieza de estaciones
  - `fenomenos_transformer.py`: Normalización de fenómenos
- **Loaders**
  - `municipios_loader.py`: Carga geometrías
  - `estaciones_loader.py`: Carga estaciones
  - `fenomenos_loader.py`: Carga eventos
  - `amenazas_loader.py`: Carga zonas de amenaza
  - `ndvi_loader.py`: Carga datos satelitales
  - `add_population.py`: Actualización de población
- **Tests**
  - `audit_database.py`: Validación de integridad
  - `test_estaciones_api.py`: Pruebas de API IDEAM
  - `test_fenomenos_api.py`: Pruebas de API UNGRD
  - `test_gee.py`: Pruebas de Google Earth Engine

#### Base de Datos (PostgreSQL + PostGIS)
- **Esquemas**
  - `public`: Tablas operacionales
  - `geo`: Datos geoespaciales
  - `ia`: Datos de predicciones
- **Tablas**
  - `fenomenos_naturales`: 356+ eventos georeferenciados
  - `estaciones`: 5 estaciones IDEAM
  - `geo.municipios`: 64 municipios con MultiPolygon
  - `geo.amenazas`: 24 zonas de amenaza
  - `geo.ndvi`: Datos satelitales de vegetación
- **Índices espaciales** para consultas rápidas
- **Constraints** de integridad referencial
- **Scripts SQL** de inicialización

#### Infraestructura
- **Docker Compose**
  - PostgreSQL 15 + PostGIS 3.3
  - AI Service (FastAPI)
  - Redes internas
  - Volúmenes persistentes
- **Setup Script** (setup.ps1)
  - Verificación de requisitos
  - Creación de contenedores
  - Ejecución de scripts SQL
  - Instalación de dependencias
  - Extracción de datos (opcional)
  - Transformación y limpieza
  - Carga a base de datos
  - Validación de integridad
  - Modo verbose para debugging
- **Variables de entorno** documentadas
  - Backend: `.env.development`
  - ETL: `db_config.env`
  - Frontend: `.env.local`
  - AI Service: `.env`

#### Documentación
- **README.md completo** con:
  - Descripción del proyecto
  - Características principales
  - Requisitos previos
  - Guía de instalación paso a paso
  - Configuración de entorno (.env)
  - Arquitectura del sistema
  - Fuentes de datos
  - Documentación de API
  - Frontend dashboard
  - Modelo de IA
  - Estructura del proyecto
  - Comandos útiles
  - Troubleshooting
  - Roadmap futuro
  - Guía de contribución
  - Licencia MIT
- **CHANGELOG.md**: Registro de cambios
- **Comentarios en código** para mantainability

### 🐛 Fixed (Corregido)

#### Frontend
- **SSR Error con Leaflet**: Dynamic imports con `ssr: false` para componentes de mapas
- **Iconos de marcadores**: Configuración correcta de Leaflet icons desde CDN
- **Filtros de municipios**: Búsqueda ahora ejecuta query en backend con LIKE
- **Nombres de campos**: Corrección de `tipo` → `tipoFenomenoNormalizado`, `fecha_evento` → `fechaReporte`
- **Layout del dashboard**: Espaciado correcto con `space-y-8`, `mb-8`, eliminando superposiciones
- **Features del modelo**: Mapeo de nombres técnicos a nombres amigables con tooltips explicativos
- **Tipo de datos ModelInfo**: Corrección de `importance` de `Record<string, number>` a `Array<{feature, importance}>`

#### Backend
- **Búsqueda de municipios**: Implementación de QueryBuilder con LIKE para búsqueda parcial
- **Timeout del AI Service**: Configuración de timeout de 5 segundos
- **CORS**: Configuración correcta para permitir frontend

#### AI Service
- **Accuracy del modelo**: Mejora de 55% a 64% con agrupación de clases
- **Balance de clases**: Uso de `class_weight='balanced'` en Random Forest

#### ETL
- **Normalización de tipos**: Agrupación de 15+ tipos en 7 categorías principales
- **Limpieza de coordenadas**: Validación de latitud/longitud válidas
- **Encoding de zonas**: Manejo correcto de zonas geográficas

### 🔄 Changed (Cambiado)

#### Modelo de IA
- **Versión**: 2.0 → 3.0 (Optimized with Class Grouping)
- **Clases**: 15+ tipos → 3 categorías agrupadas (DESLIZAMIENTO, INUNDACION, OTRO)
- **Accuracy**: 55% → 64%
- **Features**: Reducción de 12 → 8 features más relevantes

#### Frontend
- **UX de predicción**: De inputs manuales lat/lng → Mapa interactivo con clic
- **Componentes**: Separación de `MapSelector` y `AlertsMapContent` para mejor organización

### 🗑️ Removed (Eliminado)

- **Features innecesarias** del modelo: día_semana, precipitacion (sin datos disponibles)
- **Código duplicado** en transformers
- **Importaciones no usadas** en componentes

---

## [0.5.0] - 2024-11-15 (Beta)

### Added
- Backend inicial con NestJS
- Base de datos PostgreSQL + PostGIS
- Pipeline ETL básico
- Modelo de IA v1.0

---

## [0.1.0] - 2024-10-01 (Alpha)

### Added
- Estructura inicial del proyecto
- Docker Compose setup
- Scripts SQL básicos

---

## Tipos de Cambios

- **Added**: Nuevas funcionalidades
- **Changed**: Cambios en funcionalidades existentes
- **Deprecated**: Funcionalidades que serán removidas
- **Removed**: Funcionalidades removidas
- **Fixed**: Corrección de bugs
- **Security**: Vulnerabilidades de seguridad
