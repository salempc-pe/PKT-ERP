---
phase: 4
plan: 2
wave: 2
---

# Plan 4.2: Vista de Módulo de Ventas e Integración UI

## Objective
Desarrollar `SalesModule.jsx` utilizando los patrones de diseño UI existentes, enlazar el hook `useSales` para listar facturas, y conectar el módulo en la navegación lateral e integrarlo en `App.jsx`. También, agregar el formulario para registrar una nueva venta, consultando el hook `useCrm` y `useInventory` para popular listas de selección.

## Context
- .gsd/SPEC.md
- src/layouts/ClientLayout.jsx (Para link de sidebar)
- src/App.jsx (Para registro de Route)
- src/pages/client/InventoryModule.jsx (Referencia visual glassmorphism y tabla)

## Tasks

<task type="auto">
  <name>Crear UI Principal SalesModule.jsx</name>
  <files>src/pages/client/SalesModule.jsx</files>
  <action>
    - Crear `SalesModule.jsx`.
    - Importar `useAuth` y `useSales`, así como íconos `lucide-react` (FileText, DollarSign, Plus).
    - Diseñar 4 status boxes ("Ventas Totales", "Pendientes", etc.) similares a inventario.
    - Diseñar tabla "Historial de Facturación" mapeando el estado de las variables `sales`.
    - Crear un Modal para "Nueva Factura/Venta".
    - El Modal deberá usar `useCrm` para obtener los clientes y armar un dropdown o listado de contactos a elegir.
    - El modal deberá usar `useInventory` para seleccionar un producto (con input de cantidad).
    - Sumar precio del producto seleccionado * cantidad, y registrar la información general de la venta calculando montos al hacer Submit.
  </action>
  <verify>Verificar que el componente se exporta de forma correcta.</verify>
  <done>El componente visualiza el total vendido y el listado de facturas pagadas/pendientes. Se puede abrir el modal para agregar nueva venta.</done>
</task>

<task type="auto">
  <name>Integración de Rutas y Navegación</name>
  <files>src/App.jsx, src/layouts/ClientLayout.jsx</files>
  <action>
    - **En App.jsx**: Agregar ruta `Route path="sales" element={<SalesModule />}` dentro del envoltorio `<Route path="/dashboard"...`. Importar el módulo correspondiente.
    - **En ClientLayout.jsx**: Agregar un item al array `navItems` `[ { path: '/dashboard/sales', label: 'Ventas', icon: <FileText size={20} /> } ]` para que el módulo sea visible y navegable desde el Sidebar.
  </action>
  <verify>Verificar que la sintaxis de App.jsx y ClientLayout no presenta errores.</verify>
  <done>El enlace de ventas se encuentra en el menú del cliente y renderiza el componente sin errores en React Router.</done>
</task>

## Success Criteria
- [ ] La pestaña de Ventas (Sales) está disponible en la app Client y redirige exitosamente.
- [ ] Se leen correctamente los mocks y los hooks de inventory y CRM dentro del módulo de ventas para agilizar los "combobox" del formulario de creación.
