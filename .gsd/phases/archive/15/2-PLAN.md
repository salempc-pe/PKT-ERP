---
phase: 15
plan: 2
wave: 2
---

# Plan 15.2: AdminBillingModule + Auditoría con filtros por Organización

## Objective
Dos mejoras de visibilidad y separación de contextos:
1. Crear un `AdminBillingModule.jsx` propio para `/admin/sales` que muestre las facturas/transacciones del SaaS y permita seleccionar la organización del cliente. El módulo de admin NO debe ser el mismo componente que el del cliente.
2. Mejorar `ActivityLogs.jsx` agregando columna "Organización", filtro por organización y filtro por tipo de actor (org vs super admin), para escalar bien a múltiples tenants.

## Context
- `.gsd/SPEC.md`
- `.gsd/ARCHITECTURE.md`
- `src/App.jsx` — ruta `/admin/sales` actualmente usa `SalesModule` del cliente (línea 64)
- `src/modules/client/sales/SalesModule.jsx` — referencia de lo que NO debe usarse en admin
- `src/modules/admin/ActivityLogs.jsx` — vista de auditoría actual
- `src/context/AuthContext.jsx` — `mockOrganizations`, `mockActivityLogs`

## Tasks

<task type="auto">
  <name>Crear AdminBillingModule.jsx con selector de organización</name>
  <files>src/modules/admin/billing/AdminBillingModule.jsx</files>
  <action>
    Crear el archivo `src/modules/admin/billing/AdminBillingModule.jsx` con:

    ESTRUCTURA:
    - Header "Facturación SaaS" con descripción "Gestión de ingresos y suscripciones activas."
    - Selector dropdown de organización (usa `mockOrganizations` del AuthContext). Primera opción: "Todas las organizaciones".
    - KPI cards: MRR Total (suma de todas las orgs activas), Orgs Activas (count), Plan más común.
    - Tabla de organizaciones activas con columnas: Organización | Plan | MRR | Estado | Fecha inicio.
      - Datos calculados a partir de `mockOrganizations` y `SUBSCRIPTION_PLANS`.
      - Si hay org seleccionada en el selector, filtrar la tabla a esa org y mostrar detalle.
    - Diseño consistente con el resto del admin (colores `#060e20`, `#091328`, `#85adff`, `#dee5ff`, bordes `#40485d/30`, `rounded-3xl`).

    DATOS MOCK (si no existen en AuthContext, calcularlos localmente):
    - MRR por org: `SUBSCRIPTION_PLANS[org.subscription?.planId]?.price || 0`
    - Si SUBSCRIPTION_PLANS no tiene precio, usar valores: startup=0, business=99, enterprise=299.

    IMPORTACIONES NECESARIAS:
    - `useState` de react
    - `useAuth` de context
    - íconos de lucide-react: `Building2, CreditCard, TrendingUp, DollarSign, Filter`

    EVITAR: reutilizar SalesModule del cliente. Este módulo es 100% administrativo de ingresos SaaS.
  </action>
  <verify>Test-Path "src/modules/admin/billing/AdminBillingModule.jsx"</verify>
  <done>El archivo existe y exporta default `AdminBillingModule`.</done>
</task>

<task type="auto">
  <name>Registrar AdminBillingModule en App.jsx y actualizar ActivityLogs</name>
  <files>src/App.jsx, src/modules/admin/ActivityLogs.jsx</files>
  <action>
    ### En App.jsx:
    1. Agregar import: `import AdminBillingModule from './modules/admin/billing/AdminBillingModule';`
    2. Reemplazar la ruta: `<Route path="sales" element={<SalesModule />} />`
       por: `<Route path="sales" element={<AdminBillingModule />} />`
    3. Si `SalesModule` ya no se usa en rutas admin, verificar que el import del cliente siga existiendo para rutas `/client/sales`.

    ### En ActivityLogs.jsx:
    1. Importar `mockOrganizations` y destructurarlo desde `useAuth()`.
    2. Agregar estado: `const [orgFilter, setOrgFilter] = useState('all');`
    3. Agregar estado: `const [actorFilter, setActorFilter] = useState('all');` (all | org | superadmin)
    4. Agregar lógica de filtrado adicional al `filteredLogs` existente:
       ```js
       .filter(log => orgFilter === 'all' || log.orgId === orgFilter)
       .filter(log => actorFilter === 'all' || log.actorType === actorFilter)
       ```
       (Si los logs no tienen `orgId` ni `actorType`, mostrar igualmente todos — no romper si el campo no existe.)
    5. Agregar fila de filtros encima de la tabla (debajo del search bar):
       - Select "Organización" con opción "Todas" + una opción por cada org en `mockOrganizations`.
       - Select "Actor" con opciones: Todos | Organización | Super Admin.
    6. Agregar columna "Organización" en la tabla entre "Usuario" y "Acción":
       - Valor: buscar en `mockOrganizations` la org cuyo id coincida con `log.orgId`, mostrar `org.name`. Si no hay `orgId`, mostrar "—".
    7. Actualizar el colspan del mensaje vacío de 5 a 6.

    EVITAR: modificar la estructura de `mockActivityLogs` en AuthContext — solo leer datos.
    EVITAR: romper el filtro de texto existente.
  </action>
  <verify>grep -n "AdminBillingModule\|orgFilter\|actorFilter\|Organización" src/App.jsx src/modules/admin/ActivityLogs.jsx</verify>
  <done>
    - App.jsx importa y usa `AdminBillingModule` en ruta `/admin/sales`.
    - ActivityLogs tiene filtros de org y actor, y columna Organización visible en la tabla.
  </done>
</task>

## Success Criteria
- [ ] `/admin/sales` muestra `AdminBillingModule`, no `SalesModule` del cliente
- [ ] El nombre de cada organización activa es visible en la tabla de billing
- [ ] El selector de organización filtra correctamente la tabla de billing
- [ ] La auditoría muestra filtro "Organización" funcional
- [ ] La auditoría muestra filtro "Actor" (org vs superadmin) funcional
- [ ] La auditoría tiene columna "Organización" en la tabla
