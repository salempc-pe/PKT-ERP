---
phase: 37
plan: 2
wave: 1
---

# Plan 37.2: Modal de Formulario de Empleado

## Objective
Desarrollar el formulario (Modal) para registrar o editar la información detallada de los colaboradores, siguiendo el estándar visual Premium UI establecido en módulos anteriores.

## Context
- .gsd/SPEC.md
- src/modules/client/realestate/TerrainModal.jsx (referencia visual Premium UI)
- src/hooks/useEmployees.js

## Tasks

<task type="auto">
  <name>Crear EmployeeModal</name>
  <files>
    - src/modules/client/payroll/EmployeeModal.jsx
  </files>
  <action>
    Desarrollar un componente de modal reactivo (`EmployeeModal.jsx`) que reciba `employee` (opcional) y `onClose`.
    Debe contener agrupaciones visuales para:
    1. Datos Personales: Nombres, Apellidos, DNI/CE, Cargo.
    2. Estructura Salarial: Select (Fijo/Variable/Mixto), Sueldo Base, Remuneración Variable.
    3. Método de Pago: Select (Efectivo/Depósito). Si es depósito, mostrar campos anidados para Banco, Número de Cuenta y CCI.
    4. Beneficios Sociales: Checkboxes visualmente integrados para (Asignación Familiar, Gratificaciones, CTS, Utilidades).
    - Utilizar variables CSS (`var(--color-surface)`, etc.) y un diseño compacto similar a `TerrainModal.jsx`.
    - Integrar la lógica para guardar usando `useEmployees`.
  </action>
  <verify>grep -q "EmployeeModal" src/modules/client/payroll/EmployeeModal.jsx</verify>
  <done>El modal renderiza todos los campos requeridos de recursos humanos de forma estructurada y llama a la base de datos al guardar.</done>
</task>

## Success Criteria
- [ ] UI consistente con el rediseño premium.
- [ ] Funcionalidad dinámica (mostrar/ocultar cuenta bancaria según el método de pago).
