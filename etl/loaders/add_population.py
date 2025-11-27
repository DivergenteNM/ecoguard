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
        # Conectar a la base de datos
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            port=os.getenv('DB_PORT', '5435'),
            database=os.getenv('DB_NAME', 'ecoguard'),
            user=os.getenv('DB_USER', 'postgres'),
            password=os.getenv('DB_PASSWORD', 'postgres')
        )
        cur = conn.cursor()
        
        # Leer y ejecutar el script SQL
        sql_path = os.path.join(os.path.dirname(__file__), '..', '..', 'database', 'scripts', '02_add_population.sql')
        with open(sql_path, 'r', encoding='utf-8') as f:
            sql = f.read()
        
        cur.execute(sql)
        conn.commit()
        
        print("✅ Población agregada exitosamente")
        
        # Mostrar resultados
        cur.execute("SELECT nombre, poblacion_total FROM geo.municipios WHERE poblacion_total IS NOT NULL ORDER BY poblacion_total DESC")
        print("\n📊 Municipios con población:")
        for row in cur.fetchall():
            print(f"  {row[0]}: {row[1]:,}")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    add_population()
