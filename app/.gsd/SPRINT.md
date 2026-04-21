# Sprint 5 — remove-mock-data

> **Duration**: 2026-04-21 to 2026-04-21
> **Status**: In Progress

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
| Renombrar estados en AuthContext | Antigravity | ⏳ Todo | 0.5 |
| Eliminar simulaciones en useAdminAnalytics | Antigravity | ⏳ Todo | 0.5 |
| Actualizar referencias en AdminDashboard y tarjetas | Antigravity | ⏳ Todo | 0.5 |

## Daily Log

### 2026-04-21
- Sprint iniciado para limpieza de integridad de datos.
