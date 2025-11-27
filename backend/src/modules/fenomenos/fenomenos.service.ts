import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fenomeno } from './entities/fenomeno.entity';

@Injectable()
export class FenomenosService {
  constructor(
    @InjectRepository(Fenomeno)
    private fenomenosRepository: Repository<Fenomeno>,
  ) {}

  findAll() {
    return this.fenomenosRepository.find({
      order: { fecha: 'DESC' },
      take: 100, // Limit to 100 for performance
    });
  }

  findOne(id: number) {
    return this.fenomenosRepository.findOneBy({ id });
  }

  async getStats() {
    const total = await this.fenomenosRepository.count();
    
    const byType = await this.fenomenosRepository
      .createQueryBuilder('fenomeno')
      .select('fenomeno.tipoFenomeno', 'tipo')
      .addSelect('COUNT(*)', 'cantidad')
      .groupBy('fenomeno.tipoFenomeno')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    const byMunicipio = await this.fenomenosRepository
      .createQueryBuilder('fenomeno')
      .select('fenomeno.municipio', 'municipio')
      .addSelect('COUNT(*)', 'cantidad')
      .groupBy('fenomeno.municipio')
      .orderBy('cantidad', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      totalEventos: total,
      porTipo: byType,
      topMunicipios: byMunicipio,
    };
  }
}
