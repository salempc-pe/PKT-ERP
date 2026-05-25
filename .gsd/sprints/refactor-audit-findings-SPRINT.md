# Sprint 4 — refactor-audit-findings

> **Duración**: 2026-05-25 to 2026-05-27
> **Estado**: Completado

## Goal
Resolver los hallazgos críticos y de alto riesgo identificados en la auditoría de código, eliminando crashes de ejecución para el SuperAdmin, alineando las reglas de Firebase con la subcolección de facturas reales, mejorando la propagación de errores de base de datos en la UI y reduciendo el acoplamiento de `AuthContext.jsx`.

## Alcance

### Incluido
- **Fallo Crítico de Importación (`AuthContext.jsx`)**:
  - Importar explícitamente `orderBy` y `limit` desde `'firebase/firestore'`.
- **Desajuste de Reglas de Firebase (`firestore.rules`)**:
  - Alinear las reglas para la subcolección `/invoices` en lugar de `/sales`, garantizando el aislamiento multi-inquilino.
- **Robustez y Gestión de Errores (`AuthContext.jsx`)**:
  - Refactorizar funciones de base de datos (`adminRemoveUser`, `adminRemoveOrg`, etc.) para propagar fallos con `{ success: false, error }`.
- **Reducción de Deuda Técnica (Estructura)**:
  - Extraer funciones secundarias como `formatPrice`, `getClientUsers` y el seeder del proveedor principal, o modularizarlas para aliviar el tamaño de `AuthContext.jsx`.

### Excluido
- Cambios funcionales en los flujos visuales que no afecten a la estabilidad.
- Migraciones masivas de bases de datos operativas en vivo.

## Tareas

| Tarea | Asignado | Estado | Est. Horas |
|-------|----------|--------|------------|
| T1 — Configuración del Sprint | Antigravity | ✅ Hecho | 0.5 |
| T2 — Resolver crash en logs de SuperAdmin (Importaciones en `AuthContext.jsx`) | Antigravity | ✅ Hecho | 0.5 |
| T3 — Alinear subcolección `/invoices` en `firestore.rules` | Antigravity | ✅ Hecho | 0.5 |
| T4 — Mejorar propagación de errores en API interna de `AuthContext.jsx` | Antigravity | ✅ Hecho | 1.5 |
| T5 — Limpieza y modularización del archivo `AuthContext.jsx` | Antigravity | ✅ Hecho | 2.5 |
| T6 — Pruebas de compilación y verificación local | Antigravity | ✅ Hecho | 1.0 |

## Log Diario

### 2026-05-25
- Creación de Sprint 4 para abordar la refactorización técnica post-auditoría.
- Sprint 3 compact-ui archivado exitosamente en `.gsd/sprints/compact-ui-SPRINT.md`.
- Corrección de importación faltante (`orderBy` y `limit`) en `AuthContext.jsx` para evitar colapsos al cargar logs.
- Modificación en `firestore.rules` redefiniendo la subcolección de facturación de `/sales` a `/invoices` para corregir los bloqueos en producción.
- Ajuste de propagación de errores en las API CRUD admin dentro de `AuthContext.jsx`, permitiendo informar de manera controlada los éxitos/errores a la UI.
- Creación del módulo de servicio `src/services/dbSeeder.js` y remoción completa del código monolítico e inline de seeding junto con el método obsoleto `getClientUsers`.
- Ejecución de `npm run build` confirmando que la aplicación compila perfectamente y los precachés de PWA se generan con éxito sin fallos.

## Retrospectiva (2026-05-25)

### Qué salió bien
- Se resolvieron con extrema precisión los dos bloqueadores críticos que interrumpían las pruebas en producción del portal SuperAdmin y de Facturación.
- La extracción de la lógica de seeding a un archivo de servicio dedicado `dbSeeder.js` y la limpieza de código muerto redujeron significativamente las líneas complejas de `AuthContext.jsx`.
- El build de Vite compila en menos de 9 segundos de manera totalmente limpia.

### Qué podría mejorar
- La dependencia en `sessionStorage` para caché rápido en el render inicial de `AuthContext` sigue teniendo baja robustez ante cambios en tiempo real desde la consola de Firebase. Se podría estudiar un middleware de verificación en siguientes fases.

### Temas Pendientes (Action Items)
- [x] Desplegar localmente o en entorno de staging las nuevas reglas `firestore.rules` para habilitar el módulo de facturación.
