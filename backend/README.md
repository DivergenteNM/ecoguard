# EcoGuard Backend API

Backend RESTful construido con NestJS + TypeORM para el sistema EcoGuard.

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- PostgreSQL 15 corriendo (ver README raíz para setup completo)

### Instalación

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.development

# Iniciar en modo desarrollo
npm run start:dev
```

### Acceder a la API
- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api

## 📚 Estructura de Módulos

```
src/
├── modules/
│   ├── fenomenos/       # Fenómenos naturales históricos
│   ├── estaciones/      # Estaciones meteorológicas
│   ├── municipios/      # Municipios de Nariño
│   ├── amenazas/        # Zonas de amenaza
│   ├── ndvi/            # Datos satelitales de vegetación
│   ├── stats/           # Estadísticas agregadas
│   ├── map/             # Endpoints para mapas (GeoJSON)
│   └── predictions/     # Predicciones de IA
├── app.module.ts
└── main.ts
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run start:dev        # Modo watch con hot-reload
npm run start:debug      # Modo debug

# Producción
npm run build            # Compilar TypeScript
npm run start:prod       # Iniciar en producción

# Testing
npm run test             # Tests unitarios
npm run test:watch       # Tests en modo watch
npm run test:cov         # Tests con coverage
npm run test:e2e         # Tests end-to-end

# Linting
npm run lint             # Ejecutar ESLint
npm run format           # Formatear con Prettier
```

## 📊 Endpoints Principales

### Fenómenos
- `GET /fenomenos` - Listar fenómenos (paginado)
- `GET /fenomenos/:id` - Obtener por ID
- `GET /fenomenos/stats` - Estadísticas

### Estaciones
- `GET /estaciones` - Listar estaciones
- `GET /estaciones/:id` - Obtener por ID
- `GET /estaciones/stats` - Estadísticas

### Municipios
- `GET /municipios` - Listar municipios
- `GET /municipios/:id` - Obtener por ID
- `GET /municipios/stats` - Estadísticas

### NDVI
- `GET /ndvi` - Todos los registros NDVI
- `GET /ndvi/latest` - Último registro
- `GET /ndvi/stats` - Estadísticas

### Predicciones IA
- `POST /api/predictions/risk` - Predecir riesgo
- `GET /api/predictions/model-info` - Info del modelo

Ver documentación completa en `/api` cuando el servidor esté corriendo.

## 🔧 Configuración

### Variables de Entorno (.env.development)

```env
# Database
DB_HOST=localhost
DB_PORT=5435
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=ecoguard

# Application
PORT=3000
NODE_ENV=development

# AI Service
AI_SERVICE_URL=http://localhost:8001
```

## 📦 Dependencias Principales

- **NestJS** 11.0.1 - Framework
- **TypeORM** 0.3.27 - ORM
- **PostgreSQL** (pg 8.11.3) - Driver BD
- **class-validator** 0.14.1 - Validación
- **@nestjs/swagger** 8.0.7 - Documentación

## 🐛 Troubleshooting

### Error: Cannot connect to database
```bash
# Verificar que PostgreSQL esté corriendo
docker ps | grep postgres

# Verificar variables de entorno
cat .env.development
```

### Error: Module not found
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error en compilación TypeScript
```bash
# Limpiar dist y recompilar
rm -rf dist
npm run build
```

## 📝 Notas de Desarrollo

- El servidor usa hot-reload en modo desarrollo
- Swagger se regenera automáticamente al iniciar
- Las migraciones se manejan manualmente con scripts SQL
- CORS está habilitado para desarrollo local

## 🔗 Enlaces

- [Documentación NestJS](https://docs.nestjs.com/)
- [Documentación TypeORM](https://typeorm.io/)
- [README Principal](../README.md)
