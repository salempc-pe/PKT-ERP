# Sprint 38 — payroll-and-warehouse-fixes

> **Duration**: 2026-04-30 to 2026-05-01
> **Status**: In Progress

## Goal
Habilitar el módulo de nóminas en el administrador y estandarizar la tarjeta de bodega en el dashboard.

## Scope

### Included
- Agregar el módulo 'payroll' (Nóminas) a la lista de módulos disponibles en la configuración de empresas para el super admin.
- Refactorizar `WarehouseDashboardCard.jsx` para que utilice el componente `DashboardCard` estándar, asegurando consistencia visual.

### Explicitly Excluded
- Modificaciones a la lógica interna del módulo de nóminas o bodega.

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Agregar 'payroll' a AVAILABLE_MODULES en AdminClients.jsx | Antigravity | ✅ Hecho | 0.5 |
| Refactorizar WarehouseDashboardCard.jsx para usar DashboardCard | Antigravity | ✅ Hecho | 1.0 |
| Verificar cambios en el dashboard y modal de config | Antigravity | ✅ Hecho | 0.5 |

## Daily Log

### 2026-04-30
- Sprint creado.
- Identificados archivos relevantes: `AdminClients.jsx` y `WarehouseDashboardCard.jsx`.
- Agregado módulo 'payroll' a `AVAILABLE_MODULES` en `AdminClients.jsx`.
- Refactorizada `WarehouseDashboardCard.jsx` para usar el componente `DashboardCard` estándar.
- Ajustado el título de la tarjeta de bodega a "Bodega" para mayor claridad.

