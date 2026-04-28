---
phase: 27
plan: 1
wave: 1
---

# Plan 27.1: Auditoría de Cimientos y Multi-tenancy

## Objective
Asegurar que el aislamiento entre organizaciones (Multi-tenancy) sea infranqueable y que la gestión de roles en el cliente sea segura frente a manipulaciones.

## Context
- .gsd/SPEC.md
- .gsd/ARCHITECTURE.md
- firestore.rules
- src/context/AuthContext.jsx

## Tasks

<task type="auto">
  <name>Auditoría de Firestore Rules</name>
  <files>firestore.rules</files>
  <action>
    Revisar exhaustivamente todas las reglas de Firestore para:
    - Verificar que NINGUNA colección permita lectura/escritura global.
    - Asegurar que todas las consultas a nivel de organización verifiquen `auth.token.organizationId == organizationId`.
    - Validar que las reglas del SuperAdmin (`/organizations`) solo permitan acceso si el usuario tiene el rol `superadmin` en Firestore.
    - Corregir cualquier brecha identicada durante la revisión.
  </action>
  <verify>Ejecutar revisión manual de las reglas con la skill cc-skill-security-review.</verify>
  <done>Reglas actualizadas y verificadas sin fugas de datos entre inquilinos.</done>
</task>

<task type="auto">
  <name>Auditoría de AuthContext y Roles</name>
  <files>src/context/AuthContext.jsx</files>
  <action>
    Revisar la lógica de sesión y roles en el cliente:
    - Asegurar que el `role` y `organizationId` se obtengan solo de fuentes confiables (Auth Token o Firestore, no manipulables por el usuario en localStorage).
    - Verificar que los `setup-password` tokens no expiren prematuramente ni sean reutilizables sin validación.
  </action>
  <verify>Inspeccionar el manejo de estados de usuario y tokens.</verify>
  <done>Flujo de autenticación y autorización robustecido.</done>
</task>

## Success Criteria
- [ ] Aislamiento multi-tenant validado en firestore.rules.
- [ ] Roles de usuario no manipulables desde el lado del cliente.
- [ ] No existen reglas `allow read, write: if true;`.
