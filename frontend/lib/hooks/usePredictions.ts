import { useApi } from './useApi';
import { predictionsApi } from '../api/predictions';
import { RiskInput } from '../types/predictions.types';

export function useModelInfo() {
  return useApi(
    'model-info',
    () => predictionsApi.getModelInfo(),
    {
      staleTime: 60 * 60 * 1000, // 1 hora
    }
  );
}

export function usePredictRisk(data: RiskInput | null) {
  return useApi(
    ['predict-risk', data],
    () => data ? predictionsApi.calculateRisk(data) : Promise.resolve(null),
    {
      enabled: !!data,
      staleTime: 0, // No cachear predicciones
    }
  );
}
