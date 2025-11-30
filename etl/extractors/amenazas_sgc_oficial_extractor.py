"""
Extractor de datos de amenazas del SGC - Portal de Datos Abiertos
Descarga el inventario de movimientos en masa y filtra por Nariño
"""
import requests
import json
import os
from datetime import datetime

# URL del servicio FeatureServer del SGC
# ID del dataset: 312c8792ddb24954a9d2711bd89d1afe_0
SERVICE_URL = "https://services.arcgis.com/DDzi7vRExVRMO5AB/arcgis/rest/services/Inventario_de_movimientos_en_masa/FeatureServer/0"

# Bounding box de Nariño (aproximado)
# Lat: 0.5 a 2.5, Lon: -79.5 a -76.5
NARINO_BBOX = {
    'xmin': -79.5,
    'ymin': 0.5,
    'xmax': -76.5,
    'ymax': 2.5,
    'spatialReference': {'wkid': 4326}
}

def download_sgc_threats():
    """Descarga datos de amenazas del SGC filtrados por Nariño"""
    
    print("🔍 Descargando datos de amenazas del SGC...")
    print(f"Servicio: {SERVICE_URL}\n")
    
    # Parámetros de consulta
    params = {
        'where': '1=1',  # Todos los registros
        'geometry': json.dumps(NARINO_BBOX),
        'geometryType': 'esriGeometryEnvelope',
        'spatialRel': 'esriSpatialRelIntersects',
        'outFields': '*',
        'returnGeometry': 'true',
        'f': 'geojson'
    }
    
    try:
        response = requests.get(f"{SERVICE_URL}/query", params=params, timeout=60)
        response.raise_for_status()
        
        data = response.json()
        
        # Guardar GeoJSON
        output_dir = os.path.join('datasets', 'raw', 'amenazas')
        os.makedirs(output_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_file = os.path.join(output_dir, f'amenazas_sgc_narino_{timestamp}.geojson')
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        # Estadísticas
        num_features = len(data.get('features', []))
        print(f"✅ Descarga completada!")
        print(f"📊 Registros obtenidos: {num_features}")
        print(f"💾 Archivo guardado: {output_file}")
        
        # Mostrar campos disponibles
        if num_features > 0:
            first_feature = data['features'][0]
            print(f"\n📋 Campos disponibles:")
            for key in first_feature['properties'].keys():
                print(f"   - {key}")
        
        return output_file
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    download_sgc_threats()
