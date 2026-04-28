---
phase: 13
plan: 2
wave: 1
---

# Plan 13.2: Controles de Impersonation en Admin UI

## Objective
Añadir el botón dentro de la gestión de clientes que desencadena el flujo diseñado en el Plan 13.1.

## Context
- src/modules/admin/clients/AdminClients.jsx

## Tasks

<task type="auto">
  <name>Botón "Entrar como Cliente"</name>
  <files>src/modules/admin/clients/AdminClients.jsx</files>
  <action>
    - Importar `impersonateUser` desde `useAuth()`.
    - En el listado de usuarios de una organización (dentro del modal de edición o en una vista desplegable si aplica), añadir un botón pequeño (posiblemente un ícono de ojo o "Login As") al lado del nombre del usuario específico.
    - Al hacer clic, ejecutar `impersonateUser(usuario)`.
  </action>
  <verify>grep "impersonateUser" src/modules/admin/clients/AdminClients.jsx</verify>
  <done>El administrador puede elegir un usuario y suplantarlo inmediatamente.</done>
</task>

## Success Criteria
- [ ] Entrar como el cliente abre el dashboard de cliente en la misma pestaña pero bajo la vista del inquilino.
- [ ] Retornar restaura la cuenta de Admin a la perfección.
