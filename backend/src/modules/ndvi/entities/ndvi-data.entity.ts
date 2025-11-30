import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'geo', name: 'ndvi_data' })
export class NdviData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: Date;

  @Column({ name: 'fecha_extraccion', type: 'timestamp', nullable: true })
  fechaExtraccion: Date;

  @Column({ name: 'ndvi_max', type: 'numeric', precision: 10, scale: 8, nullable: true })
  ndviMax: number;

  @Column({ name: 'ndvi_mean', type: 'numeric', precision: 10, scale: 8, nullable: true })
  ndviMean: number;

  @Column({ name: 'ndvi_min', type: 'numeric', precision: 10, scale: 8, nullable: true })
  ndviMin: number;

  @Column({ length: 100, nullable: true })
  interpretacion: string;

  @Column({ name: 'imagenes_procesadas', nullable: true })
  imagenesProcessadas: number;

  @Column({ name: 'nubosidad_maxima', nullable: true })
  nubosidadMaxima: number;

  @Column({ length: 200, nullable: true })
  region: string;

  @Column({ length: 200, nullable: true })
  fuente: string;

  @Column({ name: 'resolucion_espacial_m', nullable: true })
  resolucionEspacialM: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
