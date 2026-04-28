# Sprint 5 — remove-mock-data

> **Duration**: 2026-04-21 to 2026-04-21
> **Status**: Completed ✅

## Goal
Eliminar toda la data de muestra/simulada del dashboard de administrador y asegurar que las métricas reflejen la realidad de la base de datos.

## Scope

### Included
- Renombrar estados `mockUsers`, `mockOrganizations`, etc. en `AuthContext` a nombres reales.
- Eliminar lógica de simulación (multiplicadores y valores hardcoded) en `useAdminAnalytics.js`.
- Ajustar las tarjetas modulares para mostrar 0 o datos reales cuando estén disponibles.

### Explicitly Excluded
- Implementación de agregación por Cloud Functions (fuera de alcance actual).
- Cambios en el dashboard de cliente (a menos que tenga mock data evidente).

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Renombrar estados en AuthContext | Antigravity | ✅ Done | 0.5 |
| Eliminar simulaciones en useAdminAnalytics | Antigravity | ✅ Done | 0.5 |
| Actualizar referencias en AdminDashboard y tarjetas | Antigravity | ✅ Done | 0.5 |

## Retrospective (2026-04-21)

### What Went Well
- Se eliminaron todos los cálculos ficticios que inflaban las métricas globales.
- Los nombres de las variables internas ahora son honestos (`allUsers` en lugar de `mockUsers`).
- Las tarjetas modulares ahora muestran 0 si no hay datos, lo que evita confusiones.

### What Could Improve
- Para métricas globales reales de colecciones profundas (contactos, tareas), se necesitará una solución de agregación en el backend.

### Action Items
- [ ] Planificar agregación de métricas globales mediante Firebase Cloud Functions o un documento de sumario.
