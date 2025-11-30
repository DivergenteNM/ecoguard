# ============================================================================
# Script de Verificación Rápida de Datos - EcoGuard
# ============================================================================

param(
    [switch]$Detailed = $false
)

function Write-Header {
    Write-Host "`n╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║         EcoGuard - Verificación de Datos                ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan
}

function Write-Success { param($Message) Write-Host "[OK] $Message" -ForegroundColor Green }
function Write-Error { param($Message) Write-Host "[X] $Message" -ForegroundColor Red }
function Write-Info { param($Message) Write-Host "[i] $Message" -ForegroundColor Cyan }

# Verificar que PostgreSQL esté corriendo
Write-Header
Write-Info "Verificando estado del contenedor PostgreSQL..."

$containerStatus = docker ps --filter "name=ecoguard_postgres" --format "{{.Status}}" 2>$null
if ($containerStatus -match "Up") {
    Write-Success "Contenedor ecoguard_postgres está corriendo"
} else {
    Write-Error "Contenedor ecoguard_postgres no está corriendo"
    Write-Info "Ejecuta: docker-compose up -d postgres"
    exit 1
}

# Verificar conteos de tablas
Write-Info "`nVerificando conteos de registros...`n"

$tables = @(
    @{Schema="geo"; Table="municipios"; MinExpected=60; Name="Municipios"},
    @{Schema="geo"; Table="estaciones"; MinExpected=1; Name="Estaciones"},
    @{Schema="public"; Table="fenomenos_naturales"; MinExpected=300; Name="Fenómenos"},
    @{Schema="geo"; Table="zonas_amenaza"; MinExpected=20; Name="Amenazas"},
    @{Schema="geo"; Table="ndvi_data"; MinExpected=1; Name="NDVI"}
)

$allValid = $true
$totalRecords = 0

foreach ($tableInfo in $tables) {
    $schema = $tableInfo.Schema
    $table = $tableInfo.Table
    $minExpected = $tableInfo.MinExpected
    $name = $tableInfo.Name
    
    $countResult = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c "SELECT COUNT(*) FROM $schema.$table;" 2>$null
    
    if ($countResult) {
        if ($countResult -is [array]) { $countResult = $countResult[0] }
        $countStr = $countResult.Trim()
        
        if ($countStr -match '^\d+$') {
            $count = [int]$countStr
            $totalRecords += $count
            
            if ($count -ge $minExpected) {
                Write-Success "$name`: $count registros ✓"
            } else {
                Write-Error "$name`: $count registros (esperado: mínimo $minExpected)"
                $allValid = $false
            }
        } else {
            Write-Error "$name`: Error al obtener conteo"
            $allValid = $false
        }
    } else {
        Write-Error "$name`: No se pudo conectar a la tabla"
        $allValid = $false
    }
}

Write-Info "`n───────────────────────────────────────"
Write-Host "TOTAL: $totalRecords registros" -ForegroundColor Yellow
Write-Info "───────────────────────────────────────`n"

# Verificación detallada si se solicita
if ($Detailed) {
    Write-Info "Ejecutando verificaciones detalladas...`n"
    
    Write-Info "Top 5 tipos de fenómenos:"
    $result = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c @"
SELECT tipo_fenomeno_normalizado, COUNT(*) 
FROM public.fenomenos_naturales 
GROUP BY tipo_fenomeno_normalizado 
ORDER BY COUNT(*) DESC 
LIMIT 5;
"@ 2>$null
    
    if ($result) {
        $result | ForEach-Object { 
            $line = $_.Trim()
            if ($line) { Write-Host "  $line" -ForegroundColor White }
        }
    }
    
    Write-Info "`nTop 5 municipios con más fenómenos:"
    $result = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c @"
SELECT municipio, COUNT(*) 
FROM public.fenomenos_naturales 
GROUP BY municipio 
ORDER BY COUNT(*) DESC 
LIMIT 5;
"@ 2>$null
    
    if ($result) {
        $result | ForEach-Object { 
            $line = $_.Trim()
            if ($line) { Write-Host "  $line" -ForegroundColor White }
        }
    }
    
    Write-Info "`nEstaciones por municipio:"
    $result = docker exec ecoguard_postgres psql -U postgres -d ecoguard -t -c @"
SELECT municipio, COUNT(*) 
FROM geo.estaciones 
GROUP BY municipio 
ORDER BY COUNT(*) DESC;
"@ 2>$null
    
    if ($result) {
        $result | ForEach-Object { 
            $line = $_.Trim()
            if ($line) { Write-Host "  $line" -ForegroundColor White }
        }
    }
}

# Resultado final
Write-Host ""
if ($allValid) {
    Write-Success "✓ Todas las verificaciones pasaron correctamente"
    Write-Host "`n🔗 PostgreSQL: localhost:5435 | Database: ecoguard" -ForegroundColor Cyan
    if (-not $Detailed) {
        Write-Info "`nPara ver detalles: .\verify-data.ps1 -Detailed"
    }
} else {
    Write-Error "✗ Algunas verificaciones fallaron"
    Write-Info "Ejecuta: .\setup.ps1 para reiniciar la base de datos"
}

Write-Host ""
