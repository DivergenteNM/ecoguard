import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fenomeno } from '../fenomenos/entities/fenomeno.entity';
import { ZonaAmenaza } from '../amenazas/entities/zona-amenaza.entity';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(Fenomeno)
    private fenomenosRepository: Repository<Fenomeno>,
    @InjectRepository(ZonaAmenaza)
    private amenazasRepository: Repository<ZonaAmenaza>,
  ) {}

  async getFenomenosGeoJSON(filters?: {
    tipo?: string;
    fechaInicio?: string;
    fechaFin?: string;
    municipio?: string;
  }) {
    const query = this.fenomenosRepository
      .createQueryBuilder('f')
      .select([
        'f.id',
        'f.tipoFenomenoNormalizado',
        'f.municipio',
        'f.fechaReporte',
        'f.latitud',
        'f.longitud',
      ]);

    if (filters?.tipo) {
      query.andWhere('f.tipoFenomenoNormalizado = :tipo', { tipo: filters.tipo });
    }

    if (filters?.fechaInicio) {
      query.andWhere('f.fechaReporte >= :fechaInicio', { fechaInicio: filters.fechaInicio });
    }

    if (filters?.fechaFin) {
      query.andWhere('f.fechaReporte <= :fechaFin', { fechaFin: filters.fechaFin });
    }

    if (filters?.municipio) {
      query.andWhere('f.municipio = :municipio', { municipio: filters.municipio });
    }

    const fenomenos = await query.getMany();

    return {
      type: 'FeatureCollection',
      features: fenomenos
        .filter((f) => f.latitud && f.longitud)
        .map((f) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [parseFloat(f.longitud.toString()), parseFloat(f.latitud.toString())],
          },
          properties: {
            id: f.id,
            tipo: f.tipoFenomenoNormalizado,
            fecha: f.fechaReporte,
            municipio: f.municipio,
          },
        })),
    };
  }

  async getAmenazasGeoJSON() {
    const amenazas = await this.amenazasRepository
      .createQueryBuilder('a')
      .select([
        'a.id',
        'a.categoria',
        'a.tipoFenomeno',
        'a.municipio',
        'a.areaKm2',
        'a.descripcion',
        'ST_AsGeoJSON(a.geom) as geojson',
      ])
      .getRawMany();

    return {
      type: 'FeatureCollection',
      features: amenazas.map(a => ({
        type: 'Feature',
        geometry: JSON.parse(a.geojson),
        properties: {
          id: a.a_id,
          categoria: a.a_categoria,
          tipoFenomeno: a.a_tipoFenomeno,
          municipio: a.a_municipio,
          areaKm2: parseFloat(a.a_areaKm2),
          descripcion: a.a_descripcion,
        },
      })),
    };
  }

  async getHeatmapData() {
    const fenomenos = await this.fenomenosRepository
      .createQueryBuilder('f')
      .select('f.latitud', 'lat')
      .addSelect('f.longitud', 'lon')
      .addSelect('COUNT(*)', 'weight')
      .groupBy('f.latitud, f.longitud')
      .getRawMany();

    return {
      points: fenomenos.map(f => ({
        lat: parseFloat(f.lat),
        lon: parseFloat(f.lon),
        weight: parseInt(f.weight),
      })),
    };
  }
}
