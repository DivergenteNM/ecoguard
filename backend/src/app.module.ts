import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MunicipiosModule } from './modules/municipios/municipios.module';
import { FenomenosModule } from './modules/fenomenos/fenomenos.module';
import { EstacionesModule } from './modules/estaciones/estaciones.module';
import { NdviModule } from './modules/ndvi/ndvi.module';
import { AmenazasModule } from './modules/amenazas/amenazas.module';
import { StatsModule } from './modules/stats/stats.module';
import { MapModule } from './modules/map/map.module';
import { PredictionsModule } from './modules/predictions/predictions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false, // Don't auto-sync schema in production/MVP with existing DB
      }),
      inject: [ConfigService],
    }),
    FenomenosModule,
    EstacionesModule,
    NdviModule,
    MunicipiosModule,
    AmenazasModule,
    StatsModule,
    MapModule,
    PredictionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
