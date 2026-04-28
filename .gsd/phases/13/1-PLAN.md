---
phase: 13
plan: 1
wave: 1
---

# Plan 13.1: Lógica de Impersonation y Banner

## Objective
Proporcionar la mecánica en AuthContext para cambiar entre cuentas libremente y mostrar de forma persistente la advertencia estructural en el Layout del cliente.

## Context
- src/context/AuthContext.jsx
- src/layouts/client/ClientLayout.jsx
- .gsd/phases/13/RESEARCH.md

## Tasks

<task type="auto">
  <name>Lógica de Suplantación en AuthContext</name>
  <files>src/context/AuthContext.jsx</files>
  <action>
    - Crear `impersonateUser(targetUser)`: 
      - Guardar `user` actual en sessionStorage bajo `pkt_original_admin`.
      - Preparar al cliente (`targetUser`) con su objeto de `subscription` vinculado (idéntico a como se hace en `login`).
      - Establecer al cliente como `user` en sessionStorage (`pkt_user`) y react state.
      - Redirigir a `/client/dashboard`.
    - Crear `stopImpersonation()`:
      - Leer y restaurar `pkt_original_admin` al estado `user` y `pkt_user`.
      - Eliminar `pkt_original_admin`.
      - Redirigir a `/admin/clientes` o volver.
    - Exportar además un bool `isImpersonating` (true si pkt_original_admin existe).
  </action>
  <verify>grep "impersonateUser" src/context/AuthContext.jsx</verify>
  <done>Las funciones de suplantación están definidas y exportadas correctamente.</done>
</task>

<task type="auto">
  <name>Banner de Suplantación Global</name>
  <files>src/layouts/client/ClientLayout.jsx</files>
  <action>
    - Usar `isImpersonating` y `stopImpersonation` de `useAuth()`.
    - Si `isImpersonating` es true, añadir un banner (fixed top, bg-red-600/90, texto blanco, z-index muy alto).
    - El banner debe decir "Modo Soporte: Está viendo la cuenta de [user.name]".
    - Debe incluir un botón para "Salir del Modo Soporte" que ejecute `stopImpersonation()`.
  </action>
  <verify>grep "Modo Soporte:" src/layouts/client/ClientLayout.jsx</verify>
  <done>El layout de cliente detecta modo de soporte e inyecta la advertencia.</done>
</task>

## Success Criteria
- [ ] La aplicación es capaz de cambiar rápidamente de usuario al guardar el contexto de regreso.
- [ ] El banner provee un escape seguro y advertencia visual persistente.
