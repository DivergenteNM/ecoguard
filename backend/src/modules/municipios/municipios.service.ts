import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Municipio } from './entities/municipio.entity';

@Injectable()
export class MunicipiosService {
  constructor(
    @InjectRepository(Municipio)
    private municipiosRepository: Repository<Municipio>,
  ) {}

  findAll() {
    return this.municipiosRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  findOne(id: number) {
    return this.municipiosRepository.findOneBy({ id });
  }

  async findByCode(codigoDane: string) {
    return this.municipiosRepository.findOneBy({ codigoDane });
  }

  async getStats() {
    const count = await this.municipiosRepository.count();
    const population = await this.municipiosRepository
      .createQueryBuilder('municipio')
      .select('SUM(municipio.poblacionTotal)', 'total')
      .getRawOne();
      
    return {
      totalMunicipios: count,
      poblacionRegistrada: parseInt(population.total) || 0,
    };
  }
}
