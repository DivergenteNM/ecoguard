import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
import subprocess
import io
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

def agrupar_fenomenos(tipo):
    """
    Agrupa tipos de fenómenos similares en categorías principales.
    Esto reduce el número de clases y aumenta muestras por clase.
    """
    tipo_upper = str(tipo).upper()
    
    # Deslizamientos y movimientos de tierra
    if any(word in tipo_upper for word in ['DESLIZAMIENTO', 'REMOCION', 'MASA', 'DERRUMBE', 'SOCAVACION']):
        return 'DESLIZAMIENTO'
    
    # Inundaciones y avenidas
    elif any(word in tipo_upper for word in ['INUNDACION', 'AVENIDA', 'TORRENCIAL', 'CRECIENTE']):
        return 'INUNDACION'
    
    # Vendavales y vientos
    elif any(word in tipo_upper for word in ['VENDAVAL', 'VIENTO', 'HURACAN', 'TORNADO']):
        return 'VENDAVAL'
    
    # Incendios
    elif any(word in tipo_upper for word in ['INCENDIO', 'FUEGO']):
        return 'INCENDIO'
    
    # Sequías
    elif any(word in tipo_upper for word in ['SEQUIA', 'DESERTIFICACION']):
        return 'SEQUIA'
    
    # Sismos
    elif any(word in tipo_upper for word in ['SISMO', 'TERREMOTO', 'TEMBLOR']):
        return 'SISMO'
    
    # Otros (categoría catch-all)
    else:
        return 'OTRO'

def get_data_from_docker():
    """Extrae datos con features optimizadas"""
    print("🔄 Extrayendo datos desde PostgreSQL...")
    
    query = """
    COPY (
        WITH centro AS (
            SELECT 1.2 as lat_centro, -77.3 as lon_centro
        )
        SELECT 
            f.latitud, 
            f.longitud, 
            EXTRACT(MONTH FROM f.fecha)::int as mes,
            EXTRACT(QUARTER FROM f.fecha)::int as trimestre,
            SQRT(POW(f.latitud - c.lat_centro, 2) + POW(f.longitud - c.lon_centro, 2)) as distancia_centro,
            CASE
                WHEN f.longitud < -78.0 THEN 'COSTA_PACIFICA'
                WHEN f.latitud > 1.5 THEN 'NORTE'
                WHEN f.latitud < 0.8 THEN 'SUR'
                ELSE 'CENTRO'
            END as zona,
            f.latitud * EXTRACT(MONTH FROM f.fecha) as lat_mes,
            f.longitud * EXTRACT(MONTH FROM f.fecha) as lon_mes,
            f.tipo_fenomeno_normalizado
        FROM public.fenomenos_naturales f
        CROSS JOIN centro c
        WHERE f.latitud IS NOT NULL AND f.longitud IS NOT NULL
    ) TO STDOUT WITH CSV HEADER
    """
    
    cmd = [
        "docker", "exec", "-i", "ecoguard_postgres",
        "psql", "-U", "postgres", "-d", "ecoguard", "-c", query
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8')
    
    if result.returncode != 0:
        raise Exception(f"Error: {result.stderr}")
        
    return pd.read_csv(io.StringIO(result.stdout))

def train():
    print("=" * 70)
    print("MODELO OPTIMIZADO - AGRUPACIÓN DE CLASES + FEATURES MEJORADAS")
    print("=" * 70)
    
    try:
        df = get_data_from_docker()
        print(f"\n✅ Datos extraídos: {len(df)} registros")
        
        if len(df) == 0:
            raise ValueError("❌ Sin datos")

    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        return

    # AGRUPACIÓN DE CLASES
    print(f"\n🔄 Agrupando fenómenos similares...")
    df['fenomeno_agrupado'] = df['tipo_fenomeno_normalizado'].apply(agrupar_fenomenos)
    
    print(f"\n📊 Clases ANTES de agrupar: {df['tipo_fenomeno_normalizado'].nunique()}")
    print(f"📊 Clases DESPUÉS de agrupar: {df['fenomeno_agrupado'].nunique()}")
    print(f"\nDistribución de clases agrupadas:")
    print(df['fenomeno_agrupado'].value_counts().to_string())
    
    # Preprocesamiento
    print(f"\n🔧 Preprocesando...")
    
    le_zona = LabelEncoder()
    df['zona_encoded'] = le_zona.fit_transform(df['zona'])
    
    le_target = LabelEncoder()
    df['target'] = le_target.fit_transform(df['fenomeno_agrupado'])
    
    # Features seleccionadas (las 8 mejores del análisis anterior)
    feature_columns = [
        'latitud', 'longitud', 'mes', 'trimestre',
        'distancia_centro', 'zona_encoded',
        'lat_mes', 'lon_mes'
    ]
    
    X = df[feature_columns]
    y = df['target']
    
    print(f"   ✅ Features: {len(feature_columns)}")
    print(f"   ✅ Clases: {len(le_target.classes_)} - {list(le_target.classes_)}")
    
    # Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Entrenar con hiperparámetros optimizados
    print(f"\n🤖 Entrenando Random Forest optimizado...")
    
    clf = RandomForestClassifier(
        n_estimators=200,
        max_depth=12,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
        class_weight='balanced'  # Importante para clases desbalanceadas
    )
    
    clf.fit(X_train, y_train)
    
    # Evaluar
    train_score = clf.score(X_train, y_train)
    test_score = clf.score(X_test, y_test)
    cv_scores = cross_val_score(clf, X, y, cv=5, scoring='accuracy')
    
    print(f"\n🎯 RESULTADOS:")
    print(f"   - Accuracy ENTRENAMIENTO: {train_score:.2%}")
    print(f"   - Accuracy PRUEBA: {test_score:.2%}")
    print(f"   - Accuracy CV (5-fold): {cv_scores.mean():.2%} (+/- {cv_scores.std():.2%})")
    print(f"   - Diferencia train-test: {(train_score - test_score):.2%}")
    
    if train_score - test_score < 0.15:
        print(f"   ✅ Modelo bien balanceado")
    
    # Importancia
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': clf.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print(f"\n🏆 Importancia de Features:")
    print(feature_importance.to_string(index=False))
    
    # Guardar
    print(f"\n💾 Guardando modelo...")
    if not os.path.exists('ai-service/models'):
        os.makedirs('ai-service/models')
    
    joblib.dump(clf, 'ai-service/models/model_riesgo.pkl')
    joblib.dump(le_target, 'ai-service/models/label_encoder.pkl')
    joblib.dump(le_zona, 'ai-service/models/zona_encoder.pkl')
    
    # Guardar scaler vacío para compatibilidad
    scaler = StandardScaler()
    joblib.dump(scaler, 'ai-service/models/scaler.pkl')
    
    metadata = {
        'feature_columns': feature_columns,
        'feature_importance': feature_importance.to_dict('records'),
        'n_classes': len(le_target.classes_),
        'classes': le_target.classes_.tolist(),
        'train_score': float(train_score),
        'test_score': float(test_score),
        'cv_score_mean': float(cv_scores.mean()),
        'cv_score_std': float(cv_scores.std()),
        'n_samples': len(df),
        'grouped_classes': True
    }
    joblib.dump(metadata, 'ai-service/models/metadata.pkl')
    
    print(f"   ✅ Modelo: {os.path.getsize('ai-service/models/model_riesgo.pkl')} bytes")
    
    print(f"\n" + "=" * 70)
    if test_score >= 0.65:
        print(f"✅ ÉXITO: {test_score:.2%} >= 65% con {len(feature_columns)} features")
    else:
        print(f"📊 Accuracy: {test_score:.2%} con {len(feature_columns)} features y {len(le_target.classes_)} clases")
    print(f"=" * 70)

if __name__ == "__main__":
    train()
