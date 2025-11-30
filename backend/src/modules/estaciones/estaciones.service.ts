import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Estacion } from './entities/estacion.entity';

@Injectable()
export class EstacionesService {
  constructor(
    @InjectRepository(Estacion)
    private estacionesRepository: Repository<Estacion>,
  ) {}

  async findAll(page: number = 1, limit: number = 50) {
    const [data, total] = await this.estacionesRepository.findAndCount({
      order: { nombreEstacion: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number) {
    return this.estacionesRepository.findOneBy({ id });
  }

  async findByType(tipo: string) {
    const [data, total] = await this.estacionesRepository.findAndCount({
      where: { tipoEstacion: tipo },
      order: { nombreEstacion: 'ASC' },
    });

    return {
      data,
      meta: {
        total,
      },
    };
  }

  async getStats() {
    const total = await this.estacionesRepository.count();

    const byType = await this.estacionesRepository
      .createQueryBuilder('estacion')
      .select('estacion.tipoEstacion', 'tipo')
      .addSelect('COUNT(*)', 'cantidad')
      .where('estacion.tipoEstacion IS NOT NULL')
      .groupBy('estacion.tipoEstacion')
      .getRawMany();

    const byMunicipio = await this.estacionesRepository
      .createQueryBuilder('estacion')
      .select('estacion.municipio', 'municipio')
      .addSelect('COUNT(*)', 'cantidad')
      .where('estacion.municipio IS NOT NULL')
      .groupBy('estacion.municipio')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    return {
      totalEstaciones: total,
      porTipo: byType.map((item) => ({
        tipo: item.tipo,
        cantidad: parseInt(item.cantidad),
      })),
      porMunicipio: byMunicipio.map((item) => ({
        municipio: item.municipio,
        cantidad: parseInt(item.cantidad),
      })),
    };
  }
}
