---
phase: 40
plan: 2
wave: 1
---

# Plan 40.2: UI - Segmentación y Lead Scoring

## Objective
Visualizar y permitir la edición de etiquetas (tags) y mostrar el puntaje comercial (score) en las tarjetas de Leads y lista de Contactos en la interfaz principal del CRM.

## Context
- src/modules/client/crm/CRMModule.jsx

## Tasks

<task type="auto">
  <name>Añadir visualización de tags y score en UI</name>
  <files>src/modules/client/crm/CRMModule.jsx</files>
  <action>
    - En la vista de pipeline (`activeTab === 'pipeline'`), renderizar los `tags` como pequeños badges coloridos debajo de la empresa del Lead. Renderizar el `score` en la esquina superior derecha (ej. un ícono de fuego con el número).
    - En la vista de contactos (`activeTab === 'contacts'`), agregar una columna para `Tags/Score` y renderizar esa información.
  </action>
  <verify>grep -q "score" src/modules/client/crm/CRMModule.jsx</verify>
  <done>Las tarjetas de leads y la tabla de contactos muestran visualmente el score y los tags asignados.</done>
</task>

<task type="auto">
  <name>Añadir input de Tags en Modal de Formulario</name>
  <files>src/modules/client/crm/CRMModule.jsx</files>
  <action>
    - En el modal de formulario (`showModal`), agregar un campo (texto simple separado por comas o selectores predefinidos) para capturar o editar las etiquetas (`tags`).
    - Parsear las etiquetas ingresadas al hacer submit (ej. dividir por comas, trim, filtrar vacíos) antes de llamar a `updateLead`/`updateContact`.
  </action>
  <verify>grep -q "tags" src/modules/client/crm/CRMModule.jsx</verify>
  <done>El usuario puede asignar etiquetas al crear o editar un prospecto/contacto.</done>
</task>

## Success Criteria
- [ ] La UI muestra el lead scoring de forma intuitiva.
- [ ] Las etiquetas son visibles y editables desde el modal de edición de entidades.
