---
phase: 28
plan: 1
wave: 1
---

# Plan 28.1: Maestros de Proveedores

## Objective
Implementar la base de datos de proveedores necesaria para el proceso de compras.

## Context
- .gsd/SPEC.md
- src/modules/client/crm/useCrm.js (como referencia de CRUD)

## Tasks

<task type="auto">
  <name>Crear Hook useSuppliers</name>
  <files>src/modules/client/purchases/useSuppliers.js</files>
  <action>
    - Implementar hook para CRUD de proveedores en la subcolección `organizations/{orgId}/suppliers`.
    - Campos: name, taxId (RUC/DNI), email, phone, address, category, status.
    - Implementar validación con Zod.
  </action>
  <verify>Verificar creación del archivo y exportación de funciones CRUD.</verify>
  <done>Hook useSuppliers funcional con persistencia en Firestore.</done>
</task>

<task type="auto">
  <name>Crear Vista SuppliersModule</name>
  <files>src/modules/client/purchases/SuppliersModule.jsx</files>
  <action>
    - Crear tabla de proveedores con filtros y bsqueda.
    - Implementar modal para creación y edición de proveedores.
    - Asegurar que siga el diseño aesthetic del sistema (Vibrant, Hover effects).
  </action>
  <verify>Renderizar el componente y verificar que listado de proveedores funciona (mock o real).</verify>
  <done>Componente SuppliersModule listo para integración.</done>
</task>

## Success Criteria
- [ ] CRUD funcional de proveedores guardando en `${orgId}/suppliers`.
- [ ] Validación de inputs con Zod.
- [ ] UI consistente con el sistema actual.
