import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FenomenosService } from './fenomenos.service';

@ApiTags('fenomenos')
@Controller('fenomenos')
export class FenomenosController {
  constructor(private readonly fenomenosService: FenomenosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar últimos fenómenos naturales' })
  findAll() {
    return this.fenomenosService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de fenómenos' })
  getStats() {
    return this.fenomenosService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un fenómeno por ID' })
  @ApiResponse({ status: 404, description: 'Fenómeno no encontrado' })
  async findOne(@Param('id') id: string) {
    const fenomeno = await this.fenomenosService.findOne(+id);
    if (!fenomeno) {
      throw new NotFoundException(`Fenómeno con ID ${id} no encontrado`);
    }
    return fenomeno;
  }
}
