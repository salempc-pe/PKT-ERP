---
phase: 2
plan: 2
wave: 1
---

# Plan 2.2: Lógica de Estado y CRUD del CRM

## Objective
Desarrollar un Hook personalizado de React (`useCrm`) que provea la lógica de operaciones CRUD centralizada para Contactos y Leads desde Firestore. 

## Context
- .gsd/ARCHITECTURE.md
- .gsd/ROADMAP.md
- src/services/firebase.js

## Tasks

<task type="auto">
  <name>Implementar Módulo de Consultas (useCrm Hook)</name>
  <files>
    - src/hooks/useCrm.js
  </files>
  <action>
    - Diseñar e implementar el custom hook `useCrm.js`.
    - Crear referencias a las colecciones Firestore: `/organizations/{orgId}/contacts` y `/organizations/{orgId}/leads`. Dado que no hay Auth real aún, usar una simulación de id como "default_org" por defecto si no lo pasa AuthContext.
    - Exportar funciones: `getContacts`, `addContact`, `getLeads`, `addLead`, `updateLeadStatus` (para Moverlos de columna Kanban).
    - Hacer que las subscripciones (`getContacts`, `getLeads`) usen `onSnapshot` de Firestore para Reactivity en tiempo real, guardando los datos en estado de React local dentro del hook y exponiéndolos (junto con flags `loading` y `error`).
  </action>
  <verify>Get-Content src/hooks/useCrm.js</verify>
  <done>El módulo define al menos 5 funciones claras que mutan/escuchan Firestore en base a `organizationId`.</done>
</task>

## Success Criteria
- [ ] Hook interacciona exitosamente con `firebase.js`.
- [ ] Datos reaccionan al instante ante cambios gracias al `onSnapshot`.
