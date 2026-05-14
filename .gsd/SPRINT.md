# Sprint 1 — dashboard-drag-reorder

> **Duration**: 2026-05-14 to 2026-05-15
> **Status**: In Progress

## Goal
Implementar el reordenamiento de módulos mediante Drag-and-Drop en la configuración del dashboard, y reactivar la sincronización de dicho orden personalizado con el Sidebar y el Dashboard.

## Scope

### Included
- Restaurar la lógica dinámica en `modulesConfig.js` para que acepte `savedOrder` (el orden personalizado del usuario) y lo sincronice con `MODULES_CATALOG`.
- Reactivar el guardado del campo `modulesOrder` en Firebase Firestore en `DashboardSettingsModal.jsx`.
- Añadir comportamiento nativo Drag & Drop (draggable, onDragStart, onDragOver, onDrop, onDragEnd) en el mapeo de tarjetas del modal de configuración.
- Integrar un tirador o icono visual (ej. `GripVertical`) para indicar la posibilidad de arrastre.

### Explicitly Excluded
- Integración de librerías externas de DND (se prioriza usar la API nativa de HTML5 por rendimiento y simplicidad).

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Restaurar soporte para orden dinámico personalizado y guardar en Firestore | Claude | ⬜ Todo | 0.5h |
| Implementar interacción interactiva Drag & Drop nativa en DashboardSettingsModal | Claude | ⬜ Todo | 1.0h |
| Refinar feedback visual, sombras e interacciones móviles del arrastre | Claude | ⬜ Todo | 0.5h |

## Daily Log

### 2026-05-14
- Sprint creado e inicializado.
