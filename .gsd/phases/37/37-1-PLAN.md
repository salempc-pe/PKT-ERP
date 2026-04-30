---
phase: 37
plan: 1
wave: 1
---

# Plan 37.1: Capa de Datos (useEmployees)

## Objective
Implementar la capa de acceso a datos reactiva en Firebase Firestore para gestionar la información de los empleados, asegurando el aislamiento por inquilino (`orgId`).

## Context
- .gsd/SPEC.md
- src/context/AuthContext.jsx
- src/firebase/config.js

## Tasks

<task type="auto">
  <name>Implementar useEmployees hook</name>
  <files>
    - src/hooks/useEmployees.js
  </files>
  <action>
    Crear un hook `useEmployees` análogo a `useCrm` o `useInventory`.
    - Debe suscribirse a la colección `employees` de Firestore donde el campo `orgId` coincida con el `user.orgId` actual.
    - Debe exponer el estado `employees` (lista), `loading` y `error`.
    - Debe proveer funciones asíncronas para mutación: `addEmployee`, `updateEmployee` y `deleteEmployee`.
    - La estructura base de un empleado debe contener (al crearlo): `orgId`, `firstName`, `lastName`, `documentId`, `position`, `salaryType`, `baseSalary`, `variableSalary`, `paymentMethod`, `bankInfo` (objeto), `benefits` (objeto), `status` y timestamps.
  </action>
  <verify>grep -q "useEmployees" src/hooks/useEmployees.js</verify>
  <done>Hook exporta funciones CRUD y maneja correctamente el orgId extraído del AuthContext.</done>
</task>

## Success Criteria
- [ ] El hook `useEmployees` existe y es importable.
- [ ] Implementa seguridad básica inyectando el `orgId` en cada registro nuevo.
