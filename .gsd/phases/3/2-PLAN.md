---
phase: 3
plan: 2
wave: 1
---

# Plan 3.2: Refactorización Reactiva de InventoryModule

## Objective
Conectar la interfaz gráfica del Inventario a la nueva capa de datos global mediante `useInventory`, calculando dinámicamente indicadores agregados.

## Context
- .gsd/ROADMAP.md
- src/hooks/useInventory.js
- src/pages/client/InventoryModule.jsx

## Tasks

<task type="auto">
  <name>Conexión de Interfaz con Datos Globales</name>
  <files>src/pages/client/InventoryModule.jsx</files>
  <action>
    - Importar el hook `useInventory`.
    - Eliminar los arrays constantes internos (`products`).
    - Obtener dinámicamente los productos utilizando `const { products, loading } = useInventory()`.
    - Calcular dinámicamente los "Stats Indicators" como Total Productos (length) y Bajo Stock (productos con stock iterativo).
    - Mostrar un estado de "Cargando..." o Skeleton básico si `loading` es verdadero.
    - Actualizar la tabla de listado iterando la variable reactiva real.
  </action>
  <verify>Get-Content src/pages/client/InventoryModule.jsx | Select-String "useInventory"</verify>
  <done>El módulo muestra los productos inyectados y los KPIs calculados de forma dinámica.</done>
</task>

## Success Criteria
- [ ] La tabla de inventario se puebla utilizando el estado provisto por el hook `useInventory`.
- [ ] Las métricas de cabecera reflejan la realidad matemática de la data de productos existente.
