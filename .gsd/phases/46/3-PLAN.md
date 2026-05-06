---
phase: 46
plan: 3
wave: 2
---

# Plan 46.3: Gestión Documental de Proyectos

## Objective
Implementar la interfaz para subir, visualizar y gestionar los archivos técnicos, planos y contratos de un proyecto específico, similar al patrón usado en el módulo de Inmobiliaria.

## Context
- .gsd/SPEC.md
- src/modules/client/projects/ProjectDocuments.jsx (Nuevo)
- src/modules/client/projects/ProjectKanban.jsx

## Tasks

<task type="auto">
  <name>Crear UI de Repositorio de Documentos</name>
  <files>
    src/modules/client/projects/ProjectDocuments.jsx
    src/modules/client/projects/ProjectKanban.jsx
  </files>
  <action>
    - Crear `ProjectDocuments.jsx` para mostrar los documentos asociados al proyecto en forma de grid o lista.
    - Implementar un área de drag & drop o botón de subida que utilice la lógica simulada o real (a través del hook, posiblemente convirtiendo a Base64 o URLs falsas en modo local, o storage real en producción si está configurado).
    - Integrarlo en el tab "Documentos" de `ProjectKanban.jsx`.
  </action>
  <verify>test -f src/modules/client/projects/ProjectDocuments.jsx</verify>
  <done>La sección de documentos lista archivos y permite "subir" nuevos documentos (o simular su subida).</done>
</task>

<task type="auto">
  <name>Detalle de Tarea - Modal Extendido</name>
  <files>src/modules/client/projects/ProjectKanban.jsx</files>
  <action>
    - Modificar el modal de creación/edición de Tarea en `ProjectKanban.jsx` para permitir la edición de `startDate`, `dueDate`, `progress`, y `dependencies`.
    - Esto conecta la capa de UI con la capa de datos extendida implementada en el Plan 46.1, asegurando que el Gantt reciba la data correcta.
  </action>
  <verify>grep -q "startDate" src/modules/client/projects/ProjectKanban.jsx</verify>
  <done>El modal de tareas permite establecer fechas y dependencias.</done>
</task>

## Success Criteria
- [ ] La pestaña "Documentos" permite gestionar archivos del proyecto.
- [ ] Se pueden editar completamente las fechas y atributos de una tarea desde la UI.
