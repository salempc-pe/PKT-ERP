---
phase: 7
plan: 1
wave: 1
---

# Plan 7.1: Capa de Datos (useAppointments)

## Objective
Desarrollar el hook de estado robusto `useAppointments` en `src/hooks/useAppointments.js` para proveer CRUD reactivo de eventos/citas. El hook implementará conexión real contra la colección `appointments` de Firebase Firestore con `orgId` (tenant) y manejo con mock temporal (array estático) para desarrollo ofline, en concordancia a directivas de anteriores hooks (ej. useCrm).

## Context
- `src/hooks/useCrm.js` y `src/hooks/useFinance.js` (Como referencia del estándar deseado)
- `.gsd/phases/7/RESEARCH.md`

## Tasks

<task type="auto">
  <name>Implementar Hook de Citas useAppointments</name>
  <files>src/hooks/useAppointments.js</files>
  <action>
    - Crear un archivo `useAppointments.js` que gestione las reservas/citas en Firebase/Firestore (Colección 'appointments').
    - Estructura del evento/cita: `title`, `date`, `time`, `clientId` (id asociado en CRM), `status`, `notes`.
    - Prover funciones de acceso al state (`appointments`, `loading`, `error`).
    - Añadir funciones de mutación `addAppointment`, `updateAppointment`, `deleteAppointment`.
    - Manejar el fallback de mock state con valores de prueba (ej: una cita futura para test).
  </action>
  <verify>Verificar la exportación y funciones en el archivo creado.</verify>
  <done>El hook expone `appointments` y las funciones de CRUD necesarias.</done>
</task>

## Success Criteria
- [ ] Hook de hook validado por linter y exporta la API correcta.
- [ ] Los datos base fluyen correctamente y el log indica uso de Mock o Firebase según el entorno.
