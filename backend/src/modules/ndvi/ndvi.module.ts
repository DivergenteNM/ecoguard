import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NdviController } from './ndvi.controller';
import { NdviService } from './ndvi.service';
import { NdviData } from './entities/ndvi-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NdviData])],
  controllers: [NdviController],
  providers: [NdviService],
})
export class NdviModule {}
