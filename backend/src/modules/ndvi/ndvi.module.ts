import { Module } from '@nestjs/common';
import { NdviController } from './ndvi.controller';
import { NdviService } from './ndvi.service';

@Module({
  controllers: [NdviController],
  providers: [NdviService]
})
export class NdviModule {}
