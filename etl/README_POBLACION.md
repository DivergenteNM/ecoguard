# ETL de Población Municipal - EcoGuard

## 📊 Descripción

Este módulo ETL procesa datos de población municipal de Nariño provenientes del DANE (Departamento Administrativo Nacional de Estadística) y actualiza la base de datos PostgreSQL con información demográfica actualizada.

## 🔄 Flujo de Trabajo

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO ETL POBLACIÓN                      │
└─────────────────────────────────────────────────────────────┘

1. EXTRACCIÓN (poblacion_extractor.py)
   ├─ Archivo fuente: datasets/raw/poblacion/pob_municipios_narino.xlsx
   ├─ Lee archivo Excel con pandas
   ├─ Filtra por departamento: NARIÑO
   ├─ Filtra por año: 2024 (configurable)
   ├─ Normaliza nombres de columnas
   └─ Output: datasets/processed/poblacion_narino_2024.csv

2. VALIDACIÓN
   ├─ Verifica valores nulos
   ├─ Convierte población a enteros
   ├─ Valida códigos DANE (si existen)
   └─ Genera estadísticas de resumen

3. CARGA (add_population.py)
   ├─ Lee CSV procesado
   ├─ Conecta a PostgreSQL (geo.municipios)
   ├─ Actualización inteligente en 2 fases:
   │  ├─ Fase 1: Intenta por código DANE
   │  └─ Fase 2: Intenta por nombre (case-insensitive)
   ├─ Actualiza: poblacion_total, anio_poblacion, updated_at
   └─ Muestra estadísticas: actualizados vs no encontrados
```

## 📁 Estructura de Archivos

```
etl/
├── extractors/
│   └── poblacion_extractor.py    # Extractor principal
├── loaders/
│   └── add_population.py         # Loader con lógica de actualización
└── README_POBLACION.md           # Esta documentación

datasets/
├── raw/
│   └── poblacion/
│       └── pob_municipios_narino.xlsx  # Archivo fuente DANE
└── processed/
    └── poblacion_narino_2024.csv       # CSV limpio generado
```

## 🚀 Uso

### Requisitos Previos

1. **Archivo Excel de DANE**:
   - Ubicación: `datasets/raw/poblacion/pob_municipios_narino.xlsx`
   - Columnas requeridas: `DPNOM`, `AÑO`, `DPMP`, `Población`

2. **Dependencias Python**:
   ```bash
   pip install pandas openpyxl python-dotenv psycopg2-binary
   ```

3. **Base de datos PostgreSQL**:
   - Tabla `geo.municipios` creada
   - Columnas: `poblacion_total`, `anio_poblacion`, `codigo_dane`, `nombre`

### Ejecución Manual

```bash
# Paso 1: Extracción (genera CSV)
cd etl
python extractors/poblacion_extractor.py

# Salida esperada:
# ✅ Archivo leído: 64 filas
# ✅ Filtrado por año 2024: 64 registros
# ✅ 64 municipios encontrados en NARIÑO
# 📊 Resumen:
#    - Total municipios: 64
#    - Población total: 1,863,000
#    - Municipio más poblado: PASTO (413,484)

# Paso 2: Carga a PostgreSQL
python loaders/add_population.py

# Salida esperada:
# 📊 Leyendo datos de: datasets/processed/poblacion_narino_2024.csv
# 🚀 Iniciando actualización de población...
# ✅ Proceso finalizado:
#    - Municipios actualizados: 64
#    - No encontrados en BD: 0
# 🏆 Top 5 Municipios por población:
#   PASTO: 413,484 (Año 2024)
#   TUMACO: 208,188 (Año 2024)
#   IPIALES: 147,537 (Año 2024)
```

### Ejecución Automática (Script Maestro)

```powershell
# El script maestro ejecuta ambos pasos automáticamente
.\setup.ps1

# O si ya tienes la BD configurada:
.\setup.ps1 -SkipDocker
```

## 📝 Formato de Datos

### Archivo Excel Fuente (DANE)

| DPNOM  | AÑO  | DPMP  | Población |
|--------|------|-------|-----------|
| NARIÑO | 2024 | PASTO | 413484    |
| NARIÑO | 2024 | TUMACO| 208188    |
| NARIÑO | 2024 | IPIALES| 147537   |

**Columnas:**
- `DPNOM`: Nombre del departamento (filtro: "NARIÑO")
- `AÑO`: Año de la proyección (filtro: 2024)
- `DPMP`: Código o nombre del municipio
- `Población`: Población total proyectada

### CSV Procesado

```csv
poblacion_total,año,fuente,codigo_dane,municipio
413484,2024,DANE - Proyecciones (Nueva Fuente),,PASTO
208188,2024,DANE - Proyecciones (Nueva Fuente),,TUMACO
147537,2024,DANE - Proyecciones (Nueva Fuente),,IPIALES
```

### Tabla PostgreSQL (geo.municipios)

```sql
-- Estructura relevante
CREATE TABLE geo.municipios (
    id SERIAL PRIMARY KEY,
    codigo_dane VARCHAR(10) UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    poblacion_total INTEGER,          -- ✅ Actualizado por ETL
    anio_poblacion INTEGER,           -- ✅ Actualizado por ETL
    updated_at TIMESTAMP              -- ✅ Actualizado automáticamente
);
```

## 🔧 Configuración

### Variables de Entorno (db_config.env)

```env
DB_HOST=localhost
DB_PORT=5435
DB_NAME=ecoguard
DB_USER=postgres
DB_PASSWORD=postgres123
```

### Parámetros Configurables

#### `poblacion_extractor.py`

```python
# Cambiar año de extracción
extractor = PoblacionExtractor()
csv_file = extractor.extract_dane_data(
    departamento="NARIÑO",
    year=2025  # ← Cambiar aquí
)
```

#### `add_population.py`

```python
# El loader lee automáticamente:
# datasets/processed/poblacion_narino_2024.csv
# 
# Cambiar si usas otro año:
csv_path = os.path.join(base_dir, "datasets", "processed", "poblacion_narino_2025.csv")
```

## 🔍 Lógica de Actualización

El loader `add_population.py` implementa una estrategia de actualización en dos fases:

### Fase 1: Actualización por Código DANE

```sql
UPDATE geo.municipios 
SET poblacion_total = %s, 
    anio_poblacion = %s,
    updated_at = CURRENT_TIMESTAMP
WHERE codigo_dane = %s
```

- **Ventaja**: Precisión máxima
- **Requisito**: Código DANE válido en CSV
- **Uso**: Cuando el archivo tiene códigos explícitos

### Fase 2: Actualización por Nombre

```sql
UPDATE geo.municipios 
SET poblacion_total = %s, 
    anio_poblacion = %s,
    updated_at = CURRENT_TIMESTAMP
WHERE UPPER(nombre) = %s 
  AND poblacion_total IS DISTINCT FROM %s
```

- **Ventaja**: Funciona sin códigos DANE
- **Normalización**: Case-insensitive (PASTO = pasto)
- **Uso**: Fallback cuando no hay código o cuando el código falló

### Prevención de Duplicados

```python
# Solo actualiza si el valor es diferente
AND poblacion_total IS DISTINCT FROM %s
```

Esto evita triggers innecesarios de `updated_at` cuando los datos no cambian.

## 📊 Validación de Datos

### Verificar Datos Cargados

```sql
-- Contar municipios con población
SELECT COUNT(*) 
FROM geo.municipios 
WHERE poblacion_total IS NOT NULL;

-- Top 10 municipios por población
SELECT nombre, poblacion_total, anio_poblacion
FROM geo.municipios
WHERE poblacion_total IS NOT NULL
ORDER BY poblacion_total DESC
LIMIT 10;

-- Municipios sin población
SELECT nombre, codigo_dane
FROM geo.municipios
WHERE poblacion_total IS NULL;

-- Suma total de población
SELECT SUM(poblacion_total) as poblacion_total_narino
FROM geo.municipios;
```

### Auditoría de Actualización

```sql
-- Ver última actualización
SELECT nombre, poblacion_total, anio_poblacion, updated_at
FROM geo.municipios
WHERE poblacion_total IS NOT NULL
ORDER BY updated_at DESC
LIMIT 10;
```

## ⚠️ Troubleshooting

### Problema: "No se encontró el archivo de datos"

```bash
❌ No se encontró el archivo de datos: datasets/processed/poblacion_narino_2024.csv
💡 Ejecuta primero: python etl/extractors/poblacion_extractor.py
```

**Solución:**
```bash
# Ejecutar extractor primero
python etl/extractors/poblacion_extractor.py
```

### Problema: "No encontrado en BD"

```bash
⚠️  No encontrado: SANTACRUZ (Cod: None)
```

**Causas posibles:**
1. Nombre en CSV no coincide con nombre en BD
2. Municipio no existe en tabla `geo.municipios`
3. Diferencias en acentos o mayúsculas

**Solución:**
```sql
-- Verificar nombres exactos en BD
SELECT nombre FROM geo.municipios ORDER BY nombre;

-- Comparar con CSV
-- Si hay diferencias, actualizar manualmente:
UPDATE geo.municipios SET nombre = 'SANTACRUZ' WHERE nombre = 'SANTA CRUZ';
```

### Problema: Error de conexión PostgreSQL

```bash
psycopg2.OperationalError: could not connect to server
```

**Solución:**
```bash
# Verificar que el contenedor esté corriendo
docker ps | grep ecoguard_postgres

# Verificar puerto
docker port ecoguard_postgres

# Verificar variables de entorno
cat etl/db_config.env
```

### Problema: Archivo Excel no encontrado

```bash
FileNotFoundError: datasets/raw/poblacion/pob_municipios_narino.xlsx
```

**Solución:**
1. Descargar archivo del DANE
2. Colocarlo en `datasets/raw/poblacion/`
3. Verificar nombre exacto del archivo

## 📈 Estadísticas Esperadas

| Métrica | Valor Esperado |
|---------|----------------|
| Municipios de Nariño | 64 |
| Municipios actualizados | 64 |
| Población total departamento | ~1,863,000 |
| Municipio más poblado | PASTO (~413,484) |
| Año de datos | 2024 |

## 🔄 Actualización Periódica

### Proceso Anual

Cada año cuando el DANE publique nuevas proyecciones:

1. **Descargar nuevo archivo Excel**:
   ```bash
   # Colocar en: datasets/raw/poblacion/pob_municipios_narino.xlsx
   ```

2. **Ejecutar ETL completo**:
   ```bash
   python etl/extractors/poblacion_extractor.py
   python etl/loaders/add_population.py
   ```

3. **Verificar actualización**:
   ```sql
   SELECT DISTINCT anio_poblacion FROM geo.municipios;
   -- Debería mostrar el nuevo año
   ```

## 📚 Referencias

- **DANE**: [https://www.dane.gov.co/](https://www.dane.gov.co/)
- **Proyecciones de Población**: [Portal DANE Proyecciones](https://www.dane.gov.co/index.php/estadisticas-por-tema/demografia-y-poblacion/proyecciones-de-poblacion)
- **Código DANE**: [Divipola](https://www.dane.gov.co/index.php/sistema-estadistico-nacional-sen/nomenclaturas-y-clasificaciones/codigos-de-identificacion)

## ✅ Checklist de Validación

Después de ejecutar el ETL, verificar:

- [ ] Archivo CSV procesado generado en `datasets/processed/`
- [ ] 64 municipios en el CSV
- [ ] Loader ejecutado sin errores
- [ ] 64 municipios actualizados en PostgreSQL
- [ ] Campo `poblacion_total` poblado correctamente
- [ ] Campo `anio_poblacion` = 2024
- [ ] Suma total de población ~1,863,000
- [ ] PASTO es el municipio más poblado
- [ ] Campo `updated_at` actualizado recientemente

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0  
**Responsable**: EcoGuard Team - Universidad de Nariño
