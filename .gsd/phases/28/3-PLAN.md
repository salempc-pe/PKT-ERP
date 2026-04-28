---
phase: 28
plan: 3
wave: 2
---

# Plan 28.3: Registro del Módulo y UI Integration

## Objective
Habilitar formalmente el módulo de Compras en la plataforma para que los clientes puedan activarlo y usarlo.

## Context
- src/context/AuthContext.jsx (SUBSCRIPTION_PLANS)
- src/components/layout/ClientLayout.jsx (Menú lateral)
- src/modules/client/dashboard/ClientDashboard.jsx (Tarjeta KPI)

## Tasks

<task type="auto">
  <name>Registrar Módulo en Planes</name>
  <files>src/context/AuthContext.jsx</files>
  <action>
    - Añadir 'purchases' a los módulos disponibles en `SUBSCRIPTION_PLANS` (especialmente en 'business').
    - Asegurar que la lógica de seguridad por m odulo lo reconozca.
  </action>
  <verify>Verificar que 'purchases' aparece como opción contratable en el sistema.</verify>
  <done>Módulo habilitado en la configuración global de planes.</done>
</task>

<task type="auto">
  <name>Integración UI App Cliente</name>
  <files>
    src/components/layout/ClientLayout.jsx
    src/modules/client/dashboard/ClientDashboard.jsx
  </files>
  <action>
    - Añadir item 'Compras' al Sidebar (condicionado a que el módulo esté activo).
    - Añadir tarjeta de KPI (ej: Compras del mes, Proveedores activos) al ClientDashboard.
  </action>
  <verify>Entrar con una organización que tenga el módulo activo y verificar visibilidad del menú.</verify>
  <done>Módulo accesible desde la navegación principal.</done>
</task>

## Success Criteria
- [ ] Módulo integrado en el Sidebar.
- [ ] Módulo visible solo si está activo para el tenant.
- [ ] Visualización de métricas básicas en dashboard.
