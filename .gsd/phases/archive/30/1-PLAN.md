---
phase: 30
plan: 1
wave: 1
---

# Plan 30.1: Rediseño del Menú Móvil y Subtítulos

## Objective
Mejorar la usabilidad del menú en dispositivos móviles evitando que el botón hamburguesa superponga y tape los títulos principales, y limpiar la interfaz eliminando el subtítulo redundante "Empresa Verificada".

## Context
- .gsd/ROADMAP.md
- src/layouts/client/ClientLayout.jsx

## Tasks

<task type="auto">
  <name>Ajustar Menú Hamburguesa en Móvil</name>
  <files>
    - src/layouts/client/ClientLayout.jsx
  </files>
  <action>
    - Modificar la estructura o las clases CSS (ej. agregar `pt-20` en `<main>` o ajustar el posicionamiento) para asegurar que el botón hamburguesa (actualmente `fixed top-6 left-6`) no tape el contenido ni los títulos superiores en pantallas pequeñas (`lg:hidden`).
    - Puedes optar por crear una barra superior (header móvil) dedicada o agregar padding adecuado al main container.
  </action>
  <verify>npm run dev y revisar en modo responsivo que los títulos sean 100% visibles y no queden ocultos detrás del botón de menú.</verify>
  <done>El botón hamburguesa está posicionado sin obstruir los títulos superiores de ningún módulo.</done>
</task>

<task type="auto">
  <name>Eliminar Subtítulo "Empresa Verificada"</name>
  <files>
    - src/layouts/client/ClientLayout.jsx
  </files>
  <action>
    - Localizar y eliminar el elemento `<p>` que contiene el texto "Empresa Verificada".
    - Mantener solo el nombre de la empresa como título principal en esa sección.
  </action>
  <verify>Revisar el Sidebar para confirmar la ausencia del texto "Empresa Verificada".</verify>
  <done>El subtítulo "Empresa Verificada" ya no existe en el código ni en la UI.</done>
</task>

## Success Criteria
- [ ] Los títulos de los módulos no son tapados por el menú hamburguesa en mobile.
- [ ] El Sidebar se muestra más limpio sin la etiqueta de "Empresa Verificada".
