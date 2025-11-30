import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import type { Point } from 'geojson';

@Entity({ schema: 'geo', name: 'estaciones' })
export class Estacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'codigo_estacion', length: 50, unique: true })
  codigoEstacion: string;

  @Column({ name: 'nombre_estacion', length: 200 })
  nombreEstacion: string;

  @Column({ name: 'tipo_estacion', length: 100, nullable: true })
  tipoEstacion: string;

  @Column({ length: 100, nullable: true })
  municipio: string;

  @Column({ length: 100, nullable: true })
  departamento: string;

  @Column({ name: 'zona_hidrografica', length: 200, nullable: true })
  zonaHidrografica: string;

  @Column({ type: 'numeric', precision: 10, scale: 8, nullable: true })
  latitud: number;

  @Column({ type: 'numeric', precision: 11, scale: 8, nullable: true })
  longitud: number;

  @Column({ length: 50, nullable: true })
  estado: string;

  @Column({ length: 200, nullable: true })
  entidad: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  geom: Point;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
