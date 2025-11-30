-- Crear tabla para datos NDVI (Índice de Vegetación)
CREATE TABLE IF NOT EXISTS geo.ndvi_data (
    id SERIAL PRIMARY KEY,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    fecha_extraccion TIMESTAMP,
    ndvi_max NUMERIC(10, 8),
    ndvi_mean NUMERIC(10, 8),
    ndvi_min NUMERIC(10, 8),
    interpretacion VARCHAR(100),
    imagenes_procesadas INTEGER,
    nubosidad_maxima INTEGER,
    region VARCHAR(200),
    fuente VARCHAR(200),
    resolucion_espacial_m INTEGER,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_ndvi_fecha_inicio ON geo.ndvi_data(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_ndvi_fecha_fin ON geo.ndvi_data(fecha_fin);
CREATE INDEX IF NOT EXISTS idx_ndvi_mean ON geo.ndvi_data(ndvi_mean);

-- Comentarios
COMMENT ON TABLE geo.ndvi_data IS 'Índices de Vegetación NDVI de Sentinel-2 vía Google Earth Engine';
COMMENT ON COLUMN geo.ndvi_data.ndvi_max IS 'Valor máximo de NDVI en el período';
COMMENT ON COLUMN geo.ndvi_data.ndvi_mean IS 'Valor promedio de NDVI en el período';
COMMENT ON COLUMN geo.ndvi_data.ndvi_min IS 'Valor mínimo de NDVI en el período';
COMMENT ON COLUMN geo.ndvi_data.interpretacion IS 'Interpretación del NDVI (Vegetación densa, escasa, etc.)';
