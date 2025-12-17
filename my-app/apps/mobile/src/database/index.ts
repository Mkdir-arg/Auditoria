import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { schema } from './schema';
import { Institucion } from './models/Institucion';
import { Visita } from './models/Visita';
import { Plato } from './models/Plato';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'auditoria',
  jsi: true,
});

export const database = new Database({
  adapter,
  modelClasses: [Institucion, Visita, Plato],
});
