# Research: Phase 41 - Dashboard Central (KPIs Configurables y Drill-down)

## Discovery Protocol
**Level 2 - Standard Research**: Diseño de la personalización de widgets del usuario y navegación inter-módulos (drill-down).

## 1. Configuración de KPIs y Widgets
El Dashboard actual (`ClientDashboard.jsx`) itera sobre `user.subscription.activeModules` y renderiza la tarjeta (`CardComponent`) correspondiente a cada módulo activo.

### Enfoque Propuesto para Personalización:
- **Almacenamiento**: Guardar las preferencias en el documento del usuario en Firestore (`users/{userId}`). Específicamente, un array `dashboardPreferences` que contenga las claves de los módulos que el usuario desea ver (ej. `['crm', 'sales']`).
- **UI de Configuración**: Añadir un botón "Personalizar Dashboard" que abra un modal (`DashboardSettingsModal.jsx`). Este modal mostrará switches (toggles) para cada módulo activo en la suscripción de la organización.
- **Renderizado**: En `ClientDashboard.jsx`, cruzar `activeModules` con `user.dashboardPreferences`. Si el usuario no tiene preferencias guardadas, por defecto se muestran todos los módulos activos.

## 2. Navegación Drill-down
El objetivo del drill-down es que, al hacer clic en un número o KPI específico dentro de una tarjeta del dashboard, el usuario sea redirigido al módulo correspondiente con la vista o filtro correcto ya aplicado.

### Enfoque Propuesto para Drill-down:
- **Tarjetas del Dashboard**: Actualizar componentes como `CrmDashboardCard.jsx` o `SalesDashboardCard.jsx` para envolver los KPIs en elementos clickeables (botones o enlaces).
- **Enrutamiento**: Utilizar `useNavigate()` de `react-router-dom`. Al hacer clic, navegar a la ruta del módulo pasando parámetros por URL o `state`. 
  Ejemplo: `navigate('/client/crm', { state: { view: 'leads' } })` o `navigate('/client/crm?tab=leads')`.
- **Módulos Receptores**: Modificar los módulos destino (ej. `CRMModule.jsx`) para que, al montarse, lean el estado del router (`useLocation`) o los query params (`useSearchParams`) y ajusten su estado interno (como `activeTab`) automáticamente.

## Estructura de Planes (Waves)
- **Plan 41.1**: Personalización del Dashboard (Botón, Modal, Almacenamiento en perfil de usuario y lógica de renderizado).
- **Plan 41.2**: Implementación de Drill-down en tarjetas clave (CRM, Inventario, Ventas) y soporte en los módulos receptores.
