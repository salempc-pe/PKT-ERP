---
phase: 8
plan: 3
wave: 2
---

# Plan 8.3: Integración, Navegación y Dashboard

## Objective
Conectar el módulo de proyectos al sistema global, habilitando el acceso desde el menú lateral y mostrando KPIs relevantes en el dashboard principal.

## Context
- src/layouts/client/ClientLayout.jsx
- src/App.jsx
- src/modules/client/dashboard/DashboardModule.jsx

## Tasks

<task type="auto">
  <name>Configuración de Rutas y Menú</name>
  <files>src/App.jsx, src/layouts/client/ClientLayout.jsx</files>
  <action>
    - Registrar la ruta `/client/projects` en `App.jsx`.
    - Añadir el ítem "Gestión de Proyectos" al Sidebar en `ClientLayout.jsx` (debajo de CRM).
    - Usar icono `Briefcase` o `Layers` de Lucide.
  </action>
  <verify>Navigation to /client/projects works from the sidebar.</verify>
  <done>El módulo es accesible desde la navegación principal.</done>
</task>

<task type="auto">
  <name>KPIs de Proyectos en Dashboard</name>
  <files>src/modules/client/dashboard/DashboardModule.jsx</files>
  <action>
    - Integrar el hook `useProjects` en el dashboard.
    - Mostrar una tarjeta resumen con: "Proyectos Activos", "% de Tareas Completadas" y "Tareas Críticas".
    - Asegurar que los datos sean reactivos.
  </action>
  <verify>Dashboard shows project-related stats.</verify>
  <done>El Dashboard principal refleja la actividad del módulo de proyectos.</done>
</task>

## Success Criteria
- [ ] Acceso directo desde el menú lateral.
- [ ] Dashboard actualizado con métricas de proyectos en tiempo real.
- [ ] Flujo de navegación fluido entre proyectos y tablero.
