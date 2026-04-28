# RESEARCH: Phase 6 - Contabilidad y Finanzas

## Context
La Fase 6 del ERP requiere la implementación del módulo de Contabilidad y Finanzas. Este módulo permitirá el registro y seguimiento de ingresos y gastos, así como la visualización de un flujo de caja básico y reportes financieros (P&L - Profit & Loss).

## Discovery Level: 1 (Quick Verification)
No se requieren integraciones externas complejas ni nuevas librerías. Todo el desarrollo se basará en patrones existentes del proyecto: `React`, `Firebase Firestore`, `Tailwind v4`, `Lucide React`, manteniendo el diseño Glassmorphism ("ArchitectOS").

## Data Model (Firestore)

**Colección**: `transactions`

**Campos principales**:
- `id` (String): Generado por Firestore o uuid en mock.
- `orgId` (String): ID del tenant, para asegurar el aislamiento de datos (multi-tenancy).
- `type` (String): 'income' (Ingreso) | 'expense' (Gasto).
- `amount` (Number): Monto de la transacción.
- `date` (Timestamp/String): Fecha de la transacción.
- `description` (String): Breve descripción del concepto.
- `category` (String): Categoría del ingreso/gasto (ej. Ventas, Salarios, Servicios, Marketing, etc.).
- `createdAt` (Timestamp): Fecha de registro en el sistema.

## Component Architecture

1. **Custom Hook (`useFinance.js`)**:
   Ubicación: `src/modules/client/finance/useFinance.js`
   - Encargado de interactuar con la colección `transactions` de Firestore (soporte mock opcional).
   - Métodos: `addTransaction`, `deleteTransaction`.
   - Estado: `transactions` (lista reactiva), `loading` (booleano), `error` (mensaje).
   - KPIs computados (opcionales dentro del hook o en el módulo): `totalIncome`, `totalExpense`, `balance` (flujo de caja).

2. **UI Module (`FinanceModule.jsx`)**:
   Ubicación: `src/modules/client/finance/FinanceModule.jsx`
   - Tarjetas de resumen (Ingresos, Gastos, Balance).
   - Tabla o lista de transacciones recientes.
   - Gráfico nativo o barras visuales de P&L usando Tailwind.
   - Modal para añadir un nuevo ingreso o gasto.
   
3. **Integración con Layout y Router**:
   - `src/App.jsx`: Añadir ruta `/client/finance`.
   - `src/layouts/ClientLayout.jsx`: Añadir enlace en el sidebar (ej. Icono `PieChart` o `DollarSign`).

## Conclusión
La implementación seguirá el patrón CRUD estándar ya demostrado en Módulos de CRM e Inventario, permitiendo que la fase se divida en 2 planes atómicos: Modelo de Datos (Hook) y UI (Módulo + Ruteo).
