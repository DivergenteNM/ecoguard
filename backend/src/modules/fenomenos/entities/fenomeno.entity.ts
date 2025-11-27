import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import type { Point } from 'geojson';

@Entity({ schema: 'public', name: 'fenomenos_naturales' })
export class Fenomeno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_fenomeno', length: 50, unique: true })
  idFenomeno: string;

  @Column({ name: 'tipo_fenomeno_normalizado', length: 100 })
  tipoFenomeno: string;

  @Column({ name: 'municipio_normalizado', length: 100 })
  municipio: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  latitud: number;

  @Column({ type: 'numeric', precision: 10, scale: 7 })
  longitud: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  geom: Point;
}
