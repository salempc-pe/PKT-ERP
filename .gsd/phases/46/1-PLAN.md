---
phase: 46
plan: 1
wave: 1
---

# Plan 46.1: Project Data Layer (Gantt, Timesheet & Docs Schema)

## Objective
Actualizar el data layer de proyectos (`useProjects.js`) para soportar fechas exactas y dependencias en las tareas (para el Gantt), y añadir las funciones/estructuras necesarias para registrar tiempos (Timesheet) y subir documentos (Docs).

## Context
- .gsd/SPEC.md
- src/modules/client/projects/useProjects.js

## Tasks

<task type="auto">
  <name>Actualizar esquema de Tareas</name>
  <files>src/modules/client/projects/useProjects.js</files>
  <action>
    - Modificar la función `addTask` y el mock data para incluir `startDate` (fecha actual por defecto), `dueDate` (fecha + 7 días por defecto), `progress` (0) y `dependencies` (array vacío).
    - Asegurar que `updateTask` permita actualizar todos estos nuevos campos correctamente.
  </action>
  <verify>grep -q "startDate" src/modules/client/projects/useProjects.js</verify>
  <done>El esquema de tareas ahora soporta fechas de inicio, fin, progreso y dependencias.</done>
</task>

<task type="auto">
  <name>Añadir capa de datos para Timesheets</name>
  <files>src/modules/client/projects/useProjects.js</files>
  <action>
    - Crear nuevo state `timesheets` y una suscripción a la colección `organizations/{orgId}/projects/{activeProjectId}/timesheets` o `organizations/{orgId}/timesheets` filtrada por `projectId`.
    - Añadir función `addTimesheetEntry(entryData)` que guarde `taskId, userId, date, hours, description`.
    - Añadir función `deleteTimesheetEntry(entryId)`.
  </action>
  <verify>grep -q "addTimesheetEntry" src/modules/client/projects/useProjects.js</verify>
  <done>Se pueden registrar y leer entradas de tiempo para el proyecto activo.</done>
</task>

<task type="auto">
  <name>Añadir capa de datos para Gestión Documental</name>
  <files>src/modules/client/projects/useProjects.js</files>
  <action>
    - Crear nuevo state `projectDocuments` y una suscripción correspondiente a `organizations/{orgId}/project_documents`.
    - Añadir función `addProjectDocument(docData)` para guardar referencias (nombre, url, tipo, etc.).
    - Añadir función `deleteProjectDocument(docId)`.
  </action>
  <verify>grep -q "addProjectDocument" src/modules/client/projects/useProjects.js</verify>
  <done>El hook expone métodos y el estado para gestionar los documentos del proyecto.</done>
</task>

## Success Criteria
- [ ] El hook `useProjects` exporta `timesheets`, `projectDocuments`, `addTimesheetEntry`, `addProjectDocument` y maneja los nuevos campos de tareas.
