import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstacionesController } from './estaciones.controller';
import { EstacionesService } from './estaciones.service';
import { Estacion } from './entities/estacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Estacion])],
  controllers: [EstacionesController],
  providers: [EstacionesService],
})
export class EstacionesModule {}
