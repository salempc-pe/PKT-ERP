# Sprint 23 — fix-auth-persistence

> **Duration**: 2026-05-10 to 2026-05-10
> **Status**: In Progress

## Goal
Arreglar el error que impide mantener la sesión del usuario y muestra datos por defecto al recargar.

## Scope

### Included
- Diagnosticar la pérdida del estado del usuario.
- Revisar almacenamiento local/cookies de autenticación.
- Corregir la visualización del saludo con nombre por defecto.

### Explicitly Excluded
- Nuevas funcionalidades de autenticación.
- Rediseño de la pantalla de login.

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Investigar el flujo de carga inicial del usuario | Antigravity | ✅ Done | 0.5 |
| Corregir el mecanismo de persistencia de sesión | Antigravity | ✅ Done | 1 |
| Verificar que el saludo sea dinámico y correcto | Antigravity | ✅ Done | 0.5 |

## Daily Log

### 2026-05-10
- Sprint creado para corregir la persistencia del usuario.
- Diagnostico del flujo: se detectó un typo `usnerData` no guardado en git en `AuthContext.jsx`.
- Corrección aplicada restaurando el acceso correcto a los datos de Firestore.
- Verificación exitosa del flujo de sesión y bienvenida dinámica.

## Retrospective (2026-05-10)

### What Went Well
- Rápida identificación del typo `usnerData` en el middleware de autenticación.
- El sistema se restauró a su funcionamiento normal sin afectar otros componentes.

### What Could Improve
- Validar las ediciones locales no confirmadas que puedan romper la lógica central.

### Action Items
- [x] Aplicar hotfix al archivo local.
