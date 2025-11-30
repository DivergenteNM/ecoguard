"""
Loader de Amenazas SGC a PostgreSQL
Carga zonas de amenaza por movimientos en masa a la tabla geo.zonas_amenaza
"""

import geopandas as gpd
import psycopg2
from psycopg2.extras import execute_values
import os
from dotenv import load_dotenv
import logging
from shapely.geometry import MultiPolygon, Polygon
import glob

# Cargar configuración
env_path = os.path.join(os.path.dirname(__file__), '..', 'db_config.env')
load_dotenv(env_path)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AmenazasLoader:
    """
    Carga datos de amenazas del SGC a PostgreSQL.
    """
    
    def __init__(self):
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
    
    def create_table(self):
        """Crea la tabla de amenazas si no existe."""
        sql_path = os.path.join(os.path.dirname(__file__), '..', '..', 'database', 'scripts', '03_create_amenazas_table.sql')
        
        try:
            with open(sql_path, 'r', encoding='utf-8') as f:
                sql = f.read()
            
            self.cursor.execute(sql)
            self.conn.commit()
            logger.info("✅ Tabla geo.zonas_amenaza creada/verificada")
        except Exception as e:
            logger.error(f"❌ Error creando tabla: {e}")
            self.conn.rollback()
    
    def load_amenazas(self, geojson_file=None, truncate=False):
        """
        Carga amenazas desde un archivo GeoJSON.
        """
        if not self.connect():
            return 0
        
        # Crear tabla si no existe
        self.create_table()
        
        # Buscar archivo GeoJSON si no se especifica
        if geojson_file is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            pattern = os.path.join(base_dir, "datasets", "raw", "amenazas", "amenazas_sgc_*.geojson")
            files = glob.glob(pattern)
            
            if not files:
                logger.error("❌ No se encontró archivo GeoJSON de amenazas")
                return 0
            
            # Usar el más reciente
            geojson_file = max(files, key=os.path.getctime)
            logger.info(f"📄 Usando archivo: {os.path.basename(geojson_file)}")
        
        try:
            # Leer GeoJSON
            logger.info(f"🔄 Leyendo {geojson_file}...")
            gdf = gpd.read_file(geojson_file)
            logger.info(f"📊 {len(gdf)} geometrías leídas")
            
            # Las amenazas pueden ser polígonos o puntos, aceptamos ambos
            logger.info(f"📐 {len(gdf)} geometrías válidas para cargar")
            
            # Asegurar CRS
            if gdf.crs is None:
                gdf.set_crs('EPSG:4326', inplace=True)
            elif gdf.crs != 'EPSG:4326':
                gdf = gdf.to_crs('EPSG:4326')
            
            if truncate:
                self.cursor.execute("TRUNCATE TABLE geo.zonas_amenaza RESTART IDENTITY CASCADE;")
                logger.info("🗑️  Tabla truncada")
            
            # Identificar columnas relevantes
            # Buscar columna de categoría/amenaza
            cat_col = next((col for col in gdf.columns if 'AMENAZA' in col.upper() or 'CATEGORIA' in col.upper() or 'NIVEL' in col.upper()), None)
            
            if not cat_col:
                logger.warning("⚠️  No se encontró columna de categoría. Usando 'DESCONOCIDO'")
            
            count = 0
            for _, row in gdf.iterrows():
                # Extraer datos - NO usar OBJECTID porque es demasiado grande
                categoria = row.get(cat_col) if cat_col else 'DESCONOCIDO'
                
                # Calcular área en km²
                geom = row.geometry
                if isinstance(geom, Polygon):
                    geom = MultiPolygon([geom])
                
                # Área aproximada (asumiendo proyección en grados)
                area_km2 = geom.area * 111 * 111  # Conversión aproximada
                
                wkt = geom.wkt
                
                # Insertar - omitir objectid, dejar que la BD genere el ID
                sql = """
                    INSERT INTO geo.zonas_amenaza (categoria, area_km2, geom)
                    VALUES (%s, %s, ST_Multi(ST_Force2D(ST_GeomFromText(%s, 4326))));
                """
                
                try:
                    self.cursor.execute(sql, (str(categoria), area_km2, wkt))
                    count += 1
                except Exception as e:
                    logger.error(f"Error insertando polígono: {e}")
                    self.conn.rollback()
                    continue
            
            self.conn.commit()
            logger.info(f"✅ {count} zonas de amenaza cargadas exitosamente")
            
            # Estadísticas
            self.cursor.execute("""
                SELECT categoria, COUNT(*), ROUND(SUM(area_km2)::numeric, 2) as area_total
                FROM geo.zonas_amenaza
                GROUP BY categoria
                ORDER BY COUNT(*) DESC
            """)
            
            logger.info("\n📊 Resumen por categoría:")
            for row in self.cursor.fetchall():
                logger.info(f"  {row[0]}: {row[1]} zonas, {row[2]} km²")
            
            return count
            
        except Exception as e:
            logger.error(f"❌ Error cargando amenazas: {e}")
            import traceback
            traceback.print_exc()
            return 0
        finally:
            self.disconnect()

if __name__ == "__main__":
    loader = AmenazasLoader()
    loader.load_amenazas(truncate=True)
