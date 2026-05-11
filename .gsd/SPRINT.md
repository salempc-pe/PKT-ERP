# Sprint 2 — reorder-dashboard-modules

> **Duration**: 2026-05-11 to 2026-05-12
> **Status**: In Progress

## Goal
Permitir que el usuario reordene sus módulos activos en la configuración del dashboard para que dicho orden se refleje consistentemente en la barra lateral (sidebar) y en las tarjetas informativas del dashboard.

## Scope

### Included
- Refactorizar `ClientLayout.jsx` para que el sidebar renderice los módulos dinámicamente basándose en el orden guardado en preferencias del usuario.
- Implementar botones de reordenación (subir/bajar) en `DashboardSettingsModal.jsx` en la lista de módulos.
- Asegurar la sincronización y persistencia del nuevo orden en Firebase Firestore (`dashboardPreferences`).
- Modificar `ClientDashboard.jsx` para que las tarjetas respeten el orden específico de las preferencias.

### Explicitly Excluded
- Alterar permisos de suscripción o lógicas de acceso a los módulos.
- Modificar diseños de módulos individuales.

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Refactorizar sidebar en ClientLayout.jsx para renderizado dinámico ordenado | Antigravity | ⬜ Todo | 1.0 |
| Implementar UI de reordenación en DashboardSettingsModal.jsx | Antigravity | ⬜ Todo | 1.0 |
| Ajustar renderizado de tarjetas en ClientDashboard.jsx para respetar el orden | Antigravity | ⬜ Todo | 0.5 |
| Validación y pruebas del flujo de reordenación y persistencia | Antigravity | ⬜ Todo | 0.5 |

## Daily Log

### 2026-05-11
- Sprint creado a solicitud del usuario.
- Analizada la estructura de `ClientLayout`, `ClientDashboard` y `DashboardSettingsModal`.
