"""
Script de prueba para validar acceso a la API de datos.gov.co
Dataset: Fenómenos Naturales Amenazantes en Nariño
Dataset ID: i8ar-8tth
"""

import requests
import json
from datetime import datetime

# Configuración
BASE_URL = "https://www.datos.gov.co/resource/i8ar-8tth.json"
APP_TOKEN = None  # Opcional: agregar tu token aquí

def test_basic_connection():
    """Prueba conexión básica a la API"""
    print("=" * 60)
    print("TEST 1: Conexión Básica")
    print("=" * 60)
    
    try:
        response = requests.get(BASE_URL, params={'$limit': 5})
        
        if response.status_code == 200:
            print("✅ Conexión exitosa!")
            print(f"Status Code: {response.status_code}")
            
            data = response.json()
            print(f"Registros obtenidos: {len(data)}")
            
            if data:
                print("\n📋 Primer registro:")
                print(json.dumps(data[0], indent=2, ensure_ascii=False))
            
            return True
        else:
            print(f"❌ Error: Status Code {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

def test_filter_by_municipio():
    """Prueba filtrado por municipio"""
    print("\n" + "=" * 60)
    print("TEST 2: Filtrar por Municipio (PASTO)")
    print("=" * 60)
    
    try:
        params = {
            '$where': "municipio='PASTO'",
            '$limit': 10
        }
        
        response = requests.get(BASE_URL, params=params)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Fenómenos en PASTO: {len(data)}")
            
            if data:
                print("\n📊 Tipos de fenómenos encontrados:")
                tipos = {}
                for item in data:
                    tipo = item.get('tipo_fenomeno', 'DESCONOCIDO')
                    tipos[tipo] = tipos.get(tipo, 0) + 1
                
                for tipo, count in tipos.items():
                    print(f"  - {tipo}: {count}")
            
            return True
        else:
            print(f"❌ Error: Status Code {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_count_all():
    """Cuenta total de registros"""
    print("\n" + "=" * 60)
    print("TEST 3: Contar Total de Registros")
    print("=" * 60)
    
    try:
        params = {
            '$select': 'count(*)',
        }
        
        response = requests.get(BASE_URL, params=params)
        
        if response.status_code == 200:
            data = response.json()
            total = data[0]['count'] if data else 0
            print(f"✅ Total de fenómenos registrados: {total}")
            return True
        else:
            print(f"❌ Error: Status Code {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_group_by_municipio():
    """Agrupa fenómenos por municipio"""
    print("\n" + "=" * 60)
    print("TEST 4: Agrupar por Municipio")
    print("=" * 60)
    
    try:
        params = {
            '$select': 'municipio, count(*) as total',
            '$group': 'municipio',
            '$order': 'total DESC',
            '$limit': 10
        }
        
        response = requests.get(BASE_URL, params=params)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Top 10 municipios con más fenómenos:")
            print()
            
            for i, item in enumerate(data, 1):
                municipio = item.get('municipio', 'DESCONOCIDO')
                total = item.get('total', 0)
                print(f"  {i}. {municipio}: {total} eventos")
            
            return True
        else:
            print(f"❌ Error: Status Code {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_recent_events():
    """Obtiene eventos recientes"""
    print("\n" + "=" * 60)
    print("TEST 5: Eventos Recientes (últimos 2 años)")
    print("=" * 60)
    
    try:
        params = {
            '$where': "fecha > '2022-01-01'",
            '$order': 'fecha DESC',
            '$limit': 10
        }
        
        response = requests.get(BASE_URL, params=params)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Eventos recientes encontrados: {len(data)}")
            
            if data:
                print("\n📅 Últimos eventos:")
                for item in data[:5]:
                    fecha = item.get('fecha', 'N/A')
                    municipio = item.get('municipio', 'N/A')
                    tipo = item.get('tipo_fenomeno', 'N/A')
                    print(f"  - {fecha}: {tipo} en {municipio}")
            
            return True
        else:
            print(f"❌ Error: Status Code {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_available_fields():
    """Analiza campos disponibles"""
    print("\n" + "=" * 60)
    print("TEST 6: Campos Disponibles")
    print("=" * 60)
    
    try:
        response = requests.get(BASE_URL, params={'$limit': 1})
        
        if response.status_code == 200:
            data = response.json()
            
            if data:
                print("✅ Campos disponibles en el dataset:")
                print()
                
                for key, value in data[0].items():
                    tipo_valor = type(value).__name__
                    print(f"  - {key}: {tipo_valor}")
                    if value:
                        print(f"    Ejemplo: {value}")
            
            return True
        else:
            print(f"❌ Error: Status Code {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Ejecuta todos los tests"""
    print("\n")
    print("🌍 ECOGUARD - Validación de API datos.gov.co")
    print("Dataset: Fenómenos Naturales Amenazantes - Nariño")
    print("=" * 60)
    print()
    
    tests = [
        test_basic_connection,
        test_filter_by_municipio,
        test_count_all,
        test_group_by_municipio,
        test_recent_events,
        test_available_fields
    ]
    
    results = []
    for test in tests:
        result = test()
        results.append(result)
    
    # Resumen
    print("\n" + "=" * 60)
    print("📊 RESUMEN DE PRUEBAS")
    print("=" * 60)
    
    passed = sum(results)
    total = len(results)
    
    print(f"\nTests ejecutados: {total}")
    print(f"Tests exitosos: {passed}")
    print(f"Tests fallidos: {total - passed}")
    
    if passed == total:
        print("\n✅ ¡Todas las pruebas pasaron exitosamente!")
        print("\n🎯 SIGUIENTE PASO:")
        print("  1. Crea una cuenta en datos.gov.co")
        print("  2. Genera un App Token")
        print("  3. Agrega el token a la variable APP_TOKEN en este script")
        print("  4. Ejecuta nuevamente para validar con autenticación")
    else:
        print("\n⚠️ Algunas pruebas fallaron. Revisa los errores arriba.")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
