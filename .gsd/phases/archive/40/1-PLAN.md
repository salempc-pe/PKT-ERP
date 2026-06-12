---
phase: 40
plan: 1
wave: 1
---

# Plan 40.1: Capa de Datos para Logs y Scoring

## Objective
Extender el modelo de datos del CRM (`useCrm`) para soportar etiquetas dinámicas (tags), puntuación comercial (lead scoring) y registro cronológico de interacciones.

## Context
- .gsd/SPEC.md
- src/modules/client/crm/useCrm.js

## Tasks

<task type="auto">
  <name>Actualizar useCrm.js con nuevos esquemas y funciones</name>
  <files>src/modules/client/crm/useCrm.js</files>
  <action>
    - Actualizar `ContactSchema` y `LeadSchema` añadiendo los campos `tags` (z.array(z.string()).default([])) y `score` (z.number().default(0)).
    - Crear `InteractionSchema` para validar interacciones (type: enum ['Llamada', 'Correo', 'Reunión', 'Nota'], date, notes, contactId, leadId).
    - Añadir una nueva función `addInteraction` que agregue un documento a `organizations/{orgId}/interactions` y que aumente el `score` del Lead o Contacto asociado (+10 puntos por interacción, por ejemplo).
    - Añadir suscripción a la colección `interactions` filtrada por `orgId` en `useCrm`, y retornar `interactions` en el hook.
    - Asegurarse de retornar también la nueva función en el hook.
  </action>
  <verify>grep -q "InteractionSchema" src/modules/client/crm/useCrm.js && grep -q "addInteraction" src/modules/client/crm/useCrm.js</verify>
  <done>El hook useCrm expone interactions y la función addInteraction, y los esquemas soportan tags y score.</done>
</task>

## Success Criteria
- [ ] `useCrm` provee la lista reactiva de interacciones.
- [ ] La función `addInteraction` guarda en Firestore y actualiza el score del lead/contacto.
