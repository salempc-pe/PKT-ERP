---
phase: 59
plan: 1
wave: 1
---

# Plan 59.1: Estandarización de Kanban de Proyectos con Colores del Pipeline CRM

## Objective
Modificar el tablero Kanban de Proyectos (`ProjectKanban.jsx`) para que sus columnas y la decoración de las tarjetas de tareas utilicen exactamente los mismos fondos lilas/morados/azules estilizados que usa el Pipeline del CRM, garantizando uniformidad cromática y una estética sofisticada.

## Context
- .gsd/SPEC.md
- src/modules/client/crm/CRMModule.jsx
- src/modules/client/projects/ProjectKanban.jsx

## Tasks

<task type="auto">
  <name>Homologar paleta cromática de columnas Kanban en Proyectos</name>
  <files>src/modules/client/projects/ProjectKanban.jsx</files>
  <action>
    Actualizar el arreglo `columns` en `ProjectKanban.jsx` (línea 36) para reemplazar las clases de fondo genéricas de Tailwind por colores específicos calibrados del CRM:
    - Cambiar `todo` con color `bg-slate-500` a `bg-[#a3aac4]` (Lila Grisáceo de Prospecto).
    - Cambiar `in_progress` con color `bg-blue-500` a `bg-[#6B4FD8]` (Morado Principal de Veló).
    - Cambiar `done` con color `bg-emerald-500` a `bg-[#5391ff]` (Azul de Ganado).
    
    Evitar colores planos o por defecto de Tailwind para mantener la estética premium de la plataforma.
  </action>
  <verify>Ejecutar npm run build para verificar que compila correctamente.</verify>
  <done>
    El arreglo de columnas en `ProjectKanban.jsx` define los colores como '#a3aac4', '#6B4FD8' y '#5391ff'.
  </done>
</task>

<task type="auto">
  <name>Sincronizar decoración e indicadores táctiles de tarjetas de tareas</name>
  <files>src/modules/client/projects/ProjectKanban.jsx</files>
  <action>
    Ajustar el renderizado de la tarjeta de tarea en `ProjectKanban.jsx` (alrededor de la línea 191) para garantizar que los indicadores laterales y los badges de prioridad coincidan estéticamente:
    - Asegurar que la barra lateral decorativa (`absolute top-0 left-0 w-1 h-full opacity-20`) responda con exactitud al color de su respectiva etapa unificada.
    - Asegurar que el badge de prioridad media use el color canónico morado `#6B4FD8` de forma homogénea en la función `getPriorityBadge`.
  </action>
  <verify>Visualizar localmente que las tarjetas tengan los bordes estilizados correctos de 1px con border-[var(--color-outline-variant)].</verify>
  <done>
    Las tarjetas en el Kanban de Proyectos se renderizan con los colores sincronizados del pipeline y no presentan desfases estéticos.
  </done>
</task>

## Success Criteria
- [ ] Las columnas de tareas del Kanban de Proyectos usan la paleta cromática de CRM: '#a3aac4', '#6B4FD8' y '#5391ff'.
- [ ] La decoración de la barra de color izquierda de cada tarjeta se alinea con la etapa en la que se encuentra.
