-- Crear tabla para zonas de amenaza del SGC si no existe
CREATE TABLE IF NOT EXISTS geo.zonas_amenaza (
    id SERIAL PRIMARY KEY,
    objectid INTEGER,
    categoria VARCHAR(50),  -- Nivel de amenaza (BAJA, MEDIA, ALTA, MUY ALTA)
    descripcion TEXT,
    area_km2 NUMERIC,
    fuente VARCHAR(100) DEFAULT 'SGC - Mapa Nacional 100K',
    fecha_extraccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    geom GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_zonas_amenaza_geom ON geo.zonas_amenaza USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_zonas_amenaza_categoria ON geo.zonas_amenaza (categoria);

-- Comentarios
COMMENT ON TABLE geo.zonas_amenaza IS 'Zonas de amenaza por movimientos en masa del SGC';
COMMENT ON COLUMN geo.zonas_amenaza.categoria IS 'Nivel de amenaza: BAJA, MEDIA, ALTA, MUY ALTA';
COMMENT ON COLUMN geo.zonas_amenaza.geom IS 'Geometría del polígono de amenaza en WGS84';
