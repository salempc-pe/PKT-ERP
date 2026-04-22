# Sprint 15 — Remove Mock Data References

> **Duration**: 2026-04-21 to 2026-04-22
> **Status**: In Progress

## Goal
Eliminar todas las referencias a datos "mock" (simulados) y estados relacionados en la aplicación para asegurar que solo se utilice Firestore, corrigiendo el error `setMockOrganizations is not defined`.

## Scope

### Included
- Buscar y eliminar variables, estados y funciones con el prefijo "mock" en `AuthContext.jsx`.
- Actualizar `adminCreateOrg` para usar `setAllOrganizations`.
- Limpiar cualquier otro archivo que dependa de datos mock (ej. dashboard, reportes).
- Verificar que la creación de organizaciones y usuarios funcione exclusivamente con Firestore.

### Explicitly Excluded
- Migración de datos (esto es limpieza de código).

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Buscar ocurrencias de "mock" en el código | Antigravity | ⏳ In Progress | 0.5 |
| Limpiar AuthContext.jsx | Antigravity | ⬜ Todo | 1 |
| Actualizar AdminClients.jsx y otros módulos | Antigravity | ⬜ Todo | 1 |
| Validar flujo de creación de organización | Antigravity | ⬜ Todo | 0.5 |

## Daily Log

### 2026-04-21
- Sprint creado para eliminar referencias a datos mock.
