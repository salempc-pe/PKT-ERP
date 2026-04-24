---
phase: 31
plan: 1
wave: 1
---

# Plan 31.1: Ajustes CSS para Experiencia Nativa

## Objective
Deshabilitar comportamientos web por defecto en dispositivos móviles, como el "pull-to-refresh" (refrescar al arrastrar hacia abajo) y la selección de texto o menús contextuales al mantener presionado, para que la aplicación se sienta como una app nativa.

## Context
- .gsd/ROADMAP.md
- src/index.css

## Tasks

<task type="auto">
  <name>Bloquear Pull-to-Refresh y Selección de Texto</name>
  <files>
    - src/index.css
  </files>
  <action>
    - En el bloque `@layer base` o directamente en la etiqueta `body`, agregar la propiedad `overscroll-behavior-y: none;` o `overscroll-behavior-y: contain;` para prevenir que Chrome/Safari móvil recargue la página al arrastrar hacia abajo en el límite superior.
    - Agregar las propiedades `-webkit-user-select: none;`, `user-select: none;` y `-webkit-touch-callout: none;` al `body` o en una clase global (exceptuando inputs/textareas) para evitar que el texto se sombree como si fuera una búsqueda de Google al hacer long-press.
    - Asegurar que `input, textarea` tengan `user-select: auto; -webkit-user-select: auto;` para no romper la escritura en los formularios.
  </action>
  <verify>Verificar en el código que `index.css` incluya las propiedades de `overscroll-behavior` y `user-select` en el `body`.</verify>
  <done>El código CSS base restringe el refresco nativo del navegador y la selección de texto.</done>
</task>

## Success Criteria
- [ ] `overscroll-behavior-y` configurado en `none` o `contain` en el body.
- [ ] `user-select` configurado en `none` de manera global.
- [ ] Formularios conservan la capacidad de editar y seleccionar texto (`user-select: auto`).
