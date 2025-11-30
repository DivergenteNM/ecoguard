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
import { FenomenosService } from './fenomenos.service';

@ApiTags('fenomenos')
@Controller('fenomenos')
export class FenomenosController {
  constructor(private readonly fenomenosService: FenomenosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar fenómenos naturales con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página', example: 100 })
  @ApiQuery({ name: 'tipo', required: false, type: String, description: 'Filtrar por tipo de fenómeno' })
  @ApiQuery({ name: 'municipio', required: false, type: String, description: 'Filtrar por municipio' })
  @ApiQuery({ name: 'fechaInicio', required: false, type: String, description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', required: false, type: String, description: 'Fecha de fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Lista de fenómenos' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('tipo') tipo?: string,
    @Query('municipio') municipio?: string,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    return this.fenomenosService.findAll(page, limit, {
      tipo,
      municipio,
      fechaInicio,
      fechaFin,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de fenómenos' })
  @ApiResponse({ status: 200, description: 'Estadísticas calculadas' })
  getStats() {
    return this.fenomenosService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un fenómeno por ID' })
  @ApiResponse({ status: 200, description: 'Fenómeno encontrado' })
  @ApiResponse({ status: 404, description: 'Fenómeno no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const fenomeno = await this.fenomenosService.findOne(id);
    if (!fenomeno) {
      throw new NotFoundException(`Fenómeno con ID ${id} no encontrado`);
    }
    return fenomeno;
  }
}
