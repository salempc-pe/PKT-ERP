# RESEARCH: Phase 9 - Marketplace y Sistema de Suscripciones

## Objective
Implementar un sistema de Marketplace interno para la aplicación cliente, permitiendo la activación y desactivación dinámica de módulos (CRM, Inventario, Ventas, Finanzas, etc.) mediante una pasarela de pagos (Mock o integración básica con Stripe) para el ERP SaaS.

## Integración de Pagos
Para esta fase de MVP/Prototipo, implementaremos un flujo de "Mock Checkout" que simule la experiencia de una pasarela de pagos (como Stripe o Culqi) en el frontend.

**Razonamiento:**
1. Al no tener un backend dedicado robusto (sólo Firebase), manejar webhooks reales de Stripe para activar módulos introduce una complejidad innecesaria para la prueba de concepto.
2. Un Mock Checkout permite validar la UX del sistema de suscripciones y el Marketplace sin depender de claves de API externas.
3. El pago simulado actualizará directamente el registro del tenant en Firestore para marcar los módulos correspondientes como `active`.

## Activación/Desactivación Dinámica de Módulos
Mecanismo propuesto:
1. **Firestore:** Cada tenant (empresa) tendrá un array de `activeModules` (ej. `['crm', 'inventory']`) o una subcolección `modules`.
2. **Contexto:** Se creará un `useModules` hook o se expandirá el contexto (`AuthContext` / `TenantContext`) para proveer la lista de módulos activos globalmente.
3. **Navegación:** `ClientLayout.jsx` visualizará dinámicamente el `Sidebar` mostrando sólo las rutas de módulos activos.
4. **Protección de Rutas:** Se implementará un componente Wrapper de protección de rutas (e.g., `ModuleRoute`) que verifique si el módulo al que se intenta acceder está en la lista de módulos permitidos. Si no lo está, redirige al Marketplace.

## Estructura de Datos (Firestore)
```json
// En tenants/{tenantId}
{
  "name": "Mi Empresa",
  "activePlan": "free",
  "activeModules": ["crm", "inventory"], // Lista de IDs de módulos
  "billingHistory": [
    // Registro de transacciones
  ]
}
```

## Arquitectura UI
1. **MarketplaceModule:** Una vista tipo galería separando módulos contratados vs módulos disponibles. Tarjetas con descripción, precio mensual y botón de "Suscribirse".
2. **CheckoutModal:** Modal que simula el ingreso de tarjeta de crédito (o un botón "Pagar con Prueba") y realiza el update en Firebase.
3. **Sidebar Updates:** Carga dinámica basada en permisos de `activeModules`.

## Conclusión
La estrategia de Mock Checkout + Control Dinámico UI es factible y permite cumplir con el hito 9 manteniendo el scope de MVP, facilitando una futura migración a Stripe real añadiendo Firebase Cloud Functions.
