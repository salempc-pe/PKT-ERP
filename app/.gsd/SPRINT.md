# Sprint 1 — fix-invitation-permissions

> **Duration**: 2026-04-21 to 2026-04-22
> **Status**: In Progress

## Goal
Resolver el error "FirebaseError: Missing or insufficient permissions" que impide a los usuarios invitados configurar su contraseña inicial.

## Scope

### Included
- Investigar el flujo de configuración de contraseña en `SetupPassword.jsx`.
- Revisar las reglas de seguridad de Firestore relacionadas con invitaciones y creación de usuarios.
- Corregir el error de permisos.
- Validar el flujo completo de aceptación de invitación.

### Explicitly Excluded
- Rediseño de la interfaz de invitación.
- Cambios en el flujo de login general (a menos que sea necesario para el fix).

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Analizar el código de `SetupPassword.jsx` | Antigravity | ⏳ Todo | 1 |
| Investigar reglas de seguridad de Firestore | Antigravity | ⏳ Todo | 1 |
| Implementar corrección | Antigravity | ⏳ Todo | 2 |
| Verificar el fix | Antigravity | ⏳ Todo | 1 |

## Daily Log

### 2026-04-21
- Sprint iniciado para resolver error de permisos en invitaciones.
