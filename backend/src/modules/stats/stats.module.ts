import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Fenomeno } from '../fenomenos/entities/fenomeno.entity';
import { Municipio } from '../municipios/entities/municipio.entity';
import { ZonaAmenaza } from '../amenazas/entities/zona-amenaza.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fenomeno, Municipio, ZonaAmenaza]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
