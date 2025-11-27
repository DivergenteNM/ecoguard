"""
Script de prueba para validar acceso a la API de datos.gov.co
Dataset: Estaciones de IDEAM y Terceros
Dataset ID: 57sv-p2fu
"""

import requests
import json

# Configuración
BASE_URL = "https://www.datos.gov.co/resource/57sv-p2fu.json"
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
                print("\n📋 Primera estación:")
                print(json.dumps(data[0], indent=2, ensure_ascii=False))
            
            return True
        else:
            print(f"❌ Error: Status Code {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

def test_filter_narino():
    """Prueba filtrado por departamento Nariño"""
    print("\n" + "=" * 60)
    print("TEST 2: Estaciones en Nariño")
    print("=" * 60)
    
    try:
        params = {
            '$where': "departamento='NARIÑO'",
            '$limit': 100
        }
        
        response = requests.get(BASE_URL, params=params)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Estaciones en Nariño: {len(data)}")
            
            if data:
                print("\n📊 Tipos de estaciones:")
                tipos = {}
                for item in data:
                    tipo = item.get('tipo', 'DESCONOCIDO')
                    tipos[tipo] = tipos.get(tipo, 0) + 1
                
                for tipo, count in tipos.items():
                    print(f"  - {tipo}: {count}")
                
                print("\n📍 Primeras 5 estaciones:")
                for i, item in enumerate(data[:5], 1):
                    nombre = item.get('nombre', 'N/A')
                    municipio = item.get('municipio', 'N/A')
                    tipo = item.get('tipo', 'N/A')
                    estado = item.get('estado', 'N/A')
                    print(f"  {i}. {nombre} ({municipio}) - {tipo} - {estado}")
            
            return True
        else:
            print(f"❌ Error: Status Code {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_active_stations():
    """Prueba filtrado de estaciones activas"""
    print("\n" + "=" * 60)
    print("TEST 3: Estaciones Activas en Nariño")
    print("=" * 60)
    
    try:
        params = {
            '$where': "departamento='NARIÑO' AND estado='ACTIVA'",
            '$limit': 100
        }
        
        response = requests.get(BASE_URL, params=params)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Estaciones activas: {len(data)}")
            
            if data:
                print("\n📍 Estaciones activas por municipio:")
                municipios = {}
                for item in data:
                    municipio = item.get('municipio', 'DESCONOCIDO')
                    municipios[municipio] = municipios.get(municipio, 0) + 1
                
                for municipio, count in sorted(municipios.items()):
                    print(f"  - {municipio}: {count}")
            
            return True
        else:
            print(f"❌ Error: Status Code {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_coordinates():
    """Valida coordenadas geográficas"""
    print("\n" + "=" * 60)
    print("TEST 4: Validar Coordenadas")
    print("=" * 60)
    
    try:
        params = {
            '$where': "departamento='NARIÑO'",
            '$limit': 100
        }
        
        response = requests.get(BASE_URL, params=params)
        
        if response.status_code == 200:
            data = response.json()
            
            with_coords = 0
            without_coords = 0
            
            for item in data:
                lat = item.get('latitud')
                lon = item.get('longitud')
                
                if lat and lon:
                    with_coords += 1
                else:
                    without_coords += 1
            
            print(f"✅ Estaciones con coordenadas: {with_coords}")
            print(f"⚠️  Estaciones sin coordenadas: {without_coords}")
            
            if with_coords > 0:
                print("\n📍 Ejemplo de coordenadas:")
                for item in data[:3]:
                    if item.get('latitud') and item.get('longitud'):
                        nombre = item.get('nombre', 'N/A')
                        lat = item.get('latitud')
                        lon = item.get('longitud')
                        print(f"  - {nombre}: ({lat}, {lon})")
            
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
    print("TEST 5: Campos Disponibles")
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
                        valor_str = str(value)[:50]
                        print(f"    Ejemplo: {valor_str}")
            
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
    print("Dataset: Estaciones de IDEAM y Terceros")
    print("=" * 60)
    print()
    
    tests = [
        test_basic_connection,
        test_filter_narino,
        test_active_stations,
        test_coordinates,
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
    else:
        print("\n⚠️ Algunas pruebas fallaron. Revisa los errores arriba.")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
