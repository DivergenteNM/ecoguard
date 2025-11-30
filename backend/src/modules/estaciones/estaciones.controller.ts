import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { EstacionesService } from './estaciones.service';

@ApiTags('estaciones')
@Controller('estaciones')
export class EstacionesController {
  constructor(private readonly estacionesService: EstacionesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las estaciones con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página', example: 50 })
  @ApiQuery({ name: 'tipo', required: false, type: String, description: 'Filtrar por tipo de estación' })
  @ApiResponse({ status: 200, description: 'Lista de estaciones' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('tipo') tipo?: string,
  ) {
    if (tipo) {
      return this.estacionesService.findByType(tipo);
    }
    return this.estacionesService.findAll(page, limit);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de estaciones' })
  @ApiResponse({ status: 200, description: 'Estadísticas calculadas' })
  getStats() {
    return this.estacionesService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una estación por ID' })
  @ApiResponse({ status: 200, description: 'Estación encontrada' })
  @ApiResponse({ status: 404, description: 'Estación no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const estacion = await this.estacionesService.findOne(id);
    if (!estacion) {
      throw new NotFoundException(`Estación con ID ${id} no encontrada`);
    }
    return estacion;
  }
}
