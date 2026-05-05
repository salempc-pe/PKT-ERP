# Research: Phase 43 - Inventario (Valorización, Transferencias y QR/Barras)

## 1. Análisis de Estado Actual
Actualmente, el módulo de inventario (`useInventory.js`) guarda el `stock` como un campo numérico simple dentro de cada documento de la colección `products`. No hay concepto de "Almacén", ni costo promedio, ni un historial transaccional de movimientos (solo se actualiza el stock directamente).

## 2. Requisitos de Datos Nuevos
Para soportar las nuevas funcionalidades, la estructura de datos debe evolucionar:

### A. Múltiples Almacenes
- Colección: `organizations/{orgId}/warehouses`
- Documento de Warehouse: `{ name, location, isDefault }`
- En la colección `products`, el campo `stock` simple debe coexistir con un mapa o array de inventario por almacén, ej: `stockByWarehouse: { warehouseId: cantidad }`. O bien, se crea una colección `inventory_levels` (lo más sencillo es añadir `stockByWarehouse: Record<string, number>` al documento del producto para facilitar consultas rápidas).

### B. Valorización de Inventario (Promedio Ponderado)
- Para calcular el promedio ponderado (Weighted Average Cost), cada producto debe registrar un `averageCost`.
- Nueva colección: `organizations/{orgId}/inventory_transactions`
  - `{ type: 'inbound' | 'outbound' | 'transfer', productId, quantity, unitCost, totalCost, fromWarehouseId, toWarehouseId, status, date }`
- Fórmula Promedio Ponderado: `Nuevo Costo Promedio = ((Stock Anterior * Costo Anterior) + (Nueva Cantidad * Nuevo Costo)) / (Stock Anterior + Nueva Cantidad)`

### C. Transferencias entre Almacenes
- Una transferencia requiere un documento en una nueva colección `organizations/{orgId}/inventory_transfers`.
- Estado: `pending`, `in_transit`, `completed`, `cancelled`.
- El flujo: Almacén A crea la transferencia (en_transito), se descuenta el stock de A. Almacén B recibe la transferencia (completed), se suma el stock a B.

### D. Escaneo QR / Código de Barras
- **Lector físico (USB/Bluetooth)**: Funciona como emulación de teclado. Solo requiere un campo de texto con auto-focus o un event listener global que capture `keypress` terminados en `Enter`.
- **Lector por cámara**: Se recomienda usar la librería `html5-qrcode` que tiene excelente soporte para leer códigos QR y códigos de barra 1D/2D desde dispositivos móviles y webcams en React, o alternativamente `react-zxing`. No requerimos dependencias si solo soportamos lectores USB físicos, pero la cámara añade valor móvil. Para evitar inflar el bundle innecesariamente, inicialmente implementaremos la captura de entrada por teclado rápida en un campo de "Escanear SKU", e instalaremos `html5-qrcode` (ligera) para el soporte de cámara modal.

## 3. Decisiones Arquitectónicas
1. **Actualización de `ProductSchema`**: 
   - Añadir `averageCost` (number).
   - Añadir `stockByWarehouse` (objeto: `{[warehouseId: string]: number}`).
2. **Nuevos Hooks**:
   - `useWarehouses`: para gestionar la lista de almacenes.
   - `useInventoryTransactions`: para registrar entradas, salidas y transferencias, y automatizar el cálculo del costo promedio y el movimiento de `stockByWarehouse`.
3. **UI Módulo Inventario**:
   - Agregar "Pestañas" o un sub-menú para: Productos, Almacenes, Transferencias.
   - Botón de "Escanear" que abre un modal con un input auto-enfocado (para lector USB) y una opción de "Usar Cámara".
