# Summary: Plan 8.2

## Entregables
- [x] Extensión del hook `useProjects.js` para soportar tareas vinculadas a proyectos.
- [x] Componente `ProjectKanban.jsx` con columnas To Do, In Progress y Done.
- [x] Integración de modal de tareas y cambio de estado reactivo.

## Detalles Técnicos
- Las tareas se almacenan en `organizations/{orgId}/tasks` con una clave externa `projectId`.
- El tablero Kanban permite mover tareas entre estados mediante controles intuitivos.
- Soporte completo para Mock Mode con datos pre-cargados al seleccionar un proyecto.
