import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { StatsService } from './stats.service';

@ApiTags('stats')
@Controller('api/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Obtener estadísticas para el dashboard' })
  getDashboard() {
    return this.statsService.getDashboardStats();
  }

  @Get('timeline')
  @ApiOperation({ summary: 'Obtener línea de tiempo de fenómenos' })
  @ApiQuery({ name: 'granularidad', required: false, enum: ['mes', 'trimestre', 'año'] })
  @ApiQuery({ name: 'tipo', required: false })
  getTimeline(
    @Query('granularidad') granularidad?: 'mes' | 'trimestre' | 'año',
    @Query('tipo') tipo?: string,
  ) {
    return this.statsService.getTimeline(granularidad, tipo);
  }
}
