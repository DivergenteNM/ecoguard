import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PredictionsService {
  private readonly AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001';

  constructor(private readonly httpService: HttpService) {}

  async predictRisk(data: { 
    latitud: number; 
    longitud: number; 
    mes: number;
    dia_semana?: number;
    precipitacion?: number;
  }) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.AI_SERVICE_URL}/predict`, data)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Servicio de IA no disponible',
          error: error.response?.data || error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getModelInfo() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.AI_SERVICE_URL}/info`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: 'Servicio de IA no disponible',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
