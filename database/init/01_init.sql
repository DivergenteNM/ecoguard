-- =============================================================================
-- Script de Inicialización de Base de Datos - EcoGuard
-- =============================================================================

-- Habilitar extensión PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Verificar instalación
SELECT PostGIS_Version();

-- =============================================================================
-- ESQUEMAS
-- =============================================================================

-- Esquema para datos geoespaciales
CREATE SCHEMA IF NOT EXISTS geo;

-- Esquema para datos de IA
CREATE SCHEMA IF NOT EXISTS ia;

COMMENT ON SCHEMA geo IS 'Datos geoespaciales (municipios, estaciones, zonas)';
COMMENT ON SCHEMA ia IS 'Datos y predicciones del modelo de IA';

-- =============================================================================
-- TABLA: public.fenomenos_naturales
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.fenomenos_naturales (
    id SERIAL PRIMARY KEY,
    id_fenomeno INTEGER UNIQUE,
    municipio VARCHAR(100) NOT NULL,
    vereda VARCHAR(200),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    altura_msnm INTEGER,
    cuenca_hidrografica VARCHAR(200),
    tipo_fenomeno_original TEXT,
    tipo_fenomeno_normalizado VARCHAR(100),
    categoria_fenomeno VARCHAR(50),
    nivel_riesgo VARCHAR(20),
    numero_informe VARCHAR(50),
    fecha_reporte TIMESTAMP,
    año INTEGER,
    mes INTEGER,
    dia INTEGER,
    dias_desde_evento INTEGER,
    url_reporte TEXT,
    tiene_reporte BOOLEAN,
    coordenadas_validas BOOLEAN,
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para fenómenos
CREATE INDEX IF NOT EXISTS idx_fenomenos_municipio ON public.fenomenos_naturales(municipio);
CREATE INDEX IF NOT EXISTS idx_fenomenos_categoria ON public.fenomenos_naturales(categoria_fenomeno);
CREATE INDEX IF NOT EXISTS idx_fenomenos_fecha ON public.fenomenos_naturales(fecha_reporte);
CREATE INDEX IF NOT EXISTS idx_fenomenos_geom ON public.fenomenos_naturales USING GIST(geom);

COMMENT ON TABLE public.fenomenos_naturales IS 'Histórico de fenómenos naturales amenazantes en Nariño';

-- =============================================================================
-- TABLA: geo.estaciones
-- =============================================================================

CREATE TABLE IF NOT EXISTS geo.estaciones (
    id SERIAL PRIMARY KEY,
    codigo_estacion VARCHAR(50) UNIQUE NOT NULL,
    nombre_estacion VARCHAR(200),
    departamento VARCHAR(100),
    municipio VARCHAR(100),
    zona_hidrografica VARCHAR(200),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    tipo_estacion VARCHAR(100),
    estado VARCHAR(50),
    entidad VARCHAR(200),
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para estaciones
CREATE INDEX IF NOT EXISTS idx_estaciones_codigo ON geo.estaciones(codigo_estacion);
CREATE INDEX IF NOT EXISTS idx_estaciones_municipio ON geo.estaciones(municipio);
CREATE INDEX IF NOT EXISTS idx_estaciones_geom ON geo.estaciones USING GIST(geom);

COMMENT ON TABLE geo.estaciones IS 'Catálogo de estaciones de monitoreo IDEAM y terceros';

-- =============================================================================
-- TABLA: geo.observaciones_clima
-- =============================================================================

CREATE TABLE IF NOT EXISTS geo.observaciones_clima (
    id SERIAL PRIMARY KEY,
    estacion_id INTEGER REFERENCES geo.estaciones(id),
    codigo_sensor VARCHAR(50),
    descripcion_sensor VARCHAR(200),
    fecha_observacion TIMESTAMP NOT NULL,
    valor_observado DECIMAL(10, 2),
    unidad_medida VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para observaciones
CREATE INDEX IF NOT EXISTS idx_observaciones_estacion ON geo.observaciones_clima(estacion_id);
CREATE INDEX IF NOT EXISTS idx_observaciones_fecha ON geo.observaciones_clima(fecha_observacion);

COMMENT ON TABLE geo.observaciones_clima IS 'Observaciones climáticas de las estaciones';

-- =============================================================================
-- TABLA: geo.municipios
-- =============================================================================

CREATE TABLE IF NOT EXISTS geo.municipios (
    id SERIAL PRIMARY KEY,
    codigo_dane VARCHAR(10) UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    departamento VARCHAR(100),
    area_km2 DECIMAL(10, 2),
    poblacion INTEGER,
    poblacion_total INTEGER,
    anio_poblacion INTEGER,
    geom GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para municipios
CREATE INDEX IF NOT EXISTS idx_municipios_nombre ON geo.municipios(nombre);
CREATE INDEX IF NOT EXISTS idx_municipios_geom ON geo.municipios USING GIST(geom);

COMMENT ON TABLE geo.municipios IS 'Límites municipales de Nariño';

-- =============================================================================
-- TABLA: ia.predicciones_riesgo
-- =============================================================================

CREATE TABLE IF NOT EXISTS ia.predicciones_riesgo (
    id SERIAL PRIMARY KEY,
    municipio VARCHAR(100) NOT NULL,
    fecha_prediccion TIMESTAMP NOT NULL,
    tipo_amenaza VARCHAR(50),
    probabilidad DECIMAL(5, 4),
    nivel_riesgo VARCHAR(20),
    factores_contribuyentes JSONB,
    modelo_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para predicciones
CREATE INDEX IF NOT EXISTS idx_predicciones_municipio ON ia.predicciones_riesgo(municipio);
CREATE INDEX IF NOT EXISTS idx_predicciones_fecha ON ia.predicciones_riesgo(fecha_prediccion);

COMMENT ON TABLE ia.predicciones_riesgo IS 'Predicciones de riesgo generadas por el modelo de IA';

-- =============================================================================
-- FUNCIONES ÚTILES
-- =============================================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_fenomenos_updated_at
    BEFORE UPDATE ON public.fenomenos_naturales
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estaciones_updated_at
    BEFORE UPDATE ON geo.estaciones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_municipios_updated_at
    BEFORE UPDATE ON geo.municipios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- VISTAS ÚTILES
-- =============================================================================

-- Vista: Resumen de fenómenos por municipio
CREATE OR REPLACE VIEW public.v_fenomenos_por_municipio AS
SELECT 
    municipio,
    COUNT(*) as total_fenomenos,
    COUNT(CASE WHEN categoria_fenomeno = 'DESLIZAMIENTO' THEN 1 END) as deslizamientos,
    COUNT(CASE WHEN categoria_fenomeno = 'INUNDACION' THEN 1 END) as inundaciones,
    COUNT(CASE WHEN categoria_fenomeno = 'AVENIDA_TORRENCIAL' THEN 1 END) as avenidas,
    MAX(fecha_reporte) as ultimo_evento,
    AVG(altura_msnm) as altura_promedio
FROM public.fenomenos_naturales
WHERE coordenadas_validas = true
GROUP BY municipio
ORDER BY total_fenomenos DESC;

-- Vista: Estaciones activas por municipio
CREATE OR REPLACE VIEW geo.v_estaciones_activas AS
SELECT 
    e.codigo_estacion,
    e.nombre_estacion,
    e.municipio,
    e.tipo_estacion,
    e.latitud,
    e.longitud,
    e.geom
FROM geo.estaciones e
WHERE e.estado = 'ACTIVA';

-- =============================================================================
-- DATOS INICIALES
-- =============================================================================

-- Insertar municipios de Nariño (datos básicos)
-- Estos se actualizarán con geometrías reales después
INSERT INTO geo.municipios (codigo_dane, nombre, departamento) VALUES
('52001', 'PASTO', 'NARIÑO'),
('52356', 'IPIALES', 'NARIÑO'),
('52835', 'TUMACO', 'NARIÑO')
ON CONFLICT (codigo_dane) DO NOTHING;

-- =============================================================================
-- PERMISOS
-- =============================================================================

-- Otorgar permisos al usuario postgres
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA geo TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ia TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA geo TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA ia TO postgres;

-- =============================================================================
-- FINALIZACIÓN
-- =============================================================================

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Base de datos EcoGuard inicializada correctamente';
    RAISE NOTICE '📊 Esquemas creados: public, geo, ia';
    RAISE NOTICE '📋 Tablas creadas: fenomenos_naturales, estaciones, observaciones_clima, municipios, predicciones_riesgo';
    RAISE NOTICE '🗺️  PostGIS habilitado y listo';
END $$;
