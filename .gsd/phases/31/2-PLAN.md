---
phase: 31
plan: 2
wave: 2
---

# Plan 31.2: Implementación de PWA y Logo Provisional

## Objective
Convertir la aplicación en una PWA (Progressive Web App) para que sea instalable en dispositivos móviles como una app nativa, proveyendo un archivo de manifiesto (`manifest.json`), un service worker básico y generando un logo provisional.

## Context
- .gsd/ROADMAP.md
- index.html
- vite.config.js (si existe) o package.json

## Tasks

<task type="auto">
  <name>Generar Logo Provisional</name>
  <files>
    - public/pwa-192x192.png
    - public/pwa-512x512.png
  </files>
  <action>
    - Utilizar la herramienta `generate_image` (si está disponible en el entorno) para generar un logo cuadrado simple, estético, minimalista y profesional para el ERP.
    - Si no se puede generar mediante IA, crear un archivo SVG base con las siglas "PKT" y guardarlo en la carpeta `public/`.
    - Asegurarse de tener al menos dos resoluciones de icono referenciadas en el directorio `public/` (ej. 192x192 y 512x512) para que el manifest sea válido. (Se puede redimensionar o usar un SVG convertido a formato base en la medida de lo posible).
  </action>
  <verify>Verificar que existan los archivos gráficos en el directorio public.</verify>
  <done>Se han creado los iconos provisionales requeridos para el manifiesto PWA.</done>
</task>

<task type="auto">
  <name>Configurar Vite PWA y Manifiesto</name>
  <files>
    - package.json
    - vite.config.js
    - index.html
  </files>
  <action>
    - Instalar el plugin `vite-plugin-pwa` usando npm (`npm install -D vite-plugin-pwa`).
    - Configurar `vite.config.js` importando y agregando el plugin `VitePWA`.
    - Configurar el manifiesto dentro del plugin con `name: 'PKT ERP'`, `short_name: 'PKT'`, `theme_color: '#091328'`, `background_color: '#060e20'`, `display: 'standalone'` y registrar los iconos creados.
    - Importar el registro del service worker (puede ser inyectado automáticamente por el plugin).
  </action>
  <verify>Ejecutar `npm run build` o inspeccionar el código de configuración de Vite para confirmar que el plugin está integrado sin errores.</verify>
  <done>La aplicación cuenta con las directivas PWA necesarias para ser instalada en móviles.</done>
</task>

## Success Criteria
- [ ] La aplicación tiene un `manifest.webmanifest` o `manifest.json` válido (generado por Vite PWA).
- [ ] Iconos provisionales en formato PNG/SVG están ubicados en `/public`.
- [ ] La configuración PWA tiene `display: standalone` para esconder las barras de navegación.
