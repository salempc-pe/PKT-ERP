---
phase: 30
plan: 3
wave: 2
---

# Plan 30.3: Rediseño Móvil en Contabilidad y Ventas

## Objective
Aplicar la misma lógica de optimización móvil que en Inventario para los módulos de Contabilidad (Finance) y Ventas y Facturas (Sales). Esto implica quitar las tarjetas de resumen y usar un formato de lista sin bordes estéticos de tarjeta, habilitando el scroll bidireccional.

## Context
- .gsd/ROADMAP.md
- src/modules/client/finance/FinanceModule.jsx
- src/modules/client/sales/SalesModule.jsx

## Tasks

<task type="auto">
  <name>Rediseño Móvil del Módulo de Contabilidad</name>
  <files>
    - src/modules/client/finance/FinanceModule.jsx
  </files>
  <action>
    - Ocultar (con `hidden lg:grid`) o eliminar las tarjetas de resumen superior (ingresos, gastos, etc.) en pantallas móviles para ahorrar espacio vertical.
    - Quitar el formato estético tipo tarjeta de la lista principal de contabilidad, estandarizando el estilo con el de Inventario (sin márgenes ni paddings voluminosos).
    - Asegurar que la tabla/lista tenga `overflow-x-auto` y `overflow-y-auto` para facilitar el desplazamiento libre en pantallas pequeñas.
  </action>
  <verify>Revisar visualmente el módulo de Finanzas/Contabilidad en modo móvil y verificar que no hay tarjetas resumen y el scroll funciona.</verify>
  <done>El módulo de Contabilidad refleja las mismas mejoras de visualización de listas de Inventario y no muestra tarjetas resumen.</done>
</task>

<task type="auto">
  <name>Rediseño Móvil del Módulo de Ventas y Facturas</name>
  <files>
    - src/modules/client/sales/SalesModule.jsx
  </files>
  <action>
    - Ocultar (con `hidden lg:grid`) o eliminar las tarjetas de resumen superior del módulo de Ventas en pantallas móviles.
    - Remover la estética de tarjeta del contenedor del listado de ventas para mejorar la legibilidad y usar todo el ancho disponible.
    - Configurar scroll horizontal y vertical (`overflow-x-auto overflow-y-auto`) en la lista de ventas.
  </action>
  <verify>Revisar el módulo de Ventas en vista responsiva para asegurar la usabilidad mejorada.</verify>
  <done>El listado de Ventas se ve limpio, sin tarjetas resumen superiores, y se desplaza cómodamente.</done>
</task>

## Success Criteria
- [ ] Módulo de Contabilidad no muestra tarjetas resumen en móvil y la lista tiene scroll.
- [ ] Módulo de Ventas no muestra tarjetas resumen en móvil y la lista tiene scroll.
- [ ] El estilo visual de las listas es coherente entre Inventario, Contabilidad y Ventas.
