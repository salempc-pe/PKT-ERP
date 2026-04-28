---
phase: 8
plan: 2
wave: 1
---

# Plan 8.2: Tablero Kanban y Gestión de Tareas

## Objective
Implementar la gestión de tareas dentro de cada proyecto mediante un tablero Kanban interactivo para el seguimiento de progreso.

## Context
- .gsd/phases/8/RESEARCH.md
- src/modules/client/projects/useProjects.js
- src/modules/client/crm/CRMModule.jsx (referencia de Kanban)

## Tasks

<task type="auto">
  <name>Extensión de useProjects para Tareas</name>
  <files>src/modules/client/projects/useProjects.js</files>
  <action>
    - Añadir soporte para la colección `organizations/{orgId}/tasks`.
    - Implementar `addTask`, `updateTaskStatus` y `deleteTask`.
    - Asegurar que las tareas se filtren por `projectId`.
    - Mantener sincronización en tiempo real.
  </action>
  <verify>Check hook for task-related exports.</verify>
  <done>El hook permite gestionar tareas vinculadas a proyectos.</done>
</task>

<task type="auto">
  <name>Componente ProjectKanban y Detalle</name>
  <files>src/modules/client/projects/ProjectKanban.jsx</files>
  <action>
    - Crear una vista de detalle para un proyecto seleccionado.
    - Implementar columnas Kanban (To Do, In Progress, Done).
    - Tarjetas de tareas con prioridad y responsable.
    - Modal de "Añadir Tarea".
  </action>
  <verify>Visual check of the Kanban board.</verify>
  <done>Es posible ver el tablero Kanban de un proyecto y mover tareas de estado.</done>
</task>

## Success Criteria
- [ ] Tareas persistidas correctamente con referencia a su proyecto.
- [ ] UI de Kanban fluida con cambios de estado reactivos.
- [ ] Integración de modal de creación de tareas.
