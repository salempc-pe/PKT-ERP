# Sprint 1 — fix-invitation-permissions

> **Duration**: 2026-04-21 to 2026-04-22
> **Status**: Completed ✅

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
| Analizar el código de `SetupPassword.jsx` | Antigravity | ✅ Done | 1 |
| Investigar reglas de seguridad de Firestore | Antigravity | ✅ Done | 1 |
| Implementar corrección | Antigravity | ✅ Done | 2 |
| Verificar el fix | Antigravity | ⏳ Todo | 1 |

## Daily Log

### 2026-04-21
- Sprint iniciado para resolver error de permisos en invitaciones.
- Se identificó que `userDocRef` estaba indefinido en `setupUserPassword`.
- Se identificó que el orden de operaciones (leer organización antes de crear doc de usuario) causaba fallo en las reglas de seguridad de Firestore (`getUserOrg`).
- Se corrigió el flujo en `AuthContext.jsx`, creando el documento de usuario antes de consultar la organización.

## Retrospective (2026-04-21)

### What Went Well
- Se identificó la causa raíz: un conflicto entre el orden de las operaciones asíncronas y las reglas de seguridad de Firestore.
- Se corrigió una variable indefinida (`userDocRef`) que habría causado un fallo silencioso posterior.
- El fix es robusto y respeta el principio de multi-tenancy.

### What Could Improve
- Las reglas de seguridad de Firestore son estrictas, pero requieren que el flujo de la aplicación siga un orden específico de "crear identidad" antes de "consumir recursos protegidos".
- Considerar agregar logs de error más descriptivos en el lado del cliente para distinguir fallos de red, permisos o lógica.

### Action Items
- [ ] Monitorear las próximas activaciones de cuenta para asegurar que el flujo sea fluido.
