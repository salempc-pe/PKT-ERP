# Sprint — warehouse-layout-refresh

> **Duration**: 2026-05-14 to 2026-05-14
> **Status**: Completed

## Goal
Rediseñar el layout de Bodega alineándolo visual y funcionalmente con el módulo de Inventario, reestructurando la cabecera, pestañas, botones principales y expandiendo las métricas a una cuadrícula de tarjetas dedicada.

## Scope

### Included
- Mover las pestañas de navegación (Escritorio/Móvil) y el botón de acción principal ("Registrar Ingreso" / "Nuevo Almacén") a una cabecera común en la parte superior.
- Desglosar la caja de estadísticas superior en una rejilla dedicada de 4 tarjetas responsivas (Total Materiales, Almacenes, Alertas Stock, Inversión Total).
- Implementar cálculo reactivo (`useMemo`) para el conteo de alertas de bajo stock.
- Adaptar la barra intermedia para que albergue únicamente la barra de búsqueda y el filtro por Almacén (cuando no esté en la pestaña de almacenes).

### Explicitly Excluded
- Modificación funcional del proceso de registro de entradas/salidas o alertas.
- Cambios en la cuadrícula de tarjetas de almacén individuales.

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Calcular métricas y registrar los hooks de estadísticas en `WarehouseModule.jsx` | Antigravity | ✅ Done | 0.5 |
| Implementar nueva Cabecera unificada de Pestañas y Botón de Acción | Antigravity | ✅ Done | 0.75 |
| Crear cuadrícula responsiva de Tarjetas de Estadísticas (Estilo Inventario) | Antigravity | ✅ Done | 0.75 |
| Reestructurar la sub-barra de búsquedas y filtros | Antigravity | ✅ Done | 0.5 |
| Validar el build estático y consistencia visual | Antigravity | ✅ Done | 0.25 |

## Daily Log

### 2026-05-14
- Sprint iniciado para homologar la UI entre Bodega e Inventario.
- Agregados hooks `useMemo` para `lowStockCount` y el objeto descriptor `warehouseStats`.
- Reestructurada la cabecera incorporando las pestañas tipo píldora y el botón dinámico a la derecha.
- Creada la rejilla de 4 tarjetas reactivas con iconos temáticos de lucide.
- Limpieza profunda del bloque intermedio de filtros para maximizar la claridad en desktop y móvil.
- Verificación y validación estática exitosa del build de Vite.

## Retrospective (2026-05-14)

### What Went Well
- La refactorización se ejecutó de forma extremadamente limpia respetando la estructura de Tailwind e inline CSS Variables establecida para el modo oscuro de Bodega.
- La implementación de `lowStockCount` vía memo dinámico añade un valor inmediato al usuario al permitirle ver alertas globales de stock sin tener que inspeccionar fila por fila.
- Las tarjetas encajan perfectamente en el espacio disponible gracias a que el contenedor padre ya tenía un comportamiento responsivo correcto.

### What Could Improve
- Se podría agregar en futuros sprints un click listener a la tarjeta de 'Alertas Stock' para filtrar la tabla de materiales y mostrar únicamente aquellos por debajo del mínimo de manera automática.

### Action Items
- [ ] Opcional: Añadir atajos rápidos de filtrado al hacer click en las tarjetas de métricas.
