---
phase: 45
plan: 2
wave: 1
---

# Plan 45.2: UI - Asistencia y Préstamos

## Objective
Actualizar la interfaz principal del Módulo de Nóminas para incorporar pestañas de navegación que separen la gestión de Empleados, Asistencia y Préstamos.

## Context
- .gsd/SPEC.md
- src/modules/client/payroll/PayrollModule.jsx

## Tasks

<task type="auto">
  <name>Refactorizar PayrollModule con Pestañas</name>
  <files>
    - src/modules/client/payroll/PayrollModule.jsx
  </files>
  <action>
    - Modificar `PayrollModule.jsx` para usar un sistema de navegación por pestañas (`Colaboradores`, `Asistencia`, `Préstamos`).
    - Aislar la tabla actual de colaboradores en una vista o sub-componente interno o manejar renderizado condicional.
  </action>
  <verify>grep -q "Asistencia" src/modules/client/payroll/PayrollModule.jsx</verify>
  <done>Existen 3 pestañas claramente diferenciadas en la UI.</done>
</task>

<task type="auto">
  <name>Implementar Vista de Asistencia</name>
  <files>
    - src/modules/client/payroll/AttendanceTab.jsx
  </files>
  <action>
    - Crear `AttendanceTab.jsx`.
    - Integrar `usePayroll` para listar y registrar asistencias diarias.
    - Incluir un botón rápido de "Marcar Ingreso" y "Marcar Salida".
    - Mostrar tabla con estado de asistencia por empleado.
  </action>
  <verify>grep -q "Marcar" src/modules/client/payroll/AttendanceTab.jsx</verify>
  <done>Interfaz completa para registrar el control de asistencia.</done>
</task>

<task type="auto">
  <name>Implementar Vista de Préstamos</name>
  <files>
    - src/modules/client/payroll/LoansTab.jsx
  </files>
  <action>
    - Crear `LoansTab.jsx`.
    - Integrar `usePayroll` para listar adelantos/préstamos.
    - Incluir modal o formulario in-line para otorgar un nuevo préstamo definiendo monto, empleado y número de cuotas.
  </action>
  <verify>grep -q "Préstamo" src/modules/client/payroll/LoansTab.jsx</verify>
  <done>Interfaz completa para crear y ver préstamos.</done>
</task>

## Success Criteria
- [ ] La UI tiene 3 pestañas operativas.
- [ ] El administrador puede marcar asistencias de los empleados.
- [ ] El administrador puede registrar un préstamo y ver su cuota calculada.
