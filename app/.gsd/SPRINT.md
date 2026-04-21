# Sprint 3 — fix-stuck-invitations

> **Duration**: 2026-04-21 to 2026-04-22
> **Status**: In Progress

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
| Analizar logs y flujo de `setupUserPassword` | Antigravity | ⏳ Todo | 1 |
| Implementar verificaciones de integridad | Antigravity | ⏳ Todo | 1 |
| Corregir posible fallo en `setDoc` | Antigravity | ⏳ Todo | 2 |
| Verificar limpieza de invitaciones huérfanas | Antigravity | ⏳ Todo | 1 |

## Daily Log

### 2026-04-21
- Sprint iniciado para investigar por qué las invitaciones no se activan correctamente en Firestore a pesar de que el proceso parece avanzar.
