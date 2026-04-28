---
phase: 36
plan: 1
wave: 1
---

# Plan 36.1: Títulos Móviles y Módulos Core (Inventario/Bodega/Ventas)

## Objective
Ajustar la tipografía del título principal en dispositivos móviles para que sea más delicado y optimizar el layout principal y los módulos core para que las tablas ocupen el 100% del ancho (full-width) en móviles, eliminando los márgenes y bordes de las tarjetas.

## Context
- .gsd/ROADMAP.md
- src/layouts/client/ClientLayout.jsx
- src/modules/client/inventory/InventoryModule.jsx
- src/modules/client/inventory/WarehouseModule.jsx
- src/modules/client/sales/SalesModule.jsx

## Tasks

<task type="auto">
  <name>Refinar ClientLayout para dispositivos móviles</name>
  <files>src/layouts/client/ClientLayout.jsx</files>
  <action>
    - En el componente `ClientLayout`, modificar la clase del título en versión móvil (actualmente `text-4xl font-black uppercase tracking-tighter`). Cambiarlo por algo más delicado, como `text-2xl font-bold tracking-tight text-[var(--color-on-surface)]` y quitar `uppercase`.
    - Ajustar el padding del contenedor `main`. Actualmente es `p-6 pt-28 lg:p-10`. Cambiarlo en móvil a un padding horizontal menor (ej. `px-2 sm:px-6`) o directamente permitir que las listas tomen `px-0` (modificando `max-w-7xl mx-auto`). Para no romper otras vistas, podemos reducir el padding en móvil a `p-4 pt-24 lg:p-10` y manejar el sangrado completo dentro de los módulos.
  </action>
  <verify>npm run build</verify>
  <done>El título móvil es más sutil y el main tiene márgenes reducidos en móvil.</done>
</task>

<task type="auto">
  <name>Tablas a Ancho Completo en Módulos Core</name>
  <files>
    - src/modules/client/inventory/InventoryModule.jsx
    - src/modules/client/inventory/WarehouseModule.jsx
    - src/modules/client/sales/SalesModule.jsx
  </files>
  <action>
    - Localizar el contenedor de la tabla, usualmente con clases como `overflow-auto border border-[var(--color-outline-variant)] rounded-xl bg-[var(--color-surface-container-low)]`.
    - Modificar las clases para que en móviles (menos que `md` o `sm`) NO tenga borde, NO tenga `rounded`, y el contenedor pueda tener un ancho completo (si el padding del `main` aún molesta, usar `-mx-4 md:mx-0`).
    - Ejemplo de cambio de clases: `overflow-x-auto border-y md:border border-[var(--color-outline-variant)] md:rounded-xl bg-transparent md:bg-[var(--color-surface-container-low)] -mx-4 md:mx-0`.
    - Mantener el diseño encajonado y con bordes a partir de la versión desktop/tablet (`md:`).
  </action>
  <verify>npm run build</verify>
  <done>Las tablas en Inventory, Warehouse y Sales carecen de bordes redondos en móviles y aprovechan todo el ancho.</done>
</task>

## Success Criteria
- [ ] Título móvil es sutil y respira mejor.
- [ ] El contenedor del layout provee espacio eficiente en móvil.
- [ ] En móvil, las tablas de Inventory, Warehouse y Sales se ven de lado a lado.
