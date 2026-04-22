# Sprint 16 — Fix Firebase Config

> **Duration**: 2026-04-22 to 2026-04-23
> **Status**: In Progress

## Goal
Resolver el error `auth/invalid-api-key` y realizar ajustes estéticos en el panel de SuperAdmin (PKT ERP branding).

## Scope

### Included
- Verificar el archivo `.env` local.
- Validar la carga de variables de entorno en la configuración de Firebase (`src/services/firebase.js`).
- Corregir la inicialización de Firebase.
- Asegurar que `.env.example` tenga todas las claves necesarias (sin valores).

### Explicitly Excluded
- Nuevas funcionalidades de autenticación.
- Despliegue a Netlify/Firebase hosting.

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Verificar `.env` y contrastar con `firebase.js` | Antigravity | ✅ Done | 0.5 |
| Corregir mapeo de variables en `firebase.js` | Antigravity | ✅ Done | 0.5 |
| Validar inicialización en consola | Antigravity | ⬜ Todo | 0.5 |
| Branding: Cambiar "Studio Alpha" a "PKT ERP" en AdminLayout | Antigravity | ✅ Done | 0.2 |
| Branding: Renombrar "Tenants / Clients" a "Clientes" | Antigravity | ✅ Done | 0.1 |

## Daily Log

### 2026-04-22
- Sprint creado para solucionar el error de API Key detectado en consola.
- Se re-escribió el archivo `.env` en UTF-8 para evitar problemas de codificación.
- Se mejoraron los diagnósticos en `src/services/firebase.js`.
- Actualizado el branding del SuperAdmin: "Studio Alpha" -> "PKT ERP" y removido subtítulo.
- Refinado el título: Removido "(Admin)" y aplicado gradiente a "ERP" (branding unificado).
- Renombrado el módulo "Tenants / Clients" a "Clientes" en el sidebar.
