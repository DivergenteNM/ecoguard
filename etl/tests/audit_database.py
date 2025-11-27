"""
Script de auditoría completa de la base de datos EcoGuard
Verifica todos los registros cargados en cada tabla
"""
import psycopg2
import os
from dotenv import load_dotenv
from datetime import datetime

# Cargar configuración
env_path = os.path.join(os.path.dirname(__file__), '..', 'db_config.env')
load_dotenv(env_path)

def connect_db():
    """Conecta a la base de datos."""
    return psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5435'),
        database=os.getenv('DB_NAME', 'ecoguard'),
        user=os.getenv('DB_USER', 'postgres'),
        password=os.getenv('DB_PASSWORD', 'postgres')
    )

def audit_database():
    """Realiza auditoría completa de todas las tablas."""
    conn = connect_db()
    cur = conn.cursor()
    
    print("="*80)
    print("🔍 AUDITORÍA COMPLETA DE BASE DE DATOS - EcoGuard")
    print("="*80)
    print(f"Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    # 1. Fenómenos Naturales
    print("📊 1. FENÓMENOS NATURALES (public.fenomenos_naturales)")
    print("-" * 80)
    
    cur.execute("SELECT COUNT(*) FROM public.fenomenos_naturales")
    total = cur.fetchone()[0]
    print(f"Total registros: {total}")
    
    cur.execute("""
        SELECT tipo_fenomeno_normalizado, COUNT(*) as cantidad
        FROM public.fenomenos_naturales
        GROUP BY tipo_fenomeno_normalizado
        ORDER BY cantidad DESC
    """)
    print("\nPor tipo de fenómeno:")
    for row in cur.fetchall():
        print(f"  - {row[0]}: {row[1]}")
    
    cur.execute("""
        SELECT municipio_normalizado, COUNT(*) as cantidad
        FROM public.fenomenos_naturales
        GROUP BY municipio_normalizado
        ORDER BY cantidad DESC
        LIMIT 10
    """)
    print("\nTop 10 municipios con más eventos:")
    for row in cur.fetchall():
        print(f"  - {row[0]}: {row[1]}")
    
    cur.execute("""
        SELECT 
            MIN(fecha) as fecha_min,
            MAX(fecha) as fecha_max,
            COUNT(DISTINCT EXTRACT(YEAR FROM fecha)) as años_distintos
        FROM public.fenomenos_naturales
        WHERE fecha IS NOT NULL
    """)
    fecha_info = cur.fetchone()
    print(f"\nRango temporal: {fecha_info[0]} a {fecha_info[1]} ({fecha_info[2]} años)")
    
    cur.execute("""
        SELECT COUNT(*) 
        FROM public.fenomenos_naturales 
        WHERE geom IS NOT NULL
    """)
    con_geom = cur.fetchone()[0]
    print(f"Registros con geometría: {con_geom} ({con_geom/total*100:.1f}%)")
    
    # 2. Estaciones IDEAM
    print("\n" + "="*80)
    print("📊 2. ESTACIONES IDEAM (geo.estaciones)")
    print("-" * 80)
    
    cur.execute("SELECT COUNT(*) FROM geo.estaciones")
    total = cur.fetchone()[0]
    print(f"Total estaciones: {total}")
    
    cur.execute("""
        SELECT tipo_estacion, COUNT(*)
        FROM geo.estaciones
        GROUP BY tipo_estacion
    """)
    print("\nPor tipo:")
    for row in cur.fetchall():
        print(f"  - {row[0]}: {row[1]}")
    
    cur.execute("""
        SELECT municipio_normalizado, COUNT(*)
        FROM geo.estaciones
        GROUP BY municipio_normalizado
        ORDER BY COUNT(*) DESC
    """)
    print("\nPor municipio:")
    for row in cur.fetchall():
        print(f"  - {row[0]}: {row[1]}")
    
    cur.execute("""
        SELECT COUNT(*) 
        FROM geo.estaciones 
        WHERE geom IS NOT NULL
    """)
    con_geom = cur.fetchone()[0]
    print(f"Estaciones con geometría: {con_geom} ({con_geom/total*100:.1f}%)")
    
    # 3. Municipios
    print("\n" + "="*80)
    print("📊 3. MUNICIPIOS (geo.municipios)")
    print("-" * 80)
    
    cur.execute("SELECT COUNT(*) FROM geo.municipios")
    total = cur.fetchone()[0]
    print(f"Total municipios: {total}")
    
    cur.execute("""
        SELECT COUNT(*) 
        FROM geo.municipios 
        WHERE poblacion_total IS NOT NULL
    """)
    con_pob = cur.fetchone()[0]
    print(f"Municipios con población: {con_pob}")
    
    if con_pob > 0:
        cur.execute("""
            SELECT 
                SUM(poblacion_total) as total,
                AVG(poblacion_total) as promedio,
                MAX(poblacion_total) as maximo,
                MIN(poblacion_total) as minimo
            FROM geo.municipios
            WHERE poblacion_total IS NOT NULL
        """)
        pob_stats = cur.fetchone()
        print(f"\nEstadísticas de población:")
        print(f"  - Total: {pob_stats[0]:,} habitantes")
        print(f"  - Promedio: {pob_stats[1]:,.0f} habitantes")
        print(f"  - Máximo: {pob_stats[2]:,} habitantes")
        print(f"  - Mínimo: {pob_stats[3]:,} habitantes")
        
        cur.execute("""
            SELECT nombre, poblacion_total
            FROM geo.municipios
            WHERE poblacion_total IS NOT NULL
            ORDER BY poblacion_total DESC
        """)
        print("\nMunicipios con población registrada:")
        for row in cur.fetchall():
            print(f"  - {row[0]}: {row[1]:,}")
    
    cur.execute("""
        SELECT COUNT(*) 
        FROM geo.municipios 
        WHERE geom IS NOT NULL
    """)
    con_geom = cur.fetchone()[0]
    print(f"\nMunicipios con geometría: {con_geom} ({con_geom/total*100:.1f}%)")
    
    # 4. Zonas de Amenaza
    print("\n" + "="*80)
    print("📊 4. ZONAS DE AMENAZA (geo.zonas_amenaza)")
    print("-" * 80)
    
    cur.execute("SELECT COUNT(*) FROM geo.zonas_amenaza")
    total = cur.fetchone()[0]
    print(f"Total zonas: {total}")
    
    if total > 0:
        cur.execute("""
            SELECT categoria, COUNT(*), ROUND(SUM(area_km2)::numeric, 2)
            FROM geo.zonas_amenaza
            GROUP BY categoria
            ORDER BY COUNT(*) DESC
        """)
        print("\nPor categoría:")
        for row in cur.fetchall():
            print(f"  - {row[0]}: {row[1]} zonas, {row[2]:,} km²")
        
        cur.execute("""
            SELECT 
                ROUND(SUM(area_km2)::numeric, 2) as area_total,
                ROUND(AVG(area_km2)::numeric, 2) as area_promedio
            FROM geo.zonas_amenaza
        """)
        area_stats = cur.fetchone()
        print(f"\nÁrea total cubierta: {area_stats[0]:,} km²")
        print(f"Área promedio por zona: {area_stats[1]:,} km²")
    
    # Resumen final
    print("\n" + "="*80)
    print("📈 RESUMEN GENERAL")
    print("="*80)
    
    cur.execute("""
        SELECT 
            (SELECT COUNT(*) FROM public.fenomenos_naturales) as fenomenos,
            (SELECT COUNT(*) FROM geo.estaciones) as estaciones,
            (SELECT COUNT(*) FROM geo.municipios) as municipios,
            (SELECT COUNT(*) FROM geo.zonas_amenaza) as amenazas
    """)
    resumen = cur.fetchone()
    
    print(f"Fenómenos Naturales: {resumen[0]}")
    print(f"Estaciones IDEAM: {resumen[1]}")
    print(f"Municipios: {resumen[2]}")
    print(f"Zonas de Amenaza: {resumen[3]}")
    print(f"\nTOTAL REGISTROS: {sum(resumen)}")
    
    print("\n" + "="*80)
    
    conn.close()

if __name__ == "__main__":
    try:
        audit_database()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
