import { apiClient } from './client';
import { ModelInfo, RiskInput, RiskResult } from '../types/predictions.types';

export const predictionsApi = {
  getModelInfo: () =>
    apiClient.get<ModelInfo>('/api/predictions/model-info'),

  calculateRisk: (data: RiskInput) =>
    apiClient.post<RiskResult>('/api/predictions/risk', data),
};
