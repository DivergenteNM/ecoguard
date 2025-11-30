import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ZonaAmenaza } from './entities/zona-amenaza.entity';

@Injectable()
export class AmenazasService {
  constructor(
    @InjectRepository(ZonaAmenaza)
    private amenazasRepository: Repository<ZonaAmenaza>,
  ) {}

  async findAll(page: number = 1, limit: number = 50) {
    const [data, total] = await this.amenazasRepository.findAndCount({
      select: ['id', 'categoria', 'municipio', 'areaKm2', 'tipoFenomeno', 'descripcion'],
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
    return this.amenazasRepository.findOne({ where: { id } });
  }

  async getStats() {
    const stats = await this.amenazasRepository
      .createQueryBuilder('zona')
      .select('zona.categoria', 'categoria')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(zona.areaKm2)', 'totalArea')
      .groupBy('zona.categoria')
      .getRawMany();

    return {
      porCategoria: stats.map((s) => ({
        categoria: s.categoria,
        count: parseInt(s.count),
        totalArea: parseFloat(s.totalArea || 0).toFixed(2),
      })),
    };
  }
}
