from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
from typing import Optional

app = FastAPI(title="EcoGuard AI Service", version="3.0 - Optimized")

class PredictionRequest(BaseModel):
    latitud: float
    longitud: float
    mes: int
    dia_semana: Optional[int] = None
    precipitacion: float = 0.0

# Cargar modelo y artefactos
try:
    model = joblib.load('models/model_riesgo.pkl')
    label_encoder = joblib.load('models/label_encoder.pkl')
    zona_encoder = joblib.load('models/zona_encoder.pkl')
    metadata = joblib.load('models/metadata.pkl')
    print("✅ Modelo OPTIMIZADO cargado exitosamente")
    print(f"   - Features: {len(metadata['feature_columns'])}")
    print(f"   - Clases: {metadata['n_classes']} - {metadata['classes']}")
    print(f"   - Accuracy test: {metadata['test_score']:.2%}")
    print(f"   - Accuracy CV: {metadata['cv_score_mean']:.2%}")
except Exception as e:
    print(f"⚠️ Error cargando modelo: {e}")
    model = None
    label_encoder = None
    zona_encoder = None
    metadata = None

def calcular_features(latitud: float, longitud: float, mes: int):
    """
    Calcula las 8 features optimizadas del modelo.
    """
    # Centro de Nariño
    LAT_CENTRO = 1.2
    LON_CENTRO = -77.3
    
    # Temporales
    trimestre = (mes - 1) // 3 + 1  # 1-4
    
    # Geográficas
    distancia_centro = np.sqrt((latitud - LAT_CENTRO)**2 + (longitud - LON_CENTRO)**2)
    
    # Zona geográfica
    if longitud < -78.0:
        zona = 'COSTA_PACIFICA'
    elif latitud > 1.5:
        zona = 'NORTE'
    elif latitud < 0.8:
        zona = 'SUR'
    else:
        zona = 'CENTRO'
    
    zona_encoded = zona_encoder.transform([zona])[0]
    
    # Interacciones
    lat_mes = latitud * mes
    lon_mes = longitud * mes
    
    return {
        'latitud': latitud,
        'longitud': longitud,
        'mes': mes,
        'trimestre': trimestre,
        'distancia_centro': distancia_centro,
        'zona_encoded': zona_encoded,
        'lat_mes': lat_mes,
        'lon_mes': lon_mes
    }

@app.get("/")
def read_root():
    return {
        "status": "online", 
        "service": "EcoGuard AI",
        "version": "3.0 - Optimized with Class Grouping",
        "model_loaded": model is not None,
        "features": len(metadata['feature_columns']) if metadata else 0,
        "classes": metadata['n_classes'] if metadata else 0,
        "accuracy_test": f"{metadata['test_score']:.2%}" if metadata else "N/A",
        "accuracy_cv": f"{metadata['cv_score_mean']:.2%}" if metadata else "N/A"
    }

@app.get("/info")
def get_info():
    """Información detallada del modelo"""
    if metadata is None:
        raise HTTPException(status_code=503, detail="Modelo no disponible")
    
    return {
        "features": {
            "total": len(metadata['feature_columns']),
            "list": metadata['feature_columns'],
            "importance": metadata['feature_importance']
        },
        "classes": {
            "total": metadata['n_classes'],
            "list": metadata['classes'],
            "grouped": metadata.get('grouped_classes', False)
        },
        "performance": {
            "test_accuracy": metadata['test_score'],
            "cv_accuracy_mean": metadata['cv_score_mean'],
            "cv_accuracy_std": metadata['cv_score_std'],
            "train_accuracy": metadata['train_score']
        },
        "dataset": {
            "n_samples": metadata['n_samples']
        }
    }

@app.post("/predict")
def predict(request: PredictionRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Modelo no disponible")
    
    try:
        # Calcular features
        features_dict = calcular_features(
            request.latitud, 
            request.longitud, 
            request.mes
        )
        
        # Crear DataFrame
        features = pd.DataFrame([features_dict])
        features = features[metadata['feature_columns']]
        
        # Predecir
        prediction_idx = model.predict(features)[0]
        prediction_label = label_encoder.inverse_transform([prediction_idx])[0]
        probs = model.predict_proba(features)[0]
        confidence = float(max(probs))
        
        # Top 3 predicciones
        top_3_idx = np.argsort(probs)[-3:][::-1]
        top_3_predictions = [
            {
                "riesgo": label_encoder.inverse_transform([idx])[0],
                "probabilidad": float(probs[idx])
            }
            for idx in top_3_idx
        ]
        
        return {
            "riesgo": prediction_label,
            "probabilidad": confidence,
            "top_3_predicciones": top_3_predictions,
            "features_utilizadas": len(metadata['feature_columns']),
            "modelo_version": "3.0 - Optimized",
            "detalles": f"Predicción con {len(metadata['feature_columns'])} features (accuracy: {metadata['test_score']:.0%})"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
