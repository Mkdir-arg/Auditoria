# 📱 MIGRACIÓN A REACT NATIVE - SISTEMA DE AUDITORÍA NUTRICIONAL

## 🎯 OBJETIVO

Migrar el sistema web actual a React Native para:
- ✅ Generar APK de Android
- ✅ Funcionalidad offline completa
- ✅ Sincronización cuando hay conexión
- ✅ Experiencia móvil nativa

---

## 📊 ANÁLISIS DEL SISTEMA ACTUAL

### Stack Actual
- **Backend**: Django REST API + MySQL
- **Frontend**: React Web + TypeScript
- **Datos**: 3 módulos principales (Nutrición, Auditoría, Reportes)

### Modelos de Datos Principales
1. **AlimentoNutricional** (5000+ registros Argenfood)
2. **Institucion** (escuelas, CDI, hogares, geriátricos)
3. **VisitaAuditoria** (con formulario JSON de 10 secciones)
4. **PlatoObservado** (con cálculos nutricionales)
5. **IngredientePlato** (relación con alimentos)

### Funcionalidades Críticas
- ✅ Búsqueda de alimentos (5000+ registros)
- ✅ Cálculo automático de valores nutricionales
- ✅ Formularios complejos (10 secciones)
- ✅ Reportes con filtros dinámicos
- ✅ Dashboard con estadísticas

---

## 🏗️ ARQUITECTURA PROPUESTA

### Estrategia: Híbrida Offline-First

```
┌─────────────────────────────────────────┐
│   REACT NATIVE APP (Android APK)        │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  UI Layer (React Native)           │ │
│  │  - Navegación (React Navigation)   │ │
│  │  - Componentes nativos             │ │
│  └────────────────────────────────────┘ │
│              ↓                           │
│  ┌────────────────────────────────────┐ │
│  │  Estado Local (Zustand/Redux)      │ │
│  │  - Gestión de estado offline       │ │
│  └────────────────────────────────────┘ │
│              ↓                           │
│  ┌────────────────────────────────────┐ │
│  │  Base de Datos Local (SQLite)      │ │
│  │  - Alimentos (5000+ registros)     │ │
│  │  - Instituciones                   │ │
│  │  - Visitas pendientes              │ │
│  │  - Platos e ingredientes           │ │
│  └────────────────────────────────────┘ │
│              ↓                           │
│  ┌────────────────────────────────────┐ │
│  │  Capa de Sincronización            │ │
│  │  - Cola de operaciones pendientes  │ │
│  │  - Detección de conectividad       │ │
│  │  - Resolución de conflictos        │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
              ↕ HTTP/REST (cuando online)
┌─────────────────────────────────────────┐
│   BACKEND DJANGO (Sin cambios)          │
│   - API REST existente                  │
│   - MySQL                               │
└─────────────────────────────────────────┘
```

---

## 🛠️ STACK TECNOLÓGICO REACT NATIVE

### Core
- **React Native** 0.73+
- **TypeScript** 5.x
- **Expo** (para desarrollo rápido) o **React Native CLI** (para más control)

### Base de Datos Local
- **@react-native-async-storage/async-storage** - Datos simples
- **react-native-sqlite-storage** o **WatermelonDB** - Base de datos relacional offline

### Navegación
- **@react-navigation/native** - Navegación entre pantallas
- **@react-navigation/stack** - Stack navigator
- **@react-navigation/bottom-tabs** - Tabs inferiores

### Estado Global
- **zustand** (ligero) o **@reduxjs/toolkit** (robusto)

### Networking & Sincronización
- **axios** - HTTP client
- **@react-native-community/netinfo** - Detección de conectividad
- **react-query** o **SWR** - Caché y sincronización

### UI Components
- **react-native-paper** - Material Design
- **react-native-vector-icons** - Iconos
- **react-native-gesture-handler** - Gestos
- **react-native-reanimated** - Animaciones

### Formularios
- **react-hook-form** - Gestión de formularios
- **yup** - Validación

### Generación APK
- **Expo EAS Build** (recomendado) o **Android Studio**

---

## 📁 ESTRUCTURA DEL PROYECTO

```
auditoria-mobile/
├── android/                    # Configuración Android nativa
├── ios/                        # Configuración iOS (opcional)
├── src/
│   ├── components/            # Componentes reutilizables
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── forms/
│   │   │   ├── FormularioRelevamiento.tsx
│   │   │   └── SeccionFormulario.tsx
│   │   └── platos/
│   │       ├── PlatoCard.tsx
│   │       └── IngredienteItem.tsx
│   │
│   ├── screens/               # Pantallas principales
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx
│   │   ├── instituciones/
│   │   │   ├── InstitucionesListScreen.tsx
│   │   │   └── InstitucionDetalleScreen.tsx
│   │   ├── visitas/
│   │   │   ├── VisitasListScreen.tsx
│   │   │   ├── VisitaDetalleScreen.tsx
│   │   │   └── FormularioScreen.tsx
│   │   ├── platos/
│   │   │   ├── PlatoDetalleScreen.tsx
│   │   │   └── BuscarAlimentoScreen.tsx
│   │   ├── reportes/
│   │   │   ├── DashboardScreen.tsx
│   │   │   └── RankingScreen.tsx
│   │   └── sync/
│   │       └── SyncScreen.tsx
│   │
│   ├── navigation/            # Configuración de navegación
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   │
│   ├── services/              # Servicios
│   │   ├── api/
│   │   │   ├── apiClient.ts
│   │   │   ├── auditoriaApi.ts
│   │   │   ├── nutricionApi.ts
│   │   │   └── authApi.ts
│   │   ├── database/
│   │   │   ├── db.ts
│   │   │   ├── alimentosDb.ts
│   │   │   ├── institucionesDb.ts
│   │   │   ├── visitasDb.ts
│   │   │   └── platosDb.ts
│   │   └── sync/
│   │       ├── syncService.ts
│   │       ├── syncQueue.ts
│   │       └── conflictResolver.ts
│   │
│   ├── store/                 # Estado global
│   │   ├── authStore.ts
│   │   ├── institucionesStore.ts
│   │   ├── visitasStore.ts
│   │   └── syncStore.ts
│   │
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useNetworkStatus.ts
│   │   ├── useSync.ts
│   │   └── useDatabase.ts
│   │
│   ├── utils/                 # Utilidades
│   │   ├── calculations.ts    # Cálculos nutricionales
│   │   ├── validators.ts
│   │   └── formatters.ts
│   │
│   ├── types/                 # TypeScript types
│   │   ├── models.ts
│   │   ├── api.ts
│   │   └── navigation.ts
│   │
│   └── constants/             # Constantes
│       ├── colors.ts
│       └── config.ts
│
├── app.json                   # Configuración Expo
├── package.json
├── tsconfig.json
└── README.md
```

---

## 💾 ESTRATEGIA DE BASE DE DATOS OFFLINE

### Opción 1: WatermelonDB (Recomendado)
**Ventajas:**
- ✅ Optimizado para React Native
- ✅ Sincronización integrada
- ✅ Queries reactivos
- ✅ Excelente performance con miles de registros

**Esquema:**
```typescript
// models/Alimento.ts
@model('alimentos')
class Alimento extends Model {
  @field('codigo_argenfood') codigoArgenfood!: number
  @field('nombre') nombre!: string
  @field('energia_kcal') energiaKcal!: number
  @field('proteinas_g') proteinasG!: number
  // ... más campos
  @json('data', sanitizeData) data!: any
}

// models/Visita.ts
@model('visitas')
class Visita extends Model {
  @field('institucion_id') institucionId!: string
  @field('fecha') fecha!: number
  @field('tipo_comida') tipoComida!: string
  @field('synced') synced!: boolean
  @json('formulario_respuestas', sanitizeJSON) formularioRespuestas!: any
  
  @children('platos') platos!: Query<Plato>
}
```

### Opción 2: SQLite + TypeORM
**Ventajas:**
- ✅ SQL tradicional
- ✅ Más control
- ✅ Migraciones claras

### Datos a Almacenar Localmente

#### 1. Catálogo de Alimentos (Solo lectura)
- **5000+ registros** de Argenfood
- **Descarga inicial**: Al instalar la app
- **Actualización**: Semanal/mensual en background
- **Búsqueda**: Índices en nombre y código

#### 2. Instituciones (Lectura/Escritura)
- **Descarga**: Al login
- **Creación offline**: Permitida con UUID temporal
- **Sincronización**: Al conectar

#### 3. Visitas (Lectura/Escritura)
- **Creación offline**: Permitida
- **Estado**: `pending_sync`, `synced`, `conflict`
- **Sincronización**: Automática al conectar

#### 4. Platos e Ingredientes (Lectura/Escritura)
- **Creación offline**: Permitida
- **Cálculos**: Locales usando catálogo offline

---

## 🔄 SISTEMA DE SINCRONIZACIÓN

### Estrategia de Sincronización

```typescript
// syncService.ts
class SyncService {
  // 1. Detectar conectividad
  async checkConnection(): Promise<boolean>
  
  // 2. Sincronizar datos del servidor
  async pullFromServer(): Promise<void> {
    // Descargar instituciones actualizadas
    // Descargar visitas del usuario
    // Actualizar catálogo de alimentos si hay cambios
  }
  
  // 3. Enviar cambios locales
  async pushToServer(): Promise<void> {
    // Enviar instituciones nuevas
    // Enviar visitas pendientes
    // Enviar platos e ingredientes
  }
  
  // 4. Resolver conflictos
  async resolveConflicts(): Promise<void> {
    // Estrategia: Last-Write-Wins o Manual
  }
}
```

### Cola de Operaciones Pendientes

```typescript
interface PendingOperation {
  id: string
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  entity: 'institucion' | 'visita' | 'plato' | 'ingrediente'
  data: any
  timestamp: number
  retries: number
}

// Almacenar en AsyncStorage
const syncQueue = {
  add: async (operation: PendingOperation) => {},
  process: async () => {},
  clear: async () => {}
}
```

### Indicadores de Estado

```typescript
// En cada pantalla mostrar:
interface SyncStatus {
  isOnline: boolean
  lastSync: Date | null
  pendingOperations: number
  isSyncing: boolean
}
```

---

## 🎨 ADAPTACIONES DE UI

### Componentes Web → React Native

| Web Component | React Native Equivalent |
|--------------|------------------------|
| `<div>` | `<View>` |
| `<span>`, `<p>` | `<Text>` |
| `<input>` | `<TextInput>` |
| `<button>` | `<TouchableOpacity>` + `<Text>` |
| `<select>` | `<Picker>` o Modal personalizado |
| `<table>` | `<FlatList>` con cards |
| CSS | StyleSheet API |

### Navegación

```typescript
// AppNavigator.tsx
const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Instituciones" component={InstitucionesStack} />
      <Tab.Screen name="Visitas" component={VisitasStack} />
      <Tab.Screen name="Reportes" component={ReportesStack} />
      <Tab.Screen name="Sync" component={SyncScreen} />
    </Tab.Navigator>
  )
}
```

### Formulario de Relevamiento (10 secciones)

```typescript
// FormularioScreen.tsx
const FormularioScreen = () => {
  const [seccionActual, setSeccionActual] = useState(0)
  const [respuestas, setRespuestas] = useState({})
  
  const secciones = [
    { id: 1, titulo: 'Datos Generales', campos: [...] },
    { id: 2, titulo: 'Infraestructura', campos: [...] },
    // ... 10 secciones
  ]
  
  return (
    <ScrollView>
      <ProgressBar progress={seccionActual / 10} />
      <SeccionFormulario 
        seccion={secciones[seccionActual]}
        valores={respuestas}
        onChange={setRespuestas}
      />
      <View style={styles.buttons}>
        <Button onPress={anterior}>Anterior</Button>
        <Button onPress={siguiente}>Siguiente</Button>
      </View>
    </ScrollView>
  )
}
```

### Búsqueda de Alimentos (5000+ registros)

```typescript
// BuscarAlimentoScreen.tsx
const BuscarAlimentoScreen = () => {
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState([])
  
  // Búsqueda local en SQLite
  const buscar = useCallback(
    debounce(async (texto: string) => {
      const results = await db.alimentos
        .query(Q.where('nombre', Q.like(`%${texto}%`)))
        .fetch()
      setResultados(results)
    }, 300),
    []
  )
  
  return (
    <View>
      <SearchBar value={query} onChangeText={buscar} />
      <FlatList
        data={resultados}
        renderItem={({ item }) => (
          <AlimentoCard alimento={item} onSelect={onSelect} />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  )
}
```

---

## 🔐 AUTENTICACIÓN OFFLINE

### Estrategia

1. **Login inicial**: Requiere conexión
2. **Token almacenado**: En AsyncStorage seguro
3. **Sesión offline**: Válida por 30 días
4. **Renovación**: Al conectar

```typescript
// authService.ts
class AuthService {
  async login(username: string, password: string) {
    const response = await api.post('/api/token/', { username, password })
    await AsyncStorage.setItem('access_token', response.data.access)
    await AsyncStorage.setItem('refresh_token', response.data.refresh)
    await AsyncStorage.setItem('user', JSON.stringify(response.data.user))
  }
  
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('access_token')
    return !!token
  }
  
  async refreshToken() {
    // Intentar renovar si hay conexión
  }
}
```

---

## 📦 GENERACIÓN DE APK

### Opción 1: Expo EAS Build (Recomendado)

```bash
# 1. Instalar Expo CLI
npm install -g expo-cli eas-cli

# 2. Inicializar proyecto Expo
npx create-expo-app auditoria-mobile --template expo-template-blank-typescript

# 3. Configurar EAS
eas build:configure

# 4. Generar APK
eas build --platform android --profile preview

# 5. Descargar APK
# Se genera en la nube y se descarga automáticamente
```

**app.json:**
```json
{
  "expo": {
    "name": "Auditoría Nutricional",
    "slug": "auditoria-nutricional",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "android": {
      "package": "com.auditoria.nutricional",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "CAMERA"
      ]
    }
  }
}
```

**eas.json:**
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

### Opción 2: React Native CLI + Android Studio

```bash
# 1. Crear proyecto
npx react-native init AuditoriaMobile --template react-native-template-typescript

# 2. Configurar Android
cd android
./gradlew assembleRelease

# 3. APK generado en:
# android/app/build/outputs/apk/release/app-release.apk
```

**android/app/build.gradle:**
```gradle
android {
    defaultConfig {
        applicationId "com.auditoria.nutricional"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }
    
    signingConfigs {
        release {
            storeFile file('my-release-key.keystore')
            storePassword 'password'
            keyAlias 'my-key-alias'
            keyPassword 'password'
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

## 🚀 PLAN DE MIGRACIÓN (FASES)

### FASE 1: Setup Inicial (1-2 días)
- ✅ Crear proyecto React Native con TypeScript
- ✅ Configurar navegación básica
- ✅ Configurar base de datos SQLite/WatermelonDB
- ✅ Implementar autenticación

### FASE 2: Base de Datos Offline (2-3 días)
- ✅ Crear esquemas de tablas locales
- ✅ Implementar servicio de base de datos
- ✅ Importar catálogo de alimentos (5000+ registros)
- ✅ Implementar búsqueda de alimentos

### FASE 3: Módulo Instituciones (2 días)
- ✅ Pantalla lista de instituciones
- ✅ Pantalla detalle de institución
- ✅ Formulario crear/editar institución
- ✅ Almacenamiento offline

### FASE 4: Módulo Visitas (3-4 días)
- ✅ Pantalla lista de visitas
- ✅ Pantalla detalle de visita
- ✅ Formulario de relevamiento (10 secciones)
- ✅ Navegación entre secciones
- ✅ Guardado automático

### FASE 5: Módulo Platos e Ingredientes (3-4 días)
- ✅ Pantalla agregar plato
- ✅ Búsqueda de alimentos
- ✅ Agregar ingredientes
- ✅ Cálculo automático de valores nutricionales
- ✅ Visualización de totales

### FASE 6: Sistema de Sincronización (3-4 días)
- ✅ Detección de conectividad
- ✅ Cola de operaciones pendientes
- ✅ Sincronización automática
- ✅ Resolución de conflictos
- ✅ Indicadores de estado

### FASE 7: Módulo Reportes (2-3 días)
- ✅ Dashboard con estadísticas
- ✅ Ranking de instituciones
- ✅ Filtros dinámicos
- ✅ Visualización de datos offline

### FASE 8: Testing y Optimización (2-3 días)
- ✅ Testing de funcionalidad offline
- ✅ Testing de sincronización
- ✅ Optimización de performance
- ✅ Testing en dispositivos reales

### FASE 9: Generación APK (1 día)
- ✅ Configurar firma de APK
- ✅ Generar APK de producción
- ✅ Testing de instalación
- ✅ Documentación de distribución

**TOTAL ESTIMADO: 19-26 días**

---

## 📝 CAMBIOS EN EL BACKEND (MÍNIMOS)

### 1. Endpoint de Sincronización Masiva

```python
# auditoria/views.py
@api_view(['POST'])
def sync_data(request):
    """Endpoint optimizado para sincronización móvil"""
    last_sync = request.data.get('last_sync')
    
    # Enviar solo datos modificados desde last_sync
    instituciones = Institucion.objects.filter(
        updated_at__gt=last_sync
    ).values()
    
    visitas = VisitaAuditoria.objects.filter(
        updated_at__gt=last_sync,
        auditor=request.user
    ).values()
    
    return Response({
        'instituciones': list(instituciones),
        'visitas': list(visitas),
        'timestamp': timezone.now()
    })
```

### 2. Agregar Campos de Auditoría

```python
# Agregar a todos los modelos
class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True
```

### 3. Endpoint de Descarga de Alimentos

```python
@api_view(['GET'])
def download_alimentos(request):
    """Descarga completa del catálogo para app móvil"""
    alimentos = AlimentoNutricional.objects.select_related('categoria').all()
    serializer = AlimentoSerializer(alimentos, many=True)
    return Response(serializer.data)
```

---

## 🔧 CONFIGURACIÓN INICIAL

### package.json

```json
{
  "name": "auditoria-mobile",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "build:android": "eas build --platform android --profile preview"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.0",
    "expo": "~50.0.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@react-native-async-storage/async-storage": "^1.21.0",
    "@nozbe/watermelondb": "^0.27.1",
    "axios": "^1.6.2",
    "@react-native-community/netinfo": "^11.1.0",
    "zustand": "^4.4.7",
    "react-hook-form": "^7.49.2",
    "yup": "^1.3.3",
    "react-native-paper": "^5.11.3",
    "react-native-vector-icons": "^10.0.3",
    "date-fns": "^3.0.6"
  },
  "devDependencies": {
    "@types/react": "^18.2.45",
    "@types/react-native": "^0.72.8",
    "typescript": "^5.3.3"
  }
}
```

---

## 📊 COMPARATIVA: WEB vs MOBILE

| Característica | Web | Mobile (React Native) |
|---------------|-----|----------------------|
| **Plataforma** | Navegador | Android APK |
| **Offline** | ❌ No | ✅ Sí (completo) |
| **Base de Datos** | MySQL (servidor) | SQLite (local) |
| **Sincronización** | N/A | Automática |
| **Performance** | Depende de conexión | Nativa |
| **Instalación** | No requiere | APK instalable |
| **Actualizaciones** | Automáticas | Manual o OTA |
| **Cámara** | Limitada | Nativa |
| **Notificaciones** | Push web | Push nativas |

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Setup
- [ ] Crear proyecto React Native
- [ ] Configurar TypeScript
- [ ] Configurar navegación
- [ ] Configurar base de datos local

### Autenticación
- [ ] Pantalla de login
- [ ] Almacenamiento de tokens
- [ ] Sesión offline
- [ ] Renovación de tokens

### Base de Datos Offline
- [ ] Esquema de tablas
- [ ] Importación de alimentos
- [ ] CRUD de instituciones
- [ ] CRUD de visitas
- [ ] CRUD de platos

### Funcionalidades Core
- [ ] Lista de instituciones
- [ ] Crear/editar institución
- [ ] Lista de visitas
- [ ] Crear visita
- [ ] Formulario de relevamiento (10 secciones)
- [ ] Agregar platos
- [ ] Buscar alimentos
- [ ] Agregar ingredientes
- [ ] Cálculos nutricionales

### Sincronización
- [ ] Detección de conectividad
- [ ] Cola de operaciones
- [ ] Sincronización automática
- [ ] Resolución de conflictos
- [ ] Indicadores de estado

### Reportes
- [ ] Dashboard offline
- [ ] Ranking de instituciones
- [ ] Filtros dinámicos

### Testing
- [ ] Testing offline completo
- [ ] Testing de sincronización
- [ ] Testing en dispositivos reales

### Distribución
- [ ] Configurar firma de APK
- [ ] Generar APK de producción
- [ ] Documentación de instalación

---

## 🎯 PRÓXIMOS PASOS

1. **Decidir framework**: Expo (más rápido) vs React Native CLI (más control)
2. **Crear proyecto base**
3. **Implementar autenticación**
4. **Configurar base de datos offline**
5. **Migrar pantallas una por una**
6. **Implementar sincronización**
7. **Generar APK**

---

## 📚 RECURSOS

- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [WatermelonDB](https://watermelondb.dev/)
- [React Navigation](https://reactnavigation.org/)
- [EAS Build](https://docs.expo.dev/build/introduction/)

