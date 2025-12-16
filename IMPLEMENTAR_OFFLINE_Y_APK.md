# 📱 IMPLEMENTAR OFFLINE Y GENERAR APK

## ✅ LO QUE YA TIENES

- ✅ React Native con Expo configurado
- ✅ Navegación (React Navigation con Drawer)
- ✅ Pantallas principales (Instituciones, Visitas, Alimentos, Dashboard)
- ✅ Servicios API (apiClient, auditoriaService, nutricionService)
- ✅ Autenticación con store (Zustand)
- ✅ TypeScript configurado

## ❌ LO QUE FALTA

### 1. Base de Datos Offline (SQLite)
### 2. Sistema de Sincronización
### 3. Configuración para generar APK

---

## 🚀 PASO 1: AGREGAR BASE DE DATOS OFFLINE

### Instalar dependencias

```bash
cd my-app/apps/mobile
npm install @nozbe/watermelondb @nozbe/with-observables
npm install @react-native-community/netinfo
npm install react-native-sqlite-storage
```

### Actualizar package.json

Agregar a dependencies:
```json
"@nozbe/watermelondb": "^0.27.1",
"@nozbe/with-observables": "^1.6.0",
"@react-native-community/netinfo": "11.1.0",
"react-native-sqlite-storage": "^6.0.1"
```

### Actualizar babel.config.js

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      'react-native-reanimated/plugin',
    ],
  };
};
```

---

## 📦 PASO 2: CREAR ESTRUCTURA DE BASE DE DATOS

### Crear modelos WatermelonDB

**src/database/models/Alimento.ts**
```typescript
import { Model } from '@nozbe/watermelondb'
import { field, readonly, date } from '@nozbe/watermelondb/decorators'

export default class Alimento extends Model {
  static table = 'alimentos'

  @field('codigo_argenfood') codigoArgenfood!: number
  @field('nombre') nombre!: string
  @field('categoria_id') categoriaId!: string
  @field('energia_kcal') energiaKcal!: number
  @field('proteinas_g') proteinasG!: number
  @field('grasas_totales_g') grasasTotalesG!: number
  @field('carbohidratos_g') carbohidratosG!: number
  @field('fibra_g') fibraG!: number
  @field('sodio_mg') sodioMg!: number
  @field('calcio_mg') calcioMg!: number
  @field('hierro_mg') hierroMg!: number
  
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
}
```

**src/database/models/Institucion.ts**
```typescript
import { Model } from '@nozbe/watermelondb'
import { field, readonly, date, children } from '@nozbe/watermelondb/decorators'
import { Q } from '@nozbe/watermelondb'

export default class Institucion extends Model {
  static table = 'instituciones'
  static associations = {
    visitas: { type: 'has_many', foreignKey: 'institucion_id' },
  }

  @field('codigo') codigo!: string
  @field('nombre') nombre!: string
  @field('tipo') tipo!: string
  @field('direccion') direccion!: string
  @field('barrio') barrio!: string
  @field('comuna') comuna!: string
  @field('activo') activo!: boolean
  @field('synced') synced!: boolean
  @field('server_id') serverId!: number | null
  
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
  
  @children('visitas') visitas!: any
}
```

**src/database/models/Visita.ts**
```typescript
import { Model } from '@nozbe/watermelondb'
import { field, readonly, date, relation, children, json } from '@nozbe/watermelondb/decorators'

export default class Visita extends Model {
  static table = 'visitas'
  static associations = {
    institucion: { type: 'belongs_to', key: 'institucion_id' },
    platos: { type: 'has_many', foreignKey: 'visita_id' },
  }

  @field('institucion_id') institucionId!: string
  @field('fecha') fecha!: number
  @field('tipo_comida') tipoComida!: string
  @field('observaciones') observaciones!: string
  @field('formulario_completado') formularioCompletado!: boolean
  @json('formulario_respuestas', sanitizeJSON) formularioRespuestas!: any
  @field('synced') synced!: boolean
  @field('server_id') serverId!: number | null
  
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
  
  @relation('instituciones', 'institucion_id') institucion!: any
  @children('platos') platos!: any
}

const sanitizeJSON = (json: any) => json
```

**src/database/models/Plato.ts**
```typescript
import { Model } from '@nozbe/watermelondb'
import { field, readonly, date, relation, children } from '@nozbe/watermelondb/decorators'

export default class Plato extends Model {
  static table = 'platos'
  static associations = {
    visita: { type: 'belongs_to', key: 'visita_id' },
    ingredientes: { type: 'has_many', foreignKey: 'plato_id' },
  }

  @field('visita_id') visitaId!: string
  @field('nombre') nombre!: string
  @field('tipo_plato') tipoPlato!: string
  @field('porciones_servidas') porcionesServidas!: number
  @field('energia_kcal_total') energiaKcalTotal!: number
  @field('proteinas_g_total') proteinasGTotal!: number
  @field('synced') synced!: boolean
  @field('server_id') serverId!: number | null
  
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
  
  @relation('visitas', 'visita_id') visita!: any
  @children('ingredientes') ingredientes!: any
}
```

**src/database/models/Ingrediente.ts**
```typescript
import { Model } from '@nozbe/watermelondb'
import { field, readonly, date, relation } from '@nozbe/watermelondb/decorators'

export default class Ingrediente extends Model {
  static table = 'ingredientes'
  static associations = {
    plato: { type: 'belongs_to', key: 'plato_id' },
    alimento: { type: 'belongs_to', key: 'alimento_id' },
  }

  @field('plato_id') platoId!: string
  @field('alimento_id') alimentoId!: string
  @field('cantidad') cantidad!: number
  @field('unidad') unidad!: string
  @field('energia_kcal') energiaKcal!: number
  @field('proteinas_g') proteinasG!: number
  @field('synced') synced!: boolean
  
  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date
  
  @relation('platos', 'plato_id') plato!: any
  @relation('alimentos', 'alimento_id') alimento!: any
}
```

### Crear schema

**src/database/schema.ts**
```typescript
import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'alimentos',
      columns: [
        { name: 'codigo_argenfood', type: 'number', isIndexed: true },
        { name: 'nombre', type: 'string', isIndexed: true },
        { name: 'categoria_id', type: 'string' },
        { name: 'energia_kcal', type: 'number' },
        { name: 'proteinas_g', type: 'number' },
        { name: 'grasas_totales_g', type: 'number' },
        { name: 'carbohidratos_g', type: 'number' },
        { name: 'fibra_g', type: 'number' },
        { name: 'sodio_mg', type: 'number' },
        { name: 'calcio_mg', type: 'number' },
        { name: 'hierro_mg', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'instituciones',
      columns: [
        { name: 'codigo', type: 'string', isIndexed: true },
        { name: 'nombre', type: 'string', isIndexed: true },
        { name: 'tipo', type: 'string', isIndexed: true },
        { name: 'direccion', type: 'string' },
        { name: 'barrio', type: 'string' },
        { name: 'comuna', type: 'string' },
        { name: 'activo', type: 'boolean' },
        { name: 'synced', type: 'boolean', isIndexed: true },
        { name: 'server_id', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'visitas',
      columns: [
        { name: 'institucion_id', type: 'string', isIndexed: true },
        { name: 'fecha', type: 'number', isIndexed: true },
        { name: 'tipo_comida', type: 'string' },
        { name: 'observaciones', type: 'string' },
        { name: 'formulario_completado', type: 'boolean' },
        { name: 'formulario_respuestas', type: 'string' },
        { name: 'synced', type: 'boolean', isIndexed: true },
        { name: 'server_id', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'platos',
      columns: [
        { name: 'visita_id', type: 'string', isIndexed: true },
        { name: 'nombre', type: 'string' },
        { name: 'tipo_plato', type: 'string' },
        { name: 'porciones_servidas', type: 'number' },
        { name: 'energia_kcal_total', type: 'number' },
        { name: 'proteinas_g_total', type: 'number' },
        { name: 'synced', type: 'boolean', isIndexed: true },
        { name: 'server_id', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
    tableSchema({
      name: 'ingredientes',
      columns: [
        { name: 'plato_id', type: 'string', isIndexed: true },
        { name: 'alimento_id', type: 'string', isIndexed: true },
        { name: 'cantidad', type: 'number' },
        { name: 'unidad', type: 'string' },
        { name: 'energia_kcal', type: 'number' },
        { name: 'proteinas_g', type: 'number' },
        { name: 'synced', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
  ]
})
```

### Inicializar base de datos

**src/database/index.ts**
```typescript
import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import schema from './schema'
import Alimento from './models/Alimento'
import Institucion from './models/Institucion'
import Visita from './models/Visita'
import Plato from './models/Plato'
import Ingrediente from './models/Ingrediente'

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'auditoria_nutricional',
  jsi: true,
})

export const database = new Database({
  adapter,
  modelClasses: [
    Alimento,
    Institucion,
    Visita,
    Plato,
    Ingrediente,
  ],
})
```

---

## 🔄 PASO 3: SISTEMA DE SINCRONIZACIÓN

**src/services/syncService.ts**
```typescript
import NetInfo from '@react-native-community/netinfo'
import { database } from '../database'
import apiClient from './apiClient'
import AsyncStorage from '@react-native-async-storage/async-storage'

class SyncService {
  private isSyncing = false

  async checkConnection(): Promise<boolean> {
    const state = await NetInfo.fetch()
    return state.isConnected ?? false
  }

  async sync() {
    if (this.isSyncing) return
    
    const isOnline = await this.checkConnection()
    if (!isOnline) {
      console.log('Sin conexión, sincronización cancelada')
      return
    }

    this.isSyncing = true
    try {
      await this.pullFromServer()
      await this.pushToServer()
      await AsyncStorage.setItem('last_sync', new Date().toISOString())
    } catch (error) {
      console.error('Error en sincronización:', error)
    } finally {
      this.isSyncing = false
    }
  }

  private async pullFromServer() {
    const lastSync = await AsyncStorage.getItem('last_sync')
    
    // Descargar alimentos (solo si no existen)
    const alimentosCount = await database.get('alimentos').query().fetchCount()
    if (alimentosCount === 0) {
      const { data } = await apiClient.get('/nutricion/alimentos/')
      await this.importAlimentos(data.results)
    }

    // Descargar instituciones
    const { data: instituciones } = await apiClient.get('/auditoria/instituciones/')
    await this.importInstituciones(instituciones.results)

    // Descargar visitas del usuario
    const { data: visitas } = await apiClient.get('/auditoria/visitas/')
    await this.importVisitas(visitas.results)
  }

  private async pushToServer() {
    // Enviar instituciones no sincronizadas
    const institucionesNoSync = await database.get('instituciones')
      .query(Q.where('synced', false))
      .fetch()

    for (const inst of institucionesNoSync) {
      try {
        const response = await apiClient.post('/auditoria/instituciones/', {
          codigo: inst.codigo,
          nombre: inst.nombre,
          tipo: inst.tipo,
          direccion: inst.direccion,
          barrio: inst.barrio,
          comuna: inst.comuna,
        })
        
        await database.write(async () => {
          await inst.update(record => {
            record.synced = true
            record.serverId = response.data.id
          })
        })
      } catch (error) {
        console.error('Error sincronizando institución:', error)
      }
    }

    // Enviar visitas no sincronizadas
    const visitasNoSync = await database.get('visitas')
      .query(Q.where('synced', false))
      .fetch()

    for (const visita of visitasNoSync) {
      try {
        const institucion = await visita.institucion.fetch()
        const response = await apiClient.post('/auditoria/visitas/', {
          institucion: institucion.serverId,
          fecha: new Date(visita.fecha).toISOString().split('T')[0],
          tipo_comida: visita.tipoComida,
          observaciones: visita.observaciones,
          formulario_respuestas: visita.formularioRespuestas,
        })
        
        await database.write(async () => {
          await visita.update(record => {
            record.synced = true
            record.serverId = response.data.id
          })
        })

        // Sincronizar platos de la visita
        await this.syncPlatosDeVisita(visita, response.data.id)
      } catch (error) {
        console.error('Error sincronizando visita:', error)
      }
    }
  }

  private async syncPlatosDeVisita(visita: any, visitaServerId: number) {
    const platos = await visita.platos.fetch()
    
    for (const plato of platos) {
      if (!plato.synced) {
        try {
          const response = await apiClient.post('/auditoria/platos/', {
            visita: visitaServerId,
            nombre: plato.nombre,
            tipo_plato: plato.tipoPlato,
            porciones_servidas: plato.porcionesServidas,
          })
          
          await database.write(async () => {
            await plato.update(record => {
              record.synced = true
              record.serverId = response.data.id
            })
          })

          // Sincronizar ingredientes
          await this.syncIngredientesDeP lato(plato, response.data.id)
        } catch (error) {
          console.error('Error sincronizando plato:', error)
        }
      }
    }
  }

  private async syncIngredientesDeP lato(plato: any, platoServerId: number) {
    const ingredientes = await plato.ingredientes.fetch()
    
    for (const ing of ingredientes) {
      if (!ing.synced) {
        try {
          const alimento = await ing.alimento.fetch()
          await apiClient.post('/auditoria/ingredientes/', {
            plato: platoServerId,
            alimento: alimento.serverId,
            cantidad: ing.cantidad,
            unidad: ing.unidad,
          })
          
          await database.write(async () => {
            await ing.update(record => {
              record.synced = true
            })
          })
        } catch (error) {
          console.error('Error sincronizando ingrediente:', error)
        }
      }
    }
  }

  private async importAlimentos(alimentos: any[]) {
    await database.write(async () => {
      const alimentosCollection = database.get('alimentos')
      for (const alim of alimentos) {
        await alimentosCollection.create(record => {
          record.codigoArgenfood = alim.codigo_argenfood
          record.nombre = alim.nombre
          record.energiaKcal = alim.energia_kcal || 0
          record.proteinasG = alim.proteinas_g || 0
          record.grasasTotalesG = alim.grasas_totales_g || 0
          record.carbohidratosG = alim.carbohidratos_disponibles_g || 0
          record.fibraG = alim.fibra_g || 0
          record.sodioMg = alim.sodio_mg || 0
          record.calcioMg = alim.calcio_mg || 0
          record.hierroMg = alim.hierro_mg || 0
        })
      }
    })
  }

  private async importInstituciones(instituciones: any[]) {
    await database.write(async () => {
      const institucionesCollection = database.get('instituciones')
      for (const inst of instituciones) {
        const existing = await institucionesCollection
          .query(Q.where('server_id', inst.id))
          .fetch()
        
        if (existing.length === 0) {
          await institucionesCollection.create(record => {
            record.codigo = inst.codigo
            record.nombre = inst.nombre
            record.tipo = inst.tipo
            record.direccion = inst.direccion || ''
            record.barrio = inst.barrio || ''
            record.comuna = inst.comuna || ''
            record.activo = inst.activo
            record.synced = true
            record.serverId = inst.id
          })
        }
      }
    })
  }

  private async importVisitas(visitas: any[]) {
    // Similar a importInstituciones
  }
}

export default new SyncService()
```

---

## 📱 PASO 4: GENERAR APK

### Opción A: Con Expo EAS (Recomendado)

```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Login en Expo
eas login

# 3. Configurar proyecto
eas build:configure

# 4. Generar APK
eas build --platform android --profile preview
```

### Crear eas.json

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

### Actualizar app.json

```json
{
  "expo": {
    "android": {
      "package": "com.auditoria.nutricional",
      "versionCode": 1,
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ]
    }
  }
}
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Base de Datos Offline
- [ ] Instalar WatermelonDB y dependencias
- [ ] Crear modelos (Alimento, Institucion, Visita, Plato, Ingrediente)
- [ ] Crear schema
- [ ] Inicializar base de datos
- [ ] Probar creación de registros offline

### Sincronización
- [ ] Instalar NetInfo
- [ ] Crear SyncService
- [ ] Implementar pullFromServer
- [ ] Implementar pushToServer
- [ ] Agregar indicadores de estado de sync
- [ ] Probar sincronización completa

### Generar APK
- [ ] Crear cuenta en Expo
- [ ] Configurar eas.json
- [ ] Actualizar app.json con package
- [ ] Ejecutar eas build
- [ ] Descargar y probar APK

---

## 🎯 PRÓXIMOS PASOS

1. Instalar dependencias de WatermelonDB
2. Crear estructura de base de datos
3. Adaptar servicios existentes para usar DB local
4. Implementar sincronización
5. Generar APK con EAS Build
