---
phase: 45
plan: 1
wave: 1
---

# Plan 45.1: Payroll Data Layer (Asistencia y Préstamos)

## Objective
Implementar la capa de datos (Data Layer) para soportar el registro de asistencia de los colaboradores y la gestión de préstamos/adelantos salariales.

## Context
- .gsd/SPEC.md
- src/modules/client/payroll/useEmployees.js

## Tasks

<task type="auto">
  <name>Crear usePayroll.js</name>
  <files>
    - src/modules/client/payroll/usePayroll.js
  </files>
  <action>
    - Crear un nuevo hook `usePayroll(orgId)` para manejar las colecciones `attendances` y `loans`.
    - Definir los esquemas Zod:
      - `AttendanceSchema`: empleadoId, fecha (YYYY-MM-DD), horaEntrada, horaSalida, estado (presente, tardanza, falta).
      - `LoanSchema`: empleadoId, monto, cuotas (cantidad), balancePendiente, cuotaMensual, estado (activo, pagado), fechaCreacion.
    - Implementar funciones reactivas (`onSnapshot`) para leer estas colecciones y funciones para agregar (`addAttendance`, `addLoan`), editar y eliminar.
  </action>
  <verify>grep -q "usePayroll" src/modules/client/payroll/usePayroll.js</verify>
  <done>El hook expone las funciones CRUD y listas reactivas para asistencias y préstamos.</done>
</task>

## Success Criteria
- [ ] Zod schemas definidos para Attendance y Loan.
- [ ] Hook `usePayroll` proporciona estado reactivo y operaciones Firestore.
