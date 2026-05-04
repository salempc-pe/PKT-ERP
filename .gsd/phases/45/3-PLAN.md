---
phase: 45
plan: 3
wave: 2
---

# Plan 45.3: Procesamiento de Planilla y Boletas

## Objective
Implementar el cálculo mensual de nóminas integrando descuentos (faltas, préstamos) y la generación de la boleta de pago lista para impresión (PDF).

## Context
- .gsd/SPEC.md
- src/modules/client/payroll/PayrollModule.jsx

## Tasks

<task type="auto">
  <name>Implementar Vista de Planilla y Cálculo</name>
  <files>
    - src/modules/client/payroll/PayrollModule.jsx
    - src/modules/client/payroll/PayslipsTab.jsx
  </files>
  <action>
    - Crear `PayslipsTab.jsx` y agregar la pestaña correspondiente en `PayrollModule.jsx` (pestaña `Boletas/Planilla`).
    - Añadir una función lógica en `PayslipsTab` que tome a los `employees`, cruce con `attendances` (faltas del mes) y `loans` (préstamo activo).
    - Calcular: `Sueldo Base` + `Variable` - `Deducciones Faltas` - `Cuota Préstamo` = `Neto a Pagar`.
    - Mostrar los resultados mensuales en una tabla.
  </action>
  <verify>grep -q "PayslipsTab" src/modules/client/payroll/PayrollModule.jsx</verify>
  <done>Existe una tabla que resume el neto a pagar por cada empleado en base a las deducciones.</done>
</task>

<task type="auto">
  <name>Generación Visual de Boleta de Pago</name>
  <files>
    - src/modules/client/payroll/PayslipDocument.jsx
  </files>
  <action>
    - Crear `PayslipDocument.jsx` que sea un componente estéticamente profesional formateado para impresión (A4).
    - Incluir detalles de empresa (Tenant), datos del empleado, detalle de ingresos y deducciones, y espacio para "Firma Digital/Sello".
    - Usar `@media print` CSS interno o Tailwind `print:` utilidades para que al invocar `window.print()` se genere el PDF correctamente ocultando la UI del ERP.
  </action>
  <verify>grep -q "window.print" src/modules/client/payroll/PayslipsTab.jsx || grep -q "print:" src/modules/client/payroll/PayslipDocument.jsx</verify>
  <done>Al hacer clic en "Imprimir Boleta", se abre la vista del navegador para imprimir en PDF con diseño limpio.</done>
</task>

## Success Criteria
- [ ] La planilla consolida automáticamente la información del mes.
- [ ] Las deducciones por préstamos se aplican al neto.
- [ ] La boleta de pago (Payslip) puede ser visualizada y guardada como PDF (usando CSS print o equivalente).
