"""
Loader de Municipios a PostgreSQL
Carga shapefile/geojson de municipios a la tabla geo.municipios
"""

import geopandas as gpd
import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
import os
from dotenv import load_dotenv
import logging
from shapely.geometry import MultiPolygon, Polygon

# Cargar configuración de base de datos
env_path = os.path.join(os.path.dirname(__file__), '..', 'db_config.env')
load_dotenv(env_path)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MunicipiosLoader:
    """
    Carga geometrías de municipios a PostgreSQL.
    """
    
    def __init__(self):
        """Inicializa el loader."""
        self.db_host = os.getenv('DB_HOST', 'localhost')
        self.db_port = os.getenv('DB_PORT', '5435')
        self.db_name = os.getenv('DB_NAME', 'ecoguard')
        self.db_user = os.getenv('DB_USER', 'postgres')
        self.db_password = os.getenv('DB_PASSWORD', 'postgres')
        self.conn = None
        self.cursor = None
    
    def connect(self):
        """Conecta a la base de datos."""
        try:
            self.conn = psycopg2.connect(
                host=self.db_host,
                port=self.db_port,
                database=self.db_name,
                user=self.db_user,
                password=self.db_password
            )
            self.cursor = self.conn.cursor()
            logger.info("✅ Conectado a PostgreSQL")
            return True
        except Exception as e:
            logger.error(f"❌ Error de conexión: {e}")
            return False
    
    def disconnect(self):
        """Desconecta de la base de datos."""
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()
        logger.info("🔌 Desconectado de PostgreSQL")
    
    def find_file(self) -> str:
        """Busca el archivo de municipios en la carpeta raw."""
        base_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'datasets', 'raw', 'municipios')
        
        # Extensiones soportadas
        extensions = ['.zip', '.geojson', '.json', '.shp']
        
        for ext in extensions:
            for filename in os.listdir(base_dir):
                if filename.lower().endswith(ext):
                    return os.path.join(base_dir, filename)
        
        return None
    
    def load_municipios(self, truncate: bool = False) -> int:
        """
        Carga municipios de Nariño a la base de datos.
        """
        file_path = self.find_file()
        
        if not file_path:
            logger.error("❌ No se encontró archivo de municipios en datasets/raw/municipios/")
            logger.info("Por favor descarga el GeoJSON/Shapefile/ZIP y colócalo allí.")
            return 0
        
        logger.info(f"🔄 Leyendo archivo: {file_path}...")
        
        try:
            # Manejo especial para ZIP
            read_path = file_path
            if file_path.lower().endswith('.zip'):
                # Ruta específica dentro del ZIP
                zip_internal_path = "Carto500000_Colombia_SD_2016_shp/Administrativo_R.shp"
                read_path = f"zip://{file_path}!{zip_internal_path}"
                logger.info(f"  📦 Leyendo {zip_internal_path} desde ZIP...")
            
            # Intentar leer GeoJSON completo si existe
            full_geojson_path = os.path.join(os.path.dirname(file_path), 'colombia_municipios_completo.json')
            if os.path.exists(full_geojson_path):
                read_path = full_geojson_path
                logger.info("  📄 Usando GeoJSON completo de Colombia...")
            
            gdf = gpd.read_file(read_path)
            logger.info(f"📊 {len(gdf)} registros leídos")
            
            # Filtrar por Nariño
            if 'dpt' in gdf.columns:
                logger.info("🔎 Filtrando por columna dpt = NARIÑO...")
                gdf = gdf[gdf['dpt'].astype(str).str.upper() == 'NARIÑO']
                logger.info(f"✅ {len(gdf)} municipios de Nariño encontrados")
            elif 'CODIGO_NOM' in gdf.columns:
                # Lógica anterior para Shapefile
                logger.info("🔎 Filtrando por código DANE 52 (Nariño)...")
                gdf = gdf[gdf['CODIGO_NOM'].astype(str).str.startswith('52')]
            else:
                # Fallback espacial
                logger.info("🔎 Filtrando por ubicación geográfica (Nariño)...")
                if gdf.crs != 'EPSG:4326':
                    gdf = gdf.to_crs('EPSG:4326')
                gdf = gdf.cx[-79.5:-76.5, 0.5:2.5]
            
            logger.info(f"✅ {len(gdf)} municipios a cargar")
            
            # Asegurar CRS
            if gdf.crs is None:
                logger.info("⚠️  CRS no detectado. Asumiendo EPSG:4326...")
                gdf.set_crs('EPSG:4326', inplace=True)
            
            # Reproyectar a WGS84
            if gdf.crs != 'EPSG:4326':
                logger.info("🔄 Reproyectando a EPSG:4326...")
                gdf = gdf.to_crs('EPSG:4326')
            
            if not self.connect():
                return 0
            
            if truncate:
                self.cursor.execute("TRUNCATE TABLE geo.municipios RESTART IDENTITY CASCADE;")
                logger.info("🗑️  Tabla truncada")
            
            count = 0
            for _, row in gdf.iterrows():
                # Identificar columnas
                nombre = row.get('name') or row.get('NOMBRE_GEO') or row.get('MPIO_CNMBR') or 'DESCONOCIDO'
                codigo = row.get('id') or row.get('CODIGO_NOM') or row.get('MPIO_CCDGO') or None
                dept = 'NARIÑO'
                
                # Geometría
                geom = row.geometry
                if isinstance(geom, Polygon):
                    geom = MultiPolygon([geom])
                
                wkt = geom.wkt
                
                # Insertar
                # Usamos ST_Force2D para manejar geometrías 3D (Z)
                sql = """
                    INSERT INTO geo.municipios (codigo_dane, nombre, departamento, geom)
                    VALUES (%s, %s, %s, ST_Multi(ST_Force2D(ST_GeomFromText(%s, 4326))))
                    ON CONFLICT (codigo_dane) DO UPDATE SET
                        nombre = EXCLUDED.nombre,
                        geom = EXCLUDED.geom;
                """
                
                try:
                    self.cursor.execute(sql, (codigo, nombre, dept, wkt))
                    count += 1
                except Exception as e:
                    logger.error(f"Error insertando {nombre}: {e}")
                    self.conn.rollback()
            
            self.conn.commit()
            logger.info(f"✅ {count} municipios cargados exitosamente")
            return count
            
        except Exception as e:
            logger.error(f"❌ Error cargando municipios: {e}")
            return 0
        finally:
            self.disconnect()


if __name__ == "__main__":
    loader = MunicipiosLoader()
    loader.load_municipios(truncate=True)
