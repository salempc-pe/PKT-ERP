---
phase: 30
plan: 2
wave: 1
---

# Plan 30.2: Rediseño del Módulo de Inventario (Mobile)

## Objective
Mejorar la visualización del listado de inventario en dispositivos móviles, eliminando elementos estéticos y métricas redundantes que consumen espacio (las 4 tarjetas resumen) y maximizando el área útil con una lista que soporte scroll bidireccional (horizontal y vertical).

## Context
- .gsd/ROADMAP.md
- src/modules/client/inventory/InventoryModule.jsx

## Tasks

<task type="auto">
  <name>Eliminar Tarjetas de Resumen en Inventario (Solo Móvil)</name>
  <files>
    - src/modules/client/inventory/InventoryModule.jsx
  </files>
  <action>
    - Localizar la cuadrícula (grid) que renderiza las 4 tarjetas de resumen de inventario superior.
    - Aplicar clases responsivas de Tailwind (ej. `hidden md:grid` o `hidden lg:grid`) para ocultar estas tarjetas en resoluciones móviles, ahorrando espacio vertical.
    - Opcionalmente, eliminarlas por completo si se considera que ya no son necesarias en la nueva visión. Según la solicitud, "elimines las cuatro tarjetas de resumen del módulo de inventario", por lo que si prefieres eliminarlas totalmente en todas las vistas (o ocultarlas en móvil), haz lo más fiel a "eliminar". Sugiero `hidden lg:grid` o borrar el bloque.
  </action>
  <verify>Visualizar el módulo de Inventario en modo responsivo y confirmar que no hay tarjetas resumen.</verify>
  <done>Las tarjetas resumen de inventario no son visibles en pantallas pequeñas.</done>
</task>

<task type="auto">
  <name>Rediseñar Listado de Inventario para Scroll</name>
  <files>
    - src/modules/client/inventory/InventoryModule.jsx
  </files>
  <action>
    - Eliminar el "formato de tarjeta" estético (`bg-white`, `shadow`, borders gruesos, etc.) que envuelve cada ítem de la lista o la tabla, para ahorrar márgenes y paddings.
    - Implementar un contenedor con `overflow-x-auto` y `overflow-y-auto` que permita desplazar la lista de manera horizontal y vertical libremente en el celular.
    - Asegurar que el contenido ocupe el mayor ancho posible (quitar paddings laterales excesivos en móvil).
  </action>
  <verify>Probar el listado de inventario en móvil y comprobar que el scroll en ambos ejes funciona correctamente sin cortarse o forzar anchos.</verify>
  <done>La lista de inventario es desplazable en todas las direcciones y no utiliza un layout de tarjetas voluminosas.</done>
</task>

## Success Criteria
- [ ] Las 4 tarjetas de resumen no se muestran en mobile.
- [ ] La tabla/lista principal de inventario no tiene formato de tarjeta estética con bordes excesivos.
- [ ] La lista permite scroll horizontal y vertical de manera natural en un celular.
