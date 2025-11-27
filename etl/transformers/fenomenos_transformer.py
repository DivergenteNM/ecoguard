"""
Transformador de Fenómenos Naturales
Limpia y normaliza datos del dataset de fenómenos
"""

import pandas as pd
import numpy as np
from datetime import datetime
import logging
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FenomenosTransformer:
    """
    Transforma y limpia datos de fenómenos naturales.
    
    Operaciones:
    - Limpieza de nombres de municipios
    - Normalización de tipos de fenómenos
    - Conversión de coordenadas
    - Validación de fechas
    - Extracción de información de enlaces
    """
    
    def __init__(self):
        """Inicializa el transformador."""
        self.municipios_normalizados = {}
        self.tipos_fenomenos = set()
    
    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Aplica todas las transformaciones al DataFrame.
        
        Args:
            df: DataFrame crudo de fenómenos
            
        Returns:
            DataFrame transformado y limpio
        """
        logger.info("🔄 Iniciando transformación de fenómenos...")
        
        if df.empty:
            logger.warning("⚠️  DataFrame vacío")
            return df
        
        df_clean = df.copy()
        
        # Aplicar transformaciones
        df_clean = self._clean_municipios(df_clean)
        df_clean = self._normalize_tipos_fenomenos(df_clean)
        df_clean = self._convert_coordinates(df_clean)
        df_clean = self._parse_dates(df_clean)
        df_clean = self._extract_url_info(df_clean)
        df_clean = self._add_derived_fields(df_clean)
        df_clean = self._validate_data(df_clean)
        
        logger.info(f"✅ Transformación completada: {len(df_clean)} registros válidos")
        
        return df_clean
    
    def _clean_municipios(self, df: pd.DataFrame) -> pd.DataFrame:
        """Limpia y normaliza nombres de municipios."""
        logger.info("  🧹 Limpiando nombres de municipios...")
        
        if 'municipio' not in df.columns:
            return df
        
        # Convertir a mayúsculas y quitar espacios
        df['municipio'] = df['municipio'].str.upper().str.strip()
        
        # Remover caracteres especiales
        df['municipio'] = df['municipio'].str.replace(r'[^\w\s]', '', regex=True)
        
        # Normalizar nombres comunes
        normalizaciones = {
            'PASTO': 'PASTO',
            'SAN JUAN DE PASTO': 'PASTO',
            'IPIALES': 'IPIALES',
            'TUMACO': 'TUMACO',
            'SAN ANDRES DE TUMACO': 'TUMACO'
        }
        
        df['municipio'] = df['municipio'].replace(normalizaciones)
        
        return df
    
    def _normalize_tipos_fenomenos(self, df: pd.DataFrame) -> pd.DataFrame:
        """Normaliza tipos de fenómenos."""
        logger.info("  🏷️  Normalizando tipos de fenómenos...")
        
        if 'fen_meno_natural' not in df.columns:
            return df
        
        # Crear columna normalizada
        df['tipo_fenomeno_normalizado'] = df['fen_meno_natural'].str.upper().str.strip()
        
        # Categorizar fenómenos principales
        def categorizar_fenomeno(texto):
            if pd.isna(texto):
                return 'DESCONOCIDO'
            
            texto = texto.upper()
            
            if 'DESLIZAMIENTO' in texto or 'REMOCIÓN' in texto:
                return 'DESLIZAMIENTO'
            elif 'INUNDACIÓN' in texto or 'INUNDACION' in texto:
                return 'INUNDACION'
            elif 'AVENIDA' in texto or 'TORRENCIAL' in texto:
                return 'AVENIDA_TORRENCIAL'
            elif 'SISMO' in texto or 'TERREMOTO' in texto:
                return 'SISMO'
            elif 'INCENDIO' in texto:
                return 'INCENDIO'
            elif 'SEQUÍA' in texto or 'SEQUIA' in texto:
                return 'SEQUIA'
            else:
                return 'OTRO'
        
        df['categoria_fenomeno'] = df['fen_meno_natural'].apply(categorizar_fenomeno)
        
        return df
    
    def _convert_coordinates(self, df: pd.DataFrame) -> pd.DataFrame:
        """Convierte coordenadas a formato numérico."""
        logger.info("  📍 Convirtiendo coordenadas...")
        
        # Convertir latitud y longitud a numérico
        if 'latitud' in df.columns:
            df['latitud'] = pd.to_numeric(df['latitud'], errors='coerce')
        
        if 'longitud' in df.columns:
            df['longitud'] = pd.to_numeric(df['longitud'], errors='coerce')
        
        if 'altura' in df.columns:
            df['altura_msnm'] = pd.to_numeric(df['altura'], errors='coerce')
        
        # Validar rangos para Nariño
        # Latitud: 0.5° a 2.5° N
        # Longitud: -79.5° a -76.5° W
        if 'latitud' in df.columns and 'longitud' in df.columns:
            df['coordenadas_validas'] = (
                (df['latitud'] >= 0.5) & (df['latitud'] <= 2.5) &
                (df['longitud'] >= -79.5) & (df['longitud'] <= -76.5)
            )
        
        return df
    
    def _parse_dates(self, df: pd.DataFrame) -> pd.DataFrame:
        """Parsea y valida fechas."""
        logger.info("  📅 Procesando fechas...")
        
        if 'fecha_reporte' not in df.columns:
            return df
        
        # Convertir a datetime
        df['fecha_reporte_dt'] = pd.to_datetime(df['fecha_reporte'], errors='coerce')
        
        # Extraer componentes
        df['año'] = df['fecha_reporte_dt'].dt.year
        df['mes'] = df['fecha_reporte_dt'].dt.month
        df['dia'] = df['fecha_reporte_dt'].dt.day
        
        # Calcular antigüedad
        hoy = datetime.now()
        df['dias_desde_evento'] = (hoy - df['fecha_reporte_dt']).dt.days
        
        return df
    
    def _extract_url_info(self, df: pd.DataFrame) -> pd.DataFrame:
        """Extrae información de URLs de reportes."""
        logger.info("  🔗 Extrayendo información de enlaces...")
        
        if 'enlace_a_reporte' not in df.columns:
            return df
        
        def extract_url(enlace):
            if pd.isna(enlace):
                return None
            if isinstance(enlace, dict):
                return enlace.get('url')
            return str(enlace)
        
        df['url_reporte'] = df['enlace_a_reporte'].apply(extract_url)
        df['tiene_reporte'] = df['url_reporte'].notna()
        
        return df
    
    def _add_derived_fields(self, df: pd.DataFrame) -> pd.DataFrame:
        """Agrega campos derivados útiles."""
        logger.info("  ➕ Agregando campos derivados...")
        
        # Nivel de riesgo basado en tipo de fenómeno
        def calcular_nivel_riesgo(categoria):
            riesgos = {
                'DESLIZAMIENTO': 'ALTO',
                'INUNDACION': 'ALTO',
                'AVENIDA_TORRENCIAL': 'ALTO',
                'SISMO': 'MEDIO',
                'INCENDIO': 'MEDIO',
                'SEQUIA': 'BAJO',
                'OTRO': 'BAJO',
                'DESCONOCIDO': 'BAJO'
            }
            return riesgos.get(categoria, 'BAJO')
        
        if 'categoria_fenomeno' in df.columns:
            df['nivel_riesgo'] = df['categoria_fenomeno'].apply(calcular_nivel_riesgo)
        
        # Identificador único
        df['id_fenomeno'] = df.index + 1
        
        return df
    
    def _validate_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Valida y filtra datos."""
        logger.info("  ✅ Validando datos...")
        
        inicial = len(df)
        
        # Filtrar registros sin municipio
        df = df[df['municipio'].notna()]
        
        # Filtrar registros sin coordenadas válidas (si existe la columna)
        if 'coordenadas_validas' in df.columns:
            df = df[df['coordenadas_validas'] == True]
        
        # Filtrar registros sin fecha
        if 'fecha_reporte_dt' in df.columns:
            df = df[df['fecha_reporte_dt'].notna()]
        
        final = len(df)
        removidos = inicial - final
        
        if removidos > 0:
            logger.warning(f"  ⚠️  {removidos} registros removidos por validación")
        
        return df
    
    def get_summary_stats(self, df: pd.DataFrame) -> dict:
        """
        Obtiene estadísticas resumen de los datos transformados.
        
        Args:
            df: DataFrame transformado
            
        Returns:
            Diccionario con estadísticas
        """
        stats = {
            'total_registros': len(df),
            'municipios_unicos': df['municipio'].nunique() if 'municipio' in df.columns else 0,
            'tipos_fenomenos': df['categoria_fenomeno'].value_counts().to_dict() if 'categoria_fenomeno' in df.columns else {},
            'con_coordenadas': df['coordenadas_validas'].sum() if 'coordenadas_validas' in df.columns else 0,
            'con_reporte': df['tiene_reporte'].sum() if 'tiene_reporte' in df.columns else 0,
            'rango_fechas': {
                'min': df['fecha_reporte_dt'].min() if 'fecha_reporte_dt' in df.columns else None,
                'max': df['fecha_reporte_dt'].max() if 'fecha_reporte_dt' in df.columns else None
            }
        }
        
        return stats


# Ejemplo de uso
if __name__ == "__main__":
    # Leer datos crudos
    import os
    
    raw_path = os.path.join(os.path.dirname(__file__), '..', '..', 'datasets', 'raw', 'fenomenos_naturales_narino.csv')
    
    if os.path.exists(raw_path):
        df_raw = pd.read_csv(raw_path)
        
        # Transformar
        transformer = FenomenosTransformer()
        df_clean = transformer.transform(df_raw)
        
        # Estadísticas
        stats = transformer.get_summary_stats(df_clean)
        
        print("\n" + "="*60)
        print("📊 ESTADÍSTICAS DE TRANSFORMACIÓN")
        print("="*60)
        print(f"\nTotal de registros: {stats['total_registros']}")
        print(f"Municipios únicos: {stats['municipios_unicos']}")
        print(f"Con coordenadas válidas: {stats['con_coordenadas']}")
        print(f"Con reporte: {stats['con_reporte']}")
        
        print(f"\n📋 Tipos de fenómenos:")
        for tipo, count in stats['tipos_fenomenos'].items():
            print(f"  - {tipo}: {count}")
        
        print(f"\n📅 Rango de fechas:")
        print(f"  - Desde: {stats['rango_fechas']['min']}")
        print(f"  - Hasta: {stats['rango_fechas']['max']}")
        
        # Guardar datos limpios
        processed_path = os.path.join(os.path.dirname(__file__), '..', '..', 'datasets', 'processed', 'fenomenos_naturales_clean.csv')
        os.makedirs(os.path.dirname(processed_path), exist_ok=True)
        df_clean.to_csv(processed_path, index=False)
        
        print(f"\n💾 Datos limpios guardados en: {processed_path}")
    else:
        print(f"❌ No se encontró el archivo: {raw_path}")
        print("Ejecuta primero fenomenos_extractor.py")
