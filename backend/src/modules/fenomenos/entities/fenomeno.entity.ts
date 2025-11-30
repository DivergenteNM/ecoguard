import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import type { Point } from 'geojson';

@Entity({ schema: 'public', name: 'fenomenos_naturales' })
export class Fenomeno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_fenomeno', nullable: true })
  idFenomeno: number;

  @Column({ length: 100 })
  municipio: string;

  @Column({ length: 200, nullable: true })
  vereda: string;

  @Column({ type: 'numeric', precision: 10, scale: 8, nullable: true })
  latitud: number;

  @Column({ type: 'numeric', precision: 11, scale: 8, nullable: true })
  longitud: number;

  @Column({ name: 'altura_msnm', nullable: true })
  alturaMsnm: number;

  @Column({ name: 'cuenca_hidrografica', length: 200, nullable: true })
  cuencaHidrografica: string;

  @Column({ name: 'tipo_fenomeno_original', type: 'text', nullable: true })
  tipoFenomenoOriginal: string;

  @Column({ name: 'tipo_fenomeno_normalizado', length: 100, nullable: true })
  tipoFenomenoNormalizado: string;

  @Column({ name: 'categoria_fenomeno', length: 50, nullable: true })
  categoriaFenomeno: string;

  @Column({ name: 'nivel_riesgo', length: 20, nullable: true })
  nivelRiesgo: string;

  @Column({ name: 'numero_informe', length: 50, nullable: true })
  numeroInforme: string;

  @Column({ name: 'fecha_reporte', type: 'timestamp', nullable: true })
  fechaReporte: Date;

  @Column({ nullable: true })
  año: number;

  @Column({ nullable: true })
  mes: number;

  @Column({ nullable: true })
  dia: number;

  @Column({ name: 'dias_desde_evento', nullable: true })
  diasDesdeEvento: number;

  @Column({ name: 'url_reporte', type: 'text', nullable: true })
  urlReporte: string;

  @Column({ name: 'tiene_reporte', nullable: true })
  tieneReporte: boolean;

  @Column({ name: 'coordenadas_validas', nullable: true })
  coordenadasValidas: boolean;

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
