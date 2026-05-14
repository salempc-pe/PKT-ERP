# Sprint — Dashboard Drag Interactive

> **Duration**: 2026-05-14 to 2026-05-15
> **Status**: In Progress

## Goal
Implementar reordenamiento visual interactivo en tiempo real (sort-as-you-drag) en el modal de configuración del dashboard con compatibilidad completa para PC y dispositivos móviles mediante touch listeners.

## Scope

### Included
- Transformar la lógica de arrastre en PC de estática (en soltado) a dinámica interactiva (intercambio en tiempo real por hover en `onDragOver`).
- Añadir soporte de arrastre para pantallas táctiles móviles usando `onTouchStart`, `onTouchMove`, `onTouchEnd` restringido al tirador `GripVertical`.
- Asegurar transiciones CSS y estados visuales fluidos durante la reordenación en ambas plataformas.
- Preservar el guardado reactivo del orden en Firestore.

### Explicitly Excluded
- Añadir librerías npm de Drag & Drop pesadas.
- Rediseñar el Sidebar o el Dashboard (estos simplemente leen el orden final).

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Implementar swap reactivo al pasar ratón (`onDragOver`) para efecto visual interactivo en PC | Claude | ⬜ Todo | 0.5h |
| Desarrollar el motor de Touch API en JS para emulación de arrastre reactivo en pantallas móviles | Claude | ⬜ Todo | 1.0h |
| Añadir `touch-action: none` en el Grip handle para permitir scroll general pero habilitar arrastre preciso | Claude | ⬜ Todo | 0.2h |
| Validar el orden dinámico final y sincronización con Firebase | Claude | ⬜ Todo | 0.3h |

## Daily Log

### 2026-05-14
- Sprint creado para refinar interacción visual y soporte multi-plataforma de arrastre de módulos.
