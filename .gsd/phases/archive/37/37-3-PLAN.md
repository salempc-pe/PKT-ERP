---
phase: 37
plan: 3
wave: 2
---

# Plan 37.3: Módulo Principal y Navegación

## Objective
Implementar la interfaz principal de Nóminas (lista de empleados y KPIs) e integrarla en la estructura de ruteo y navegación (Sidebar) de la aplicación.

## Context
- .gsd/SPEC.md
- src/routes/ClientLayout.jsx
- src/App.jsx

## Tasks

<task type="auto">
  <name>Crear PayrollModule</name>
  <files>
    - src/modules/client/payroll/PayrollModule.jsx
  </files>
  <action>
    Crear el componente contenedor `PayrollModule`.
    - Mostrar KPIs en la cabecera (ej. Total de Empleados, Planilla Mensual Estimada calculada sumando el baseSalary de los empleados activos).
    - Renderizar una tabla `full-width` (adaptativa para móvil, sin contenedores estilo tarjeta en móvil) listando los empleados y sus datos clave.
    - Incluir el botón principal estandarizado azul alineado a la derecha para "Agregar Empleado", el cual abre `EmployeeModal`.
  </action>
  <verify>grep -q "PayrollModule" src/modules/client/payroll/PayrollModule.jsx</verify>
  <done>Módulo funcional que renderiza el listado y maneja el estado del modal.</done>
</task>

<task type="auto">
  <name>Integrar Módulo en la Navegación</name>
  <files>
    - src/App.jsx
    - src/routes/ClientLayout.jsx
  </files>
  <action>
    - En `App.jsx`, agregar la ruta `/payroll` protegida para que renderice `<PayrollModule />`.
    - En `ClientLayout.jsx`, agregar el enlace en el menú lateral (Sidebar) debajo de Compras o Equipo. Usar el icono `Users` o `Wallet` de `lucide-react` y el título "Nóminas".
  </action>
  <verify>grep -q "/payroll" src/App.jsx</verify>
  <done>El módulo es accesible mediante el menú lateral de la aplicación.</done>
</task>

## Success Criteria
- [ ] La tabla se visualiza correctamente ocupando todo el ancho en versión móvil.
- [ ] La navegación enlaza exitosamente a `/payroll`.
- [ ] Los KPIs se calculan y actualizan en tiempo real basándose en Firestore.
