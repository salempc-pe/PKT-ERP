# Sprint 2 — fix-user-dashboard-and-modules

> **Duration**: 2026-04-21 to 2026-04-22
> **Status**: Completed ✅

## Goal
Corregir la visibilidad de módulos para usuarios no-administradores y asegurar que el dashboard cargue correctamente los módulos activos de la organización.

## Scope

### Included
- Investigar y corregir la lógica de renderizado del Sidebar en `ClientLayout.jsx`.
- Investigar y corregir la carga de tarjetas en `ClientDashboard.jsx` para usuarios estándar.
- Asegurar que 'Mi Equipo' sea exclusivo para administradores.

### Explicitly Excluded
- Cambios en el diseño visual de los módulos.
- Modificación de permisos en Firestore (ya revisados en el sprint anterior).

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Analizar Sidebar en `ClientLayout.jsx` | Antigravity | ✅ Done | 1 |
| Analizar Dashboard en `ClientDashboard.jsx` | Antigravity | ✅ Done | 1 |
| Corregir lógica de visibilidad | Antigravity | ✅ Done | 2 |
| Verificar con diferentes roles | Antigravity | ✅ Done | 1 |

## Daily Log

### 2026-04-21
- Sprint iniciado para corregir acceso de usuarios estándar.
- Se restringió la visibilidad de 'Mi Equipo' y 'Configuración' en el Sidebar solo para administradores.
- Se mejoró la robustez de la carga de sesión en `AuthContext.jsx` añadiendo manejadores de errores en la carga de suscripción.
- Se corrigió el rol por defecto en invitaciones de 'client' a 'user'.
- Se integró el módulo de Compras en el Dashboard del cliente.

## Retrospective (2026-04-21)

### What Went Well
- Se identificó un error potencial de bloqueo en la carga de sesión si la petición a la organización fallaba.
- Se estandarizó la lógica de `isAdmin` en todo el flujo de autenticación.
- Se completó la integración visual del módulo de Compras.

### What Could Improve
- Los defaults en las funciones de creación de usuarios deben ser revisados periódicamente para evitar escalada de privilegios accidental.

### Action Items
- [ ] Validar que los usuarios existentes sin rol explícito no pierdan acceso.
