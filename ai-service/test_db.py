import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

try:
    print("Connecting...")
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5435'),
        database=os.getenv('DB_NAME', 'ecoguard'),
        user=os.getenv('DB_USER', 'postgres'),
        password=os.getenv('DB_PASSWORD', 'postgres'),
        options='-c client_encoding=LATIN1'
    )
    print(f"Encoding: {conn.encoding}")
    
    cur = conn.cursor()
    cur.execute("SELECT tipo_fenomeno_normalizado FROM public.fenomenos_naturales LIMIT 1")
    row = cur.fetchone()
    print(f"Row: {row}")
    
    conn.close()
    print("Success")
except Exception as e:
    print(f"Error: {e}")
