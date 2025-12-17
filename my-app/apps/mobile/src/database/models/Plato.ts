import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import { Visita } from './Visita';

export class Plato extends Model {
  static table = 'platos';
  static associations = {
    visitas: { type: 'belongs_to', key: 'visita_id' },
  };

  @field('visita_id') visitaId!: string;
  @relation('visitas', 'visita_id') visita!: Visita;
  @field('nombre') nombre!: string;
  @field('descripcion') descripcion?: string;
  @field('server_id') serverId?: number;
  @field('synced') synced!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
