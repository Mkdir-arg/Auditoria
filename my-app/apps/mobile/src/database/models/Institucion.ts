import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export class Institucion extends Model {
  static table = 'instituciones';

  @field('nombre') nombre!: string;
  @field('tipo') tipo!: string;
  @field('direccion') direccion!: string;
  @field('comuna') comuna?: string;
  @field('barrio') barrio?: string;
  @field('telefono') telefono?: string;
  @field('email') email?: string;
  @field('server_id') serverId?: number;
  @field('synced') synced!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
