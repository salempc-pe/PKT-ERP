# Sprint 1 — fix-inventory-tables-styles

> **Duration**: 2026-05-10 to 2026-05-11
> **Status**: In Progress

## Goal
Modernizar la estética del módulo de Inventario para dar soporte nativo a Modo Oscuro y aplicar el formato de tablas expandidas de borde a borde en dispositivos móviles.

## Scope

### Included
- Reemplazar clases de color `bg-white`, `bg-gray-50`, `text-gray-900`, etc., por variables del sistema de diseño (`var(--color-...)`) en `InventoryModule.jsx`.
- Aplicar el contenedor `-mx-4 md:mx-0 border-y md:border` a las tablas del Inventario para vista móvil ancha.
- Arreglar el modal de inventario y las tarjetas de almacenes para dar soporte a modo oscuro.

### Explicitly Excluded
- Cambios de lógica funcional en el inventario.
- Funcionalidades nuevas de transferencia.

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Auditar y reemplazar clases estáticas en InventoryModule | Antigravity | ✅ Done | 1.0 |
| Adaptar wrapper de tablas para responsive expandido | Antigravity | ✅ Done | 0.5 |
| Validar soporte para modo oscuro en modales | Antigravity | ✅ Done | 0.5 |

## Daily Log

### 2026-05-10
- Sprint creado tras la petición del usuario.
- Identificadas las clases hardcodeadas y el patrón de diseño de tablas objetivo en WarehouseModule.
