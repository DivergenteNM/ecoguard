"""
Extractor de Amenazas del SGC (Servicio Geológico Colombiano)
Extrae zonas de amenaza por movimientos en masa desde ArcGIS REST API
"""

import requests
import json
import os
import geopandas as gpd
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AmenazasSGCExtractor:
    """
    Extrae datos de amenazas por movimientos en masa del SGC.
    """
    
    # URL base del servicio
    BASE_URL = "https://srvags.sgc.gov.co/arcgis/rest/services/Mapa_Nacional_Amenaza_Mov_Masa_100K/Mapa_Nacional_Amenaza_Movimientos_Masa_100K/MapServer"
    
    def __init__(self, output_dir=None):
        if output_dir is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            output_dir = os.path.join(base_dir, "datasets", "raw", "amenazas")
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
    
    def list_layers(self):
        """Lista las capas disponibles en el servicio."""
        try:
            response = requests.get(f"{self.BASE_URL}?f=json", timeout=30)
            response.raise_for_status()
            data = response.json()
            
            logger.info("📋 Capas disponibles:")
            for layer in data.get('layers', []):
                logger.info(f"  Layer {layer['id']}: {layer['name']}")
            
            return data.get('layers', [])
        except Exception as e:
            logger.error(f"❌ Error listando capas: {e}")
            return []
    
    def extract_by_bbox(self, layer_id=0, bbox=None):
        """
        Extrae amenazas de una capa específica dentro de un bounding box.
        
        Args:
            layer_id: ID de la capa (default 0)
            bbox: [min_lon, min_lat, max_lon, max_lat] (default: Nariño)
        """
        if bbox is None:
            # Bounding box de Nariño
            bbox = [-79.5, 0.5, -76.5, 2.5]
        
        min_lon, min_lat, max_lon, max_lat = bbox
        
        # Construir URL de consulta
        query_url = f"{self.BASE_URL}/{layer_id}/query"
        
        params = {
            'f': 'geojson',
            'returnGeometry': 'true',
            'spatialRel': 'esriSpatialRelIntersects',
            'geometry': f'{min_lon},{min_lat},{max_lon},{max_lat}',
            'geometryType': 'esriGeometryEnvelope',
            'inSR': '4326',
            'outFields': '*',
            'outSR': '4326',
            'where': '1=1'
        }
        
        logger.info(f"🌍 Consultando capa {layer_id} para BBox: {bbox}...")
        
        try:
            response = requests.get(query_url, params=params, timeout=60)
            response.raise_for_status()
            
            data = response.json()
            
            if 'features' in data and len(data['features']) > 0:
                count = len(data['features'])
                logger.info(f"✅ Se encontraron {count} polígonos de amenaza")
                
                # Guardar GeoJSON
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"amenazas_sgc_layer{layer_id}_{timestamp}.geojson"
                filepath = os.path.join(self.output_dir, filename)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                
                logger.info(f"💾 Datos guardados en: {filepath}")
                
                # Mostrar estadísticas
                gdf = gpd.GeoDataFrame.from_features(data['features'])
                logger.info(f"📊 Columnas disponibles: {list(gdf.columns)}")
                
                return filepath
            else:
                logger.warning("⚠️  No se encontraron datos en la zona especificada")
                logger.info(f"Respuesta: {data}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error consultando SGC API: {e}")
            import traceback
            traceback.print_exc()
            return None

if __name__ == "__main__":
    extractor = AmenazasSGCExtractor()
    
    # Listar capas disponibles
    layers = extractor.list_layers()
    
    # Extraer datos de la primera capa (usualmente la de amenazas)
    if layers:
        logger.info(f"\n🎯 Extrayendo datos de la capa 0...")
        extractor.extract_by_bbox(layer_id=0)
