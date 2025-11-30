import joblib

m = joblib.load('ai-service/models/metadata.pkl')
print('='*50)
print('RESULTADOS DEL MODELO OPTIMIZADO')
print('='*50)
print(f'Test Accuracy: {m["test_score"]:.2%}')
print(f'CV Accuracy: {m["cv_score_mean"]:.2%} (+/- {m["cv_score_std"]:.2%})')
print(f'Features: {len(m["feature_columns"])}')
print(f'Clases: {m["n_classes"]} - {m["classes"]}')
print(f'Samples: {m["n_samples"]}')
print('='*50)
