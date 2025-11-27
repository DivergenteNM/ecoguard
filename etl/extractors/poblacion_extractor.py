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
            input_file = os.path.join(base_dir, "datasets", "raw", "poblacion", "poblacion_municipal_2018-2042.xlsx")
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
            # Nota: El archivo puede tener múltiples hojas, usualmente la primera contiene los datos
            df = pd.read_excel(self.input_file, sheet_name=0)
            
            logger.info(f"✅ Archivo leído: {len(df)} filas")
            logger.info(f"Columnas disponibles: {list(df.columns)}")
            
            # Filtrar por departamento (la columna puede llamarse 'DPNOM', 'Departamento', etc.)
            dept_col = next((col for col in df.columns if 'DEP' in col.upper() or 'DPTO' in col.upper()), None)
            
            if dept_col:
                logger.info(f"🔎 Filtrando por departamento usando columna: {dept_col}")
                df_filtered = df[df[dept_col].astype(str).str.upper().str.contains(departamento)]
                logger.info(f"✅ {len(df_filtered)} municipios encontrados en {departamento}")
            else:
                logger.warning("⚠️  No se encontró columna de departamento. Mostrando primeras filas:")
                logger.info(df.head())
                return None
            
            # Buscar columna de población para el año especificado
            year_col = str(year)
            pop_col = next((col for col in df_filtered.columns if year_col in str(col)), None)
            
            if not pop_col:
                logger.warning(f"⚠️  No se encontró columna para el año {year}")
                logger.info(f"Columnas disponibles: {list(df_filtered.columns)}")
                # Intentar con la última columna numérica
                numeric_cols = df_filtered.select_dtypes(include=['number']).columns
                if len(numeric_cols) > 0:
                    pop_col = numeric_cols[-1]
                    logger.info(f"Usando última columna numérica: {pop_col}")
            
            # Identificar columna de municipio
            mun_col = next((col for col in df_filtered.columns if 'MUN' in col.upper() or 'NOMBRE' in col.upper()), None)
            
            if not mun_col:
                logger.error("❌ No se pudo identificar la columna de municipios")
                return None
            
            # Crear DataFrame limpio
            result = pd.DataFrame({
                'municipio': df_filtered[mun_col].str.upper().str.strip(),
                'poblacion_total': df_filtered[pop_col],
                'año': year,
                'fuente': 'DANE - Proyecciones 2018-2042'
            })
            
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
