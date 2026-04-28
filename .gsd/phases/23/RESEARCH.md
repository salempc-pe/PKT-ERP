# Research Phase 23: Enterprise Security & Multi-Tenant User Management

## Objetivo General
Implementar un sistema robusto de invitaciones, roles (Admin/User) y límites de cuota (maxUsers), con aislamiento real mediante Reglas de Seguridad en Firestore (`organizationId`).

## Hallazgos Actuales
1. Actualmente `AdminClients.jsx` gestiona la asignación de usuarios y roles simulados (`client`, `employee`, etc.), pero estos usuarios no tienen una validación de `maxUsers` en la organización.
2. Los roles actuales en el select de `AdminClients.jsx` ("client", "employee", "accountant", "sales") se pueden condensar o adaptar al requerimiento: al menos deben mapear internamente a permisos "Admin" y "User" dentro del `AuthContext`.
3. `firestore.rules` contiene reglas sumamente básicas (`allow read, write: if request.auth != null;`). Esto debe actualizarse para aislar los documentos según el `organizationId` del JWT o del documento del usuario.

## Requerimientos Técnicos
1. **AdminOrganizations (`maxUsers`)**: En el esquema de `mockOrganizations` (y posteriormente Firebase), añadir un campo `maxUsers` (número, ej: 5, 10, 50).
2. **Validación de Cuotas**: Cuando se agrega una invitación o un nuevo usuario (ya sea desde Admin o Cliente), comparar el total de usuarios ligados a ese `orgId` contra el `maxUsers`. Si lo excede, mostrar error.
3. **Módulo de Gestión de Equipo**: Crear una vista nueva (`TeamModule.jsx`) para que el `Admin` del lado Cliente pueda invitar gente a suTenant (`organizationId`) usando links mágicos (copiar link), de forma parecida a lo que se hace hoy en AdminClients, pero sin ver a otras organizaciones.
4. **AuthContext**: Asegurar que al estar logueado, `user.role` define si ven el menú de "Gestión de Equipo".
5. **Firebase Security Rules**: Reglas estilo `allow read: if request.auth.uid != null && resource.data.organizationId == request.auth.token.organizationId` (si usamos Custom Claims) o haciendo match de la colección local de usuarios. Dado que Firebase puede no tener el `organizationId` en el token Auth aún, las reglas pueden basarse en un Get al documento de usuario: `get(/databases/$(database)/documents/users/$(request.auth.uid)).data.organizationId`.

## Decisiones Arquitectónicas
- **Reglas de Firestore**: Usaremos la consulta recursiva de seguridad `get(/databases/(database)/documents/users/(request.auth.uid)).data.organizationId` para validar todas las demás colecciones (crm, inventory, sales, projects, etc.).
- **Roles**: En AuthContext y Firebase, un usuario tendrá `role: 'admin'` (Dueño/Gestor del tenant) o `role: 'user'` (colaborador).
- **Gestor de Invitaciones**: ClienteAdmin no envía correos reales aún, se genera un enlace (como hace `AdminClients`) que el Admin puede copiar y enviar por WhatsApp/Email al invitado.

## Riesgos y Mitigaciones
- Las reglas de Firestore pueden volverse verbosas. Construiremos una función genérica en las reglas de seguridad de Firestore para simplificar: `function isUserInOrg(orgId) { return ... }`.
