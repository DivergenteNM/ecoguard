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

  findAll() {
    return this.estacionesRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  findOne(id: number) {
    return this.estacionesRepository.findOneBy({ id });
  }

  findByType(tipo: string) {
    return this.estacionesRepository.find({
      where: { tipo },
      order: { nombre: 'ASC' },
    });
  }

  async getStats() {
    const total = await this.estacionesRepository.count();
    
    const byType = await this.estacionesRepository
      .createQueryBuilder('estacion')
      .select('estacion.tipo', 'tipo')
      .addSelect('COUNT(*)', 'cantidad')
      .groupBy('estacion.tipo')
      .getRawMany();

    return {
      totalEstaciones: total,
      porTipo: byType,
    };
  }
}
