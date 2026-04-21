# Sprint 2 — fix-user-dashboard-and-modules

> **Duration**: 2026-04-21 to 2026-04-22
> **Status**: In Progress

## Goal
Corregir la visibilidad de módulos para usuarios no-administradores y asegurar que el dashboard cargue correctamente los módulos activos de la organización.

## Scope

### Included
- Investigar y corregir la lógica de renderizado del Sidebar en `ClientLayout.jsx`.
- Investigar y corregir la carga de tarjetas en `ClientDashboard.jsx` para usuarios estándar.
- Asegurar que 'Mi Equipo' sea exclusivo para administradores.

### Explicitly Excluded
- Cambios en el diseño visual de los módulos.
- Modificación de permisos en Firestore (ya revisados en el sprint anterior).

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Analizar Sidebar en `ClientLayout.jsx` | Antigravity | ⏳ Todo | 1 |
| Analizar Dashboard en `ClientDashboard.jsx` | Antigravity | ⏳ Todo | 1 |
| Corregir lógica de visibilidad | Antigravity | ⏳ Todo | 2 |
| Verificar con diferentes roles | Antigravity | ⏳ Todo | 1 |

## Daily Log

### 2026-04-21
- Sprint iniciado para corregir acceso de usuarios estándar.
