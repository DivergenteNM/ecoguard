import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NdviService } from './ndvi.service';

@ApiTags('ndvi')
@Controller('ndvi')
export class NdviController {
  constructor(private readonly ndviService: NdviService) {}

  @Get('latest')
  @ApiOperation({ summary: 'Obtener últimos datos NDVI procesados' })
  getLatest() {
    return this.ndviService.getLatest();
  }
}
