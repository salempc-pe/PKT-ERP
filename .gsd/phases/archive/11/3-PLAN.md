---
phase: 11
plan: 3
wave: 2
---

# Plan 11.3: Portal de Suscripción del Cliente (Marketplace v2)

## Objective
Actualizar el Marketplace del cliente para que refleje su plan actual y permita solicitar mejoras (Upgrades).

## Context
- src/modules/client/marketplace/MarketplaceModule.jsx
- src/context/AuthContext.jsx

## Tasks

<task type="auto">
  <name>Rediseño de Marketplace a Comparativa de Planes</name>
  <files>src/modules/client/marketplace/MarketplaceModule.jsx</files>
  <action>
    1. Reemplazar el listado de módulos individuales por un layout de 3 columnas (Startup, Business, Enterprise).
    2. Resaltar visualmente el "Plan Actual" del cliente.
    3. Cambiar botones de planes superiores a "Mejorar Plan" y el plan actual a "Plan Activo".
  </action>
  <verify>grep "Plan Actual" src/modules/client/marketplace/MarketplaceModule.jsx</verify>
  <done>El cliente ve una comparativa de planes clara con su nivel actual resaltado.</done>
</task>

<task type="auto">
  <name>Lógica de Bloqueo por Cuotas (MVP)</name>
  <files>src/modules/admin/clients/AdminClients.jsx</files>
  <action>
    En el modal de edición de Admin, bloquear el botón "Vincular Usuario" si la organización ya alcanzó el límite definido en su plan (ej. 2 para Startup). Mostrar un mensaje de aviso: "Límite del plan alcanzado".
  </action>
  <verify>grep "Límite del plan alcanzado" src/modules/admin/clients/AdminClients.jsx</verify>
  <done>El sistema aplica y visualiza los límites de cuota definidos en el plan.</done>
</task>

## Success Criteria
- [ ] El cliente entiende en qué plan se encuentra y qué módulos adicionales ganaría con un upgrade.
- [ ] Las cuotas de usuario funcionan y bloquean nuevos registros cuando se alcanzan.
