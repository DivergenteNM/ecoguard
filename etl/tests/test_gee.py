"""
Script de prueba para Google Earth Engine
Verifica que la conexión funcione correctamente
"""
import ee

# Project ID de Google Cloud
PROJECT_ID = 'gen-lang-client-0925028424'

print("="*60)
print("🧪 Test de Google Earth Engine")
print("="*60)
print(f"\n🔧 Project ID: {PROJECT_ID}\n")

try:
    # Inicializar
    ee.Initialize(project=PROJECT_ID)
    print("✅ Google Earth Engine inicializado correctamente\n")
    
    # Definir región de Nariño
    narino_bbox = ee.Geometry.Rectangle([-79.5, 0.5, -76.5, 2.5])
    
    # Obtener una imagen reciente de Sentinel-2
    print("🔍 Buscando imagen Sentinel-2 reciente...")
    image = ee.ImageCollection('COPERNICUS/S2_SR') \
        .filterBounds(narino_bbox) \
        .filterDate('2024-01-01', '2024-12-31') \
        .sort('CLOUDY_PIXEL_PERCENTAGE') \
        .first()
    
    info = image.getInfo()
    
    print(f"\n📊 Imagen encontrada:")
    print(f"  ID: {info['id']}")
    
    # Convertir timestamp a fecha legible
    timestamp = info['properties'].get('system:time_start')
    if timestamp:
        from datetime import datetime
        fecha = datetime.fromtimestamp(timestamp / 1000)
        print(f"  Fecha: {fecha.strftime('%Y-%m-%d')}")
    
    print(f"  Nubosidad: {info['properties'].get('CLOUDY_PIXEL_PERCENTAGE')}%")
    
    print("\n" + "="*60)
    print("🎉 ¡Google Earth Engine está funcionando perfectamente!")
    print("="*60)
    print("\n✅ Puedes ejecutar el extractor NDVI:")
    print("   cd etl\\extractors")
    print("   python ndvi_extractor.py")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    print("\n💡 Posibles soluciones:")
    print("1. Verifica que el Project ID sea correcto")
    print("2. Asegúrate de haber habilitado Earth Engine API")
    print("3. Verifica tu autenticación")
