---
phase: 11
plan: 2
wave: 1
---

# Plan 11.2: UI Administrador (Gestión de Planes y Cuotas)

## Objective
Permitir al administrador ver y cambiar el plan de suscripción de cada organización desde el panel de gestión de clientes.

## Context
- src/modules/admin/clients/AdminClients.jsx
- src/context/AuthContext.jsx

## Tasks

<task type="auto">
  <name>Visualización de Plan en Lista</name>
  <files>src/modules/admin/clients/AdminClients.jsx</files>
  <action>
    Actualizar la tarjeta de organización para mostrar el nombre del plan actual (ej. badge "Startup" o "Business") junto al ID de la organización.
  </action>
  <verify>grep "org.subscription" src/modules/admin/clients/AdminClients.jsx</verify>
  <done>El plan es visible en cada tarjeta de cliente.</done>
</task>

<task type="auto">
  <name>Selector de Plan en Editar Organización</name>
  <files>src/modules/admin/clients/AdminClients.jsx</files>
  <action>
    1. Añadir un selector (select/dropdown) en el modal de edición para elegir entre los niveles de SUBSCRIPTION_PLANS.
    2. Conectar el cambio con la función adminUpdateOrgPlan de AuthContext.
  </action>
  <verify>grep "adminUpdateOrgPlan" src/modules/admin/clients/AdminClients.jsx</verify>
  <done>El administrador puede cambiar el plan de una organización desde el modal de edición.</done>
</task>

## Success Criteria
- [ ] El administrador puede ver el plan actual de todas las organizaciones de un vistazo.
- [ ] El cambio de plan en el modal de edición persiste correctamente.
