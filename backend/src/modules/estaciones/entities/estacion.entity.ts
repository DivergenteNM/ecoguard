import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import type { Point } from 'geojson';

@Entity({ schema: 'geo', name: 'estaciones' })
export class Estacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'codigo_estacion', length: 50, unique: true })
  codigoEstacion: string;

  @Column({ name: 'nombre_estacion', length: 200 })
  nombre: string;

  @Column({ name: 'tipo_estacion', length: 100 })
  tipo: string;

  @Column({ name: 'municipio_normalizado', length: 100 })
  municipio: string;

  @Column({ length: 100 })
  departamento: string;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  latitud: number;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  longitud: number;

  @Column({ name: 'elevacion_msnm', nullable: true })
  elevacion: number;

  @Column({ length: 50 })
  estado: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  geom: Point;
}
