-- ============================================================================
-- Script: Recreación Completa de Base de Datos EcoGuard
-- Descripción: Elimina y recrea la BD con solo las tablas necesarias
-- ============================================================================

-- PASO 1: Eliminar base de datos existente
DROP DATABASE IF EXISTS ecoguard;

-- PASO 2: Crear base de datos limpia
CREATE DATABASE ecoguard;

-- Conectar a la nueva base de datos
\c ecoguard

-- PASO 3: Habilitar extensión PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- PASO 4: Crear esquemas
CREATE SCHEMA IF NOT EXISTS geo;
COMMENT ON SCHEMA public IS 'Esquema para datos de eventos y fenómenos naturales';
COMMENT ON SCHEMA geo IS 'Esquema para datos geográficos (municipios, estaciones, zonas de amenaza)';

-- ============================================================================
-- TABLA 1: Fenómenos Naturales
-- ============================================================================
CREATE TABLE public.fenomenos_naturales (
    id SERIAL PRIMARY KEY,
    id_fenomeno VARCHAR(50) UNIQUE NOT NULL,
    tipo_fenomeno_original VARCHAR(200),
    tipo_fenomeno_normalizado VARCHAR(100),
    municipio VARCHAR(100),
    fecha DATE NOT NULL,
    latitud NUMERIC(10, 7) NOT NULL,
    longitud NUMERIC(10, 7) NOT NULL,
    descripcion TEXT,
    url_fuente VARCHAR(500),
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_fenomenos_geom ON public.fenomenos_naturales USING GIST(geom);
CREATE INDEX idx_fenomenos_municipio ON public.fenomenos_naturales(municipio);
CREATE INDEX idx_fenomenos_tipo ON public.fenomenos_naturales(tipo_fenomeno_normalizado);
CREATE INDEX idx_fenomenos_fecha ON public.fenomenos_naturales(fecha);

COMMENT ON TABLE public.fenomenos_naturales IS 
'Inventario de fenómenos naturales amenazantes en Nariño (2007-2024). Fuente: UNGRD - Datos Abiertos Colombia';

-- ============================================================================
-- TABLA 2: Municipios
-- ============================================================================
CREATE TABLE geo.municipios (
    id SERIAL PRIMARY KEY,
    codigo_dane VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) DEFAULT 'NARIÑO',
    poblacion_total INTEGER,
    anio_poblacion INTEGER,
    geom GEOMETRY(MultiPolygon, 4326) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_municipios_geom ON geo.municipios USING GIST(geom);
CREATE INDEX idx_municipios_codigo ON geo.municipios(codigo_dane);
CREATE INDEX idx_municipios_nombre ON geo.municipios(nombre);

COMMENT ON TABLE geo.municipios IS 
'Límites administrativos de los 64 municipios de Nariño con datos de población. Fuente: IGAC/DANE';

-- ============================================================================
-- TABLA 3: Estaciones IDEAM
-- ============================================================================
CREATE TABLE geo.estaciones (
    id SERIAL PRIMARY KEY,
    codigo_estacion VARCHAR(50) UNIQUE NOT NULL,
    nombre_estacion VARCHAR(200) NOT NULL,
    tipo_estacion VARCHAR(100),
    municipio VARCHAR(100),
    departamento VARCHAR(100) DEFAULT 'NARIÑO',
    latitud NUMERIC(10, 7) NOT NULL,
    longitud NUMERIC(10, 7) NOT NULL,
    elevacion_msnm INTEGER,
    estado VARCHAR(50),
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_estaciones_geom ON geo.estaciones USING GIST(geom);
CREATE INDEX idx_estaciones_codigo ON geo.estaciones(codigo_estacion);

COMMENT ON TABLE geo.estaciones IS 
'Estaciones meteorológicas de IDEAM en Nariño. Fuente: IDEAM - Datos Abiertos Colombia';

-- ============================================================================
-- TABLA 4: Zonas de Amenaza
-- ============================================================================
CREATE TABLE geo.zonas_amenaza (
    id SERIAL PRIMARY KEY,
    categoria VARCHAR(50) NOT NULL,
    descripcion TEXT,
    area_km2 NUMERIC(10, 2),
    municipio VARCHAR(100),
    tipo_fenomeno VARCHAR(100),
    fuente VARCHAR(100) DEFAULT 'DATOS ABIERTOS COLOMBIA - UNGRD',
    fuente_detalle TEXT,
    geom GEOMETRY(MultiPolygon, 4326) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_zonas_amenaza_geom ON geo.zonas_amenaza USING GIST(geom);
CREATE INDEX idx_zonas_amenaza_categoria ON geo.zonas_amenaza(categoria);
CREATE INDEX idx_zonas_amenaza_municipio ON geo.zonas_amenaza(municipio);

COMMENT ON TABLE geo.zonas_amenaza IS 
'Zonas de amenaza por movimientos en masa calculadas mediante análisis de densidad de eventos históricos (2007-2024)';

COMMENT ON COLUMN geo.zonas_amenaza.categoria IS 
'Nivel de amenaza: BAJA (<5 eventos), MEDIA (5-9), ALTA (10-19), MUY ALTA (≥20)';

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
SELECT 'Base de datos recreada exitosamente' as resultado;
SELECT schemaname, tablename FROM pg_tables WHERE schemaname IN ('public', 'geo') ORDER BY schemaname, tablename;
