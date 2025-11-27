"""
Extractor de Fenómenos Naturales Amenazantes - Nariño
Dataset ID: i8ar-8tth
Fuente: datos.gov.co (Socrata SODA API)
"""

import requests
import pandas as pd
from datetime import datetime, timedelta
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


class FenomenosNaturalesExtractor:
    """
    Extractor para el dataset de Fenómenos Naturales Amenazantes en Nariño.
    
    Funcionalidades:
    - Extracción completa de fenómenos históricos
    - Filtrado por municipio, tipo de fenómeno, fechas
    - Paginación automática para datasets grandes
    - Manejo de errores y reintentos
    - Validación de datos
    """
    
    def __init__(self, app_token: Optional[str] = None):
        """
        Inicializa el extractor.
        
        Args:
            app_token: Token de aplicación de Socrata (opcional)
                      Si no se proporciona, se intenta leer de .env
        """
        # Configuración
        self.base_url = os.getenv('SOCRATA_BASE_URL', 'https://www.datos.gov.co/resource')
        self.dataset_id = os.getenv('FENOMENOS_DATASET_ID', 'i8ar-8tth')
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
    
    def extract_all(self, limit: int = 10000) -> pd.DataFrame:
        """
        Extrae todos los fenómenos naturales del dataset.
        
        Args:
            limit: Número máximo de registros a obtener
            
        Returns:
            DataFrame con los fenómenos
        """
        logger.info("🔄 Extrayendo todos los fenómenos naturales...")
        
        params = {
            '$limit': limit,
            '$order': 'fecha_reporte DESC'
        }
        
        data = self._make_request(params)
        
        if data:
            df = pd.DataFrame(data)
            logger.info(f"✅ Extraídos {len(df)} fenómenos")
            return df
        else:
            logger.error("❌ No se pudieron extraer datos")
            return pd.DataFrame()
    
    def extract_by_municipio(self, municipio: str) -> pd.DataFrame:
        """
        Extrae fenómenos de un municipio específico.
        
        Args:
            municipio: Nombre del municipio (ej: 'PASTO', 'IPIALES')
            
        Returns:
            DataFrame con los fenómenos del municipio
        """
        logger.info(f"🔄 Extrayendo fenómenos de {municipio}...")
        
        params = {
            '$where': f"municipio='{municipio.upper()}'",
            '$order': 'fecha_reporte DESC'
        }
        
        data = self._make_request(params)
        
        if data:
            df = pd.DataFrame(data)
            logger.info(f"✅ Extraídos {len(df)} fenómenos de {municipio}")
            return df
        else:
            return pd.DataFrame()
    
    def extract_by_tipo(self, tipo_fenomeno: str) -> pd.DataFrame:
        """
        Extrae fenómenos por tipo.
        
        Args:
            tipo_fenomeno: Tipo de fenómeno a buscar
                          (ej: 'Deslizamiento', 'Inundación')
            
        Returns:
            DataFrame con los fenómenos del tipo especificado
        """
        logger.info(f"🔄 Extrayendo fenómenos tipo: {tipo_fenomeno}...")
        
        params = {
            '$where': f"fen_meno_natural LIKE '%{tipo_fenomeno}%'",
            '$order': 'fecha_reporte DESC'
        }
        
        data = self._make_request(params)
        
        if data:
            df = pd.DataFrame(data)
            logger.info(f"✅ Extraídos {len(df)} fenómenos tipo {tipo_fenomeno}")
            return df
        else:
            return pd.DataFrame()
    
    def extract_by_date_range(
        self, 
        fecha_inicio: str, 
        fecha_fin: str
    ) -> pd.DataFrame:
        """
        Extrae fenómenos en un rango de fechas.
        
        Args:
            fecha_inicio: Fecha de inicio (formato: 'YYYY-MM-DD')
            fecha_fin: Fecha de fin (formato: 'YYYY-MM-DD')
            
        Returns:
            DataFrame con los fenómenos en el rango
        """
        logger.info(f"🔄 Extrayendo fenómenos entre {fecha_inicio} y {fecha_fin}...")
        
        params = {
            '$where': f"fecha_reporte >= '{fecha_inicio}T00:00:00' AND fecha_reporte <= '{fecha_fin}T23:59:59'",
            '$order': 'fecha_reporte DESC'
        }
        
        data = self._make_request(params)
        
        if data:
            df = pd.DataFrame(data)
            logger.info(f"✅ Extraídos {len(df)} fenómenos en el rango")
            return df
        else:
            return pd.DataFrame()
    
    def extract_recent(self, days: int = 365) -> pd.DataFrame:
        """
        Extrae fenómenos recientes.
        
        Args:
            days: Número de días hacia atrás desde hoy
            
        Returns:
            DataFrame con los fenómenos recientes
        """
        fecha_fin = datetime.now()
        fecha_inicio = fecha_fin - timedelta(days=days)
        
        return self.extract_by_date_range(
            fecha_inicio.strftime('%Y-%m-%d'),
            fecha_fin.strftime('%Y-%m-%d')
        )
    
    def get_estadisticas_por_municipio(self) -> pd.DataFrame:
        """
        Obtiene estadísticas agregadas por municipio.
        
        Returns:
            DataFrame con conteo de fenómenos por municipio
        """
        logger.info("🔄 Obteniendo estadísticas por municipio...")
        
        params = {
            '$select': 'municipio, count(*) as total',
            '$group': 'municipio',
            '$order': 'total DESC'
        }
        
        data = self._make_request(params)
        
        if data:
            df = pd.DataFrame(data)
            logger.info(f"✅ Estadísticas de {len(df)} municipios")
            return df
        else:
            return pd.DataFrame()
    
    def get_estadisticas_por_tipo(self) -> pd.DataFrame:
        """
        Obtiene estadísticas agregadas por tipo de fenómeno.
        
        Returns:
            DataFrame con conteo de fenómenos por tipo
        """
        logger.info("🔄 Obteniendo estadísticas por tipo de fenómeno...")
        
        params = {
            '$select': 'fen_meno_natural, count(*) as total',
            '$group': 'fen_meno_natural',
            '$order': 'total DESC'
        }
        
        data = self._make_request(params)
        
        if data:
            df = pd.DataFrame(data)
            logger.info(f"✅ Estadísticas de {len(df)} tipos de fenómenos")
            return df
        else:
            return pd.DataFrame()
    
    def extract_with_pagination(
        self, 
        batch_size: int = 1000,
        max_records: int = 10000
    ) -> pd.DataFrame:
        """
        Extrae datos con paginación para datasets grandes.
        
        Args:
            batch_size: Tamaño de cada lote
            max_records: Máximo de registros a extraer
            
        Returns:
            DataFrame con todos los registros
        """
        logger.info(f"🔄 Extrayendo con paginación (lotes de {batch_size})...")
        
        all_data = []
        offset = 0
        
        while offset < max_records:
            params = {
                '$limit': batch_size,
                '$offset': offset,
                '$order': 'fecha_reporte DESC'
            }
            
            data = self._make_request(params)
            
            if not data or len(data) == 0:
                break
            
            all_data.extend(data)
            offset += batch_size
            
            logger.info(f"  📦 Lote {offset // batch_size}: {len(data)} registros")
            
            if len(data) < batch_size:
                break
        
        if all_data:
            df = pd.DataFrame(all_data)
            logger.info(f"✅ Total extraído: {len(df)} registros")
            return df
        else:
            return pd.DataFrame()
    
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
    extractor = FenomenosNaturalesExtractor()
    
    # Extraer todos los fenómenos
    df_all = extractor.extract_all()
    
    if not df_all.empty:
        print("\n" + "="*60)
        print("📊 RESUMEN DE DATOS EXTRAÍDOS")
        print("="*60)
        print(f"\nTotal de registros: {len(df_all)}")
        print(f"\nColumnas disponibles:")
        for col in df_all.columns:
            print(f"  - {col}")
        
        print(f"\n📍 Primeros 5 registros:")
        print(df_all.head())
        
        # Guardar a CSV
        extractor.save_to_csv(df_all, 'fenomenos_naturales_narino')
        
        # Estadísticas
        stats = extractor.get_stats()
        print(f"\n📈 Estadísticas del extractor:")
        print(f"  - Requests realizados: {stats['total_requests']}")
        print(f"  - Registros obtenidos: {stats['total_records']}")
        print(f"  - Usando token: {'✅ Sí' if stats['using_token'] else '❌ No'}")
