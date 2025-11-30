-- Poblar Zonas de Amenaza (VERSIÓN SIMPLIFICADA Y FUNCIONAL)
TRUNCATE TABLE geo.zonas_amenaza RESTART IDENTITY CASCADE;

INSERT INTO geo.zonas_amenaza (
    categoria,
    descripcion,
    area_km2,
    municipio,
    tipo_fenomeno,
    fuente,
    fuente_detalle,
    geom
)
SELECT 
    CASE 
        WHEN COUNT(*) >= 20 THEN 'MUY ALTA'
        WHEN COUNT(*) >= 10 THEN 'ALTA'
        WHEN COUNT(*) >= 5 THEN 'MEDIA'
        ELSE 'BAJA'
    END as categoria,
    
    'Zona calculada con ' || COUNT(*) || ' eventos (2007-2024)' as descripcion,
    
    (ST_Area(m.geom::geography) / 1000000)::numeric(10,2) as area_km2,
    
    m.nombre as municipio,
    
    (
        SELECT tipo_fenomeno_normalizado 
        FROM public.fenomenos_naturales 
        WHERE UPPER(TRANSLATE(municipio, 'ÁÉÍÓÚÑ', 'AEIOUN')) = UPPER(m.nombre)
        GROUP BY tipo_fenomeno_normalizado 
        ORDER BY COUNT(*) DESC 
        LIMIT 1
    ) as tipo_fenomeno,
    
    'DATOS ABIERTOS COLOMBIA - UNGRD' as fuente,
    
    'Zonificación calculada con eventos históricos' as fuente_detalle,
    
    m.geom
    
FROM public.fenomenos_naturales f
INNER JOIN geo.municipios m ON UPPER(TRANSLATE(f.municipio, 'ÁÉÍÓÚÑ', 'AEIOUN')) = UPPER(m.nombre)
WHERE f.geom IS NOT NULL
GROUP BY m.nombre, m.geom;

-- Reporte
SELECT categoria, COUNT(*) as municipios FROM geo.zonas_amenaza GROUP BY categoria ORDER BY CASE categoria WHEN 'MUY ALTA' THEN 1 WHEN 'ALTA' THEN 2 WHEN 'MEDIA' THEN 3 WHEN 'BAJA' THEN 4 END;
SELECT COUNT(*) as total FROM geo.zonas_amenaza;
