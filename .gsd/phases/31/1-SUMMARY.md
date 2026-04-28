# Summary 31.1: Ajustes CSS para Experiencia Nativa

## Qué se hizo
- **Bloqueo de Pull-to-Refresh**: Se agregó `overscroll-behavior-y: none;` al `body` en `src/index.css`.
- **Desactivación de Selección de Texto**: Se aplicó `user-select: none;` y `-webkit-touch-callout: none;` globalmente en el `body`.
- **Excepción para Formularios**: Se aseguró que `input`, `textarea` y elementos con `contenteditable` mantengan `user-select: auto;` para permitir la edición.

## Verificación
- [x] Propiedades CSS agregadas correctamente al archivo base.
- [x] Los campos de texto siguen siendo editables.
