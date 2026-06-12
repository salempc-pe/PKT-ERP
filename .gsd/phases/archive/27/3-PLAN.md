---
phase: 27
plan: 3
wave: 2
---

# Plan 27.3: Auditoría del Portal SuperAdmin y Secretos

## Objective
Revisar las acciones críticas del SuperAdmin y asegurar que no haya fugas de información sensible o credenciales en el código del frontend.

## Context
- .gsd/SPEC.md
- src/modules/admin/clients/useAdminOrganizations.js
- firebase.json
- .env.example

## Tasks

<task type="auto">
  <name>Auditoría de Acciones Críticas Admin</name>
  <files>src/modules/admin/clients/useAdminOrganizations.js</files>
  <action>
    - Revisar la función `adminUpdateFullOrg` para asegurar que solo un SuperAdmin verificado pueda invocarla (aunque Firestore Rules ya lo proteja, el código debe tener guardias).
    - Verificar que la gestión de `maxUsers` y `modules` sea atómica y no permita estados inconsistentes.
  </action>
  <verify>Validar flujos de edición de organizaciones.</verify>
  <done>Acciones de SuperAdmin blindadas.</done>
</task>

<task type="auto">
  <name>Escaneo de Secretos y Credenciales</name>
  <files>
    .env.example
    src/services/firebase.js
  </files>
  <action>
    - Asegurar que no existan credenciales sensibles (claves de API privadas, service accounts) subidas accidentalmente al repositorio.
    - Confirmar que `.env` está en el `.gitignore` (ya realizado, pero verificar persistencia).
    - Verificar que los mensajes de error en producción no filtren detalles técnicos de Firebase o de la infraestructura.
  </action>
  <verify>Ejecutar búsqueda de patrones sensibles en el código.</verify>
  <done>Repo libre de secretos y credenciales expuestas.</done>
</task>

## Success Criteria
- [ ] Acciones de SuperAdmin verificadas y seguras.
- [ ] No existen secretos harcodeados en el frontend.
- [ ] Mensajes de error sanitizados para producción.
