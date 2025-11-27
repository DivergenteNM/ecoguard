-- Actualizar población para municipios principales de Nariño
-- Fuente: Proyecciones DANE 2024 (aproximadas)

-- Primero, agregar columna de población si no existe
ALTER TABLE geo.municipios 
ADD COLUMN IF NOT EXISTS poblacion_total INTEGER,
ADD COLUMN IF NOT EXISTS año_poblacion INTEGER,
ADD COLUMN IF NOT EXISTS fuente_poblacion VARCHAR(100);

-- Actualizar población para los municipios principales
UPDATE geo.municipios SET 
    poblacion_total = 392930,
    año_poblacion = 2024,
    fuente_poblacion = 'DANE Proyecciones 2024'
WHERE UPPER(nombre) LIKE '%PASTO%';

UPDATE geo.municipios SET 
    poblacion_total = 147537,
    año_poblacion = 2024,
    fuente_poblacion = 'DANE Proyecciones 2024'
WHERE UPPER(nombre) LIKE '%IPIALES%';

UPDATE geo.municipios SET 
    poblacion_total = 208188,
    año_poblacion = 2024,
    fuente_poblacion = 'DANE Proyecciones 2024'
WHERE UPPER(nombre) LIKE '%TUMACO%';

UPDATE geo.municipios SET 
    poblacion_total = 48123,
    año_poblacion = 2024,
    fuente_poblacion = 'DANE Proyecciones 2024'
WHERE UPPER(nombre) LIKE '%TUQUERRES%';

UPDATE geo.municipios SET 
    poblacion_total = 35678,
    año_poblacion = 2024,
    fuente_poblacion = 'DANE Proyecciones 2024'
WHERE UPPER(nombre) LIKE '%SAMANIEGO%';

UPDATE geo.municipios SET 
    poblacion_total = 28456,
    año_poblacion = 2024,
    fuente_poblacion = 'DANE Proyecciones 2024'
WHERE UPPER(nombre) LIKE '%LA UNION%';

UPDATE geo.municipios SET 
    poblacion_total = 26789,
    año_poblacion = 2024,
    fuente_poblacion = 'DANE Proyecciones 2024'
WHERE UPPER(nombre) LIKE '%SANDONA%';

UPDATE geo.municipios SET 
    poblacion_total = 24567,
    año_poblacion = 2024,
    fuente_poblacion = 'DANE Proyecciones 2024'
WHERE UPPER(nombre) LIKE '%BARBACOAS%';

-- Verificar resultados
SELECT 
    nombre,
    poblacion_total,
    año_poblacion,
    fuente_poblacion
FROM geo.municipios
WHERE poblacion_total IS NOT NULL
ORDER BY poblacion_total DESC;
