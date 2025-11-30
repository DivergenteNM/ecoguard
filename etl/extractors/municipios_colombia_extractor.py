"""
Extractor de Municipios de Colombia desde datos.gov.co
Dataset ID: gdxc-w37w (Municipios de Colombia)
Fuente: datos.gov.co (Socrata SODA API)
"""

import requests
import json
from pathlib import Path
import logging
from typing import Optional, List, Dict
import os
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class MunicipiosColombiaExtractor:
    """
    Extrae datos geográficos de municipios de Colombia desde datos.gov.co (API Socrata).
    Compatible con la estructura existente de la BD.
    """
    
    def __init__(self, app_token: Optional[str] = None):
        self.output_dir = Path(__file__).parent.parent.parent / 'datasets' / 'raw' / 'municipios'
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Configuración API
        self.base_url = os.getenv('SOCRATA_BASE_URL', 'https://www.datos.gov.co/resource')
        self.dataset_id = 'gdxc-w37w'  # Municipios de Colombia
        self.endpoint = f"{self.base_url}/{self.dataset_id}.json"
        
        # Token de autenticación
        self.app_token = app_token or os.getenv('SOCRATA_APP_TOKEN')
        
        # Headers
        self.headers = {}
        if self.app_token:
            self.headers['X-App-Token'] = self.app_token
            logger.info("✅ Usando App Token para autenticación")
        else:
            logger.warning("⚠️  Sin App Token. Límite: 100 requests/hora")
        
        self.total_requests = 0
        self.total_records = 0
    
    def _make_request(self, params: Dict) -> Optional[List[Dict]]:
        """
        Realiza petición a la API con manejo de errores.
        """
        try:
            self.total_requests += 1
            
            response = requests.get(
                self.endpoint,
                params=params,
                headers=self.headers,
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                self.total_records += len(data)
                return data
            else:
                logger.error(f"❌ Error HTTP {response.status_code}: {response.text}")
                return None
                
        except requests.exceptions.Timeout:
            logger.error("❌ Timeout en la petición")
            return None
        except Exception as e:
            logger.error(f"❌ Error en petición: {e}")
            return None
    
    def extract_municipios_narino(self) -> bool:
        """
        Extrae municipios de Nariño desde datos.gov.co usando la API Socrata.
        Filtra solo los que necesitamos para mantener la estructura de BD.
        """
        logger.info("=" * 70)
        logger.info("🚀 EXTRACTOR DE MUNICIPIOS DE NARIÑO - datos.gov.co")
        logger.info("=" * 70)
        
        try:
            # Consulta SoQL para filtrar Nariño (código departamento 52)
            # Solicitar geometría en formato GeoJSON
            params = {
                '$where': "cod_dpto='52'",  # Código DANE de Nariño - columna correcta
                '$limit': 100,  # Nariño tiene ~64 municipios
                '$order': 'nom_mpio',  # Ordenar por nombre - columna correcta
            }
            
            logger.info("📡 Consultando API de datos.gov.co...")
            logger.info(f"   Endpoint: {self.endpoint}")
            logger.info(f"   Filtro: Departamento código 52 (Nariño)")
            
            data = self._make_request(params)
            
            if not data:
                logger.error("❌ No se obtuvieron datos de la API")
                return False
            
            logger.info(f"✅ Recibidos {len(data)} municipios de Nariño")
            
            # Convertir a GeoJSON
            geojson_data = self._convert_to_geojson(data)
            
            if not geojson_data:
                logger.error("❌ Error convirtiendo a GeoJSON")
                return False
            
            # Guardar archivo
            output_file = self.output_dir / 'narino_municipios_datos_gov.geojson'
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(geojson_data, f, ensure_ascii=False, indent=2)
            
            logger.info(f"💾 Guardado en: {output_file}")
            
            # Verificar coordenadas
            self._verify_coordinates_from_geojson(geojson_data)
            
            # Mostrar muestra de datos
            self._show_sample(data)
            
            logger.info("=" * 70)
            logger.info("✅ EXTRACCIÓN COMPLETADA")
            logger.info("=" * 70)
            logger.info(f"📊 Total requests: {self.total_requests}")
            logger.info(f"📊 Total registros: {self.total_records}")
            logger.info(f"📁 Archivo: {output_file.name}")
            logger.info("\n📋 Próximo paso:")
            logger.info("   cd ..")
            logger.info("   python loaders/municipios_loader.py")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Error en extracción: {e}")
            return False
    
    def _convert_to_geojson(self, data: List[Dict]) -> Optional[Dict]:
        """
        Convierte los datos de la API a formato GeoJSON estándar.
        Usa latitud/longitud como puntos (no hay geometr polígonos en este dataset).
        """
        try:
            features = []
            
            for record in data:
                # Verificar que tenga coordenadas
                if 'latitud' not in record or 'longitud' not in record:
                    logger.warning(f"⚠️  Municipio sin coordenadas: {record.get('nom_mpio', 'DESCONOCIDO')}")
                    continue
                
                try:
                    # Las coordenadas vienen como strings con coma como separador decimal
                    lat_str = str(record['latitud']).replace(',', '.')
                    lng_str = str(record['longitud']).replace(',', '.')
                    lat = float(lat_str)
                    lng = float(lng_str)
                except (ValueError, TypeError) as e:
                    logger.warning(f"⚠️  Coordenadas inválidas para {record.get('nom_mpio', 'DESCONOCIDO')}: {e}")
                    continue
                
                # Crear feature con geometría Point (centroide del municipio)
                feature = {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [lng, lat]  # [longitud, latitud] en GeoJSON
                    },
                    'properties': {
                        'codigo_dane': record.get('cod_mpio'),
                        'nombre': record.get('nom_mpio', 'DESCONOCIDO'),
                        'departamento': record.get('dpto', 'NARIÑO'),
                        'codigo_departamento': record.get('cod_dpto', '52'),
                        'tipo_municipio': record.get('tipo_municipio'),
                    }
                }
                
                features.append(feature)
            
            geojson = {
                'type': 'FeatureCollection',
                'crs': {
                    'type': 'name',
                    'properties': {
                        'name': 'EPSG:4326'
                    }
                },
                'features': features
            }
            
            logger.info(f"✅ Convertidos {len(features)} municipios a GeoJSON (geometrías Point)")
            logger.info(f"ℹ️  Nota: Este dataset usa puntos (centroides), no polígonos completos")
            return geojson
            
        except Exception as e:
            logger.error(f"❌ Error convirtiendo a GeoJSON: {e}")
            return None
    
    def _verify_coordinates_from_geojson(self, geojson: Dict):
        """
        Verifica que las coordenadas sean válidas para Nariño, Colombia.
        """
        try:
            all_coords = []
            
            for feature in geojson['features']:
                geom = feature['geometry']
                
                # Extraer coordenadas según tipo de geometría
                if geom['type'] == 'Point':
                    all_coords.append(geom['coordinates'])
                elif geom['type'] == 'Polygon':
                    coords = geom['coordinates'][0]
                    all_coords.extend(coords)
                elif geom['type'] == 'MultiPolygon':
                    coords = geom['coordinates'][0][0]
                    all_coords.extend(coords)
            
            if not all_coords:
                logger.warning("⚠️  No se encontraron coordenadas para verificar")
                return
            
            # Calcular bounds
            lngs = [c[0] for c in all_coords]
            lats = [c[1] for c in all_coords]
            
            min_lng, max_lng = min(lngs), max(lngs)
            min_lat, max_lat = min(lats), max(lats)
            
            logger.info("📍 Verificación de coordenadas:")
            logger.info(f"   Longitud: {min_lng:.4f} a {max_lng:.4f}")
            logger.info(f"   Latitud:  {min_lat:.4f} a {max_lat:.4f}")
            
            # Rangos válidos para Nariño
            valid_lng = -79.5 <= min_lng and max_lng <= -76.5
            valid_lat = 0.5 <= min_lat and max_lat <= 2.5
            
            if valid_lng and valid_lat:
                logger.info("   ✅ Coordenadas CORRECTAS para Nariño, Colombia")
            else:
                logger.warning("   ⚠️  Coordenadas fuera del rango esperado")
                logger.warning(f"   Esperado: Lng [-79.5, -76.5], Lat [0.5, 2.5]")
                
        except Exception as e:
            logger.error(f"❌ Error verificando coordenadas: {e}")
    
    def _show_sample(self, data: List[Dict]):
        """
        Muestra una muestra de los datos extraídos.
        """
        logger.info("\n📋 Muestra de municipios extraídos:")
        logger.info("-" * 70)
        
        for i, record in enumerate(data[:5]):
            nombre = record.get('nom_mpio', 'DESCONOCIDO')
            codigo = record.get('cod_mpio', 'N/A')
            lat = record.get('latitud', 'N/A')
            lng = record.get('longitud', 'N/A')
            has_coords = '✅' if ('latitud' in record and 'longitud' in record) else '❌'
            
            logger.info(f"   {i+1}. {nombre:20} | Código: {codigo} | Coords: [{lng}, {lat}] {has_coords}")
        
        if len(data) > 5:
            logger.info(f"   ... y {len(data) - 5} municipios más")
        logger.info("-" * 70)


if __name__ == "__main__":
    extractor = MunicipiosColombiaExtractor()
    success = extractor.extract_municipios_narino()
    
    if success:
        logger.info("\n🎉 ¡Datos descargados exitosamente!")
        logger.info("📌 Para cargar a la base de datos, ejecuta:")
        logger.info("   python loaders/municipios_loader.py")
    else:
        logger.error("\n❌ Extracción fallida")
        logger.info("💡 Verifica tu conexión a internet e intenta de nuevo")
