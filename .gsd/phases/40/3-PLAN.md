---
phase: 40
plan: 3
wave: 2
---

# Plan 40.3: UI - Historial de Interacciones

## Objective
Implementar un componente lateral (Drawer o Modal lateral) para visualizar el log cronológico de interacciones de un lead/contacto específico y permitir registrar nuevas interacciones que aumenten el Lead Score.

## Context
- src/modules/client/crm/InteractionHistory.jsx (Nuevo archivo)
- src/modules/client/crm/CRMModule.jsx

## Tasks

<task type="auto">
  <name>Crear Componente InteractionHistory</name>
  <files>src/modules/client/crm/InteractionHistory.jsx</files>
  <action>
    - Crear un componente funcional que reciba `entity` (contacto o lead), `interactions` (array filtrado por esa entidad), `onClose` (función) y `onAddInteraction` (función).
    - El componente debe ser un panel lateral (drawer) superpuesto o un modal grande.
    - Debe renderizar un Timeline cronológico de las interacciones pasadas.
    - Debe incluir un formulario rápido en la parte superior/inferior para agregar una nueva interacción (Selector de Tipo: 'Llamada', 'Correo', 'Reunión', y un campo de notas de texto).
  </action>
  <verify>grep -q "InteractionHistory" src/modules/client/crm/InteractionHistory.jsx</verify>
  <done>El componente `InteractionHistory` renderiza correctamente el timeline y el formulario.</done>
</task>

<task type="auto">
  <name>Integrar Historial en CRMModule</name>
  <files>src/modules/client/crm/CRMModule.jsx</files>
  <action>
    - Importar `InteractionHistory`.
    - Añadir estado para `selectedEntityForHistory` (lead o contacto seleccionado).
    - Añadir un botón o hacer clickeable la tarjeta/fila para abrir el Historial de Interacciones.
    - Pasar las interacciones correspondientes (filtrando el estado `interactions` global por `contactId` o `leadId`) y la función `addInteraction` del hook `useCrm`.
  </action>
  <verify>grep -q "InteractionHistory" src/modules/client/crm/CRMModule.jsx</verify>
  <done>Al hacer clic en un lead o contacto, se abre su historial de interacciones funcional.</done>
</task>

## Success Criteria
- [ ] Es posible ver el historial de comunicaciones por cada cliente.
- [ ] Registrar una nueva llamada o correo impacta positivamente el score del cliente en tiempo real.
