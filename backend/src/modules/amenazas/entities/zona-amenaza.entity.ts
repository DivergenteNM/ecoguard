import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import type { MultiPolygon } from 'geojson';

@Entity({ schema: 'geo', name: 'zonas_amenaza' })
export class ZonaAmenaza {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  categoria: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'area_km2', type: 'numeric', precision: 10, scale: 2, nullable: true })
  areaKm2: number;

  @Column({ length: 100, nullable: true })
  municipio: string;

  @Column({ name: 'tipo_fenomeno', length: 100, nullable: true })
  tipoFenomeno: string;

  @Column({ length: 100, nullable: true, default: 'DATOS ABIERTOS COLOMBIA - UNGRD' })
  fuente: string;

  @Column({ name: 'fuente_detalle', type: 'text', nullable: true })
  fuenteDetalle: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'MultiPolygon',
    srid: 4326,
  })
  geom: MultiPolygon;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
