# Sprint 1 — Real Auth Flow & Mock Cleanup

> **Duration**: 2026-04-19 to 2026-04-20
> **Status**: In Progress

## Goal
Implementar la creación real de organizaciones y usuarios desde cero sin depender de datos de prueba locaes, corrigiendo los errores de permisos de Firestore y limpiando todo el mock data de la app.

## Scope

### Included
- Limpiar `INITIAL_MOCK_USERS`, `mockOrganizations`, y cualquier referencia a `localStorage('pkt_mock_users')`.
- Corregir error de permisos al crear organización (asegurar que exista un verdadero SuperAdmin en Firestore).
- Implementar el flujo real donde el SuperAdmin crea una organización y su primer usuario (Tenant Admin / `client`).
- Implementar flujo real donde el Tenant Admin invita usuarios.

### Explicitly Excluded
- Creación de nuevos módulos o funcionalidades ajenas a la autenticación.

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Limpiar mock data en AuthContext.jsx | Claude | ⬜ Todo | — |
| Crear script de seeder para el Super Admin | Claude | ⬜ Todo | — |
| Arreglar reglas de Firestore y creación de Org | Claude | ⬜ Todo | — |
| Ajustar vistas (Login, Team, Clients) sin mock | Claude | ⬜ Todo | — |

## Daily Log

### 2026-04-19
- Sprint created 
