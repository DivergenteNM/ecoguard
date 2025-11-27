"""
Transformador de Estaciones IDEAM
Limpia y normaliza datos de estaciones de monitoreo
"""

import pandas as pd
import numpy as np
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class EstacionesTransformer:
    """
    Transforma y limpia datos de estaciones IDEAM.
    
    Operaciones:
    - Deduplicación de estaciones
    - Validación de coordenadas
    - Normalización de nombres
    - Agregación de observaciones por estación
    """
    
    def __init__(self):
        """Inicializa el transformador."""
        self.estaciones_unicas = {}
    
    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Aplica todas las transformaciones al DataFrame.
        
        Args:
            df: DataFrame crudo de estaciones
            
        Returns:
            DataFrame transformado con estaciones únicas
        """
        logger.info("🔄 Iniciando transformación de estaciones...")
        
        if df.empty:
            logger.warning("⚠️  DataFrame vacío")
            return df
        
        df_clean = df.copy()
        
        # Aplicar transformaciones
        df_clean = self._clean_station_names(df_clean)
        df_clean = self._convert_coordinates(df_clean)
        df_clean = self._deduplicate_stations(df_clean)
        df_clean = self._normalize_types(df_clean)
        df_clean = self._validate_data(df_clean)
        
        logger.info(f"✅ Transformación completada: {len(df_clean)} estaciones únicas")
        
        return df_clean
    
    def _clean_station_names(self, df: pd.DataFrame) -> pd.DataFrame:
        """Limpia nombres de estaciones."""
        logger.info("  🧹 Limpiando nombres de estaciones...")
        
        if 'nombreestacion' in df.columns:
            df['nombreestacion'] = df['nombreestacion'].str.strip()
            df['nombreestacion'] = df['nombreestacion'].str.upper()
        
        if 'municipio' in df.columns:
            df['municipio'] = df['municipio'].str.strip()
            df['municipio'] = df['municipio'].str.upper()
        
        return df
    
    def _convert_coordinates(self, df: pd.DataFrame) -> pd.DataFrame:
        """Convierte coordenadas a formato numérico."""
        logger.info("  📍 Convirtiendo coordenadas...")
        
        if 'latitud' in df.columns:
            df['latitud'] = pd.to_numeric(df['latitud'], errors='coerce')
        
        if 'longitud' in df.columns:
            df['longitud'] = pd.to_numeric(df['longitud'], errors='coerce')
        
        # Validar rangos para Nariño
        if 'latitud' in df.columns and 'longitud' in df.columns:
            df['coordenadas_validas'] = (
                (df['latitud'] >= 0.5) & (df['latitud'] <= 2.5) &
                (df['longitud'] >= -79.5) & (df['longitud'] <= -76.5)
            )
        
        return df
    
    def _deduplicate_stations(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Deduplica estaciones y agrega información.
        
        El dataset de observaciones tiene múltiples filas por estación.
        Necesitamos una fila única por estación.
        """
        logger.info("  🔄 Deduplicando estaciones...")
        
        # Columnas de estación (no de observación)
        station_cols = [
            'codigoestacion', 'nombreestacion', 'departamento', 
            'municipio', 'zonahidrografica', 'latitud', 'longitud',
            'entidad', 'coordenadas_validas'
        ]
        
        # Filtrar solo columnas que existen
        available_cols = [col for col in station_cols if col in df.columns]
        
        # Agrupar por código de estación
        df_stations = df[available_cols].drop_duplicates(subset=['codigoestacion'])
        
        logger.info(f"  📊 {len(df)} observaciones → {len(df_stations)} estaciones únicas")
        
        return df_stations
    
    def _normalize_types(self, df: pd.DataFrame) -> pd.DataFrame:
        """Normaliza tipos de estaciones."""
        logger.info("  🏷️  Normalizando tipos...")
        
        # El dataset de observaciones no tiene tipo de estación directamente
        # Lo inferiremos del tipo de sensor si está disponible
        if 'descripcionsensor' in df.columns:
            def inferir_tipo(descripcion):
                if pd.isna(descripcion):
                    return 'DESCONOCIDO'
                
                desc = str(descripcion).upper()
                
                if 'PRECIPITACION' in desc or 'LLUVIA' in desc:
                    return 'PLUVIOMETRICA'
                elif 'TEMPERATURA' in desc:
                    return 'METEOROLOGICA'
                elif 'NIVEL' in desc or 'CAUDAL' in desc:
                    return 'HIDROMETRICA'
                elif 'VIENTO' in desc:
                    return 'METEOROLOGICA'
                else:
                    return 'OTRA'
            
            # Agrupar por estación y tomar el tipo más común
            if 'codigoestacion' in df.columns:
                tipo_por_estacion = df.groupby('codigoestacion')['descripcionsensor'].first()
                df['tipo_estacion'] = df['codigoestacion'].map(
                    lambda x: inferir_tipo(tipo_por_estacion.get(x))
                )
        else:
            df['tipo_estacion'] = 'DESCONOCIDO'
        
        # Estado (asumimos todas activas si tienen observaciones recientes)
        df['estado'] = 'ACTIVA'
        
        return df
    
    def _validate_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Valida y filtra datos."""
        logger.info("  ✅ Validando datos...")
        
        inicial = len(df)
        
        # Filtrar registros sin código de estación
        df = df[df['codigoestacion'].notna()]
        
        # Filtrar registros sin coordenadas válidas
        if 'coordenadas_validas' in df.columns:
            df = df[df['coordenadas_validas'] == True]
        
        # Filtrar registros sin municipio
        if 'municipio' in df.columns:
            df = df[df['municipio'].notna()]
        
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
            'total_estaciones': len(df),
            'municipios_unicos': df['municipio'].nunique() if 'municipio' in df.columns else 0,
            'tipos_estacion': df['tipo_estacion'].value_counts().to_dict() if 'tipo_estacion' in df.columns else {},
            'con_coordenadas': df['coordenadas_validas'].sum() if 'coordenadas_validas' in df.columns else 0,
            'entidades': df['entidad'].value_counts().to_dict() if 'entidad' in df.columns else {}
        }
        
        return stats


# Ejemplo de uso
if __name__ == "__main__":
    import os
    
    # Leer datos crudos
    raw_path = os.path.join(os.path.dirname(__file__), '..', '..', 'datasets', 'raw', 'estaciones_ideam_narino.csv')
    
    if os.path.exists(raw_path):
        df_raw = pd.read_csv(raw_path)
        
        # Transformar
        transformer = EstacionesTransformer()
        df_clean = transformer.transform(df_raw)
        
        # Estadísticas
        stats = transformer.get_summary_stats(df_clean)
        
        print("\n" + "="*60)
        print("ESTADISTICAS DE TRANSFORMACION")
        print("="*60)
        print(f"\nTotal de estaciones unicas: {stats['total_estaciones']}")
        print(f"Municipios con estaciones: {stats['municipios_unicos']}")
        print(f"Con coordenadas validas: {stats['con_coordenadas']}")
        
        print(f"\nTipos de estaciones:")
        for tipo, count in stats['tipos_estacion'].items():
            print(f"  - {tipo}: {count}")
        
        print(f"\nEntidades:")
        for entidad, count in list(stats['entidades'].items())[:5]:
            print(f"  - {entidad[:50]}: {count}")
        
        # Guardar datos limpios
        processed_path = os.path.join(os.path.dirname(__file__), '..', '..', 'datasets', 'processed', 'estaciones_ideam_clean.csv')
        os.makedirs(os.path.dirname(processed_path), exist_ok=True)
        df_clean.to_csv(processed_path, index=False)
        
        print(f"\nDatos limpios guardados en: {processed_path}")
    else:
        print(f"❌ No se encontró el archivo: {raw_path}")
        print("Ejecuta primero: python extractors/estaciones_extractor.py")
