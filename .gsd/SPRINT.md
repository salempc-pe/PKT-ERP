# Sprint 27 — disable-text-selection

> **Duration**: 2026-05-10 to 2026-05-10
> **Status**: In Progress

## Goal
Bloquear la selección de texto a nivel global en la aplicación para que se comporte como una aplicación móvil nativa, exceptuando campos de entrada de texto.

## Scope

### Included
- Deshabilitar `user-select` y `-webkit-user-select` en el selector universal `*`.
- Deshabilitar `-webkit-touch-callout` para evitar menús contextuales de imágenes/enlaces.
- Permitir explícitamente la selección en `input`, `textarea` y elementos `contenteditable`.

### Explicitly Excluded
- Ninguno.

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Agregar reglas CSS globales en index.css | Antigravity | ⬜ Todo | 0.5 |
| Verificar que los inputs sigan funcionando | Antigravity | ⬜ Todo | 0.5 |

## Daily Log

### 2026-05-10
- Sprint creado para abordar la experiencia nativa de la PWA.
