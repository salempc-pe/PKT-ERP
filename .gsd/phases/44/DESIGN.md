# Diseño Técnico: Fase 44 - Bodega Evolucionada (Insumos)

## 1. Resumen de Entendimiento
Evolución del módulo de Bodega para soportar múltiples almacenes físicos, alertas de stock bajo granulares y reportes de valorización financiera de materiales.

## 2. Decisiones de Diseño
- **Ubicaciones:** Uso de la colección global `warehouses`.
- **Alertas:** Umbrales configurables por pareja (Material, Almacén).
- **Valorización:** Basada en lotes específicos (FIFO) para reportes de inversión y costos de salida.

## 3. Arquitectura de Datos
### Firestore
- **`warehouse_stock`**:
    - `warehouseId`: string (ref a /warehouses)
    - `status`: string ("OK" | "LOW" | "EMPTY")
- **`warehouse_history`**:
    - `warehouseId`: string
    - `movementValue`: number (cantidad * precio_lote)
- **`material_settings` (Nueva)**:
    - `materialName`: string
    - `thresholds`: Map<warehouseId, number>

## 4. Componentes UI
- **Selector de Almacén:** En modales de Ingreso/Salida y filtro principal.
- **Indicadores de Inversión:** Dashboard cards con valor total por almacén.
- **Panel de Alertas:** Lista de materiales bajo el umbral en la ubicación actual.
