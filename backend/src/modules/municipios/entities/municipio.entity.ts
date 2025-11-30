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

  @Column({ length: 100, nullable: true })
  departamento: string;

  @Column({ name: 'area_km2', type: 'decimal', precision: 10, scale: 2, nullable: true })
  areaKm2: number;

  @Column({ nullable: true })
  poblacion: number;

  @Column({ name: 'poblacion_total', nullable: true })
  poblacionTotal: number;

  @Column({ name: 'anio_poblacion', nullable: true })
  anioPoblacion: number;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'MultiPolygon',
    srid: 4326,
  })
  geom: MultiPolygon;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
