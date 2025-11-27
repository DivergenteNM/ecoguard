import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MunicipiosService } from './municipios.service';

@ApiTags('municipios')
@Controller('municipios')
export class MunicipiosController {
  constructor(private readonly municipiosService: MunicipiosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los municipios' })
  findAll() {
    return this.municipiosService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de municipios' })
  getStats() {
    return this.municipiosService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un municipio por ID' })
  @ApiResponse({ status: 404, description: 'Municipio no encontrado' })
  async findOne(@Param('id') id: string) {
    const municipio = await this.municipiosService.findOne(+id);
    if (!municipio) {
      throw new NotFoundException(`Municipio con ID ${id} no encontrado`);
    }
    return municipio;
  }
}
