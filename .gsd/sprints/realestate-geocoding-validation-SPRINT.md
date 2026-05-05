# Sprint 48.1 — realestate-geocoding-validation

> **Duration**: 2026-05-04 to 2026-05-05
> **Status**: In Progress

## Goal
Implementar búsqueda automática de ubicación por dirección (Geocoding) y flexibilizar la validación de campos obligatorios en el registro de terrenos.

## Scope

### Included
- Geocoding con Nominatim (OSM) en TerrainModal.
- Actualización de TerrainSchema para hacer el precio opcional.
- Verificación de campos obligatorios (dirección, ciudad, distrito, propietario, área).

### Explicitly Excluded
- Integración con Google Maps API (se usará OSM/Nominatim).

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Flexibilizar TerrainSchema | Claude | ✅ Done | 0.2 |
| Implementar búsqueda por dirección en TerrainModal | Claude | ✅ Done | 1.0 |
| Validar campos obligatorios en UI | Claude | ✅ Done | 0.3 |
| Sincronizar estados de presentación con Pipeline | Claude | ✅ Done | 0.5 |

## Daily Log

### 2026-05-04
- Sprint iniciado.
- Precio hecho opcional en el esquema de validación.
- Implementado Geocoding en TerrainModal.
- Rediseñado Pipeline para trabajar por instancias de presentación.
- Sincronizados estados de presentación con Pipeline.
- Sprint cerrado con éxito.
