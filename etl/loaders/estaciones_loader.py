"""
Loader de Estaciones IDEAM a PostgreSQL
Carga datos transformados a la tabla geo.estaciones
"""

import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
import os
from dotenv import load_dotenv
import logging

# Cargar configuración de base de datos
env_path = os.path.join(os.path.dirname(__file__), '..', 'db_config.env')
load_dotenv(env_path)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class EstacionesLoader:
    """
    Carga datos de estaciones a PostgreSQL.
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
    
    def load_from_csv(self, csv_path: str, truncate: bool = False) -> int:
        """
        Carga datos desde CSV a la tabla geo.estaciones.
        
        Args:
            csv_path: Ruta al archivo CSV
            truncate: Si True, limpia la tabla antes de cargar
            
        Returns:
            Número de registros insertados
        """
        logger.info(f"🔄 Cargando datos desde {csv_path}...")
        
        if not os.path.exists(csv_path):
            logger.error(f"❌ Archivo no encontrado: {csv_path}")
            return 0
        
        # Leer CSV
        df = pd.read_csv(csv_path)
        logger.info(f"📊 {len(df)} registros leídos del CSV")
        
        if not self.connect():
            return 0
        
        try:
            # Truncar tabla si se solicita
            if truncate:
                self.cursor.execute("TRUNCATE TABLE geo.estaciones RESTART IDENTITY CASCADE;")
                logger.info("🗑️  Tabla truncada")
            
            # Preparar datos
            records = []
            for _, row in df.iterrows():
                record = (
                    str(row['codigoestacion']) if pd.notna(row.get('codigoestacion')) else None,
                    str(row['nombreestacion']) if pd.notna(row.get('nombreestacion')) else None,
                    str(row['tipo_estacion']) if pd.notna(row.get('tipo_estacion')) else None,
                    str(row['municipio']) if pd.notna(row.get('municipio')) else None,
                    str(row['departamento']) if pd.notna(row.get('departamento')) else 'NARIÑO',
                    float(row['latitud']) if pd.notna(row.get('latitud')) else None,
                    float(row['longitud']) if pd.notna(row.get('longitud')) else None,
                    str(row['estado']) if pd.notna(row.get('estado')) else None
                )
                records.append(record)
            
            # SQL de inserción simplificado
            insert_sql = """
                INSERT INTO geo.estaciones (
                    codigo_estacion, nombre_estacion, tipo_estacion, municipio,
                    departamento, latitud, longitud, estado
                ) VALUES %s
                ON CONFLICT (codigo_estacion) DO UPDATE SET
                    nombre_estacion = EXCLUDED.nombre_estacion,
                    estado = EXCLUDED.estado;
            """
            
            # Insertar en lotes
            execute_values(self.cursor, insert_sql, records, page_size=100)
            
            # Actualizar geometrías
            update_geom_sql = """
                UPDATE geo.estaciones
                SET geom = ST_SetSRID(ST_MakePoint(longitud, latitud), 4326)
                WHERE latitud IS NOT NULL AND longitud IS NOT NULL AND geom IS NULL;
            """
            self.cursor.execute(update_geom_sql)
            
            # Commit
            self.conn.commit()
            
            logger.info(f"✅ {len(records)} registros insertados exitosamente")
            
            # Estadísticas
            self.cursor.execute("SELECT COUNT(*) FROM geo.estaciones;")
            total = self.cursor.fetchone()[0]
            logger.info(f"📊 Total en base de datos: {total} estaciones")
            
            return len(records)
            
        except Exception as e:
            self.conn.rollback()
            logger.error(f"❌ Error al cargar datos: {e}")
            return 0
        finally:
            self.disconnect()
    
    def verify_data(self):
        """Verifica los datos cargados."""
        if not self.connect():
            return
        
        try:
            logger.info("\n" + "="*60)
            logger.info("VERIFICACION DE DATOS")
            logger.info("="*60)
            
            # Total de registros
            self.cursor.execute("SELECT COUNT(*) FROM geo.estaciones;")
            total = self.cursor.fetchone()[0]
            logger.info(f"\nTotal de estaciones: {total}")
            
            # Por municipio
            self.cursor.execute("""
                SELECT municipio, COUNT(*) as total
                FROM geo.estaciones
                GROUP BY municipio
                ORDER BY total DESC;
            """)
            logger.info("\nPor municipio:")
            for row in self.cursor.fetchall():
                logger.info(f"  - {row[0]}: {row[1]}")
            
            # Con geometría
            self.cursor.execute("""
                SELECT COUNT(*) FROM geo.estaciones WHERE geom IS NOT NULL;
            """)
            con_geom = self.cursor.fetchone()[0]
            logger.info(f"\nEstaciones con geometria: {con_geom}")
            
        except Exception as e:
            logger.error(f"❌ Error en verificación: {e}")
        finally:
            self.disconnect()


# Ejemplo de uso
if __name__ == "__main__":
    import sys
    
    # Ruta al CSV procesado
    csv_path = os.path.join(
        os.path.dirname(__file__), 
        '..', '..', 
        'datasets', 'processed', 
        'estaciones_ideam_clean.csv'
    )
    
    if not os.path.exists(csv_path):
        logger.error(f"❌ No se encontró el archivo: {csv_path}")
        logger.info("Ejecuta primero: python transformers/estaciones_transformer.py")
        sys.exit(1)
    
    # Crear loader
    loader = EstacionesLoader()
    
    # Cargar datos
    inserted = loader.load_from_csv(csv_path, truncate=True)
    
    if inserted > 0:
        # Verificar
        loader.verify_data()
        logger.info("\n✅ Carga completada exitosamente")
    else:
        logger.error("\n❌ No se pudieron cargar los datos")
