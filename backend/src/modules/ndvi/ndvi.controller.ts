import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NdviService } from './ndvi.service';

@ApiTags('ndvi')
@Controller('ndvi')
export class NdviController {
  constructor(private readonly ndviService: NdviService) {}

  @Get('latest')
  @ApiOperation({ summary: 'Obtener últimos datos NDVI procesados' })
  @ApiResponse({ status: 200, description: 'Datos NDVI más recientes' })
  @ApiResponse({ status: 404, description: 'No hay datos NDVI disponibles' })
  getLatest() {
    return this.ndviService.getLatest();
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los registros NDVI' })
  @ApiResponse({ status: 200, description: 'Lista de registros NDVI' })
  getAll() {
    return this.ndviService.getAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Estadísticas de datos NDVI' })
  @ApiResponse({ status: 200, description: 'Estadísticas calculadas' })
  getStats() {
    return this.ndviService.getStats();
  }
}
