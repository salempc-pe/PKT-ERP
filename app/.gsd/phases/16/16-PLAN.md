---
phase: 16
plan: 1
wave: 1
---

# Plan 16.1: Capa de datos para Facturación y Vencimientos

## Objective
Actualizar la capa de datos de ventas (`useSales.js`) para soportar los nuevos campos necesarios en el control de facturación: `issueDate` (fecha de emisión), `dueDate` (fecha de vencimiento) y `documentType` (Boleta o Factura).

## Context
- .gsd/SPEC.md
- src/modules/client/sales/useSales.js

## Tasks

<task type="auto">
  <name>Actualizar Hook useSales para Documentos</name>
  <files>src/modules/client/sales/useSales.js</files>
  <action>
    - Modificar la data Mock inicial para que incluya `issueDate` (Date), `dueDate` (Date) y `documentType` ('Boleta' | 'Factura').
    - Asegurarse de que `addSale` maneje estos nuevos campos (ej. asignar `issueDate` por defecto hoy si no viene, y `dueDate` calcularlo a 30 días si no viene especificado).
  </action>
  <verify>
    cat src/modules/client/sales/useSales.js | grep -E 'dueDate|documentType|issueDate'
  </verify>
  <done>
    Los datos de prueba mock y la función addSale incluyen dueDate, issueDate y documentType.
  </done>
</task>

---
phase: 16
plan: 2
wave: 1
---

# Plan 16.2: Interfaz de Panel de Facturación y Emisión

## Objective
Renovar el módulo de Ventas/Facturas (`SalesModule.jsx`) para que funcione como un panel de control de facturación. Debe mostrar las fechas de vencimiento con indicadores visuales de retraso y ofrecer botones específicos para "Emitir Boleta" y "Emitir Factura".

## Context
- src/modules/client/sales/SalesModule.jsx

## Tasks

<task type="auto">
  <name>UI - Tabla y Fechas de Vencimiento</name>
  <files>src/modules/client/sales/SalesModule.jsx</files>
  <action>
    - Modificar la tabla principal de documentos para incluir: Tipo (Boleta/Factura), Fecha de Emisión y Fecha de Vencimiento en lugar de sólo la creación.
    - Implementar una función de cálculo visual que evalúe cuántos días faltan para `dueDate` o si está vencido (retraso en días), mostrando un badge o texto de color (ej. rojo si está vencido, naranja si faltan pocos días, verde o neutro si es pago a futuro).
  </action>
  <verify>
    grep "dueDate" src/modules/client/sales/SalesModule.jsx
  </verify>
  <done>
    La tabla muestra las nuevas columnas y el indicador visual de días de retraso o días restantes.
  </done>
</task>

<task type="auto">
  <name>UI - Funciones de Emisión</name>
  <files>src/modules/client/sales/SalesModule.jsx</files>
  <action>
    - Reemplazar el botón genérico "Nueva Venta/Factura" por dos botones distintos: "Emitir Boleta" y "Emitir Factura".
    - Al abrir el modal de creación (puede reutilizarse el mismo, pero pasándole un parámetro), inicializar el estado del `documentType` en Boleta o Factura.
    - Asegurar que al hacer submit en el modal, se guarde correctamente el tipo de documento.
  </action>
  <verify>
    grep "Emitir Boleta" src/modules/client/sales/SalesModule.jsx
  </verify>
  <done>
    Existen dos botones separados para la creación y el modal respeta el tipo de documento.
  </done>
</task>
