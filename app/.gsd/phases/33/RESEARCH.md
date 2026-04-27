# Investigación de Integración de Guía de Marca Veló

## Objetivos
- Alinear la estética de la aplicación con la guía de marca oficial (`velo-brand-guide.html`).

## Hallazgos de la Guía de Marca
1. **Paleta de Colores**:
   - **Primary / Brand**: Púrpura principal `#6B4FD8` (Tints: `#9E8AEB`, `#C4B9F0`, `#EDE9FB`).
   - **Success / Positive**: Verde acento `#2E8B57` (Tints: `#5BAF7E`, `#A8D8BC`, `#E6F5EC`).
   - **Text / UI**: Negro neutro `#1A1A1A` (Tints: `#444444`, `#888888`, `#E8E8E4`).
   - **Background / Surface**: Blanco hueso `#F7F7F5` (Tints: `#FFFFFF`, `#F0F0EC`, `#E8E8E4`).
2. **Tipografía**:
   - Fuente principal: **System UI** (`system-ui, -apple-system, 'Segoe UI', sans-serif`). Se debe eliminar `Manrope`.
   - Fuente monoespaciada para datos/códigos: `'SF Mono', 'Fira Code', monospace`.
3. **Logo**:
   - Tilde en la "ó" de "Veló".
   - Variantes según fondo. (Ya estandarizado en el componente `VeloLogo`).
4. **Espaciado**:
   - Sistema de espaciado base 4px (4, 8, 12, 16, 24, 32, 48, 64). Esto encaja con el estándar de Tailwind (`p-1`, `p-2`, `p-3`, `p-4`, `p-6`, `p-8`, etc.).

## Estado Actual (`index.css`)
- Actualmente se usa `Manrope` para `--font-headline`, `--font-body`, `--font-label`.
- Existe un mapeo complejo de variables `--color-*` basadas en Material Design (azules y violetas oscuros).
- Existen overrides para `.light` (`:root.light`) que cambian los colores a un esquema claro-azulado.
- Hay clases que capturan directamente los hex (`[class*="bg-\[#141f38\]"]`) para forzar cambios de tema. Esto es frágil.

## Recomendaciones de Implementación
1. **Actualizar Tipografía**: Cambiar las variables `--font-*` en `index.css` a `system-ui`.
2. **Reemplazar Colores Base**: Ajustar las variables principales de Tailwind (`--color-primary`, `--color-surface`, etc.) para que utilicen los valores proporcionados en la guía Veló.
   - Modo Oscuro: Mantener los colores de fondo oscuros pero ajustar los tonos de primary a `#6B4FD8` (y sus tints) y success a `#2E8B57`.
   - Modo Claro: Usar el blanco hueso `#F7F7F5` y `#FFFFFF` para superficies.
3. **Limpieza de Tailwind Clases Fijas**: Asegurarnos de que el esquema de Tailwind respete la guía y que el layout principal use las nuevas variables.
