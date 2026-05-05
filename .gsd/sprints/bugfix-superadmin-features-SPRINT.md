# Sprint 1 — Fix Super Admin Features

> **Duration**: 2026-05-04 to 2026-05-05
> **Status**: In Progress

## Goal
Fix impersonation mode and module management (adding/removing) in the company modal for Super Admin.

## Scope

### Included
- Fix "modo suplantación" (impersonation) for companies.
- Fix adding/removing modules in the company modal.
- Verify stability of Super Admin client management.

### Explicitly Excluded
- New features for the client module.
- Styling changes unless strictly necessary for the fix.

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Identify root cause of impersonation failure | Antigravity | ✅ Done | 1 |
| Identify root cause of module management failure | Antigravity | ✅ Done | 1 |
| Implement fixes for both issues | Antigravity | ✅ Done | 2 |
| Verify fixes in local environment | Antigravity | ✅ Done | 1 |

## Daily Log

### 2026-05-04
- Sprint creado.
- Identificada causa raíz: El listener reactivo de AuthContext sobrescribía el rol virtual de 'superadmin'.
- Implementada corrección en la lógica de detección de roles y el listener.
- Verificadas las correcciones en el navegador (suplantación y gestión de módulos funcionando).
