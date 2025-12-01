-- ============================================================================
-- ADVERTENCIA: ESTE SCRIPT ESTÁ OBSOLETO
-- ============================================================================
-- 
-- ⚠️  Este script ya NO se usa en el flujo ETL actual de EcoGuard.
-- 
-- La población ahora se carga mediante el proceso ETL de Python:
--   1. python etl/extractors/poblacion_extractor.py
--   2. python etl/loaders/add_population.py
-- 
-- Este archivo se mantiene solo como referencia histórica de los
-- datos de población que se usaban antes de implementar el ETL automático.
-- 
-- Para más información, consultar: etl/README_POBLACION.md
-- ============================================================================

-- Actualizar población de municipios principales (Censo DANE 2018 proyectado 2023)
-- NOTA: Estos datos son del 2023 y están desactualizados.
-- El ETL ahora carga datos del 2024 desde archivo Excel del DANE.

UPDATE geo.municipios SET poblacion_total = 392930, anio_poblacion = 2023 WHERE nombre = 'PASTO';
UPDATE geo.municipios SET poblacion_total = 208188, anio_poblacion = 2023 WHERE nombre = 'TUMACO';
UPDATE geo.municipios SET poblacion_total = 147537, anio_poblacion = 2023 WHERE nombre = 'IPIALES';
UPDATE geo.municipios SET poblacion_total = 48123, anio_poblacion = 2023 WHERE nombre = 'TUQUERRES';
UPDATE geo.municipios SET poblacion_total = 35678, anio_poblacion = 2023 WHERE nombre = 'SAMANIEGO';
UPDATE geo.municipios SET poblacion_total = 28456, anio_poblacion = 2023 WHERE nombre = 'LA UNION';
UPDATE geo.municipios SET poblacion_total = 26789, anio_poblacion = 2023 WHERE nombre = 'SANDONA';
UPDATE geo.municipios SET poblacion_total = 24567, anio_poblacion = 2023 WHERE nombre = 'BARBACOAS';
