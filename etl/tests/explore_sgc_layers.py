"""
Explorador de capas del SGC
Identifica todas las capas disponibles en el servicio de amenazas
"""
import requests
import json

BASE_URL = "https://srvags.sgc.gov.co/arcgis/rest/services/Mapa_Nacional_Amenaza_Mov_Masa_100K/Mapa_Nacional_Amenaza_Movimientos_Masa_100K/MapServer"

print("="*80)
print("🔍 EXPLORADOR DE CAPAS SGC - Amenazas por Movimientos en Masa")
print("="*80 + "\n")

try:
    # Obtener información del servicio
    response = requests.get(f"{BASE_URL}?f=json", timeout=30)
    response.raise_for_status()
    data = response.json()
    
    print(f"📋 Servicio: {data.get('mapName', 'N/A')}")
    print(f"Descripción: {data.get('description', 'N/A')}")
    print(f"Versión: {data.get('currentVersion', 'N/A')}\n")
    
    layers = data.get('layers', [])
    print(f"🗂️  Total de capas disponibles: {len(layers)}\n")
    
    if layers:
        print("CAPAS DISPONIBLES:")
        print("-" * 80)
        for layer in layers:
            print(f"\n📌 Layer {layer['id']}: {layer['name']}")
            print(f"   Tipo de geometría: {layer.get('geometryType', 'N/A')}")
            
            # Obtener detalles de la capa
            layer_url = f"{BASE_URL}/{layer['id']}?f=json"
            layer_response = requests.get(layer_url, timeout=30)
            layer_data = layer_response.json()
            
            print(f"   Descripción: {layer_data.get('description', 'N/A')}")
            
            # Campos disponibles
            fields = layer_data.get('fields', [])
            if fields:
                print(f"   Campos ({len(fields)}):")
                for field in fields[:10]:  # Mostrar primeros 10
                    print(f"     - {field['name']} ({field['type']})")
                if len(fields) > 10:
                    print(f"     ... y {len(fields) - 10} campos más")
            
            # Intentar obtener conteo de features
            count_url = f"{BASE_URL}/{layer['id']}/query"
            count_params = {
                'where': '1=1',
                'returnCountOnly': 'true',
                'f': 'json'
            }
            try:
                count_response = requests.get(count_url, params=count_params, timeout=30)
                count_data = count_response.json()
                if 'count' in count_data:
                    print(f"   Total de features: {count_data['count']}")
            except:
                pass
    
    print("\n" + "="*80)
    print("💡 RECOMENDACIÓN:")
    print("="*80)
    print("Si hay múltiples capas, deberías extraer datos de cada una para obtener")
    print("una zonificación más detallada de amenazas (BAJA, MEDIA, ALTA, MUY ALTA).")
    print("\nPara extraer una capa específica, usa:")
    print("  python amenazas_sgc_extractor.py --layer <ID>")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
