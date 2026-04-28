---
phase: 35
plan: 1
wave: 1
---

# Plan de Ejecución 35.1: Cimientos y Hook de Bodega

## Objetivo
Implementar la capa de datos reactiva para el inventario de bodega, permitiendo el manejo de lotes por precio y el historial de movimientos.

## Tareas

### 1. Crear Hook `useWarehouse.js`
<task>
Crear el archivo `app/src/modules/client/inventory/useWarehouse.js` con las siguientes funciones:
- `addMovement`: Registra ingresos (nuevos lotes) y egresos (salidas a destinos).
- `stock`: Stream en tiempo real de los lotes disponibles (`warehouse_stock`).
- `history`: Stream de los últimos movimientos (`warehouse_history`).
</task>

<verify>
Verificar que el archivo se ha creado y exporta las funciones necesarias.
</verify>

---

# Plan de Ejecución 35.2: Interfaz de Usuario y Navegación

## Objetivo
Desarrollar la interfaz visual del módulo de bodega y asegurar su accesibilidad desde el menú principal.

## Tareas

### 1. Crear `WarehouseModule.jsx`
<task>
Implementar `app/src/modules/client/inventory/WarehouseModule.jsx` con:
- Diseño plano (estilo Veló).
- Buscador con dropdown editable de materiales.
- Tablas para Stock Actual e Historial.
- Modales para Ingreso y Egreso.
</task>

<verify>
Confirmar que el componente renderiza correctamente y sigue el sistema de diseño.
</verify>

### 2. Registrar en el Sidebar y Rutas
<task>
Agregar el acceso a "Bodega" en el Sidebar del cliente y configurar la ruta correspondiente en `App.jsx`.
</task>

<verify>
Validar que el módulo es accesible desde la navegación lateral.
</verify>
