# 📋 FASES PARA COMPLETAR SISTEMA MÓVIL

## ✅ FASE 0: COMPLETADO (40%)
**Tiempo**: Ya realizado
**Estado**: ✅ Funcional en producción

### Pantallas:
- ✅ LoginScreen
- ✅ HomeScreen
- ✅ InstitucionesScreen
- ✅ VisitasScreen
- ✅ NuevaVisitaScreen
- ✅ DetalleVisitaScreen

### Funcionalidades:
- ✅ Autenticación JWT
- ✅ Sincronización offline
- ✅ CRUD básico de visitas y platos
- ✅ Diseño idéntico a la web

---

## 🔵 FASE 1: FORMULARIO DE RELEVAMIENTO (20%)
**Tiempo estimado**: 1 día
**Prioridad**: ALTA

### Pantallas a crear:
1. **FormularioScreen** - 10 secciones de relevamiento
   - Sección 1: Datos generales
   - Sección 2: Infraestructura
   - Sección 3: Higiene
   - Sección 4: Personal
   - Sección 5: Almacenamiento
   - Sección 6: Preparación
   - Sección 7: Servicio
   - Sección 8: Residuos
   - Sección 9: Documentación
   - Sección 10: Observaciones finales

### Componentes necesarios:
- Checkbox
- Radio Button
- TextArea
- Stepper (navegación entre secciones)

### Funcionalidades:
- Guardar progreso offline
- Validación por sección
- Navegación entre secciones
- Guardar como borrador

### Archivos a crear:
```
src/screens/FormularioScreen.tsx
src/components/Checkbox.tsx
src/components/RadioButton.tsx
src/components/Stepper.tsx
```

---

## 🟢 FASE 2: INGREDIENTES Y ALIMENTOS (15%)
**Tiempo estimado**: 1 día
**Prioridad**: ALTA

### Pantallas a crear:
1. **IngredientesScreen** - Agregar ingredientes a platos
2. **BuscadorAlimentosScreen** - Buscar en catálogo Argenfood
3. **AlimentosScreen** - Catálogo completo

### Funcionalidades:
- Búsqueda de alimentos
- Agregar cantidad
- Cálculo automático de valores nutricionales
- Guardar ingredientes offline

### Archivos a crear:
```
src/screens/IngredientesScreen.tsx
src/screens/BuscadorAlimentosScreen.tsx
src/screens/AlimentosScreen.tsx
src/services/nutricionService.ts
```

---

## 🟡 FASE 3: REPORTES Y ESTADÍSTICAS (15%)
**Tiempo estimado**: 1 día
**Prioridad**: MEDIA

### Pantallas a crear:
1. **ReportesScreen** - Dashboard con métricas
2. **FiltrosScreen** - Filtros dinámicos
3. **RankingScreen** - Ranking de instituciones

### Funcionalidades:
- Gráficos (usar react-native-chart-kit)
- Filtros por fecha, institución, tipo
- Exportar reportes
- Promedios nutricionales

### Componentes necesarios:
- Charts (barras, líneas, torta)
- DatePicker
- Filtros avanzados

### Archivos a crear:
```
src/screens/ReportesScreen.tsx
src/screens/FiltrosScreen.tsx
src/screens/RankingScreen.tsx
src/components/Chart.tsx
src/components/DatePicker.tsx
```

---

## 🟣 FASE 4: ADMINISTRACIÓN (10%)
**Tiempo estimado**: 0.5 días
**Prioridad**: BAJA

### Pantallas a crear:
1. **UsuariosScreen** - Gestión de usuarios
2. **CategoriasScreen** - Gestión de categorías
3. **ConfiguracionScreen** - Ajustes del sistema

### Funcionalidades:
- CRUD de usuarios
- CRUD de categorías
- Configuración de perfil
- Cambio de contraseña

### Archivos a crear:
```
src/screens/UsuariosScreen.tsx
src/screens/CategoriasScreen.tsx
src/screens/ConfiguracionScreen.tsx
src/screens/PerfilScreen.tsx
```

---

## 🔴 FASE 5: MEJORAS Y PULIDO (10%)
**Tiempo estimado**: 0.5 días
**Prioridad**: BAJA

### Mejoras:
1. **Animaciones** - Transiciones suaves
2. **Validaciones** - Formularios completos
3. **Mensajes de error** - UX mejorada
4. **Loading states** - Skeletons
5. **Pull to refresh** - En todas las listas
6. **Búsqueda avanzada** - Filtros múltiples
7. **Notificaciones** - Alertas de sincronización
8. **Caché de imágenes** - Si se agregan fotos

### Componentes adicionales:
```
src/components/Skeleton.tsx
src/components/Toast.tsx
src/components/LoadingOverlay.tsx
src/components/EmptyState.tsx
```

---

## 📊 RESUMEN DE FASES

| Fase | Descripción | Tiempo | Prioridad | Pantallas |
|------|-------------|--------|-----------|-----------|
| ✅ 0 | Core (Completado) | - | - | 6 |
| 🔵 1 | Formulario | 1 día | ALTA | 1 |
| 🟢 2 | Ingredientes | 1 día | ALTA | 3 |
| 🟡 3 | Reportes | 1 día | MEDIA | 3 |
| 🟣 4 | Administración | 0.5 días | BAJA | 4 |
| 🔴 5 | Mejoras | 0.5 días | BAJA | - |

**TOTAL**: 4 días para completar 100%

---

## 🎯 RECOMENDACIÓN

### Opción A: Sistema Completo (100%)
- Implementar TODAS las fases
- Tiempo: 4 días
- Resultado: Sistema idéntico a la web

### Opción B: MVP Extendido (70%)
- Implementar solo Fase 1 y 2
- Tiempo: 2 días
- Resultado: Sistema funcional con formularios e ingredientes

### Opción C: Producción Actual (40%)
- Usar lo que ya está
- Tiempo: 0 días
- Resultado: Flujo principal funciona perfectamente

---

## 📝 PRÓXIMOS PASOS

**¿Qué fase quieres que implemente primero?**

1. **Fase 1** - Formulario (más importante)
2. **Fase 2** - Ingredientes (funcionalidad clave)
3. **Fase 3** - Reportes (análisis de datos)
4. **Todas** - Sistema completo

**O generar APK con lo actual y continuar después?**
