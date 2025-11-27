import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import type { MultiPolygon } from 'geojson';

@Entity({ schema: 'geo', name: 'municipios' })
export class Municipio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'codigo_dane', length: 10, unique: true })
  codigoDane: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  departamento: string;

  @Column({ name: 'poblacion_total', nullable: true })
  poblacionTotal: number;

  @Column({ name: 'año_poblacion', nullable: true })
  anioPoblacion: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'MultiPolygon',
    srid: 4326,
  })
  geom: MultiPolygon;
}
