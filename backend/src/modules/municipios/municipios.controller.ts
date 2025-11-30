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
import { MunicipiosService } from './municipios.service';

@ApiTags('municipios')
@Controller('municipios')
export class MunicipiosController {
  constructor(private readonly municipiosService: MunicipiosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los municipios con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Elementos por página', example: 64 })
  @ApiQuery({ name: 'nombre', required: false, type: String, description: 'Buscar por nombre de municipio' })
  @ApiResponse({ status: 200, description: 'Lista de municipios' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(64), ParseIntPipe) limit: number,
    @Query('nombre') nombre?: string,
  ) {
    return this.municipiosService.findAll(page, limit, nombre);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de municipios' })
  @ApiResponse({ status: 200, description: 'Estadísticas calculadas' })
  getStats() {
    return this.municipiosService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un municipio por ID' })
  @ApiResponse({ status: 200, description: 'Municipio encontrado' })
  @ApiResponse({ status: 404, description: 'Municipio no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const municipio = await this.municipiosService.findOne(id);
    if (!municipio) {
      throw new NotFoundException(`Municipio con ID ${id} no encontrado`);
    }
    return municipio;
  }
}
