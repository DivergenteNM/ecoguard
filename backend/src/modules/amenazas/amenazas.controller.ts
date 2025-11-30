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
import { AmenazasService } from './amenazas.service';

@ApiTags('amenazas')
@Controller('amenazas')
export class AmenazasController {
  constructor(private readonly amenazasService: AmenazasService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las zonas de amenaza con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página', example: 50 })
  @ApiResponse({ status: 200, description: 'Lista de zonas de amenaza con geometría' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.amenazasService.findAll(page, limit);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas por categoría' })
  @ApiResponse({ status: 200, description: 'Estadísticas de amenazas agrupadas por categoría' })
  getStats() {
    return this.amenazasService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una zona de amenaza por ID' })
  @ApiResponse({ status: 200, description: 'Detalle de la zona de amenaza' })
  @ApiResponse({ status: 404, description: 'Zona de amenaza no encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const amenaza = await this.amenazasService.findOne(id);
    if (!amenaza) {
      throw new NotFoundException(`Zona de amenaza con ID ${id} no encontrada`);
    }
    return amenaza;
  }
}
