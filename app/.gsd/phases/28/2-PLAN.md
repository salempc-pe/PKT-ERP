---
phase: 28
plan: 2
wave: 1
---

# Plan 28.2: Órdenes de Compra e Integración con Inventario

## Objective
Gestionar las órdenes de compra y automatizar la recepción de mercadería para actualizar el stock.

## Context
- src/modules/client/inventory/useInventory.js (para integración de stock)
- src/modules/client/sales/useSales.js (referencia de estados de documentos)

## Tasks

<task type="auto">
  <name>Crear Hook usePurchases</name>
  <files>src/modules/client/purchases/usePurchases.js</files>
  <action>
    - Hook para CRUD de órdenes de compra en `organizations/{orgId}/purchases`.
    - Lógica de estados: Borrador, Solicitada, Recibida, Pagada, Anulada.
    - Implementar función `receivePurchase` que, al cambiar estado a 'Recibida', invoque la actualización de stock en la colección de productos.
    - Validación Zod para montos y SKUs.
  </action>
  <verify>Probar el flujo de cambio de estado y verificar incremento de stock en productos relacionados.</verify>
  <done>Hook de compras gestionando estados e integrando stock.</done>
</task>

<task type="auto">
  <name>Vista PurchasesModule y Modal OC</name>
  <files>src/modules/client/purchases/PurchasesModule.jsx</files>
  <action>
    - Vista de listado de Órdenes de Compra.
    - Modal complejo para "Nueva OC" permitiendo seleccionar proveedor y productos del inventario actual.
    - Botón de "Confirmar Recepción" que gatilla la lógica de stock.
  </action>
  <verify>Verificar que se pueden añadir ítems del inventario a la orden de compra.</verify>
  <done>Interfaz de gestión de compras operativa e integrada.</done>
</task>

## Success Criteria
- [ ] Integración funcional Compras -> Inventario (Stock update).
- [ ] Selección de proveedores y productos en tiempo real.
- [ ] Manejo de estados de documentos financieros/operativos.
