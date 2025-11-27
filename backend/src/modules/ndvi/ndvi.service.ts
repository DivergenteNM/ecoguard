import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NdviService {
  private readonly dataPath = path.join(process.cwd(), '..', 'datasets', 'raw', 'ndvi');

  async getLatest() {
    try {
      if (!fs.existsSync(this.dataPath)) {
        throw new NotFoundException('Directorio de datos NDVI no encontrado');
      }

      const files = fs.readdirSync(this.dataPath)
        .filter(file => file.endsWith('.json'))
        .sort((a, b) => {
          return fs.statSync(path.join(this.dataPath, b)).mtime.getTime() - 
                 fs.statSync(path.join(this.dataPath, a)).mtime.getTime();
        });

      if (files.length === 0) {
        throw new NotFoundException('No hay datos NDVI disponibles');
      }

      const latestFile = files[0];
      const content = fs.readFileSync(path.join(this.dataPath, latestFile), 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new NotFoundException(`Error al leer datos NDVI: ${error.message}`);
    }
  }
}
