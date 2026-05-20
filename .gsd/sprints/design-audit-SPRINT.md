# Sprint 2 — no-shadows

> **Duración**: 2026-05-19 to 2026-05-19
> **Estado**: En Progreso

## Objetivo
Eliminar todas las sombras (`shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`, `hover:shadow-md`) de los módulos, adoptando el estilo del CRM como referencia visual. Actualizar `design-standards.md` para codificar la regla.

## Alcance

### Incluido
- `design-standards.md` → Regla global de sombras documentada
- `SalesModule.jsx` → KPI cards con shadow-sm/hover:shadow-md
- `TeamModule.jsx` → KPI cards con shadow-sm/hover:shadow-md, modal copy button
- `AuditLogsTab.jsx` → Cards de logs con hover:shadow-lg
- `PermissionsModal.jsx` → Icon badge con shadow-lg
- `TerrainDetailsModal.jsx` → Contenedor y badges con shadow-sm/shadow-lg/shadow-2xl
- `TerrainModal.jsx` → Icon badge y section con shadow-sm/shadow-lg

### Excepciones documentadas (NO eliminar)
- `shadow-2xl` en el panel principal de modales
- `hover:shadow-[0_0_20px_rgba(...)]` en botones primarios (glow efecto)

## Tareas

| Tarea | Estado | Notas |
|-------|--------|-------|
| T1 — design-standards.md actualizado | ✅ Hecho | Regla global codificada |
| T2 — SalesModule: KPI cards | ✅ Hecho | shadow-sm + hover:shadow-md + icon shadow-sm eliminados |
| T3 — TeamModule: KPI cards + botones | ✅ Hecho | shadow-sm + hover:shadow-md + shadow-lg eliminados |
| T4 — AuditLogsTab: log cards | ✅ Hecho | hover:shadow-lg eliminado |
| T5 — PermissionsModal: icon badge | ✅ Hecho | shadow-lg shadow-purple-500/20 eliminado |
| T6 — TerrainDetailsModal: modal + badges | ✅ Hecho | shadow-lg (icon) + shadow-sm (form) + shadow-lg (label) eliminados |
| T7 — TerrainModal: icon + section | ✅ Hecho | shadow-lg shadow-purple-500/20 + shadow-sm + shadow-[glow] eliminados |

## Retrospectiva (2026-05-19)

### Qué salió bien
- El mapa de búsqueda con Select-String permitió identificar cada ocurrencia exacta sin omisiones
- Las correcciones se aplicaron en paralelo por módulo → tiempo mínimo

### Regla persistida
- `design-standards.md` ahora codifica explícitamente la regla global de sombras con la excepción de modales y glow de botones primarios

### Elementos cerrados
- 13 correcciones de sombras en 7 archivos


## Log Diario

### 2026-05-19
- Sprint creado
- design-standards.md actualizado con la regla global de sombras
