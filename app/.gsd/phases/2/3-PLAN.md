---
phase: 2
plan: 3
wave: 2
---

# Plan 2.3: Interfaz Gráfica CRM (Kanban & Tabla)

## Objective
Reemplazar la vista mock actual del Módulo CRM (`src/pages/client/CRMModule.jsx`) por tableros y listados interactivos nutridos por datos en tiempo real mediante `useCrm`. Implementar Kanban dinámico.

## Context
- .gsd/ARCHITECTURE.md
- .gsd/ROADMAP.md
- src/pages/client/CRMModule.jsx
- src/hooks/useCrm.js

## Tasks

<task type="auto">
  <name>Sustitución de Vista e Integración de UI Data</name>
  <files>
    - src/pages/client/CRMModule.jsx
  </files>
  <action>
    - Importar y emplear el hook `useCrm` en `CRMModule.jsx`.
    - Eliminar los arrays hardcoded de prospectos. Reemplazarlos por un mapeo del estado global expuesto por `leads`.
    - Dividir la UI en dos pestañas principales (Tabs): "Pipeline (Kanban)" y "Contactos (Listado)". Usar Tailwind básico y glassmorphism.
    - El Kanban de Pipeline debe organizar cada item según su propiedad `.status` ("prospect", "negotiating", "won", "lost"). Implementar controles nativos visuales con React para mover entre fases.
  </action>
  <verify>Get-Content src/pages/client/CRMModule.jsx</verify>
  <done>Ausencia de datos harcodeados. Componente `CRMModule` despliega las dos vistas principales tabuladas leyendo el estado central.</done>
</task>

<task type="auto">
  <name>Botones Reales y Modales Funcionales</name>
  <files>
    - src/pages/client/CRMModule.jsx
  </files>
  <action>
    - Implementar botones flotantes "+ Añadir Contacto" y "+ Añadir Lead".
    - Desarrollar un diseño in-file modal visual con Tailwind (opacidad y posición fija o absoluta) que use las funciones mutadoras guardadas en `useCrm`: `addContact` y `addLead`. 
    - Validar que los envíos desde el formulario (prevent default submit) muten con éxito en firebase y recarguen UI solos.
  </action>
  <verify>Get-Content src/pages/client/CRMModule.jsx</verify>
  <done>Llamadas reales a base de datos implementadas en callbacks onSubmit de la forma Modal. Diseño modular y atractivo, cuidando UX.</done>
</task>

## Success Criteria
- [ ] Formularios de adición validados visualmente.
- [ ] Interfaz Kanban dividida de Contactos.
- [ ] Total integración Front-to-Blackbox Firebase en CRM.
