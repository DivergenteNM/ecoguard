"""
Extractor de Estaciones de IDEAM y Terceros
Dataset ID: 57sv-p2fu
Fuente: datos.gov.co (Socrata SODA API)
"""

import requests
import pandas as pd
from typing import Optional, List, Dict
import os
from dotenv import load_dotenv
import logging

# Cargar variables de entorno
load_dotenv()

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class EstacionesIDEAMExtractor:
    """
    Extractor para el dataset de Estaciones de IDEAM y Terceros.
    
    Funcionalidades:
    - Extracción de estaciones por departamento
    - Filtrado por tipo de estación
    - Filtrado por estado (activa/inactiva)
    - Validación de coordenadas geográficas
    - Exportación a CSV y GeoJSON
    """
    
    def __init__(self, app_token: Optional[str] = None):
        """
        Inicializa el extractor.
        
        Args:
            app_token: Token de aplicación de Socrata (opcional)
        """
        # Configuración
        self.base_url = os.getenv('SOCRATA_BASE_URL', 'https://www.datos.gov.co/resource')
        self.dataset_id = os.getenv('ESTACIONES_DATASET_ID', '57sv-p2fu')
        self.endpoint = f"{self.base_url}/{self.dataset_id}.json"
        
        # Token de autenticación
        self.app_token = app_token or os.getenv('SOCRATA_APP_TOKEN')
        
        # Headers
        self.headers = {}
        if self.app_token:
            self.headers['X-App-Token'] = self.app_token
            logger.info("✅ Usando App Token para autenticación")
        else:
            logger.warning("⚠️  No se encontró App Token. Límite: 100 requests/hora")
        
        # Estadísticas
        self.total_requests = 0
        self.total_records = 0
    
    def _make_request(self, params: Dict) -> Optional[List[Dict]]:
        """
        Realiza una petición a la API con manejo de errores.
        
        Args:
            params: Parámetros de la consulta
            
        Returns:
            Lista de registros o None si hay error
        """
        try:
            self.total_requests += 1
            
            response = requests.get(
                self.endpoint,
                params=params,
                headers=self.headers,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                self.total_records += len(data)
                return data
            else:
                logger.error(f"❌ Error API: Status {response.status_code}")
                logger.error(f"Response: {response.text}")
                return None
                
        except requests.exceptions.Timeout:
            logger.error("❌ Timeout en la petición")
            return None
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Error de conexión: {e}")
            return None
        except Exception as e:
            logger.error(f"❌ Error inesperado: {e}")
            return None
    
    def extract_by_departamento(
        self, 
        departamento: str = 'NARIÑO',
        limit: int = 10000
    ) -> pd.DataFrame:
        """
        Extrae estaciones de un departamento específico.
        
        Args:
            departamento: Nombre del departamento
            limit: Número máximo de registros
            
        Returns:
            DataFrame con las estaciones
        """
        logger.info(f"🔄 Extrayendo estaciones de {departamento}...")
        
        params = {
            '$where': f"departamento='{departamento.upper()}'",
            '$limit': limit,
            '$order': 'municipio'
        }
        
        data = self._make_request(params)
        
        if data:
            df = pd.DataFrame(data)
            logger.info(f"✅ Extraídas {len(df)} estaciones de {departamento}")
            return df
        else:
            return pd.DataFrame()
    
    def extract_active_stations(
        self, 
        departamento: str = 'NARIÑO'
    ) -> pd.DataFrame:
        """
        Extrae solo estaciones activas de un departamento.
        
        Args:
            departamento: Nombre del departamento
            
        Returns:
            DataFrame con estaciones activas
        """
        logger.info(f"🔄 Extrayendo estaciones activas de {departamento}...")
        
        # Primero extraer todas
        df_all = self.extract_by_departamento(departamento)
        
        if df_all.empty:
            return pd.DataFrame()
        
        # Filtrar por estado si existe la columna
        if 'estado' in df_all.columns:
            df_active = df_all[df_all['estado'].str.upper() == 'ACTIVA']
            logger.info(f"✅ {len(df_active)} estaciones activas encontradas")
            return df_active
        else:
            logger.warning("⚠️  Columna 'estado' no encontrada, retornando todas")
            return df_all
    
    def extract_by_municipio(
        self, 
        municipio: str,
        departamento: str = 'NARIÑO'
    ) -> pd.DataFrame:
        """
        Extrae estaciones de un municipio específico.
        
        Args:
            municipio: Nombre del municipio
            departamento: Nombre del departamento
            
        Returns:
            DataFrame con las estaciones del municipio
        """
        logger.info(f"🔄 Extrayendo estaciones de {municipio}, {departamento}...")
        
        params = {
            '$where': f"departamento='{departamento.upper()}' AND municipio='{municipio.upper()}'",
            '$order': 'nombreestacion'
        }
        
        data = self._make_request(params)
        
        if data:
            df = pd.DataFrame(data)
            logger.info(f"✅ Extraídas {len(df)} estaciones de {municipio}")
            return df
        else:
            return pd.DataFrame()
    
    def extract_by_tipo(
        self, 
        tipo_estacion: str,
        departamento: str = 'NARIÑO'
    ) -> pd.DataFrame:
        """
        Extrae estaciones por tipo.
        
        Args:
            tipo_estacion: Tipo de estación (ej: 'METEOROLOGICA', 'HIDROMETRICA')
            departamento: Nombre del departamento
            
        Returns:
            DataFrame con estaciones del tipo especificado
        """
        logger.info(f"🔄 Extrayendo estaciones tipo {tipo_estacion}...")
        
        # Extraer todas del departamento
        df_all = self.extract_by_departamento(departamento)
        
        if df_all.empty:
            return pd.DataFrame()
        
        # Filtrar por tipo si existe la columna
        if 'tipo' in df_all.columns:
            df_tipo = df_all[df_all['tipo'].str.upper().str.contains(tipo_estacion.upper(), na=False)]
            logger.info(f"✅ {len(df_tipo)} estaciones tipo {tipo_estacion}")
            return df_tipo
        else:
            logger.warning("⚠️  Columna 'tipo' no encontrada")
            return pd.DataFrame()
    
    def validate_coordinates(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Valida y limpia coordenadas geográficas.
        
        Args:
            df: DataFrame con estaciones
            
        Returns:
            DataFrame con coordenadas validadas
        """
        logger.info("🔄 Validando coordenadas...")
        
        if df.empty:
            return df
        
        # Convertir a numérico
        if 'latitud' in df.columns:
            df['latitud'] = pd.to_numeric(df['latitud'], errors='coerce')
        if 'longitud' in df.columns:
            df['longitud'] = pd.to_numeric(df['longitud'], errors='coerce')
        
        # Contar registros antes
        total_antes = len(df)
        
        # Filtrar coordenadas válidas para Nariño
        # Latitud: 0.5° a 2.5° N
        # Longitud: -79.5° a -76.5° W
        df_valid = df[
            (df['latitud'] >= 0.5) & (df['latitud'] <= 2.5) &
            (df['longitud'] >= -79.5) & (df['longitud'] <= -76.5)
        ].copy()
        
        total_despues = len(df_valid)
        removidos = total_antes - total_despues
        
        if removidos > 0:
            logger.warning(f"⚠️  {removidos} registros removidos por coordenadas inválidas")
        
        logger.info(f"✅ {total_despues} estaciones con coordenadas válidas")
        
        return df_valid
    
    def get_estadisticas_por_municipio(
        self, 
        departamento: str = 'NARIÑO'
    ) -> pd.DataFrame:
        """
        Obtiene estadísticas de estaciones por municipio.
        
        Args:
            departamento: Nombre del departamento
            
        Returns:
            DataFrame con conteo por municipio
        """
        logger.info("🔄 Obteniendo estadísticas por municipio...")
        
        df = self.extract_by_departamento(departamento)
        
        if df.empty:
            return pd.DataFrame()
        
        # Agrupar por municipio
        stats = df.groupby('municipio').size().reset_index(name='total_estaciones')
        stats = stats.sort_values('total_estaciones', ascending=False)
        
        logger.info(f"✅ Estadísticas de {len(stats)} municipios")
        
        return stats
    
    def save_to_csv(self, df: pd.DataFrame, filename: str) -> str:
        """
        Guarda DataFrame a CSV.
        
        Args:
            df: DataFrame a guardar
            filename: Nombre del archivo (sin extensión)
            
        Returns:
            Ruta del archivo guardado
        """
        output_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'datasets', 'raw')
        os.makedirs(output_dir, exist_ok=True)
        
        filepath = os.path.join(output_dir, f"{filename}.csv")
        df.to_csv(filepath, index=False, encoding='utf-8')
        
        logger.info(f"💾 Guardado en: {filepath}")
        return filepath
    
    def save_to_geojson(self, df: pd.DataFrame, filename: str) -> str:
        """
        Guarda DataFrame a GeoJSON (requiere geopandas).
        
        Args:
            df: DataFrame con columnas latitud y longitud
            filename: Nombre del archivo (sin extensión)
            
        Returns:
            Ruta del archivo guardado
        """
        try:
            import geopandas as gpd
            from shapely.geometry import Point
            
            # Validar coordenadas
            df_valid = self.validate_coordinates(df)
            
            if df_valid.empty:
                logger.error("❌ No hay datos con coordenadas válidas")
                return ""
            
            # Crear geometría
            geometry = [Point(xy) for xy in zip(df_valid['longitud'], df_valid['latitud'])]
            gdf = gpd.GeoDataFrame(df_valid, geometry=geometry, crs='EPSG:4326')
            
            # Guardar
            output_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'datasets', 'processed')
            os.makedirs(output_dir, exist_ok=True)
            
            filepath = os.path.join(output_dir, f"{filename}.geojson")
            gdf.to_file(filepath, driver='GeoJSON')
            
            logger.info(f"💾 GeoJSON guardado en: {filepath}")
            return filepath
            
        except ImportError:
            logger.warning("⚠️  geopandas no instalado. Instalar con: pip install geopandas")
            return ""
        except Exception as e:
            logger.error(f"❌ Error al guardar GeoJSON: {e}")
            return ""
    
    def get_stats(self) -> Dict:
        """
        Obtiene estadísticas del extractor.
        
        Returns:
            Diccionario con estadísticas
        """
        return {
            'total_requests': self.total_requests,
            'total_records': self.total_records,
            'using_token': bool(self.app_token)
        }


# Ejemplo de uso
if __name__ == "__main__":
    # Crear extractor
    extractor = EstacionesIDEAMExtractor()
    
    # Extraer estaciones de Nariño
    df_narino = extractor.extract_by_departamento('NARIÑO')
    
    if not df_narino.empty:
        print("\n" + "="*60)
        print("📊 RESUMEN DE DATOS EXTRAÍDOS")
        print("="*60)
        print(f"\nTotal de estaciones: {len(df_narino)}")
        print(f"\nColumnas disponibles:")
        for col in df_narino.columns:
            print(f"  - {col}")
        
        # Validar coordenadas
        df_valid = extractor.validate_coordinates(df_narino)
        print(f"\n📍 Estaciones con coordenadas válidas: {len(df_valid)}")
        
        # Estadísticas por municipio
        stats = extractor.get_estadisticas_por_municipio()
        print(f"\n📊 Top 10 municipios con más estaciones:")
        print(stats.head(10).to_string(index=False))
        
        # Guardar a CSV
        extractor.save_to_csv(df_valid, 'estaciones_ideam_narino')
        
        # Intentar guardar GeoJSON
        extractor.save_to_geojson(df_valid, 'estaciones_ideam_narino')
        
        # Estadísticas del extractor
        stats_extractor = extractor.get_stats()
        print(f"\n📈 Estadísticas del extractor:")
        print(f"  - Requests realizados: {stats_extractor['total_requests']}")
        print(f"  - Registros obtenidos: {stats_extractor['total_records']}")
        print(f"  - Usando token: {'✅ Sí' if stats_extractor['using_token'] else '❌ No'}")
