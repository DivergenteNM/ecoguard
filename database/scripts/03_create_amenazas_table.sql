-- Crear tabla para zonas de amenaza si no existe
CREATE TABLE IF NOT EXISTS geo.zonas_amenaza (
    id SERIAL PRIMARY KEY,
    objectid BIGINT,
    categoria VARCHAR(50),  -- Nivel de amenaza (BAJA, MEDIA, ALTA, MUY ALTA)
    descripcion TEXT,
    area_km2 NUMERIC(10, 2),
    municipio VARCHAR(100),
    tipo_fenomeno VARCHAR(100),
    fuente VARCHAR(100) DEFAULT 'DATOS ABIERTOS COLOMBIA - UNGRD',
    fuente_detalle TEXT,
    geom GEOMETRY(GEOMETRY, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_zonas_amenaza_geom ON geo.zonas_amenaza USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_zonas_amenaza_categoria ON geo.zonas_amenaza (categoria);
CREATE INDEX IF NOT EXISTS idx_zonas_amenaza_municipio ON geo.zonas_amenaza (municipio);

-- Comentarios
COMMENT ON TABLE geo.zonas_amenaza IS 'Zonas de amenaza por movimientos en masa';
COMMENT ON COLUMN geo.zonas_amenaza.categoria IS 'Nivel de amenaza: BAJA, MEDIA, ALTA, MUY ALTA';
