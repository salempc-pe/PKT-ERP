# Sprint 4 — refactor-audit-findings

> **Duración**: 2026-05-25 to 2026-05-27
> **Estado**: En Progreso

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
| T1 — Configuración del Sprint | Antigravity | ⬜ Todo | 0.5 |
| T2 — Resolver crash en logs de SuperAdmin (Importaciones en `AuthContext.jsx`) | Antigravity | ⬜ Todo | 0.5 |
| T3 — Alinear subcolección `/invoices` en `firestore.rules` | Antigravity | ⬜ Todo | 0.5 |
| T4 — Mejorar propagación de errores en API interna de `AuthContext.jsx` | Antigravity | ⬜ Todo | 1.5 |
| T5 — Limpieza y modularización del archivo `AuthContext.jsx` | Antigravity | ⬜ Todo | 2.5 |
| T6 — Pruebas de compilación y verificación local | Antigravity | ⬜ Todo | 1.0 |

## Log Diario

### 2026-05-25
- Creación de Sprint 4 para abordar la refactorización técnica post-auditoría.
- Sprint 3 compact-ui archivado exitosamente en `.gsd/sprints/compact-ui-SPRINT.md`.
