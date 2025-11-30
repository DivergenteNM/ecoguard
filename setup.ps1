<#
.SYNOPSIS
    Script maestro para configuración completa del proyecto EcoGuard
.DESCRIPTION
    Automatiza la creación de contenedores Docker, base de datos PostgreSQL + PostGIS,
    extracción de datos desde fuentes externas, transformación y carga (ETL) completa.
.NOTES
    Autor: EcoGuard Team
    Versión: 1.0
    Requisitos: Docker, Docker Compose, Python 3.11+, Node.js 18+
#>

param(
    [switch]$SkipExtraction,
    [switch]$SkipDocker,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$VerbosePreference = if ($Verbose) { "Continue" } else { "SilentlyContinue" }

# Colores para output
function Write-ColorOutput($ForegroundColor, $Message) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $Message
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Step($Message) {
    Write-ColorOutput Cyan "`n▶ $Message"
}

function Write-Success($Message) {
    Write-ColorOutput Green "[OK] $Message"
}

function Write-Error($Message) {
    Write-ColorOutput Red "[X] $Message"
}

function Write-Info($Message) {
    Write-ColorOutput Yellow "[i] $Message"
}

# Banner
Clear-Host
Write-ColorOutput Magenta @"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ███████╗ ██████╗ ██████╗  ██████╗ ██╗   ██╗ █████╗    ║
║   ██╔════╝██╔════╝██╔═══██╗██╔════╝ ██║   ██║██╔══██╗   ║
║   █████╗  ██║     ██║   ██║██║  ███╗██║   ██║███████║   ║
║   ██╔══╝  ██║     ██║   ██║██║   ██║██║   ██║██╔══██║   ║
║   ███████╗╚██████╗╚██████╔╝╚██████╔╝╚██████╔╝██║  ██║   ║
║   ╚══════╝ ╚═════╝ ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ║
║                                                           ║
║        Sistema de Predicción de Amenazas Ambientales     ║
║                      Setup Maestro v1.0                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
"@

Write-Info "Iniciando configuración completa del sistema..."
Write-Info "Ubicación: $PWD"
Write-Output ""

# ============================================================================
# PASO 1: Verificar Requisitos
# ============================================================================
Write-Step "PASO 1/9: Verificando requisitos del sistema"

# Verificar Docker
try {
    $dockerVersion = docker --version
    Write-Success "Docker encontrado: $dockerVersion"
} catch {
    Write-Error "Docker no está instalado o no está en el PATH"
    Write-Info "Descarga Docker Desktop desde: https://www.docker.com/products/docker-desktop"
    exit 1
}

# Verificar Docker Compose
try {
    $composeVersion = docker-compose --version
    Write-Success "Docker Compose encontrado: $composeVersion"
} catch {
    Write-Error "Docker Compose no está instalado"
    exit 1
}

# Verificar Python
try {
    $pythonVersion = python --version
    Write-Success "Python encontrado: $pythonVersion"
} catch {
    Write-Error "Python no está instalado o no está en el PATH"
    Write-Info "Descarga Python 3.11+ desde: https://www.python.org/downloads/"
    exit 1
}

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Success "Node.js encontrado: $nodeVersion"
} catch {
    Write-Error "Node.js no está instalado o no está en el PATH"
    Write-Info "Descarga Node.js 18+ desde: https://nodejs.org/"
    exit 1
}

# ============================================================================
# PASO 2: Limpiar Contenedores y Volúmenes Existentes
# ============================================================================
Write-Step "PASO 2/9: Limpiando contenedores y volúmenes existentes"

# Detener y eliminar contenedores
$containers = @("ecoguard_postgres", "ecoguard_ai_service", "ecoguard_pgadmin")
foreach ($container in $containers) {
    $exists = docker ps -a --filter "name=$container" --format "{{.Names}}"
    if ($exists) {
        Write-Info "Deteniendo contenedor $container..."
        docker stop $container 2>$null
        Write-Info "Eliminando contenedor $container..."
        docker rm $container 2>$null
        Write-Success "Contenedor $container eliminado"
    }
}

# Eliminar volúmenes
$volume = "ecoguard_postgres_data"
$volumeExists = docker volume ls --filter "name=$volume" --format "{{.Name}}"
if ($volumeExists) {
    Write-Info "Eliminando volumen $volume..."
    docker volume rm $volume 2>$null
    Write-Success "Volumen $volume eliminado"
}

# Eliminar red
$network = "ecoguard_ecoguard_network"
$networkExists = docker network ls --filter "name=$network" --format "{{.Name}}"
if ($networkExists) {
    Write-Info "Eliminando red $network..."
    docker network rm $network 2>$null
    Write-Success "Red $network eliminada"
}

# ============================================================================
# PASO 3: Crear Contenedor PostgreSQL + PostGIS
# ============================================================================
if (-not $SkipDocker) {
    Write-Step "PASO 3/9: Creando contenedor PostgreSQL + PostGIS"
    
    Write-Info "Levantando servicio postgres..."
    docker-compose up -d postgres
    
    Write-Info "Esperando que PostgreSQL esté listo..."
    $maxAttempts = 30
    $attempt = 0
    $ready = $false
    
    while (-not $ready -and $attempt -lt $maxAttempts) {
        $attempt++
        Start-Sleep -Seconds 2
        $health = docker inspect --format='{{.State.Health.Status}}' ecoguard_postgres 2>$null
        if ($health -eq "healthy") {
            $ready = $true
            Write-Success "PostgreSQL está listo y saludable"
        } else {
            Write-Host "." -NoNewline
        }
    }
    
    if (-not $ready) {
        Write-Error "PostgreSQL no respondió después de $maxAttempts intentos"
        exit 1
    }
} else {
    Write-Info "Omitiendo creación de contenedores Docker (--SkipDocker)"
}

# ============================================================================
# PASO 4: Crear Estructura de Base de Datos
# ============================================================================
Write-Step "PASO 4/9: Creando estructura de base de datos"

Write-Info "Ejecutando scripts de inicialización..."

# Script 01: Inicialización base
Write-Info "  → 01_init.sql: Creando extensiones y esquemas"
Get-Content database/init/01_init.sql | docker exec -i ecoguard_postgres psql -U postgres -d ecoguard
if ($LASTEXITCODE -eq 0) {
    Write-Success "  [OK] Extensiones PostGIS y esquemas creados"
} else {
    Write-Error "Error ejecutando 01_init.sql"
    exit 1
}

# Script 02: Población inicial
Write-Info "  → 02_add_population.sql: Agregando datos de población"
Get-Content database/scripts/02_add_population.sql | docker exec -i ecoguard_postgres psql -U postgres -d ecoguard
if ($LASTEXITCODE -eq 0) {
    Write-Success "  [OK] Columnas de población agregadas"
} else {
    Write-Error "Error ejecutando 02_add_population.sql"
    exit 1
}

# Script 03: Tabla de amenazas
Write-Info "  → 03_create_amenazas_table.sql: Creando tabla de amenazas"
Get-Content database/scripts/03_create_amenazas_table.sql | docker exec -i ecoguard_postgres psql -U postgres -d ecoguard
if ($LASTEXITCODE -eq 0) {
    Write-Success "  [OK] Tabla geo.zonas_amenaza creada"
} else {
    Write-Error "Error ejecutando 03_create_amenazas_table.sql"
    exit 1
}

# Script 05: Tabla NDVI
Write-Info "  → 05_create_ndvi_table.sql: Creando tabla NDVI"
Get-Content database/scripts/05_create_ndvi_table.sql | docker exec -i ecoguard_postgres psql -U postgres -d ecoguard
if ($LASTEXITCODE -eq 0) {
    Write-Success "  [OK] Tabla geo.ndvi_data creada"
} else {
    Write-Error "Error ejecutando 05_create_ndvi_table.sql"
    exit 1
}

# ============================================================================
# PASO 5: Instalar Dependencias de Python
# ============================================================================
Write-Step "PASO 5/9: Instalando dependencias de Python para ETL"

Set-Location etl
if (Test-Path "requirements.txt") {
    Write-Info "Verificando versión de Python..."
    $pythonVersion = python --version 2>&1
    Write-Info "  Python detectado: $pythonVersion"
    
    if ($pythonVersion -match "Python 3\.13") {
        Write-Info "  [!] Python 3.13 detectado - instalando pandas desde binarios pre-compilados"
        python -m pip install --quiet --upgrade pip
        python -m pip install --quiet --only-binary :all: pandas
        python -m pip install --quiet requests python-dotenv psycopg2-binary
    } else {
        Write-Info "Instalando paquetes desde requirements.txt..."
        python -m pip install --quiet --upgrade pip
        python -m pip install --quiet -r requirements.txt
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Dependencias de Python instaladas"
    } else {
        Write-Error "Error instalando dependencias de Python"
        Write-Info "  Intentando instalación alternativa sin geopandas..."
        python -m pip install --quiet requests pandas python-dotenv psycopg2-binary
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Dependencias básicas instaladas (sin geopandas)"
        } else {
            Write-Error "Error crítico instalando dependencias"
            Set-Location ..
            exit 1
        }
    }
} else {
    Write-Error "No se encontró etl/requirements.txt"
    Set-Location ..
    exit 1
}
Set-Location ..

# ============================================================================
# PASO 6: Extracción de Datos (Opcional)
# ============================================================================
if (-not $SkipExtraction) {
    Write-Step "PASO 6/9: Extrayendo datos desde fuentes externas"
    Write-Info "Este paso puede tardar varios minutos..."
    
    # Estaciones IDEAM
    Write-Info "  → Extrayendo estaciones meteorológicas IDEAM..."
    python etl/extractors/estaciones_extractor.py
    if ($LASTEXITCODE -eq 0) {
        Write-Success "  Estaciones IDEAM extraídas"
    } else {
        Write-Error "Error extrayendo estaciones"
    }
    
    # Fenómenos UNGRD
    Write-Info "  → Extrayendo fenómenos naturales UNGRD..."
    python etl/extractors/fenomenos_extractor.py
    if ($LASTEXITCODE -eq 0) {
        Write-Success "  Fenómenos UNGRD extraídos"
    } else {
        Write-Error "Error extrayendo fenómenos"
    }
    
    # Amenazas SGC
    Write-Info "  → Extrayendo zonas de amenaza SGC..."
    python etl/extractors/amenazas_sgc_extractor.py
    if ($LASTEXITCODE -eq 0) {
        Write-Success "  Zonas de amenaza SGC extraídas"
    } else {
        Write-Error "Error extrayendo amenazas SGC"
    }
    
    # NDVI Google Earth Engine (requiere autenticación)
    Write-Info "  → Extrayendo datos NDVI desde Google Earth Engine..."
    Write-Info "  [i] Este paso requiere autenticación con Google Earth Engine"
    # python etl/extractors/ndvi_extractor.py
    Write-Info "  [!] Extracción NDVI omitida (requiere autenticación GEE)"
    
} else {
    Write-Info "Omitiendo extracción de datos (--SkipExtraction)"
    Write-Info "Usando archivos existentes en datasets/raw/"
}

# ============================================================================
# PASO 7: Transformación de Datos
# ============================================================================
Write-Step "PASO 7/9: Transformando datos"

# Transformar estaciones
if (Test-Path "datasets/raw/estaciones_ideam_narino.csv") {
    Write-Info "  → Limpiando y transformando estaciones..."
    python etl/transformers/estaciones_transformer.py
    if ($LASTEXITCODE -eq 0) {
        Write-Success "  Estaciones transformadas"
    } else {
        Write-Error "Error transformando estaciones"
    }
} else {
    Write-Info "  [!] Archivo de estaciones no encontrado, omitiendo transformación"
}

# Transformar fenómenos
if (Test-Path "datasets/raw/fenomenos_naturales_narino.csv") {
    Write-Info "  → Limpiando y transformando fenómenos..."
    python etl/transformers/fenomenos_transformer.py
    if ($LASTEXITCODE -eq 0) {
        Write-Success "  Fenómenos transformados"
    } else {
        Write-Error "Error transformando fenómenos"
    }
} else {
    Write-Info "  [!] Archivo de fenómenos no encontrado, omitiendo transformación"
}

# ============================================================================
# PASO 8: Carga de Datos (ETL Load)
# ============================================================================
Write-Step "PASO 8/9: Cargando datos a PostgreSQL"

# Cargar municipios
Write-Info "  → Cargando municipios de Nariño..."
python etl/loaders/municipios_loader.py
if ($LASTEXITCODE -eq 0) {
    $count = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c "SELECT COUNT(*) FROM geo.municipios;"
    Write-Success "  Municipios cargados: $($count.Trim()) registros"
} else {
    Write-Error "Error cargando municipios"
}

# Cargar estaciones
Write-Info "  → Cargando estaciones meteorológicas..."
python etl/loaders/estaciones_loader.py
if ($LASTEXITCODE -eq 0) {
    $count = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c "SELECT COUNT(*) FROM geo.estaciones;"
    if ($count) {
        Write-Success "  [OK] Estaciones cargadas: $($count.Trim()) registros"
    } else {
        Write-Success "  [OK] Estaciones cargadas"
    }
} else {
    Write-Error "Error cargando estaciones"
}

# Cargar fenómenos
Write-Info "  → Cargando fenómenos naturales..."
python etl/loaders/fenomenos_loader.py
if ($LASTEXITCODE -eq 0) {
    $count = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c "SELECT COALESCE((SELECT COUNT(*) FROM public.fenomenos_naturales), 0);" 2>$null
    if ($count -and $count.Trim()) {
        Write-Success "  [OK] Fenómenos cargados: $($count.Trim()) registros"
    } else {
        Write-Success "  [OK] Fenómenos cargados"
    }
} else {
    Write-Error "Error cargando fenómenos"
}

# Cargar población
Write-Info "  → Actualizando datos de población..."
python etl/loaders/add_population.py
if ($LASTEXITCODE -eq 0) {
    Write-Success "  [OK] Datos de población actualizados"
} else {
    Write-Error "Error actualizando población"
}

# Cargar amenazas
Write-Info "  → Cargando zonas de amenaza..."
python etl/loaders/amenazas_loader.py
if ($LASTEXITCODE -eq 0) {
    $count = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c "SELECT COUNT(*) FROM geo.zonas_amenaza;" 2>$null
    if ($count -and $count.Trim()) {
        Write-Success "  [OK] Zonas de amenaza cargadas: $($count.Trim()) registros"
    } else {
        Write-Success "  [OK] Zonas de amenaza cargadas"
    }
} else {
    Write-Error "Error cargando amenazas"
}

# Cargar NDVI
Write-Info "  → Cargando datos NDVI..."
python etl/loaders/ndvi_loader.py
if ($LASTEXITCODE -eq 0) {
    $count = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c "SELECT COUNT(*) FROM geo.ndvi_data;" 2>$null
    if ($count -and $count.Trim()) {
        Write-Success "  [OK] Datos NDVI cargados: $($count.Trim()) registros"
    } else {
        Write-Success "  [OK] Datos NDVI cargados"
    }
} else {
    Write-Error "Error cargando NDVI"
}

# ============================================================================
# PASO 9: Validación de Integridad de Datos
# ============================================================================
Write-Step "PASO 9/9: Validando integridad de datos"

Write-Info "Ejecutando verificaciones de integridad..."

# Contar registros por tabla
$tables = @(
    @{Schema="geo"; Table="municipios"; MinExpected=60},
    @{Schema="geo"; Table="estaciones"; MinExpected=1},
    @{Schema="public"; Table="fenomenos_naturales"; MinExpected=300},
    @{Schema="geo"; Table="zonas_amenaza"; MinExpected=20},
    @{Schema="geo"; Table="ndvi_data"; MinExpected=1}
)

$allValid = $true
foreach ($tableInfo in $tables) {
    $schema = $tableInfo.Schema
    $table = $tableInfo.Table
    $minExpected = $tableInfo.MinExpected
    
    $countResult = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c "SELECT COUNT(*) FROM $schema.$table;" 2>$null
    if ($countResult) {
        # Si es array, tomar primer elemento
        if ($countResult -is [array]) {
            $countResult = $countResult[0]
        }
        
        $countStr = $countResult.Trim()
        if ($countStr -and $countStr -match '^\d+$') {
            $count = [int]$countStr
            
            if ($count -ge $minExpected) {
                Write-Success "  [OK] $schema.$table`: $count registros (esperado: mínimo $minExpected)"
            } else {
                Write-Error "  [X] $schema.$table`: $count registros (esperado: mínimo $minExpected)"
                $allValid = $false
            }
        } else {
            Write-Error "  [X] $schema.$table`: Resultado inválido: '$countStr'"
            $allValid = $false
        }
    } else {
        Write-Error "  [X] $schema.$table`: No se pudo obtener conteo"
        $allValid = $false
    }
}

# Verificar geometrías válidas
Write-Info "`nVerificando geometrías..."
$invalidGeomsResult = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c "SELECT COUNT(*) FROM geo.municipios WHERE NOT ST_IsValid(geom);" 2>$null
if ($invalidGeomsResult) {
    if ($invalidGeomsResult -is [array]) {
        $invalidGeomsResult = $invalidGeomsResult[0]
    }
    
    $invalidGeomsStr = $invalidGeomsResult.Trim()
    if ($invalidGeomsStr -match '^\d+$') {
        $invalidGeoms = [int]$invalidGeomsStr
        
        if ($invalidGeoms -eq 0) {
            Write-Success "  [OK] Todas las geometrías de municipios son válidas"
        } else {
            Write-Error "  [X] Se encontraron $invalidGeoms geometrías inválidas"
            $allValid = $false
        }
    } else {
        Write-Info "  [INFO] No se pudo verificar geometrías (resultado: '$invalidGeomsStr')"
    }
} else {
    Write-Info "  [INFO] No se pudo verificar geometrías"
}

# Verificar coordenadas
Write-Info "`nVerificando coordenadas..."
$fenomenosExist = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public' AND table_name='fenomenos_naturales';" 2>$null
if ($fenomenosExist) {
    if ($fenomenosExist -is [array]) { $fenomenosExist = $fenomenosExist[0] }
    $fenomenosExistStr = $fenomenosExist.Trim()
    if ($fenomenosExistStr -match '^\d+$') {
        $fenomenosExist = [int]$fenomenosExistStr
    } else {
        $fenomenosExist = 0
    }
} else {
    $fenomenosExist = 0
}

if ($fenomenosExist -gt 0) {
    $outOfBounds = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c @"
SELECT COUNT(*) FROM public.fenomenos_naturales 
WHERE latitud NOT BETWEEN 0.5 AND 2.0 
   OR longitud NOT BETWEEN -79.0 AND -76.5;
"@ 2>$null
    if ($outOfBounds) {
        if ($outOfBounds -is [array]) { $outOfBounds = $outOfBounds[0] }
        $outOfBoundsStr = $outOfBounds.Trim()
        if ($outOfBoundsStr -match '^\d+$') {
            $outOfBounds = [int]$outOfBoundsStr
            
            if ($outOfBounds -eq 0) {
                Write-Success "  [OK] Todas las coordenadas de fenómenos están dentro de Nariño"
            } else {
                Write-Info "  [INFO] Se encontraron $outOfBounds registros con coordenadas fuera de rango (puede ser normal)"
            }
        }
    }
} else {
    Write-Info "  [INFO] Tabla fenomenos_naturales no existe aún"
}

# ============================================================================
# RESUMEN FINAL
# ============================================================================
Write-Output ""
Write-ColorOutput Magenta "╔═══════════════════════════════════════════════════════════╗"
Write-ColorOutput Magenta "║           CONFIGURACIÓN COMPLETADA EXITOSAMENTE           ║"
Write-ColorOutput Magenta "╚═══════════════════════════════════════════════════════════╝"
Write-Output ""

if ($allValid) {
    Write-Success "[OK] Base de datos configurada y validada correctamente"
} else {
    Write-Info "[!] Base de datos configurada con algunas advertencias"
}

Write-Output ""
Write-ColorOutput Cyan "📊 ESTADÍSTICAS DE LA BASE DE DATOS:"
Write-Output ""

# Obtener estadísticas de todas las tablas existentes
$statsMunicipios = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c "SELECT COUNT(*) FROM geo.municipios;" 2>$null
$statsEstaciones = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c "SELECT COUNT(*) FROM geo.estaciones;" 2>$null
$statsFenomenos = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c "SELECT COALESCE((SELECT COUNT(*) FROM public.fenomenos_naturales WHERE 1=1), 0);" 2>$null
if (-not $statsFenomenos) { $statsFenomenos = "0" }
$statsAmenazas = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c "SELECT COUNT(*) FROM geo.zonas_amenaza;" 2>$null
$statsNDVI = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c "SELECT COUNT(*) FROM geo.ndvi_data;" 2>$null

Write-Output "  Municipios:        $($statsMunicipios.Trim()) registros"
Write-Output "  Estaciones:        $($statsEstaciones.Trim()) registros"
Write-Output "  Fenómenos:         $($statsFenomenos.Trim()) registros"
Write-Output "  Zonas de Amenaza:  $($statsAmenazas.Trim()) registros"
Write-Output "  Datos NDVI:        $($statsNDVI.Trim()) registros"
Write-Output ""

# Validar datos esperados
$municipiosCount = [int]$statsMunicipios.Trim()
$estacionesCount = [int]$statsEstaciones.Trim()
$fenomenosCount = [int]$statsFenomenos.Trim()
$amenazasCount = [int]$statsAmenazas.Trim()
$ndviCount = [int]$statsNDVI.Trim()

$warnings = @()
if ($municipiosCount -lt 60) { $warnings += "  ⚠ Se esperaban al menos 60 municipios, se encontraron $municipiosCount" }
if ($estacionesCount -lt 1) { $warnings += "  ⚠ Se esperaban al menos 1 estación, se encontraron $estacionesCount" }
if ($fenomenosCount -lt 300) { $warnings += "  ⚠ Se esperaban al menos 300 fenómenos, se encontraron $fenomenosCount" }
if ($amenazasCount -lt 20) { $warnings += "  ⚠ Se esperaban al menos 20 zonas de amenaza, se encontraron $amenazasCount" }

if ($warnings.Count -gt 0) {
    Write-ColorOutput Yellow "`n⚠ ADVERTENCIAS:"
    foreach ($warning in $warnings) {
        Write-Output $warning
    }
    Write-Output ""
}
Write-ColorOutput Cyan "🚀 PRÓXIMOS PASOS:"
Write-Output ""
Write-Output "  1. Iniciar servicio de IA:"
Write-Output "     docker-compose up -d ai-service"
Write-Output ""
Write-Output "  2. Instalar dependencias del backend:"
Write-Output "     cd backend"
Write-Output "     npm install"
Write-Output ""
Write-Output "  3. Iniciar backend en modo desarrollo:"
Write-Output "     npm run start:dev"
Write-Output ""
Write-Output "  4. Acceder a la API:"
Write-Output "     http://localhost:3000"
Write-Output "     Swagger: http://localhost:3000/api"
Write-Output ""
Write-Output "  5. Ver logs de contenedores:"
Write-Output "     docker logs ecoguard_postgres"
Write-Output "     docker logs ecoguard_ai_service"
Write-Output ""

Write-ColorOutput Green "[OK] Setup completado! El sistema EcoGuard esta listo para usarse."
Write-Output ""
