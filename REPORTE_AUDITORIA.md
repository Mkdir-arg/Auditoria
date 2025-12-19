# Auditoría Integral del Monorepo

## Resumen Ejecutivo
- La API está expuesta: DRF sin permisos por defecto, CORS/hosts abiertos y creación automática de admin/admin123, dejando datos sensibles accesibles.
- Infra de ejecución es de desarrollo: `runserver`/`npm run dev` en contenedores, `makemigrations` en runtime y `.env` con secretos versionado; no hay pipeline ni tests.
- Autenticación frágil: tokens en localStorage sin refresh, logs de credenciales, IPs hardcodeadas en móvil y colas offline sin protección.
- Observabilidad, validaciones y manejo de errores casi inexistentes; cache en memoria sin invalidación coherente para reportes.
- Documentación declara “producción” pero faltan guardrails básicos (lint/typecheck/tests/CI, server productivo, endurecimiento de seguridad y offline robusto).

## Hallazgos Priorizados (Impacto/Riesgo/Esfuerzo/Archivos)
| Impacto | Riesgo | Esfuerzo | Archivos |
| --- | --- | --- | --- |
| Alto | Medio | M | `my-app/backend/src/config/settings.py`, `core/urls.py`, `auditoria/views.py`, `nutricion/views.py` |
| Alto | Medio | M | `my-app/backend/entrypoint.sh`, `my-app/backend/Dockerfile` |
| Alto | Bajo | S | `my-app/backend/src/config/settings.py` |
| Alto | Bajo | S | `my-app/.env`, `my-app/.env.example` |
| Medio | Medio | M | `my-app/apps/web/src/hooks/useAuth.ts`, `my-app/apps/web/src/services/apiClient.ts`, `my-app/apps/web/src/pages/LoginPage.tsx` |
| Medio | Medio | M | `my-app/apps/web/Dockerfile`, `my-app/backend/Dockerfile` |
| Alto | Medio | M | (crear) `tests/` backend y web |
| Medio | Medio | M | `my-app/apps/mobile/App.tsx`, `my-app/apps/mobile/src/services/apiClient.ts`, `my-app/apps/mobile/src/services/syncService.ts` |
| Medio | Bajo | M | `my-app/backend/src/auditoria/reports.py`, `my-app/backend/src/auditoria/views.py` |
| Medio | Bajo | S | `my-app/backend/src/config/settings.py`, `my-app/apps/web/src/main.tsx` (logging) |

## Detalle por Categoría
### Arquitectura y límites
- Por qué: API expuesta sin permisos por defecto. Dónde: `settings.py` (DEFAULT_PERMISSION_CLASSES vacío), viewsets en `core`, `nutricion`, `auditoria`. Cómo: definir `DEFAULT_PERMISSION_CLASSES = [IsAuthenticated]`, añadir `IsAdminUser` en endpoints de gestión de usuarios y permitir anónimos solo donde se requiera explícitamente. Riesgo: alto. Esfuerzo: M. Verificar: curl a `/api/auditoria/visitas/` devuelve 401 sin JWT, 200 con JWT.
- Por qué: `makemigrations` y admin/admin123 en runtime producen drift y credenciales inseguras. Dónde: `backend/entrypoint.sh`. Cómo: eliminar `makemigrations`, mover creación de superusuario a comando manual, usar migraciones existentes. Riesgo: alto. Esfuerzo: M. Verificar: contenedor arranca sin generar migraciones nuevas y sin crear admin.

### Diseño (patrones)
- Por qué: lógica de dominio en views (recalcular totales, clonado) dificulta testear y reutilizar. Dónde: `auditoria/views.py`. Cómo: extraer servicios (e.g., `PlatoService`, `ReporteService`) con funciones puras; views sólo orquestan. Riesgo: medio. Esfuerzo: M. Verificar: tests unitarios de servicios y views delgadas.
- Por qué: shared y móvil duplican servicios no usados. Dónde: `apps/shared/services`, pantallas RN no usadas (WebView). Cómo: eliminar código muerto o consolidar en un único client compartido. Riesgo: medio. Esfuerzo: M. Verificar: árbol de imports limpio, bundle más pequeño.

### Código limpio
- Por qué: logs de credenciales y tokens. Dónde: `apps/web/src/pages/LoginPage.tsx`, `hooks/useAuth.ts`. Cómo: quitar `console.log`, manejar errores con reporter. Riesgo: medio. Esfuerzo: S. Verificar: build sin referencias a logs.
- Por qué: hardcodes (IPs, endpoints) y manejo de errores mínimo. Dónde: `apps/mobile/App.tsx`, `services/apiClient.ts`. Cómo: extraer baseURL a env/config, handlers de error centralizados. Riesgo: medio. Esfuerzo: M. Verificar: cambio de URL sin tocar código, errores visibles en UI.

### Performance
- Por qué: cache en memoria sin invalidación consistente; reportes pueden quedar stale. Dónde: `auditoria/reports.py` y invalidaciones sólo en `IngredientePlatoViewSet`. Cómo: invalidar en create/update/delete de visitas, instituciones y plantillas; migrar cache a Redis. Riesgo: medio. Esfuerzo: M. Verificar: dashboard se actualiza tras crear visita; métricas de cache hits.
- Por qué: posible N+1 en filtros dinámicos. Dónde: `auditoria/reports.py::get_instituciones_con_filtros`. Cómo: prefetch select_related/prefetch y usar agregaciones en DB. Riesgo: medio. Esfuerzo: M. Verificar: profiling muestra menos queries.

### Seguridad
- Por qué: CORS/ALLOWED_HOSTS abiertos, DEBUG=1, SECRET_KEY y DB en `.env` versionado. Dónde: `settings.py`, raíz `.env`. Cómo: leer hosts/orígenes desde env, DEBUG=0 por defecto, eliminar `.env` del repo, rotar secretos. Riesgo: alto. Esfuerzo: S. Verificar: origen no permitido bloqueado; `git status` sin .env.
- Por qué: tokens en localStorage sin refresh ni cookies; IPs hardcodeadas en móvil; colas offline guardan payloads sin protección. Dónde: `apps/web/src/store/authStore.ts`, `services/apiClient.ts`, `apps/mobile/App.tsx`, `apps/mobile/src/services/syncService.ts`. Cómo: refresh automático en interceptor, considerar cookies httpOnly/SameSite o SecureStore, URLs via env, cifrar/firmar colas o minimizar datos. Riesgo: alto. Esfuerzo: M. Verificar: token expirado se renueva; cola offline no expone datos sensibles.
- Por qué: superusuario admin/admin123 creado siempre. Dónde: `backend/entrypoint.sh`. Cómo: eliminar creación automática; usar variables/secrets. Riesgo: alto. Esfuerzo: S. Verificar: contenedor no crea usuarios por defecto.

### Tests
- Por qué: no hay tests. Dónde: repo entero. Cómo: añadir pytest + DRF APITestCases (auth, instituciones, visitas, reportes), fixtures mínimas; Vitest/Jest para hooks/servicios web. Riesgo: alto. Esfuerzo: M. Verificar: `pytest` y `npm test` verdes en CI.

### Tipado y contratos
- Por qué: backend sin type hints. Dónde: `backend/src/**/*.py`. Cómo: anotar servicios/reportes; mypy con plugin Django. Riesgo: medio. Esfuerzo: M. Verificar: `mypy` sin errores.
- Por qué: RN con `strict: false`. Dónde: `apps/mobile/tsconfig.json`. Cómo: activar `strict`, corregir tipos en hooks/servicios. Riesgo: medio. Esfuerzo: M. Verificar: `tsc --noEmit` limpio.

### Observabilidad
- Por qué: sin logging estructurado ni tracing; errores silenciosos en web. Dónde: backend general; React Query onError no reporta. Cómo: configurar logging JSON, request-id middleware, Sentry o similar; manejar onError global en React Query y toasts. Riesgo: medio. Esfuerzo: M. Verificar: logs con request-id y niveles; errores capturados.

### DX y consistencia
- Por qué: sin lint/format/pre-commit. Dónde: todo. Cómo: ruff/black/isort/mypy; eslint/prettier; pre-commit hooks. Riesgo: medio. Esfuerzo: M. Verificar: `pre-commit run --all-files` limpio.
- Por qué: contenedores de desarrollo en producción. Dónde: `backend/Dockerfile`, `apps/web/Dockerfile`. Cómo: multistage, gunicorn, build estático y server adecuado. Riesgo: alto. Esfuerzo: M. Verificar: imágenes livianas, sirve build compilado.

## Quick Wins (alto impacto/bajo riesgo)
- Gitignore de `.env`, eliminar `my-app/.env` y usar `.env.example` sin secretos.
- En `settings.py`: `DEFAULT_PERMISSION_CLASSES = ['rest_framework.permissions.IsAuthenticated']`; `CORS_ALLOWED_ORIGINS`/`ALLOWED_HOSTS` desde env; `DEBUG` en 0 por defecto.
- Eliminar `makemigrations` y creación de admin en `backend/entrypoint.sh`; ejecutar sólo `migrate` y arrancar con gunicorn.
- Cambiar comando backend a `gunicorn config.wsgi:application --bind 0.0.0.0:8000` en Dockerfile.
- Quitar `console.log` de login y cualquier log de credenciales; `drop_console` ya está en Vite build.
- Añadir interceptor de refresh en `apps/web/src/services/apiClient.ts` usando `/api/token/refresh/`.
- Externalizar URLs en móvil (API y web) a variables de env/Expo y eliminar IPs hardcodeadas.
- Invalidar cache de reportes al crear/editar/eliminar visitas e instituciones.
- Añadir endpoint `/api/health/` simple para healthchecks.
- Crear Makefile con `make lint`, `make test`, `make build-web` para unificar comandos.

## Plan por Fases
- Fase 0: Guardrails
  - [ ] Gitignore de `.env`, rotar secretos, `DEBUG=0`.
  - [ ] Lint/format/typecheck: ruff/black/isort/mypy; eslint/prettier; tsc.
  - [ ] CI mínima (lint + build + tests esqueleto).
  - [ ] Healthcheck y configuración de CORS/hosts por env.
- Fase 1: Refactor seguro
  - [ ] Permisos DRF obligatorios; roles en viewsets; eliminar admin/makemigrations automáticos.
  - [ ] Docker productivo (gunicorn, build estático web, sin `npm run dev`/`runserver`).
  - [ ] Auth web/mobile con refresh, sin logs, URLs configurables; almacenamiento seguro.
  - [ ] Limpieza de código muerto y consolidación de servicios compartidos.
- Fase 2: Performance y escalabilidad
  - [ ] Cache Redis con invalidación correcta en reportes.
  - [ ] Optimizar consultas (prefetch/annotate) y revisar índices según queries reales.
  - [ ] Robustecer offline sync (colas fiables, reintentos, minimización de payloads).
- Fase 3: Hardening de seguridad
  - [ ] CORS/ALLOWED_HOSTS restringidos, HTTPS, headers (CSP, HSTS).
  - [ ] Tokens en storage seguro (cookies httpOnly o SecureStore) y rotación programada.
  - [ ] Rate limiting real en DRF; monitoreo/alertas.
  - [ ] Observabilidad con logging estructurado y captura de errores.

## Configuraciones Recomendadas (automatable)
- Python (`pyproject.toml`):
  ```toml
  [tool.black]
  line-length = 100
  target-version = ["py311"]

  [tool.isort]
  profile = "black"

  [tool.ruff]
  line-length = 100
  extend-select = ["I","B","E","F"]
  exclude = ["migrations"]

  [tool.mypy]
  python_version = "3.11"
  plugins = ["mypy_django_plugin.main"]
  django_settings_module = "config.settings"
  ignore_missing_imports = true
  ```
- Frontend (`apps/web/.eslintrc.cjs`):
  ```js
  module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'prettier',
    ],
    plugins: ['@typescript-eslint','react','react-hooks'],
    settings: { react: { version: '18.2' } },
    ignorePatterns: ['dist','node_modules'],
  };
  ```
- Pre-commit (`.pre-commit-config.yaml`):
  - ruff, black, isort, mypy (ignore-missing-imports), eslint (`.ts,.tsx`), prettier `--check`.
- CI (GitHub Actions `.github/workflows/ci.yml`):
  - Backend job: setup-python, `pip install -r requirements.txt pytest pytest-django mypy ruff black isort`, `ruff check`, `black --check`, `isort --check-only`, `mypy`, `pytest`.
  - Frontend job: setup-node 20, `npm ci` en `apps/web`, `npm run lint`, `npm run build`. Añadir servicio MySQL si se crean tests de integración.

## Comandos de Validación
- Backend (lint/typecheck/tests):
  - `cd my-app/backend && pip install -r requirements.txt pytest pytest-django mypy ruff black isort`
  - `ruff check src`
  - `black --check src`
  - `isort --check-only src`
  - `mypy src`
  - `pytest`
- Frontend:
  - `cd my-app/apps/web && npm install`
  - `npm run lint`
  - `npm run build`
- Docker/local:
  - `cd my-app && docker-compose up -d`
  - `docker-compose logs -f backend` (healthcheck `/api/health/` si se agrega)
- Benchmark básico (una vez asegurada auth):
  - `ab -n 200 -c 20 http://localhost:8000/api/auditoria/reportes/dashboard/` (o `hey` equivalente) para comparar antes/después de cache Redis.
