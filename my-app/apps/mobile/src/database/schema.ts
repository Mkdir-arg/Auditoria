import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'instituciones',
      columns: [
        { name: 'nombre', type: 'string' },
        { name: 'tipo', type: 'string' },
        { name: 'direccion', type: 'string' },
        { name: 'comuna', type: 'string', isOptional: true },
        { name: 'barrio', type: 'string', isOptional: true },
        { name: 'telefono', type: 'string', isOptional: true },
        { name: 'email', type: 'string', isOptional: true },
        { name: 'server_id', type: 'number', isOptional: true },
        { name: 'synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'visitas',
      columns: [
        { name: 'institucion_id', type: 'string', isIndexed: true },
        { name: 'fecha', type: 'number' },
        { name: 'tipo_comida', type: 'string' },
        { name: 'observaciones', type: 'string', isOptional: true },
        { name: 'formulario_data', type: 'string', isOptional: true },
        { name: 'server_id', type: 'number', isOptional: true },
        { name: 'synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'platos',
      columns: [
        { name: 'visita_id', type: 'string', isIndexed: true },
        { name: 'nombre', type: 'string' },
        { name: 'descripcion', type: 'string', isOptional: true },
        { name: 'server_id', type: 'number', isOptional: true },
        { name: 'synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
