# Summary Plan 28.2: Órdenes de Compra e Integración con Inventario

## Lo que se hizo
- **Hook usePurchases**: Implementado flujo de gestión de órdenes de compra (OC).
  - Lógica de estados: Borrador, Solicitada, Recibida, Pagada, Anulada.
  - **Integración con Inventario**: Implementada la función `receivePurchase` que incrementa automáticamente el stock de los productos involucrados en Firestore al confirmar la recepción.
- **Vista PurchasesModule**: Interfaz completa para la creación y seguimiento de OCs.
  - Generación automática de números correlativos (OC-0001, etc.).
  - Modal dinámico de "Nueva Compra" que permite seleccionar productos existentes del inventario, definir costos y cantidades.
  - Totalización automática de montos.

## Resultados
- El sistema ahora cierra el ciclo logístico básico: Proveedores -> Compra -> Actualización Automática de Stock.
- Validación de datos para evitar recepciones duplicadas o compras de productos inexistentes.
