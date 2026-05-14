# Sprint — toggle-warehouse-module

> **Duration**: 2026-05-14 to 2026-05-15
> **Status**: In Progress

## Goal
Habilitar el control independiente para activar y desactivar el módulo de Bodega (`warehouse`) desde el panel SuperAdmin de Clientes, desvinculando su herencia implícita del módulo de Inventario.

## Scope

### Included
- Añadir el módulo `warehouse` (Bodega) a la lista `AVAILABLE_MODULES` en `AdminClients.jsx`.
- Remover la asignación automática del módulo `warehouse` cuando `inventory` está activo en `modulesConfig.js`.

### Explicitly Excluded
- Rediseños estéticos de componentes visuales en SuperAdmin o Bodega.
- Alteraciones en el control de roles dentro del módulo de Bodega.

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Registrar módulo en panel SuperAdmin (`AdminClients.jsx`) | Antigravity | ✅ Done | 0.5 |
| Eliminar herencia automática de Bodega (`modulesConfig.js`) | Antigravity | ✅ Done | 0.5 |
| Validar cambios | Antigravity | ✅ Done | 0.5 |

## Daily Log

### 2026-05-14
- Sprint creado.
- Implementada la visibilidad e independencia del módulo de Bodega.
- Todas las tareas completadas.

## Retrospective (2026-05-14)

### What Went Well
- Se identificó la raíz del problema rápidamente al notar la herencia implícita en `modulesConfig.js`.
- La implementación resolvió la necesidad de negocio sin romper compatibilidades en otras áreas.

### What Could Improve
- Mantener un listado claro de qué módulos son derivados para futuras extensiones de la aplicación.

### Action Items
- Ninguno. El módulo ahora funciona con total autonomía de toggling.
