# Research: Phase 4 (Ventas y Facturación)

## Architecture Context
Esta fase conecta las dos fases anteriores (CRM e Inventario) mediante la creación de un modelo intermedio: `invoices` (Ventas).

El flujo de creacion requiere:
- Seleccionar un cliente (de los obtenidos vía `useCrm`).
- Seleccionar múltiples productos y cantidades (de `useInventory`).
- Calcular totales (Subtotal, Tax, Final).
- Insertar en la coleccion `invoices/sales`.
- Idealmente, descontar el stock del producto vendido, aunque por simplicidad de MVP en Firebase lo podemos manejar en el frontend leyendo los productos, o usando transacciones de Firestore (o simplemente actualizando los docs del lado cliente uno a uno).

## Data Schema (invoices)
Path: `organizations/{orgId}/invoices/{invoiceId}`
- `clientId` (string)
- `clientName` (string)
- `items`: Array de objetos `{ productId, name, quantity, price, subtotal }`
- `totalAmount` (number)
- `status` (string: "Borrador", "Pagada", "Pendiente", "Vencida")
- `date` (timestamp)
- `createdAt`

## Discovery Level Context
No requerimos librerías externas avanzadas en este MVP para enviar correos o crear PDFs complejos (se exportarán con funciones nativas más adelante o solo se listan), porque Firebase es nuestro BaaS. Nos apegaremos a Tailwind UI y a Lucide-React para íconos que ya usamos.

## Strategy / Sub-phases
1. **Lógica de Datos (`useSales.js`)**: Hook para fetching e insert.
2. **Interfaz de Ventas (`SalesModule.jsx`)**: UI con Stats e Historico de Operaciones de facturación.
3. **Formulario Relacional**: Seleccionar contacto, buscar items y sumar.

El routing se debe agregar a `App.jsx` y los sidemenus en `ClientLayout.jsx` que ya deberían poder soportarlo.
