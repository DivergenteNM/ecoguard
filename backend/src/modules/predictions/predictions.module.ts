import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PredictionsController } from './predictions.controller';
import { PredictionsService } from './predictions.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  ],
  controllers: [PredictionsController],
  providers: [PredictionsService],
  exports: [PredictionsService],
})
export class PredictionsModule {}
