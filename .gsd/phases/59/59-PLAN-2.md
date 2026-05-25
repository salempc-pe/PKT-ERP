---
phase: 59
plan: 2
wave: 1
---

# Plan 59.2: Estandarización Milimétrica de Botones y Pastillas en Módulo de Proyectos

## Objective
Refinar los botones de acción primarios/secundarios, pestañas superiores y layouts del listado de proyectos (`ProjectModule.jsx`), e implementar el diseño de pastillas flotantes con franja izquierda de color para lograr consistencia pixel-perfect con el módulo CRM de Veló.

## Context
- .gsd/SPEC.md
- src/modules/client/projects/ProjectModule.jsx
- src/modules/client/projects/ProjectKanban.jsx

## Tasks

<task type="auto">
  <name>Estandarizar listado de proyectos con diseño de pastilla de franja izquierda</name>
  <files>src/modules/client/projects/ProjectModule.jsx</files>
  <action>
    Modificar el renderizado de las tarjetas en la lista principal de proyectos en `ProjectModule.jsx` para alinearse con la base de contactos del CRM:
    - Diseñar una tarjeta de proyecto flotante compacta, reemplazando bordes o sombras excesivas por un borde sutil `border-[var(--color-outline-variant)]`.
    - Incorporar una franja lateral decorativa de color en la parte izquierda de cada tarjeta (`absolute top-0 left-0 w-1.5 h-full bg-[#6B4FD8] rounded-l-2xl`) para replicar el estilo de pastilla de contacto e interactores del CRM.
  </action>
  <verify>Ejecutar npm run build para verificar que el empaquetador compile sin errores.</verify>
  <done>
    Las tarjetas de proyectos en la vista principal (`ProjectModule.jsx`) se renderizan como pastillas con franja izquierda de color.
  </done>
</task>

<task type="auto">
  <name>Homologar botones, selectores y pestañas del tope de página</name>
  <files>
    src/modules/client/projects/ProjectKanban.jsx
    src/modules/client/projects/ProjectModule.jsx
  </files>
  <action>
    Refinar los componentes interactivos del tope en el módulo de proyectos para asegurar uniformidad:
    - Asegurar que los botones principales ("Nuevo Proyecto", "Nueva Tarea") tengan los paddings, bordes redondeados y efectos hover estandarizados: `bg-[#6B4FD8] text-[#002150] font-bold hover:shadow-[0_0_20px_rgba(133,173,255,0.3)] transition-all`.
    - Normalizar el selector de pestañas (Tablero, GANTT, Horas, Documentos) en `ProjectKanban.jsx` con `bg-[var(--color-surface-container)]/50 rounded-xl border border-[var(--color-outline-variant)]` en su contenedor y la clase `activeTab === tab.id ? 'bg-[#6B4FD8] text-[#002150]' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'` en sus botones.
    - Asegurar que el selector responsivo móvil en pantallas pequeñas use un dropdown `<select>` idéntico al estándar canónico móvil del CRM.
  </action>
  <verify>Comprobar la responsividad de los selectores superiores de pestañas en dispositivos simulados con targets de click de 44px.</verify>
  <done>
    Los selectores superiores y botones principales de proyectos usan la misma estructura de CSS, variables cromáticas y targets que el módulo CRM.
  </done>
</task>

## Success Criteria
- [ ] Las tarjetas de proyectos en la vista principal usan el diseño de pastilla flotante con franja de color en su izquierda.
- [ ] Los selectores superiores (tabs) y botones CTAs principales en Proyectos usan la paleta morada canónica `#6B4FD8` de Veló con textos `#002150`.
- [ ] El selector responsivo móvil de Proyectos utiliza el componente `<select>` unificado de alta densidad táctil.
