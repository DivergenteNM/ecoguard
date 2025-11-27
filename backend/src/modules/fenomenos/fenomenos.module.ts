import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FenomenosController } from './fenomenos.controller';
import { FenomenosService } from './fenomenos.service';
import { Fenomeno } from './entities/fenomeno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fenomeno])],
  controllers: [FenomenosController],
  providers: [FenomenosService],
})
export class FenomenosModule {}
