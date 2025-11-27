import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MunicipiosController } from './modules/municipios/municipios.controller';
import { FenomenosModule } from './modules/fenomenos/fenomenos.module';
import { EstacionesModule } from './modules/estaciones/estaciones.module';
import { NdviModule } from './modules/ndvi/ndvi.module';

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
  ],
  controllers: [AppController, MunicipiosController],
  providers: [AppService],
})
export class AppModule {}
