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

  async findAll(
    page: number = 1,
    limit: number = 100,
    filters?: {
      tipo?: string;
      municipio?: string;
      fechaInicio?: string;
      fechaFin?: string;
    },
  ) {
    const queryBuilder = this.fenomenosRepository.createQueryBuilder('fenomeno');

    // Aplicar filtros
    if (filters?.tipo) {
      queryBuilder.andWhere('fenomeno.tipoFenomenoNormalizado = :tipo', { tipo: filters.tipo });
    }

    if (filters?.municipio) {
      queryBuilder.andWhere('LOWER(fenomeno.municipio) LIKE LOWER(:municipio)', {
        municipio: `%${filters.municipio}%`,
      });
    }

    if (filters?.fechaInicio) {
      queryBuilder.andWhere('fenomeno.fechaReporte >= :fechaInicio', {
        fechaInicio: filters.fechaInicio,
      });
    }

    if (filters?.fechaFin) {
      queryBuilder.andWhere('fenomeno.fechaReporte <= :fechaFin', {
        fechaFin: filters.fechaFin,
      });
    }

    // Paginación y ordenamiento
    const [data, total] = await queryBuilder
      .select([
        'fenomeno.id',
        'fenomeno.idFenomeno',
        'fenomeno.tipoFenomenoNormalizado',
        'fenomeno.municipio',
        'fenomeno.fechaReporte',
        'fenomeno.latitud',
        'fenomeno.longitud',
      ])
      .orderBy('fenomeno.fechaReporte', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

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
    return this.fenomenosRepository.findOne({
      where: { id },
      select: [
        'id',
        'idFenomeno',
        'tipoFenomenoOriginal',
        'tipoFenomenoNormalizado',
        'municipio',
        'fechaReporte',
        'latitud',
        'longitud',
        'urlReporte',
      ],
    });
  }

  async getStats() {
    const total = await this.fenomenosRepository.count();

    const byType = await this.fenomenosRepository
      .createQueryBuilder('fenomeno')
      .select('fenomeno.tipoFenomenoNormalizado', 'tipo')
      .addSelect('COUNT(*)', 'cantidad')
      .where('fenomeno.tipoFenomenoNormalizado IS NOT NULL')
      .groupBy('fenomeno.tipoFenomenoNormalizado')
      .orderBy('cantidad', 'DESC')
      .getRawMany();

    const byMunicipio = await this.fenomenosRepository
      .createQueryBuilder('fenomeno')
      .select('fenomeno.municipio', 'municipio')
      .addSelect('COUNT(*)', 'cantidad')
      .where('fenomeno.municipio IS NOT NULL')
      .groupBy('fenomeno.municipio')
      .orderBy('cantidad', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      totalEventos: total,
      porTipo: byType.map((item) => ({
        tipo: item.tipo,
        cantidad: parseInt(item.cantidad),
      })),
      topMunicipios: byMunicipio.map((item) => ({
        municipio: item.municipio,
        cantidad: parseInt(item.cantidad),
      })),
    };
  }
}
