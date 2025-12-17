import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import { Institucion } from './Institucion';

export class Visita extends Model {
  static table = 'visitas';
  static associations = {
    instituciones: { type: 'belongs_to', key: 'institucion_id' },
  };

  @field('institucion_id') institucionId!: string;
  @relation('instituciones', 'institucion_id') institucion!: Institucion;
  @field('fecha') fecha!: number;
  @field('tipo_comida') tipoComida!: string;
  @field('observaciones') observaciones?: string;
  @field('formulario_data') formularioData?: string;
  @field('server_id') serverId?: number;
  @field('synced') synced!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
