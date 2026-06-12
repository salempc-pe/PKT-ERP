---
phase: 8
plan: 1
wave: 1
---

# Plan 8.1: Backbone de Datos y Listado de Proyectos

## Objective
Establecer la capa de persistencia para proyectos y crear la interfaz inicial de gestión donde el usuario puede ver y crear nuevos proyectos.

## Context
- .gsd/SPEC.md
- .gsd/ARCHITECTURE.md
- src/modules/client/crm/useCrm.js (como referencia de patrón)
- src/layouts/client/ClientLayout.jsx (para menú)

## Tasks

<task type="auto">
  <name>Creación del Hook useProjects (Proyectos)</name>
  <files>src/modules/client/projects/useProjects.js</files>
  <action>
    Crear un hook reactivo que gestione:
    - Lista de proyectos de la organización (`projects`).
    - Métodos `addProject`, `updateProjectStatus` y `deleteProject`.
    - Soporte para modo Mock (si no hay API Key de Firebase).
    - Usar la colección `organizations/{orgId}/projects`.
  </action>
  <verify>Check file existence and check for mock data implementation.</verify>
  <done>El hook exporta proyectos y funciones CRUD operativas.</done>
</task>

<task type="auto">
  <name>Interfaz Base de ProjectModule</name>
  <files>src/modules/client/projects/ProjectModule.jsx</files>
  <action>
    - Diseñar la vista de lista de proyectos usando CSS Grid y Tailwind v4.
    - Implementar tarjetas con "Glassmorphism" y barras de progreso.
    - Añadir Modal para crear nuevo proyecto.
    - Estilo ArchitectOS (Premium).
  </action>
  <verify>Visual verification of the grid and modal.</verify>
  <done>Se visualizan los proyectos y el modal de creación funciona.</done>
</task>

## Success Criteria
- [ ] Hook `useProjects` funcional con persistencia en Firestore (o mock).
- [ ] Grid de proyectos estético y responsivo.
- [ ] Modal de "Nuevo Proyecto" conectado al hook.
