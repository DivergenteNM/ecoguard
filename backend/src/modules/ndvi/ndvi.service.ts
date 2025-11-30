import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NdviData } from './entities/ndvi-data.entity';

@Injectable()
export class NdviService {
  constructor(
    @InjectRepository(NdviData)
    private ndviRepository: Repository<NdviData>,
  ) {}

  async getLatest() {
    const latest = await this.ndviRepository.find({
      order: { fechaExtraccion: 'DESC' },
      take: 1,
    });

    if (!latest || latest.length === 0) {
      throw new NotFoundException('No hay datos NDVI disponibles');
    }

    const data = latest[0];

    return {
      id: data.id,
      periodo: {
        inicio: data.fechaInicio,
        fin: data.fechaFin,
      },
      fechaExtraccion: data.fechaExtraccion,
      estadisticas: {
        ndviMax: parseFloat(data.ndviMax?.toString() || '0'),
        ndviMean: parseFloat(data.ndviMean?.toString() || '0'),
        ndviMin: parseFloat(data.ndviMin?.toString() || '0'),
      },
      interpretacion: data.interpretacion,
      imagenesProcessadas: data.imagenesProcessadas,
      nubosidadMaxima: data.nubosidadMaxima,
      region: data.region,
      fuente: data.fuente,
      resolucionEspacialM: data.resolucionEspacialM,
      metadata: data.metadata,
    };
  }

  async getAll() {
    const data = await this.ndviRepository.find({
      order: { fechaExtraccion: 'DESC' },
      select: [
        'id',
        'fechaInicio',
        'fechaFin',
        'fechaExtraccion',
        'ndviMean',
        'interpretacion',
        'imagenesProcessadas',
      ],
    });

    return data.map((item) => ({
      id: item.id,
      periodo: {
        inicio: item.fechaInicio,
        fin: item.fechaFin,
      },
      fechaExtraccion: item.fechaExtraccion,
      ndviMean: parseFloat(item.ndviMean?.toString() || '0'),
      interpretacion: item.interpretacion,
      imagenesProcessadas: item.imagenesProcessadas,
    }));
  }

  async getStats() {
    const count = await this.ndviRepository.count();
    const latest = await this.getLatest();

    return {
      totalRegistros: count,
      ultimaExtraccion: latest.fechaExtraccion,
      estadisticasRecientes: latest.estadisticas,
    };
  }
}
