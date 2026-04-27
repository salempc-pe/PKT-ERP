---
phase: 33
plan: 1
wave: 1
---

# Plan 33.1: Actualización del Sistema de Diseño (CSS)

## Objective
Alinear `index.css` con la guía de marca Veló (colores primarios, superficies claras/oscuras y tipografía).

## Context
- .gsd/phases/33/RESEARCH.md
- app/src/index.css

## Tasks

<task type="auto">
  <name>Actualizar Tipografía a System UI</name>
  <files>app/src/index.css</files>
  <action>
    - Cambiar las variables `--font-headline`, `--font-body` y `--font-label` para usar `system-ui, -apple-system, 'Segoe UI', sans-serif`.
  </action>
  <verify>grep "system-ui" src/index.css</verify>
  <done>Las fuentes base ahora usan system-ui en lugar de Manrope.</done>
</task>

<task type="auto">
  <name>Actualizar Colores de Marca y Superficies</name>
  <files>app/src/index.css</files>
  <action>
    - Reemplazar `--color-primary` (y variantes cercanas como `--color-primary-dim`, `--color-primary-container`, `--color-primary-fixed`) con el púrpura principal de Veló: `#6B4FD8`, `#9E8AEB`, `#C4B9F0`, `#EDE9FB`.
    - Actualizar `--color-background`, `--color-surface` para la variante `.light` a `#f7f7f5` y `#ffffff`.
    - Actualizar `--color-on-surface` en `.light` al negro neutro `#1a1a1a`.
    - Configurar colores de éxito/acento (si existen en el tema) al verde `#2E8B57`.
    - Ajustar la clase `.animate-logo-pulse` para mantener el efecto breathing si se hizo algún cambio.
  </action>
  <verify>grep -i "6B4FD8" src/index.css</verify>
  <done>Los colores primarios, textos y superficies coinciden con la paleta de la guía Veló.</done>
</task>

## Success Criteria
- [ ] La fuente de la aplicación es nativa del sistema (`system-ui`).
- [ ] El tema claro refleja la estética "blanco hueso" de la guía.
- [ ] Los botones primarios y acentos visuales usan el púrpura Veló.
