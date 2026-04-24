# Sprint: pwa-ux-refinement

> **Duration**: 2026-04-24
> **Status**: In Progress

## Goal
Solucionar el refresco persistente al arrastrar hacia abajo y sincronizar el color de la barra de estado de Android con el fondo de la aplicación (Modo Claro/Oscuro).

## Scope

### Included
- Extender `overscroll-behavior: none` al elemento `html` para asegurar el bloqueo del pull-to-refresh en Chrome/Android.
- Implementar etiquetas meta dinámicas o CSS para el `theme-color` que cambie según el modo (oscuro/claro).
- Asegurar que la barra de estado de Android se camufle con el fondo de la app.

### Explicitly Excluded
- Cambios en el manifiesto PWA fuera de los colores.
- Nuevos iconos.

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Arreglar pull-to-refresh (html/body CSS) | Claude | ⬜ Todo | 0.5 |
| Sincronizar theme-color de la barra de estado | Claude | ⬜ Todo | 1.0 |
| Verificación en simulador/código | Claude | ⬜ Todo | 0.5 |

## Daily Log

### 2026-04-24
- Sprint creado para refinar la experiencia PWA.
