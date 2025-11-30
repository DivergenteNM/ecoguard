import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { PredictionsService } from './predictions.service';

class PredictRiskDto {
  @IsNumber()
  latitud: number;

  @IsNumber()
  longitud: number;

  @IsNumber()
  mes: number;

  @IsOptional()
  @IsNumber()
  dia_semana?: number;

  @IsOptional()
  @IsNumber()
  precipitacion?: number;
}

@ApiTags('predictions')
@Controller('api/predictions')
export class PredictionsController {
  constructor(private readonly predictionsService: PredictionsService) {}

  @Post('risk')
  @ApiOperation({ summary: 'Predecir riesgo de fenómeno natural' })
  @ApiBody({ type: PredictRiskDto })
  predictRisk(@Body() data: PredictRiskDto) {
    return this.predictionsService.predictRisk(data);
  }

  @Get('model-info')
  @ApiOperation({ summary: 'Obtener información del modelo de IA' })
  getModelInfo() {
    return this.predictionsService.getModelInfo();
  }
}
