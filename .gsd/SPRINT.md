# Sprint — warehouse-management-tab

> **Duration**: 2026-05-14 to 2026-05-15
> **Status**: In Progress

## Goal
Agregar una pestaña "Almacenes" en el módulo de Bodega (`WarehouseModule.jsx`) que permita visualizar, crear, editar y borrar almacenes compartidos con el módulo de Inventario.

## Scope

### Included
- Agregar la opción 'warehouses' al selector de pestañas (`activeTab`) en `WarehouseModule.jsx`.
- Importar funciones mutadoras (`addWarehouse`, `updateWarehouse`, `deleteWarehouse`) del hook compartido `useWarehouses`.
- Renderizar la pestaña con vista de tarjetas responsivas mostrando información básica del almacén.
- Implementar un modal específico para la creación y edición de almacenes.
- Integrar botón para eliminación física de almacenes con confirmación del usuario.

### Explicitly Excluded
- Gestión de transferencias de inventario en la misma vista (fuera de alcance por ahora).
- Alertas avanzadas o reportes analíticos exclusivos de almacenes.

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Adaptar estados y pestañas en `WarehouseModule.jsx` | Antigravity | ⬜ Todo | 0.5 |
| Implementar pestaña de listado de almacenes en UI | Antigravity | ⬜ Todo | 1.0 |
| Desarrollar modal de Formulario y lógica de eliminación | Antigravity | ⬜ Todo | 1.0 |
| Validar flujo CRUD completo compartiendo datos con Inventario | Antigravity | ⬜ Todo | 0.5 |

## Daily Log

### 2026-05-14
- Sprint creado a petición del usuario.
