# Fase 3: Investigación - Módulo de Inventario

## Contexto
El objetivo de la fase 3 es implementar el Módulo de Inventario (Control de Stock) en la aplicación, la cual ya posee una arquitectura mock para el módulo y una base de Firebase configurada en la Fase 2 (CRM).

## Descubrimiento Técnico (Level 1)
- **Persistencia:** Al igual que `useCrm`, se usará la misma instancia de Firestore configurada en `src/services/firebase.js`.
- **Estructura de Datos (Firestore):**
  - Collection: `organizations/{orgId}/products`
  - Campos mínimos: `sku`, `name`, `category`, `price`, `stock`, `status`, `createdAt`, `updatedAt`.
  - El estado (`status`) puede ser derivado automáticamente basado en stock (ej. si stock == 0: "Agotado", si stock <= umbral: "Bajo Stock", si no: "Normal").
- **Hook Reactivo:** Se diseñará `useInventory.js` que imite el patrón fallback/live de `useCrm.js` (soporte para Mock Data si no hay un `VITE_FIREBASE_API_KEY`).
- **UI:** Refactorización de `InventoryModule.jsx` para alimentar la tabla y métricas desde Firestore global, eliminando arrays duros en el componente.

## Implementación
No requiere integraciones externas más allá de las librerías de Firebase y los componentes visuales Lucide React ya instalados.
Se dividirá en:
1. Creación del modelo de datos / hook (Data Layer).
2. Conexión de UI y estado real.
3. Integración de interactividad (Formulario / Modal para añadir productos).
