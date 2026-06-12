---
phase: 5
plan: 1
wave: 1
---

# Plan 5.1: Dashboard Centralizado

## Objective
Implementar una página de Dashboard unificada que muestre los KPIs clave de los módulos CRM, Inventario y Facturación.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- app/src/modules/ (Donde viven los módulos)
- app/src/hooks/ (useCrm, useInventory, useSales)

## Tasks

<task type="auto">
  <name>Crear DashboardModule y Componentes de KPI</name>
  <files>
    - app/src/modules/dashboard/DashboardModule.jsx
    - app/src/modules/dashboard/components/KpiCard.jsx
  </files>
  <action>
    - Crear un nuevo módulo en `src/modules/dashboard`.
    - Implementar un componente `KpiCard` reutilizable con estilos glassmorphism (ArchitectOS).
    - El `DashboardModule` debe usar `useCrm`, `useInventory` y `useSales` para obtener datos.
    - Calcular: Total Clientes, Valor de Inventario, Total Ventas (MTD) y Facturas Pendientes.
  </action>
  <verify>npm run dev (verificar visualmente la carga de datos)</verify>
  <done>El dashboard muestra 4 tarjetas de KPI con datos reales de Firestore.</done>
</task>

<task type="auto">
  <name>Integrar Dashboard en el sistema de Rutas y Sidebar</name>
  <files>
    - app/src/App.jsx
    - app/src/layouts/client/ClientLayout.jsx
  </files>
  <action>
    - Añadir la ruta `/dashboard` (o actualizar la ruta raíz `/` para que apunte al DashboardModule).
    - Asegurar que el Dashboard sea la página de inicio por defecto del portal cliente.
    - Actualizar la navegación lateral para incluir el link al Dashboard con un icono apropiado.
  </action>
  <verify>Navegar a la raíz de la app y confirmar que carga el Dashboard.</verify>
  <done>El Dashboard es accesible desde el menú y es la página de aterrizaje.</done>
</task>

## Success Criteria
- [ ] Dashboad unificado visible en el portal cliente.
- [ ] Datos de 3 módulos diferentes agregados en una sola vista.
