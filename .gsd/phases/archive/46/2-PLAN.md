---
phase: 46
plan: 2
wave: 1
---

# Plan 46.2: UI - Gantt y Timesheet

## Objective
Implementar la vista de Gantt (usando CSS Grid para máxima customización) y la vista de Timesheet dentro del detalle del proyecto, permitiendo conmutar entre Kanban, Gantt y otras pestañas.

## Context
- .gsd/SPEC.md
- src/modules/client/projects/ProjectKanban.jsx
- src/modules/client/projects/ProjectGantt.jsx (Nuevo)

## Tasks

<task type="auto">
  <name>Refactorizar Navegación en ProjectKanban</name>
  <files>src/modules/client/projects/ProjectKanban.jsx</files>
  <action>
    - Añadir un selector de vistas/tabs (Ej: "Tablero", "Gantt", "Horas", "Documentos") en la cabecera de `ProjectKanban`.
    - Separar el contenido actual del Kanban en su propia sub-sección para poder renderizar condicionalmente el Gantt o los documentos.
  </action>
  <verify>grep -q "Tablero" src/modules/client/projects/ProjectKanban.jsx</verify>
  <done>La interfaz permite cambiar entre Tablero, Gantt y otros tabs manteniendo el contexto del proyecto activo.</done>
</task>

<task type="auto">
  <name>Crear ProjectGantt</name>
  <files>src/modules/client/projects/ProjectGantt.jsx</files>
  <action>
    - Crear el componente `ProjectGantt` que reciba las tareas y permita renderizar una cuadrícula temporal (ej: vista por meses/semanas) usando Tailwind CSS Grid.
    - Cada tarea debe representarse como una barra horizontal basada en su `startDate` y `dueDate`.
    - (Opcional) Implementar visualización de `progress` dentro de la barra de la tarea.
    - Integrarlo en `ProjectKanban` bajo el tab "Gantt".
  </action>
  <verify>test -f src/modules/client/projects/ProjectGantt.jsx</verify>
  <done>Existe una vista Gantt funcional e integrada que visualiza las fechas de las tareas.</done>
</task>

<task type="auto">
  <name>Implementar Vista Timesheet</name>
  <files>
    src/modules/client/projects/ProjectTimesheet.jsx
    src/modules/client/projects/ProjectKanban.jsx
  </files>
  <action>
    - Crear `ProjectTimesheet.jsx` para listar las horas registradas del proyecto (consumiendo `timesheets` del hook).
    - Añadir un botón flotante o un modal simple para agregar nuevas entradas de horas (`taskId`, `hours`, `description`, `date`).
    - Integrarlo en `ProjectKanban` bajo el tab "Horas".
  </action>
  <verify>test -f src/modules/client/projects/ProjectTimesheet.jsx</verify>
  <done>Los usuarios pueden registrar y ver las horas trabajadas en las tareas del proyecto.</done>
</task>

## Success Criteria
- [ ] La vista de detalle del proyecto tiene un selector de Tabs (Kanban, Gantt, Horas).
- [ ] La vista Gantt renderiza las tareas en una línea de tiempo horizontal.
- [ ] La vista de Horas permite ingresar y visualizar registros de tiempos.
