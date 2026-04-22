# Sprint 16 — Fix Firebase Config

> **Duration**: 2026-04-22 to 2026-04-23
> **Status**: In Progress

## Goal
Resolver el error `auth/invalid-api-key` y asegurar que las variables de entorno de Firebase estén correctamente configuradas en el entorno local.

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
| Verificar `.env` y contrastar con `firebase.js` | Antigravity | ⬜ Todo | 0.5 |
| Corregir mapeo de variables en `firebase.js` | Antigravity | ⬜ Todo | 0.5 |
| Validar inicialización en consola | Antigravity | ⬜ Todo | 0.5 |

## Daily Log

### 2026-04-22
- Sprint creado para solucionar el error de API Key detectado en consola.
