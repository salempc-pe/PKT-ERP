# Sprint 27 — disable-text-selection

> **Duration**: 2026-05-10 to 2026-05-10
> **Status**: Completed

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
| Agregar reglas CSS globales en index.css | Antigravity | ✅ Done | 0.5 |
| Verificar que los inputs sigan funcionando | Antigravity | ✅ Done | 0.5 |

## Daily Log

### 2026-05-10
- Sprint creado para abordar la experiencia nativa de la PWA.
- Modificado `index.css` para añadir `user-select: none` globalmente y habilitar selectores para inputs.

## Retrospective (2026-05-10)

### What Went Well
- Se implementaron las reglas CSS cross-browser de forma limpia en el core CSS.

### What Could Improve
- N/A.

### Action Items
- [x] Sprint cerrado.
