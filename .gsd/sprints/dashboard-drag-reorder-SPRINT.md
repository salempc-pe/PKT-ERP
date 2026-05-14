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
| Restaurar soporte para orden dinámico personalizado y guardar en Firestore | Claude | ✅ Done | 0.5h |
| Implementar interacción interactiva Drag & Drop nativa en DashboardSettingsModal | Claude | ✅ Done | 1.0h |
| Refinar feedback visual, sombras e interacciones móviles del arrastre | Claude | ✅ Done | 0.5h |

## Daily Log

### 2026-05-14
- Sprint creado e inicializado.
- Se restauró la lógica dinámica de fusión de orden personalizado en `modulesConfig.js`.
- Se implementó con éxito el Drag & Drop nativo en el modal mediante las APIs nativas HTML5 (`onDragStart`, `onDragOver`, `onDrop`, `onDragEnd`).
- Se reactivó el guardado de `modulesOrder` en Firebase Firestore en el componente de Ajustes del Dashboard.
- Se añadió feedback visual mediante efectos CSS `active:cursor-grabbing` y `GripVertical` icons.
- Sprint cerrado y completado exitosamente.

## Retrospective (2026-05-14)

### What Went Well
- El uso de la API nativa HTML5 Drag & Drop evitó añadir dependencias externas innecesarias (como dnd-kit o react-beautiful-dnd), manteniendo el paquete web extremadamente liviano y rápido.
- La integración de feedback visual con CSS dinámico (`opacity-40`, `border-dashed scale-95`) entrega una UX muy premium.
- Al preservar la firma existente de `getOrderedModules(accessibleKeys, user?.modulesOrder)` en `ClientLayout` y `ClientDashboard`, no hubo necesidad de modificar múltiples componentes; se acopló todo limpiamente en un único punto modular.

### What Could Improve
- La API nativa de HTML5 Drag & Drop en dispositivos móviles requiere configuraciones polifill adicionales para eventos `touch`. El arrastre visual actual está altamente enfocado en interacciones de escritorio/portátil (mouse/trackpad).


