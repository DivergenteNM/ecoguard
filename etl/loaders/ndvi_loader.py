"""
Loader de datos NDVI a PostgreSQL
Carga datos de índice de vegetación desde JSON a la tabla geo.ndvi_data
"""

import json
import psycopg2
import os
from dotenv import load_dotenv
import logging
from datetime import datetime

# Cargar configuración
env_path = os.path.join(os.path.dirname(__file__), '..', 'db_config.env')
load_dotenv(env_path)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class NDVILoader:
    """Carga datos NDVI desde JSON a PostgreSQL."""
    
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
        """Crea la tabla de NDVI si no existe."""
        sql_path = os.path.join(os.path.dirname(__file__), '..', '..', 'database', 'scripts', '05_create_ndvi_table.sql')
        
        try:
            with open(sql_path, 'r', encoding='utf-8') as f:
                sql = f.read()
            
            self.cursor.execute(sql)
            self.conn.commit()
            logger.info("✅ Tabla geo.ndvi_data creada/verificada")
        except Exception as e:
            logger.error(f"❌ Error creando tabla: {e}")
            self.conn.rollback()
    
    def load_ndvi(self, json_file=None, truncate=False):
        """Carga datos NDVI desde un archivo JSON."""
        if not self.connect():
            return 0
        
        # Crear tabla si no existe
        self.create_table()
        
        # Buscar archivo JSON si no se especifica
        if json_file is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            ndvi_dir = os.path.join(base_dir, "datasets", "raw", "ndvi")
            
            if not os.path.exists(ndvi_dir):
                logger.error(f"❌ No se encontró directorio: {ndvi_dir}")
                return 0
            
            # Buscar archivos JSON
            json_files = [f for f in os.listdir(ndvi_dir) if f.endswith('.json')]
            
            if not json_files:
                logger.error("❌ No se encontró archivo JSON de NDVI")
                return 0
            
            # Usar el más reciente
            json_file = os.path.join(ndvi_dir, sorted(json_files)[-1])
            logger.info(f"📄 Usando archivo: {os.path.basename(json_file)}")
        
        try:
            # Leer JSON
            logger.info(f"🔄 Leyendo {json_file}...")
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if truncate:
                self.cursor.execute("TRUNCATE TABLE geo.ndvi_data RESTART IDENTITY CASCADE;")
                logger.info("🗑️  Tabla truncada")
            
            # Preparar datos para inserción
            fecha_extraccion = datetime.fromisoformat(data['fecha_extraccion'].replace('Z', '+00:00'))
            fecha_inicio = data['periodo']['inicio']
            fecha_fin = data['periodo']['fin']
            
            # Crear metadata JSON
            metadata = {
                'bbox': data.get('bbox'),
                'project_id': data.get('project_id'),
                'imagenes_procesadas': data.get('imagenes_procesadas'),
                'nubosidad_maxima': data.get('nubosidad_maxima')
            }
            
            # Insertar
            sql = """
                INSERT INTO geo.ndvi_data (
                    fecha_inicio, fecha_fin, fecha_extraccion,
                    ndvi_max, ndvi_mean, ndvi_min,
                    interpretacion, imagenes_procesadas, nubosidad_maxima,
                    region, fuente, resolucion_espacial_m, metadata
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING;
            """
            
            self.cursor.execute(sql, (
                fecha_inicio,
                fecha_fin,
                fecha_extraccion,
                data['estadisticas']['NDVI_max'],
                data['estadisticas']['NDVI_mean'],
                data['estadisticas']['NDVI_min'],
                data.get('interpretacion'),
                data.get('imagenes_procesadas'),
                data.get('nubosidad_maxima'),
                data.get('region'),
                data.get('fuente'),
                data.get('resolucion_espacial_m'),
                json.dumps(metadata)
            ))
            
            self.conn.commit()
            logger.info(f"✅ Datos NDVI cargados exitosamente")
            
            # Estadísticas
            self.cursor.execute("SELECT COUNT(*) FROM geo.ndvi_data")
            count = self.cursor.fetchone()[0]
            logger.info(f"📊 Total registros en tabla: {count}")
            
            return 1
            
        except Exception as e:
            logger.error(f"❌ Error cargando NDVI: {e}")
            import traceback
            traceback.print_exc()
            return 0
        finally:
            self.disconnect()

if __name__ == "__main__":
    loader = NDVILoader()
    loader.load_ndvi(truncate=True)
