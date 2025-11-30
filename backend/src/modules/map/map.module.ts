import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { Fenomeno } from '../fenomenos/entities/fenomeno.entity';
import { ZonaAmenaza } from '../amenazas/entities/zona-amenaza.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fenomeno, ZonaAmenaza]),
  ],
  controllers: [MapController],
  providers: [MapService],
  exports: [MapService],
})
export class MapModule {}
