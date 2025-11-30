"""
Buscar y extraer datos de población municipal de Nariño desde datos.gov.co
"""

import requests
import json
from typing import Optional, Dict, List
import os
from dotenv import load_dotenv
import logging

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def search_population_datasets():
    """
    Busca datasets relacionados con población en datos.gov.co
    """
    logger.info("🔍 Buscando datasets de población municipal...")
    
    # API de búsqueda de Socrata
    search_url = "https://www.datos.gov.co/api/catalog/v1"
    
    params = {
        'q': 'poblacion municipal',
        'limit': 20
    }
    
    try:
        response = requests.get(search_url, params=params, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            logger.info(f"✅ Encontrados {len(data.get('results', []))} datasets")
            
            for i, dataset in enumerate(data.get('results', [])[:10]):
                resource = dataset.get('resource', {})
                logger.info(f"\n{i+1}. {resource.get('name', 'Sin nombre')}")
                logger.info(f"   ID: {resource.get('id', 'N/A')}")
                logger.info(f"   Descripción: {resource.get('description', 'N/A')[:100]}...")
                
                # Ver si tiene columnas de población
                if 'columns_name' in resource:
                    logger.info(f"   Columnas: {', '.join(resource['columns_name'][:5])}")
        else:
            logger.error(f"❌ Error HTTP {response.status_code}")
            
    except Exception as e:
        logger.error(f"❌ Error buscando datasets: {e}")


def try_dane_proyecciones():
    """
    Intenta obtener proyecciones de población del DANE
    Dataset común: Proyecciones de población municipal
    """
    logger.info("\n🔍 Intentando datasets conocidos del DANE...")
    
    # IDs conocidos de datasets de población
    dataset_ids = [
        'xdk5-pm3f',  # Población DANE
        '2v9d-c8fi',  # Demografía
        'gdxc-w37w',  # Municipios (que ya usamos)
    ]
    
    app_token = os.getenv('SOCRATA_APP_TOKEN')
    headers = {'X-App-Token': app_token} if app_token else {}
    
    for dataset_id in dataset_ids:
        try:
            # Obtener metadatos
            meta_url = f"https://www.datos.gov.co/api/views/{dataset_id}.json"
            response = requests.get(meta_url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                meta = response.json()
                logger.info(f"\n✅ Dataset encontrado: {dataset_id}")
                logger.info(f"   Nombre: {meta.get('name', 'N/A')}")
                logger.info(f"   Descripción: {meta.get('description', 'N/A')[:150]}...")
                
                # Ver columnas
                columns = meta.get('columns', [])
                col_names = [c.get('name') for c in columns if 'name' in c]
                logger.info(f"   Columnas ({len(col_names)}): {', '.join(col_names[:10])}")
                
                # Ver si tiene datos de Nariño
                data_url = f"https://www.datos.gov.co/resource/{dataset_id}.json"
                params = {'$limit': 5}
                data_resp = requests.get(data_url, params=params, headers=headers, timeout=10)
                
                if data_resp.status_code == 200:
                    sample = data_resp.json()
                    logger.info(f"   Muestra de datos ({len(sample)} registros):")
                    for item in sample[:2]:
                        logger.info(f"      {json.dumps(item, indent=2)[:200]}...")
            
        except Exception as e:
            logger.debug(f"   Dataset {dataset_id} no disponible: {e}")
            continue


def check_census_data():
    """
    Verifica si hay datos del censo disponibles
    """
    logger.info("\n📊 Verificando datos censales...")
    
    # URL típica de censos en datos.gov.co
    search_terms = ['censo 2018', 'proyecciones poblacion', 'dane poblacion municipal']
    
    for term in search_terms:
        logger.info(f"\n🔎 Buscando: '{term}'")
        
        try:
            search_url = "https://www.datos.gov.co/api/catalog/v1"
            params = {
                'q': term,
                'limit': 5,
                'only': 'datasets'
            }
            
            response = requests.get(search_url, params=params, timeout=20)
            
            if response.status_code == 200:
                data = response.json()
                results = data.get('results', [])
                
                if results:
                    logger.info(f"   ✅ Encontrados {len(results)} resultados")
                    for result in results[:3]:
                        resource = result.get('resource', {})
                        logger.info(f"      • {resource.get('name')}")
                        logger.info(f"        ID: {resource.get('id')}")
                else:
                    logger.info(f"   ℹ️  No se encontraron resultados")
                    
        except Exception as e:
            logger.error(f"   ❌ Error: {e}")


if __name__ == "__main__":
    logger.info("=" * 80)
    logger.info("🔍 BÚSQUEDA DE DATOS DE POBLACIÓN MUNICIPAL")
    logger.info("=" * 80)
    
    search_population_datasets()
    try_dane_proyecciones()
    check_census_data()
    
    logger.info("\n" + "=" * 80)
    logger.info("📌 ALTERNATIVAS:")
    logger.info("   1. Usar API del DANE directamente: https://www.dane.gov.co/")
    logger.info("   2. Descargar censo 2018: https://www.dane.gov.co/index.php/estadisticas-por-tema/demografia-y-poblacion/censo-nacional-de-poblacion-y-vivenda-2018")
    logger.info("   3. Buscar en datasets de gobernación de Nariño")
    logger.info("=" * 80)
