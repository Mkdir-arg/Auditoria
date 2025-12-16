# 🚀 SETUP BASE DE DATOS OFFLINE Y SINCRONIZACIÓN

## ✅ ARCHIVOS CREADOS

### Base de Datos (SQLite + WatermelonDB)
- ✅ `src/database/schema.ts` - Esquema de tablas
- ✅ `src/database/index.ts` - Inicialización de DB
- ✅ `src/database/models/Alimento.ts` - Modelo Alimento
- ✅ `src/database/models/Institucion.ts` - Modelo Institución
- ✅ `src/database/models/Visita.ts` - Modelo Visita
- ✅ `src/database/models/Plato.ts` - Modelo Plato
- ✅ `src/database/models/Ingrediente.ts` - Modelo Ingrediente

### Sincronización
- ✅ `src/database/sync/syncService.ts` - Servicio de sincronización completo
- ✅ `src/hooks/useSync.ts` - Hook para estado de sincronización
- ✅ `src/hooks/useDatabase.ts` - Hook para operaciones CRUD

### UI
- ✅ `src/screens/SyncScreen.tsx` - Pantalla de sincronización

### Configuración
- ✅ `babel.config.js` - Soporte para decorators
- ✅ `package.json` - Dependencias actualizadas
- ✅ `app.json` - Configuración Android + WatermelonDB
- ✅ `eas.json` - Configuración para generar APK

---

## 📦 INSTALACIÓN

### 1. Instalar dependencias

```bash
cd my-app/apps/mobile
npm install
```

Esto instalará:
- `@nozbe/watermelondb` - Base de datos SQLite
- `@nozbe/with-observables` - Observables para React
- `@react-native-async-storage/async-storage` - Storage local
- `@react-native-community/netinfo` - Detección de conectividad
- `@babel/plugin-proposal-decorators` - Soporte decorators

### 2. Limpiar caché

```bash
npm start -- --clear
```

---

## 🔧 USO DE LA BASE DE DATOS

### Ejemplo: Buscar alimentos offline

```typescript
import { useDatabase } from '../hooks/useDatabase'

function BuscarAlimentoScreen() {
  const { searchAlimentos } = useDatabase()
  
  const buscar = async (query: string) => {
    const resultados = await searchAlimentos(query)
    console.log(resultados) // Array de alimentos
  }
}
```

### Ejemplo: Crear institución offline

```typescript
const { createInstitucion } = useDatabase()

const crear = async () => {
  const institucion = await createInstitucion({
    codigo: 'ESC001',
    nombre: 'Escuela Primaria N°1',
    tipo: 'escuela',
    direccion: 'Av. Corrientes 1234',
    barrio: 'Almagro',
    comuna: '5'
  })
  // Se guarda localmente con synced=false
}
```

### Ejemplo: Crear visita offline

```typescript
const { createVisita } = useDatabase()

const crearVisita = async (institucionId: string) => {
  const visita = await createVisita({
    institucionId: institucionId,
    fecha: Date.now(),
    tipoComida: 'almuerzo',
    observaciones: 'Todo en orden'
  })
}
```

### Ejemplo: Agregar plato con ingredientes

```typescript
const { createPlato, createIngrediente } = useDatabase()

// 1. Crear plato
const plato = await createPlato({
  visitaId: visitaId,
  nombre: 'Arroz con pollo',
  tipoPlato: 'principal',
  porcionesServidas: 50
})

// 2. Agregar ingredientes (cálculo automático)
await createIngrediente({
  platoId: plato.id,
  alimentoId: alimentoArrozId,
  cantidad: 200, // gramos
  unidad: 'g'
})

await createIngrediente({
  platoId: plato.id,
  alimentoId: alimentoPolloId,
  cantidad: 150,
  unidad: 'g'
})

// Los totales nutricionales se calculan automáticamente
```

---

## 🔄 USO DE SINCRONIZACIÓN

### En cualquier pantalla

```typescript
import { useSync } from '../hooks/useSync'

function MiPantalla() {
  const { isOnline, isSyncing, lastSync, pendingCount, sync } = useSync()
  
  return (
    <View>
      <Text>Estado: {isOnline ? 'Online' : 'Offline'}</Text>
      <Text>Pendientes: {pendingCount}</Text>
      <Button onPress={sync} disabled={!isOnline}>
        Sincronizar
      </Button>
    </View>
  )
}
```

### Sincronización automática

El sistema detecta automáticamente cuando hay conexión y puede sincronizar. Para sincronización automática al conectar:

```typescript
useEffect(() => {
  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected) {
      sync() // Sincronizar automáticamente
    }
  })
  return () => unsubscribe()
}, [])
```

---

## 📱 GENERAR APK

### Opción 1: Con EAS Build (Recomendado)

```bash
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Login en Expo
eas login

# 3. Configurar proyecto (primera vez)
eas build:configure

# 4. Generar APK
eas build --platform android --profile preview

# 5. Descargar APK
# El link de descarga aparecerá en la terminal
```

### Opción 2: Build local (requiere Android Studio)

```bash
# 1. Generar bundle
expo prebuild

# 2. Ir a carpeta android
cd android

# 3. Generar APK
./gradlew assembleRelease

# 4. APK en: android/app/build/outputs/apk/release/app-release.apk
```

---

## 🎯 FLUJO COMPLETO OFFLINE

### 1. Primera vez (con internet)
```
Usuario instala APK → Login → Descarga catálogo de alimentos (5000+)
→ Descarga instituciones → Listo para trabajar offline
```

### 2. Trabajo offline
```
Usuario crea visita → Agrega platos → Agrega ingredientes
→ Cálculos automáticos → Todo se guarda localmente (synced=false)
```

### 3. Sincronización (cuando hay internet)
```
Detecta conexión → Envía instituciones nuevas → Envía visitas
→ Envía platos → Envía ingredientes → Marca todo como synced=true
```

---

## 🔍 VERIFICAR INSTALACIÓN

### 1. Verificar que WatermelonDB funciona

```typescript
import { database } from './src/database'

// En cualquier componente
useEffect(() => {
  database.get('alimentos').query().fetchCount().then(count => {
    console.log('Alimentos en DB:', count)
  })
}, [])
```

### 2. Verificar sincronización

```typescript
import syncService from './src/database/sync/syncService'

// Probar sincronización
syncService.sync().then(() => {
  console.log('Sincronización completa')
})
```

---

## 📊 ESTRUCTURA DE DATOS

### Alimentos (Solo lectura)
- 5000+ registros de Argenfood
- Búsqueda por nombre
- Valores nutricionales completos

### Instituciones (Lectura/Escritura)
- CRUD completo offline
- Sincronización bidireccional

### Visitas (Lectura/Escritura)
- Crear offline
- Formulario JSON (10 secciones)
- Sincronización al conectar

### Platos e Ingredientes (Lectura/Escritura)
- Cálculos nutricionales automáticos
- Totales en tiempo real

---

## ⚠️ IMPORTANTE

1. **Primera sincronización**: Requiere internet para descargar catálogo de alimentos
2. **Espacio**: El catálogo ocupa ~5MB en SQLite
3. **Performance**: Búsqueda de alimentos es instantánea (índices en SQLite)
4. **Conflictos**: Sistema usa "last-write-wins" (última escritura gana)

---

## 🐛 TROUBLESHOOTING

### Error: "Decorators are not enabled"
```bash
# Limpiar caché
npm start -- --clear
```

### Error: "Cannot find module @nozbe/watermelondb"
```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
```

### APK no instala
```bash
# Verificar firma en app.json
# Verificar permisos en app.json
```

---

## ✅ PRÓXIMOS PASOS

1. Ejecutar `npm install`
2. Probar sincronización inicial
3. Crear visita offline
4. Verificar que se sincroniza al conectar
5. Generar APK con `eas build`

