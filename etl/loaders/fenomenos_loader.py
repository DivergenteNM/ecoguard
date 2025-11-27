"""
Loader de Fenómenos Naturales a PostgreSQL
Carga datos transformados a la base de datos
"""

import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
import os
from dotenv import load_dotenv
import logging
from datetime import datetime

# Cargar configuración de base de datos
env_path = os.path.join(os.path.dirname(__file__), '..', 'db_config.env')
load_dotenv(env_path)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FenomenosLoader:
    """
    Carga datos de fenómenos naturales a PostgreSQL.
    """
    
    def __init__(self, db_url: str = None):
        """
        Inicializa el loader.
        
        Args:
            db_url: URL de conexión a PostgreSQL
        """
        # Usar parámetros individuales en lugar de URL para evitar problemas de encoding
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
        Carga datos desde CSV a la tabla fenomenos_naturales.
        
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
                self.cursor.execute("TRUNCATE TABLE public.fenomenos_naturales RESTART IDENTITY CASCADE;")
                logger.info("🗑️  Tabla truncada")
            
            # Preparar datos
            records = []
            for _, row in df.iterrows():
                record = (
                    int(row['id_fenomeno']) if pd.notna(row.get('id_fenomeno')) else None,
                    str(row['municipio']) if pd.notna(row.get('municipio')) else None,
                    str(row['vereda']) if pd.notna(row.get('vereda')) else None,
                    float(row['latitud']) if pd.notna(row.get('latitud')) else None,
                    float(row['longitud']) if pd.notna(row.get('longitud')) else None,
                    int(row['altura_msnm']) if pd.notna(row.get('altura_msnm')) else None,
                    str(row['cuenca_hidrogr_fica']) if pd.notna(row.get('cuenca_hidrogr_fica')) else None,
                    str(row['fen_meno_natural']) if pd.notna(row.get('fen_meno_natural')) else None,
                    str(row['tipo_fenomeno_normalizado']) if pd.notna(row.get('tipo_fenomeno_normalizado')) else None,
                    str(row['categoria_fenomeno']) if pd.notna(row.get('categoria_fenomeno')) else None,
                    str(row['nivel_riesgo']) if pd.notna(row.get('nivel_riesgo')) else None,
                    str(row['n_mero_informe']) if pd.notna(row.get('n_mero_informe')) else None,
                    pd.to_datetime(row['fecha_reporte_dt']) if pd.notna(row.get('fecha_reporte_dt')) else None,
                    int(row['año']) if pd.notna(row.get('año')) else None,
                    int(row['mes']) if pd.notna(row.get('mes')) else None,
                    int(row['dia']) if pd.notna(row.get('dia')) else None,
                    int(row['dias_desde_evento']) if pd.notna(row.get('dias_desde_evento')) else None,
                    str(row['url_reporte']) if pd.notna(row.get('url_reporte')) else None,
                    bool(row['tiene_reporte']) if pd.notna(row.get('tiene_reporte')) else False,
                    bool(row['coordenadas_validas']) if pd.notna(row.get('coordenadas_validas')) else False,
                )
                records.append(record)
            
            # SQL de inserción
            insert_sql = """
                INSERT INTO public.fenomenos_naturales (
                    id_fenomeno, municipio, vereda, latitud, longitud, altura_msnm,
                    cuenca_hidrografica, tipo_fenomeno_original, tipo_fenomeno_normalizado,
                    categoria_fenomeno, nivel_riesgo, numero_informe, fecha_reporte,
                    año, mes, dia, dias_desde_evento, url_reporte, tiene_reporte,
                    coordenadas_validas
                ) VALUES %s
                ON CONFLICT (id_fenomeno) DO UPDATE SET
                    municipio = EXCLUDED.municipio,
                    updated_at = CURRENT_TIMESTAMP;
            """
            
            # Insertar en lotes
            execute_values(self.cursor, insert_sql, records, page_size=100)
            
            # Actualizar geometrías
            update_geom_sql = """
                UPDATE public.fenomenos_naturales
                SET geom = ST_SetSRID(ST_MakePoint(longitud, latitud), 4326)
                WHERE latitud IS NOT NULL AND longitud IS NOT NULL AND geom IS NULL;
            """
            self.cursor.execute(update_geom_sql)
            
            # Commit
            self.conn.commit()
            
            logger.info(f"✅ {len(records)} registros insertados exitosamente")
            
            # Estadísticas
            self.cursor.execute("SELECT COUNT(*) FROM public.fenomenos_naturales;")
            total = self.cursor.fetchone()[0]
            logger.info(f"📊 Total en base de datos: {total} registros")
            
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
            logger.info("📊 VERIFICACIÓN DE DATOS")
            logger.info("="*60)
            
            # Total de registros
            self.cursor.execute("SELECT COUNT(*) FROM public.fenomenos_naturales;")
            total = self.cursor.fetchone()[0]
            logger.info(f"\n✅ Total de registros: {total}")
            
            # Por categoría
            self.cursor.execute("""
                SELECT categoria_fenomeno, COUNT(*) as total
                FROM public.fenomenos_naturales
                GROUP BY categoria_fenomeno
                ORDER BY total DESC;
            """)
            logger.info("\n📋 Por categoría:")
            for row in self.cursor.fetchall():
                logger.info(f"  - {row[0]}: {row[1]}")
            
            # Por municipio (top 10)
            self.cursor.execute("""
                SELECT municipio, COUNT(*) as total
                FROM public.fenomenos_naturales
                GROUP BY municipio
                ORDER BY total DESC
                LIMIT 10;
            """)
            logger.info("\n📍 Top 10 municipios:")
            for row in self.cursor.fetchall():
                logger.info(f"  - {row[0]}: {row[1]}")
            
            # Con geometría
            self.cursor.execute("""
                SELECT COUNT(*) FROM public.fenomenos_naturales WHERE geom IS NOT NULL;
            """)
            con_geom = self.cursor.fetchone()[0]
            logger.info(f"\n🗺️  Registros con geometría: {con_geom}")
            
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
        'fenomenos_naturales_clean.csv'
    )
    
    if not os.path.exists(csv_path):
        logger.error(f"❌ No se encontró el archivo: {csv_path}")
        logger.info("Ejecuta primero: python transformers/fenomenos_transformer.py")
        sys.exit(1)
    
    # Crear loader
    loader = FenomenosLoader()
    
    # Cargar datos
    inserted = loader.load_from_csv(csv_path, truncate=True)
    
    if inserted > 0:
        # Verificar
        loader.verify_data()
        logger.info("\n✅ Carga completada exitosamente")
    else:
        logger.error("\n❌ No se pudieron cargar los datos")
