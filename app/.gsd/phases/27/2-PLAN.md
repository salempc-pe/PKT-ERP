---
phase: 27
plan: 2
wave: 1
---

# Plan 27.2: Auditoría de Módulos de Cliente y Validación de Inputs

## Objective
Revisar los módulos operativos (CRM, Inventario, Ventas) para prevenir inyecciones de datos, asegurar la validación de tipos y proteger la integridad de los registros financieros.

## Context
- .gsd/SPEC.md
- src/modules/client/crm/useCrm.js
- src/modules/client/inventory/useInventory.js
- src/modules/client/sales/useSales.js

## Tasks

<task type="auto">
  <name>Auditoría de Validación de Datos (Zod)</name>
  <files>
    src/modules/client/crm/useCrm.js
    src/modules/client/inventory/useInventory.js
  </files>
  <action>
    - Verificar que todas las funciones de escritura (create/update) utilicen esquemas de Zod para validar el input antes de enviarlo a Firestore.
    - Asegurar que no se permitan campos extraños o inyecciones de scripts (XSS) en nombres de productos o contactos.
    - Implementar validaciones faltantes para tipos de datos (ej. stock como número entero, precios como números positivos).
  </action>
  <verify>Revisar la implementación de hooks useCrm y useInventory.</verify>
  <done>Todos los inputs de escritura están validados con Zod.</done>
</task>

<task type="auto">
  <name>Integridad de Documentos Financieros</name>
  <files>src/modules/client/sales/useSales.js</files>
  <action>
    - Asegurar que los estados de "Pagado" y "Anulado" no puedan ser revertidos sin validación de permisos.
    - Verificar que la numeración automática no pueda ser manipulada por el usuario client-side para saltarse correlativos (auditando la lógica de escritura).
  </action>
  <verify>Auditar el flujo de vida de los documentos de venta.</verify>
  <done>Reglas de negocio financieras protegidas contra manipulación malintencionada.</done>
</task>

## Success Criteria
- [ ] Validación estricta con Zod en todos los módulos de escritura.
- [ ] Sanitización básica de strings para prevenir XSS en campos de texto.
- [ ] Documentos de venta con integridad de estado asegurada.
