import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmenazasService } from './amenazas.service';
import { AmenazasController } from './amenazas.controller';
import { ZonaAmenaza } from './entities/zona-amenaza.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ZonaAmenaza])],
  controllers: [AmenazasController],
  providers: [AmenazasService],
  exports: [AmenazasService],
})
export class AmenazasModule {}
