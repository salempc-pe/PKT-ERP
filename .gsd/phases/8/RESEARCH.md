# Research: Phase 8 — Gestión de Proyectos

## Contexto
El módulo de Gestión de Proyectos debe permitir a los usuarios (Tenants) organizar su trabajo en tableros visuales. Siguiendo la estética **ArchitectOS** (estilo Apple/Linear, glassmorphism, sombras suaves), implementaremos un sistema de proyectos con tareas anidadas.

## Arquitectura de Datos (Firestore)
Para mantener consistencia con las fases anteriores, utilizaremos `orgId` (organizationId) como aislante principal.

- **Colección: `projects`**
  - Path: `organizations/{orgId}/projects/{projectId}`
  - Campos: 
    - `name` (string)
    - `description` (string)
    - `status` (enum: `active`, `paused`, `completed`)
    - `color` (string - para personalización visual)
    - `progress` (number - calculado dinámicamente o persistido)
    - `createdAt` (serverTimestamp)

- **Colección: `tasks`**
  - Path: `organizations/{orgId}/tasks/{taskId}`
  - Campos:
    - `projectId` (string - FK)
    - `title` (string)
    - `status` (enum: `todo`, `in_progress`, `done`)
    - `priority` (enum: `low`, `medium`, `high`)
    - `assignedTo` (string - ID de usuario o nombre)
    - `dueDate` (timestamp)
    - `createdAt` (serverTimestamp)

## UI/UX — "Kanban Pro"
1. **Vista de Lista de Proyectos**: Grid de tarjetas con efecto glassmorphism. Muestra progreso visual (barra de progreso).
2. **Vista de Tablero (Kanban)**:
   - Columnas fijas: "Por Hacer", "En Curso", "Finalizado".
   - Drag & Drop (simulado o simple mediante botones de cambio de estado para evitar dependencias pesadas en esta fase, similar al CRM).
   - Filtros rápidos por prioridad.

## Desafíos Técnicos
- **Cálculo de Progreso**: El porcentaje de completitud del proyecto debe basarse en la proporción de tareas `done`. 
- **Integración**: Conectar con `DashboardModule` para mostrar "Proyectos Activos" y "Tareas Pendientes".

## Conclusión
La implementación seguirá el patrón de Hooks Reactivos (`useProjects`) y Componentes Modulares, asegurando que funcione tanto en modo Mock (desarrollo local sin Firebase) como en Producción.
