"""
Extractor y Transformer de Población DANE
Procesa el archivo Excel de proyecciones de población municipal
y extrae los datos de Nariño para el año más reciente
"""

import pandas as pd
import os
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PoblacionExtractor:
    """
    Extrae y transforma datos de población del DANE.
    """
    
    def __init__(self, input_file=None):
        if input_file is None:
            # Ruta absoluta al archivo
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
            input_file = os.path.join(base_dir, "datasets", "raw", "poblacion", "pob_municipios_narino.xlsx")
        self.input_file = input_file
        self.output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "datasets", "processed")
        os.makedirs(self.output_dir, exist_ok=True)
        
    def extract_and_transform(self, year=2024, departamento='NARIÑO'):
        """
        Extrae datos de población para un departamento y año específico.
        """
        logger.info(f"📊 Leyendo archivo Excel: {self.input_file}...")
        
        try:
            # Leer el archivo Excel
            df = pd.read_excel(self.input_file)
            
            logger.info(f"✅ Archivo leído: {len(df)} filas")
            logger.info(f"Columnas disponibles: {list(df.columns)}")
            
            # Normalizar nombres de columnas para facilitar búsqueda
            df.columns = [str(col).strip() for col in df.columns]
            
            # Filtrar por año
            if 'AÑO' in df.columns:
                df = df[df['AÑO'] == year]
                logger.info(f"✅ Filtrado por año {year}: {len(df)} registros")
            else:
                logger.warning("⚠️  No se encontró columna 'AÑO'. Usando todos los registros.")

            # Filtrar por departamento (DPNOM)
            if 'DPNOM' in df.columns:
                df_filtered = df[df['DPNOM'].astype(str).str.upper().str.contains(departamento)]
                logger.info(f"✅ {len(df_filtered)} municipios encontrados en {departamento}")
            else:
                logger.warning(f"⚠️  No se encontró columna 'DPNOM'. Intentando filtrar por código si es posible o usando todo.")
                df_filtered = df
            required_cols = ['DPMP', 'Población']
            missing = [col for col in required_cols if col not in df_filtered.columns]
            
            if missing:
                logger.error(f"❌ Faltan columnas requeridas: {missing}")
                return None
            
            # Crear DataFrame limpio
            # Al parecer DPMP contiene el NOMBRE del municipio en este archivo, no el código
            # Y no hay columna de código explícita según la inspección
            
            result = pd.DataFrame({
                'poblacion_total': df_filtered['Población'],
                'año': year,
                'fuente': 'DANE - Proyecciones (Nueva Fuente)'
            })
            
            # Intentar determinar si DPMP es código o nombre
            sample_val = str(df_filtered['DPMP'].iloc[0]) if not df_filtered.empty else ''
            is_numeric = sample_val.replace('.','').isdigit()
            
            if is_numeric:
                result['codigo_dane'] = df_filtered['DPMP'].astype(str).str.zfill(5)
                result['municipio'] = 'DESCONOCIDO' # O intentar buscar nombre en otra col
            else:
                # Es nombre
                result['codigo_dane'] = None
                result['municipio'] = df_filtered['DPMP'].str.upper().str.strip()
            
            # Limpiar valores nulos
            result = result.dropna(subset=['poblacion_total'])
            result['poblacion_total'] = result['poblacion_total'].astype(int)
            # Guardar resultado
            output_file = os.path.join(self.output_dir, f'poblacion_narino_{year}.csv')
            result.to_csv(output_file, index=False, encoding='utf-8')
            
            logger.info(f"💾 Datos guardados en: {output_file}")
            logger.info(f"📊 Resumen:")
            logger.info(f"   - Total municipios: {len(result)}")
            logger.info(f"   - Población total: {result['poblacion_total'].sum():,}")
            if not result.empty:
                logger.info(f"   - Municipio más poblado: {result.loc[result['poblacion_total'].idxmax(), 'municipio']} ({result['poblacion_total'].max():,})")
            
            return output_file
            
        except Exception as e:
            logger.error(f"❌ Error procesando archivo: {e}")
            import traceback
            traceback.print_exc()
            return None

if __name__ == "__main__":
    extractor = PoblacionExtractor()
    extractor.extract_and_transform(year=2024, departamento='NARIÑO')
