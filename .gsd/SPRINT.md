# Sprint 51.1 — fix-permissions-normal-client

> **Duration**: 2026-05-04 to 2026-05-05
> **Status**: In Progress

## Goal
Resolver errores de "Missing or insufficient permissions" en Firebase para usuarios con rol 'cliente' en los módulos de CRM, Almacén y Compras.

## Scope

### Included
- Investigar y corregir `useCrm.js` (interacciones y leads).
- Investigar y corregir `useWarehouse.js` (history stream).
- Investigar y corregir `PurchasesDashboardCard.jsx` (purchase stats).
- Auditoría y ajuste de `firestore.rules`.

### Explicitly Excluded
- Creación de nuevos módulos.
- Cambios en la lógica de negocio no relacionados con permisos.

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Analizar `firestore.rules` y comparar con consultas fallidas | Claude | ✅ Done | 0.5 |
| Corregir permisos en CRM (`useCrm.js`) | Claude | ✅ Done | 0.5 |
| Corregir permisos en Almacén (`useWarehouse.js`) | Claude | ✅ Done | 0.5 |
| Corregir permisos en Compras (`PurchasesDashboardCard.jsx`) | Claude | ✅ Done | 0.5 |

## Daily Log

### 2026-05-04
- Sprint creado para atender errores de permisos reportados por el usuario cliente.
- Refactorizadas funciones `isSuperAdmin`, `isOrgAdmin` y `getUserOrg` en `firestore.rules` para evitar errores de ejecución cuando el documento de usuario no está disponible.
- Implementada lógica defensiva en `useCrm.js`, `useWarehouse.js` y `PurchasesDashboardCard.jsx` para evitar suscripciones a la organización por defecto (`default_org`).
- Sincronizados componentes de UI (`CRMModule`, `WarehouseModule`) para manejar estados de carga y IDs de organización de forma más robusta.
