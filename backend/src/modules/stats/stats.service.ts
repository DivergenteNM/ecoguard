import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fenomeno } from '../fenomenos/entities/fenomeno.entity';
import { Municipio } from '../municipios/entities/municipio.entity';
import { ZonaAmenaza } from '../amenazas/entities/zona-amenaza.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Fenomeno)
    private fenomenosRepository: Repository<Fenomeno>,
    @InjectRepository(Municipio)
    private municipiosRepository: Repository<Municipio>,
    @InjectRepository(ZonaAmenaza)
    private amenazasRepository: Repository<ZonaAmenaza>,
  ) {}

  async getDashboardStats() {
    // Total counts
    const totalFenomenos = await this.fenomenosRepository.count();
    const totalMunicipios = await this.municipiosRepository.count();
    const totalZonasAmenaza = await this.amenazasRepository.count();

    // Fenómenos por tipo - usando query raw
    const fenomenosPorTipo = await this.fenomenosRepository.query(`
      SELECT tipo_fenomeno_normalizado as tipo, COUNT(*)::int as count
      FROM public.fenomenos_naturales
      WHERE tipo_fenomeno_normalizado IS NOT NULL
      GROUP BY tipo_fenomeno_normalizado
      ORDER BY count DESC
    `);

    // Fenómenos por mes
    const fenomenosPorMes = await this.fenomenosRepository.query(`
      SELECT EXTRACT(MONTH FROM fecha_reporte)::int as mes, COUNT(*)::int as count
      FROM public.fenomenos_naturales
      WHERE fecha_reporte IS NOT NULL
      GROUP BY EXTRACT(MONTH FROM fecha_reporte)
      ORDER BY mes ASC
    `);

    // Municipios más afectados
    const municipiosMasAfectados = await this.fenomenosRepository.query(`
      SELECT municipio as nombre, COUNT(*)::int as count
      FROM public.fenomenos_naturales
      WHERE municipio IS NOT NULL
      GROUP BY municipio
      ORDER BY count DESC
      LIMIT 10
    `);

    // Amenazas por categoría
    const amenazasPorCategoria = await this.amenazasRepository.query(`
      SELECT categoria, COUNT(*)::int as count
      FROM geo.zonas_amenaza
      GROUP BY categoria
    `);

    return {
      totalFenomenos,
      totalMunicipios,
      totalZonasAmenaza,
      fenomenosPorTipo,
      fenomenosPorMes,
      municipiosMasAfectados,
      amenazasPorCategoria,
    };
  }

  async getTimeline(granularidad: 'mes' | 'trimestre' | 'año' = 'mes', tipo?: string) {
    let selectExpression: string;
    switch (granularidad) {
      case 'año':
        selectExpression = "TO_CHAR(f.fecha_reporte, 'YYYY')";
        break;
      case 'trimestre':
        selectExpression = "TO_CHAR(f.fecha_reporte, 'YYYY') || '-Q' || TO_CHAR(f.fecha_reporte, 'Q')";
        break;
      default:
        selectExpression = "TO_CHAR(f.fecha_reporte, 'YYYY-MM')";
    }

    const query = this.fenomenosRepository
      .createQueryBuilder('f')
      .select(selectExpression, 'periodo')
      .addSelect('COUNT(*)', 'count');

    if (tipo) {
      query.where('f.tipoFenomenoNormalizado = :tipo', { tipo });
    }

    const timeline = await query
      .groupBy('periodo')
      .orderBy('periodo', 'ASC')
      .getRawMany();

    return {
      timeline: timeline.map(item => ({
        periodo: item.periodo,
        count: parseInt(item.count),
      })),
    };
  }
}
