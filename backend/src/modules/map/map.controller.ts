import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { MapService } from './map.service';

@ApiTags('map')
@Controller('api/map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get('fenomenos')
  @ApiOperation({ summary: 'Obtener fenómenos en formato GeoJSON para el mapa' })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'fechaInicio', required: false })
  @ApiQuery({ name: 'fechaFin', required: false })
  @ApiQuery({ name: 'municipio', required: false })
  getFenomenosGeoJSON(
    @Query('tipo') tipo?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('municipio') municipio?: string,
  ) {
    return this.mapService.getFenomenosGeoJSON({
      tipo,
      fechaInicio,
      fechaFin,
      municipio,
    });
  }

  @Get('amenazas')
  @ApiOperation({ summary: 'Obtener zonas de amenaza en formato GeoJSON' })
  getAmenazasGeoJSON() {
    return this.mapService.getAmenazasGeoJSON();
  }

  @Get('heatmap')
  @ApiOperation({ summary: 'Obtener datos para mapa de calor' })
  getHeatmapData() {
    return this.mapService.getHeatmapData();
  }
}
