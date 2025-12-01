"""
Script para agregar datos de población a los municipios principales
"""
import psycopg2
import os
from dotenv import load_dotenv

# Cargar configuración
env_path = os.path.join(os.path.dirname(__file__), '..', 'db_config.env')
load_dotenv(env_path)

def add_population():
    """Ejecuta el script SQL para agregar población."""
    try:
        # Ruta al archivo CSV procesado (asumiendo año actual o configurado)
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        csv_path = os.path.join(base_dir, "datasets", "processed", "poblacion_narino_2024.csv")
        
        if not os.path.exists(csv_path):
            print(f"❌ No se encontró el archivo de datos: {csv_path}")
            print("💡 Ejecuta primero: python etl/extractors/poblacion_extractor.py")
            return

        print(f"📊 Leyendo datos de: {csv_path}")
        import pandas as pd
        df = pd.read_csv(csv_path)
        
        # Conectar a la base de datos
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            port=os.getenv('DB_PORT', '5435'),
            database=os.getenv('DB_NAME', 'ecoguard'),
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', 'postgres')
        )
        cur = conn.cursor()
        
        updated_count = 0
        not_found_count = 0
        
        print("🚀 Iniciando actualización de población...")
        
        for _, row in df.iterrows():
            codigo = str(row['codigo_dane']).zfill(5) if pd.notna(row['codigo_dane']) else None
            municipio_nombre = str(row['municipio']).upper().strip() if pd.notna(row['municipio']) else None
            poblacion = int(row['poblacion_total'])
            anio = int(row['año'])
            
            updated = False
            
            # 1. Intentar actualizar por código DANE si existe
            if codigo:
                cur.execute("""
                    UPDATE geo.municipios 
                    SET poblacion_total = %s, 
                        anio_poblacion = %s,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE codigo_dane = %s
                """, (poblacion, anio, codigo))
                
                if cur.rowcount > 0:
                    updated = True
            
            # 2. Si no se actualizó (o no había código), intentar por nombre
            if not updated and municipio_nombre:
                # Normalizar nombre para búsqueda (ignorar tildes si es necesario, pero Postgres es case sensitive)
                # Asumimos que los nombres están en mayúsculas en BD
                cur.execute("""
                    UPDATE geo.municipios 
                    SET poblacion_total = %s, 
                        anio_poblacion = %s,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE UPPER(nombre) = %s AND poblacion_total IS DISTINCT FROM %s
                """, (poblacion, anio, municipio_nombre, poblacion))
                
                if cur.rowcount > 0:
                    updated = True
            
            if updated:
                updated_count += 1
            else:
                # print(f"⚠️  No encontrado: {municipio_nombre} (Cod: {codigo})")
                not_found_count += 1
        
        conn.commit()
        
        print(f"\n✅ Proceso finalizado:")
        print(f"   - Municipios actualizados: {updated_count}")
        print(f"   - No encontrados en BD: {not_found_count}")
        
        # Mostrar resultados top 5
        cur.execute("""
            SELECT nombre, poblacion_total, anio_poblacion 
            FROM geo.municipios 
            WHERE poblacion_total IS NOT NULL 
            ORDER BY poblacion_total DESC 
            LIMIT 5
        """)
        print("\n🏆 Top 5 Municipios por población:")
        for row in cur.fetchall():
            print(f"  {row[0]}: {row[1]:,} (Año {row[2]})")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    add_population()
