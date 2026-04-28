---
phase: 36
plan: 3
wave: 1
---

# Plan 36.3: Tablas a Ancho Completo en Configuración y Admin

## Objective
Finalizar el paso a diseño móvil de tablas asegurando que las vistas del lado de Administrador (Team, Billing, Logs) también pierdan su estructura de tarjeta confinada y se expanda el listado al ancho completo.

## Context
- .gsd/ROADMAP.md
- src/modules/client/team/TeamModule.jsx
- src/modules/admin/billing/AdminBillingModule.jsx
- src/modules/admin/ActivityLogs.jsx

## Tasks

<task type="auto">
  <name>Refactorizar Tablas de Team y Admin</name>
  <files>
    - src/modules/client/team/TeamModule.jsx
    - src/modules/admin/billing/AdminBillingModule.jsx
    - src/modules/admin/ActivityLogs.jsx
  </files>
  <action>
    - Quitar bordes redondeados, bordes laterales, y aplicar `-mx-4 md:mx-0` o `-mx-6 md:mx-0` dependiendo del padding padre en pantallas móviles (`< md`).
    - Permitir que el contenedor de tabla flote con `bg-transparent md:bg-[var(--color-surface-container-low)]`.
  </action>
  <verify>npm run build</verify>
  <done>Las tablas de equipo de trabajo, suscripciones de admin y auditoría no tienen estilo tarjeta en móvil.</done>
</task>

## Success Criteria
- [ ] Listado de miembros del equipo en móvil va de borde a borde.
- [ ] Vistas de Admin (Logs y Billing) no están encajonadas en pantallas chicas.
