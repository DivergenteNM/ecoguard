import { Controller, Get, Param, NotFoundException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { EstacionesService } from './estaciones.service';

@ApiTags('estaciones')
@Controller('estaciones')
export class EstacionesController {
  constructor(private readonly estacionesService: EstacionesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las estaciones' })
  @ApiQuery({ name: 'tipo', required: false, description: 'Filtrar por tipo de estación' })
  findAll(@Query('tipo') tipo?: string) {
    if (tipo) {
      return this.estacionesService.findByType(tipo);
    }
    return this.estacionesService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de estaciones' })
  getStats() {
    return this.estacionesService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una estación por ID' })
  @ApiResponse({ status: 404, description: 'Estación no encontrada' })
  async findOne(@Param('id') id: string) {
    const estacion = await this.estacionesService.findOne(+id);
    if (!estacion) {
      throw new NotFoundException(`Estación con ID ${id} no encontrada`);
    }
    return estacion;
  }
}
