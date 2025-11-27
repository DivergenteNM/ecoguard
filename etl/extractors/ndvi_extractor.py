"""
Extractor de NDVI usando Google Earth Engine
Extrae índice de vegetación de Sentinel-2 para Nariño
"""
import ee
import os
import json
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class NDVIExtractor:
    """
    Extrae datos NDVI de Google Earth Engine.
    """
    
    def __init__(self, project_id='gen-lang-client-0925028424', output_dir=None):
        self.project_id = project_id
        
        if output_dir is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            output_dir = os.path.join(base_dir, "datasets", "raw", "ndvi")
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Inicializar Earth Engine
        try:
            ee.Initialize(project=self.project_id)
            logger.info(f"✅ Google Earth Engine inicializado (Project: {self.project_id})")
        except Exception as e:
            logger.error(f"❌ Error inicializando GEE: {e}")
            raise
    
    def calculate_ndvi(self, start_date='2024-01-01', end_date='2024-12-31', 
                       max_cloud_cover=30):
        """
        Calcula NDVI promedio para Nariño.
        
        Args:
            start_date: Fecha inicio (YYYY-MM-DD)
            end_date: Fecha fin (YYYY-MM-DD)
            max_cloud_cover: Máximo % de nubes permitido
        """
        logger.info(f"🛰️  Buscando imágenes Sentinel-2...")
        logger.info(f"   Período: {start_date} a {end_date}")
        logger.info(f"   Nubosidad máxima: {max_cloud_cover}%")
        
        # Definir región de Nariño
        narino = ee.Geometry.Rectangle([-79.5, 0.5, -76.5, 2.5])
        
        # Obtener colección de imágenes Sentinel-2
        collection = ee.ImageCollection('COPERNICUS/S2_SR') \
            .filterBounds(narino) \
            .filterDate(start_date, end_date) \
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', max_cloud_cover))
        
        count = collection.size().getInfo()
        logger.info(f"✅ {count} imágenes encontradas")
        
        if count == 0:
            logger.warning("⚠️  No se encontraron imágenes. Intenta aumentar max_cloud_cover")
            return None
        
        # Función para calcular NDVI
        def add_ndvi(image):
            ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI')
            return image.addBands(ndvi)
        
        # Aplicar NDVI a todas las imágenes
        collection_ndvi = collection.map(add_ndvi)
        
        # Calcular NDVI promedio
        ndvi_mean = collection_ndvi.select('NDVI').mean()
        
        # Obtener estadísticas
        logger.info("📊 Calculando estadísticas NDVI...")
        stats = ndvi_mean.reduceRegion(
            reducer=ee.Reducer.mean().combine(
                reducer2=ee.Reducer.minMax(),
                sharedInputs=True
            ),
            geometry=narino,
            scale=500,  # Resolución en metros
            maxPixels=1e9
        ).getInfo()
        
        logger.info(f"\n📊 Estadísticas NDVI:")
        logger.info(f"   Promedio: {stats.get('NDVI_mean', 'N/A'):.4f}")
        logger.info(f"   Mínimo: {stats.get('NDVI_min', 'N/A'):.4f}")
        logger.info(f"   Máximo: {stats.get('NDVI_max', 'N/A'):.4f}")
        
        # Interpretación
        ndvi_avg = stats.get('NDVI_mean', 0)
        if ndvi_avg > 0.6:
            interpretacion = "Vegetación densa y saludable"
        elif ndvi_avg > 0.4:
            interpretacion = "Vegetación moderada"
        elif ndvi_avg > 0.2:
            interpretacion = "Vegetación escasa"
        else:
            interpretacion = "Suelo desnudo o agua"
        
        logger.info(f"   Interpretación: {interpretacion}")
        
        # Guardar metadatos
        metadata = {
            'fecha_extraccion': datetime.now().isoformat(),
            'project_id': self.project_id,
            'periodo': {
                'inicio': start_date,
                'fin': end_date
            },
            'imagenes_procesadas': count,
            'nubosidad_maxima': max_cloud_cover,
            'estadisticas': stats,
            'interpretacion': interpretacion,
            'region': 'Nariño, Colombia',
            'bbox': [-79.5, 0.5, -76.5, 2.5],
            'fuente': 'Sentinel-2 Surface Reflectance (Google Earth Engine)',
            'resolucion_espacial_m': 500
        }
        
        # Guardar JSON
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"ndvi_narino_{start_date}_{end_date}_{timestamp}.json"
        filepath = os.path.join(self.output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
        
        logger.info(f"\n💾 Metadatos guardados en: {filepath}")
        
        return metadata

if __name__ == "__main__":
    extractor = NDVIExtractor()
    
    # Extraer NDVI del último año
    logger.info("="*60)
    logger.info("🌿 Extractor de NDVI - Nariño, Colombia")
    logger.info("="*60 + "\n")
    
    result = extractor.calculate_ndvi(
        start_date='2024-01-01',
        end_date='2024-12-31',
        max_cloud_cover=30
    )
    
    if result:
        logger.info("\n" + "="*60)
        logger.info("✅ Extracción completada exitosamente")
        logger.info("="*60)
