# 📱 Análisis de Compatibilidad React Native

## ✅ Estado Actual

La aplicación móvil **YA EXISTE** en `/apps/mobile` pero necesita actualizaciones para las nuevas funcionalidades.

## ❌ Problemas Identificados

### 1. **localStorage vs SecureStore**
- **Web**: Usa `localStorage` directamente
- **Mobile**: Usa `expo-secure-store`
- **Impacto**: Formularios guardados en localStorage no funcionan en mobile

### 2. **window.location.href**
- **Web**: Usa `window.location.href = '/login'` para redirección
- **Mobile**: No existe `window`, usa React Navigation
- **Ubicación**: `apps/web/src/services/apiClient.ts`

### 3. **Servicios Duplicados**
- Cada plataforma tiene su propia copia de servicios
- Cambios deben hacerse 2 veces
- Propenso a inconsistencias

### 4. **Pantallas Faltantes en Mobile**
- ❌ `InstitucionDetallePage` - Nueva funcionalidad
- ❌ `FormularioRelevamientoPage` - Nueva funcionalidad
- ❌ `CategoriasPage` - CRUD completo
- ❌ `AlimentosPage` - CRUD completo
- ❌ `RankingPage` - Reportes
- ❌ `ReporteInstitucionPage` - Reportes

## ✅ Solución Implementada

### Estructura Compartida `/apps/shared`

```
apps/shared/
├── types/
│   └── index.ts          # Interfaces compartidas
├── services/
│   └── auditoriaService.ts  # Factory de servicios
└── utils/
    └── storage.ts        # Abstracción de storage
```

### 1. **Storage Abstraction Layer**

```typescript
// Interfaz común
interface StorageAdapter {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
}

// Web usa localStorage
class WebStorage implements StorageAdapter

// Mobile usa SecureStore
class MobileStorage implements StorageAdapter
```

**Uso:**
```typescript
// Inicializar en cada plataforma
// Web: initStorage(new WebStorage())
// Mobile: initStorage(new MobileStorage(SecureStore))

// Usar en código compartido
const storage = getStorage()
await storage.setItem('key', 'value')
```

### 2. **Servicios Compartidos**

```typescript
// Factory pattern
export const createAuditoriaService = (apiClient: any) => ({
  getInstituciones() { ... },
  createVisita() { ... }
})

// Web
import apiClient from './apiClient'
export const auditoriaService = createAuditoriaService(apiClient)

// Mobile
import apiClient from './apiClient'
export const auditoriaService = createAuditoriaService(apiClient)
```

### 3. **Tipos Compartidos**

Todas las interfaces en `/apps/shared/types/index.ts`:
- `Institucion`
- `VisitaAuditoria`
- `PlatoObservado`
- `User`
- etc.

## 📋 Tareas Pendientes

### Para Web
- [ ] Migrar a storage abstraction layer
- [ ] Actualizar apiClient para no usar window.location
- [ ] Importar servicios desde shared

### Para Mobile
- [ ] Crear `InstitucionDetalleScreen`
- [ ] Crear `FormularioRelevamientoScreen`
- [ ] Crear `CategoriasScreen` con CRUD
- [ ] Crear `AlimentosScreen` con CRUD
- [ ] Crear `RankingScreen`
- [ ] Crear `ReporteInstitucionScreen`
- [ ] Actualizar navegación con nuevas rutas
- [ ] Migrar a storage abstraction layer
- [ ] Importar servicios desde shared

## 🎯 Recomendaciones

### Arquitectura Ideal

```
my-app/
├── apps/
│   ├── shared/           # ✅ Código compartido
│   │   ├── types/
│   │   ├── services/
│   │   └── utils/
│   ├── web/              # Web específico
│   │   ├── components/   # UI web (Tailwind)
│   │   └── pages/
│   └── mobile/           # Mobile específico
│       ├── components/   # UI mobile (React Native)
│       └── screens/
```

### Patrón de Desarrollo

1. **Lógica de negocio** → `/apps/shared`
2. **UI Web** → `/apps/web` (Tailwind, HTML)
3. **UI Mobile** → `/apps/mobile` (React Native components)

### Beneficios

✅ **DRY**: Código compartido, cambios en un solo lugar
✅ **Consistencia**: Misma lógica en ambas plataformas
✅ **Mantenibilidad**: Más fácil de mantener
✅ **Testing**: Tests compartidos

## 🚀 Próximos Pasos

1. **Migrar Web a shared**
   - Actualizar imports
   - Usar storage abstraction
   - Probar que todo funciona

2. **Actualizar Mobile**
   - Agregar pantallas faltantes
   - Usar shared services
   - Implementar nuevas funcionalidades

3. **Testing**
   - Probar en ambas plataformas
   - Verificar sincronización
   - Validar UX en mobile

## 📝 Notas Importantes

- **NO** eliminar código actual hasta migración completa
- Mantener compatibilidad hacia atrás
- Probar exhaustivamente en ambas plataformas
- Documentar cambios en cada PR
