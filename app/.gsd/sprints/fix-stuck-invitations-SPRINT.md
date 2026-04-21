# Sprint 3 — fix-stuck-invitations

> **Duration**: 2026-04-21 to 2026-04-22
> **Status**: Completed ✅

## Goal
Resolver el problema donde las invitaciones se quedan en estado "pendiente" y no logran crear el documento de usuario final con el UID de Auth.

## Scope

### Included
- Investigar fallos silenciosos en `setupUserPassword`.
- Mejorar el manejo de errores en la activación de cuenta.
- Asegurar que el documento temporal se elimine SOLO si el nuevo se creó correctamente.
- Validar consistencia de datos entre Auth y Firestore.

### Explicitly Excluded
- Cambios en el diseño del dashboard.
- Modificación de la lógica de roles (ya ajustada).

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Analizar logs y flujo de `setupUserPassword` | Antigravity | ✅ Done | 1 |
| Implementar verificaciones de integridad | Antigravity | ✅ Done | 1 |
| Corregir posible fallo en `setDoc` | Antigravity | ✅ Done | 2 |
| Verificar limpieza de invitaciones huérfanas | Antigravity | ✅ Done | 1 |

## Daily Log

### 2026-04-21
- Sprint iniciado para investigar por qué las invitaciones no se activan correctamente en Firestore.
- Se implementó una lógica de auto-reparación en `onAuthStateChanged` que activa perfiles si el usuario ya está autenticado pero el documento en Firestore es antiguo o inexistente.
- Se mejoró `setupUserPassword` para manejar el error `auth/email-already-in-use` permitiendo completar activaciones interrumpidas.
- Se aseguró la eliminación de documentos temporales de invitación tras una activación exitosa.

## Retrospective (2026-04-21)

### What Went Well
- La lógica de auto-reparación soluciona preventivamente fallos de red o cierres de pestaña durante el onboarding.
- Se identificó la causa de las duplicidades en el modal de SuperAdmin.

### What Could Improve
- El flujo de invitación sigue dependiendo de múltiples pasos que podrían fallar de forma asíncrona; se recomienda mover parte de esta lógica a Cloud Functions en el futuro para mayor atomicidad.

### Action Items
- [ ] Monitorear si aparecen nuevos usuarios duplicados en el panel de SuperAdmin.
