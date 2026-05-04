# Research: Phase 50 - Equipo: ACL Granular, Audit Log y Sesiones

## Discovery Protocol
**Level 3 - Deep Dive**: Implementación de seguridad interna (RBAC/ACL), trazabilidad y control de acceso concurrente en Firebase.

## 1. ACL Granular (Access Control List)
Actualmente, el sistema se basa en un rol simple (`admin` o `user`). Para soportar permisos granulares por módulo y acción (Leer, Crear, Editar, Eliminar):
- **Data Model**: Extender el documento del usuario en `organizations/{orgId}/users/{userId}` o en la colección global `users/{uid}` para incluir un objeto `permissions` o `acl`.
  ```json
  "permissions": {
    "CRM": { "read": true, "create": true, "update": true, "delete": false },
    "INVENTORY": { "read": true, "create": false, "update": false, "delete": false }
  }
  ```
- **Contexto (AuthContext)**: Crear un helper `hasPermission(module, action)` que lea los permisos del usuario activo y devuelva un booleano.
- **UI**: Los componentes críticos (botones de Guardar, Eliminar) usarán este helper para renderizarse o bloquearse.

## 2. Audit Log (Registro de Auditoría)
Para responder a "quién hizo qué y cuándo":
- **Data Model**: Nueva subcolección `organizations/{orgId}/audit_logs`.
  - Campos: `timestamp`, `userId`, `userName`, `module` (ej. 'CRM'), `action` (ej. 'DELETE_CLIENT'), `details` (ej. 'Eliminó al cliente Juan Pérez').
- **Implementación**: Crear un helper `useAuditLog.js` que exporte una función `logAction`. Esta función debe invocarse en los handlers de éxito de mutaciones importantes (ej. al terminar `addDoc` o `deleteDoc`).
- **UI**: Añadir una pestaña "Registro de Actividad" o "Auditoría" en el módulo de Equipo (`TeamModule.jsx`) exclusiva para administradores.

## 3. Sesiones Activas y Cierre Remoto
- **Data Model**: Como Firebase Auth maneja los tokens opacamente, podemos rastrear las sesiones guardando un registro en Firestore al iniciar sesión: `users/{userId}/sessions/{sessionId}`.
- Sin embargo, para forzar el cierre, podemos almacenar un campo `sessionRevokedAt` (timestamp) en el perfil de usuario. 
- **Lógica en el Cliente**: En el `AuthContext`, si `userProfile.sessionRevokedAt` es mayor que la hora actual (o se detecta un cambio en vivo), se ejecuta `signOut(auth)`.
- **UI**: En la gestión de usuarios del equipo, el Admin puede hacer clic en "Cerrar todas las sesiones" para un colaborador específico.

## Estructura de Tareas
- **Plan 50.1**: Sistema de ACL Granular (Modelo, Contexto y Configuración en UI).
- **Plan 50.2**: Infraestructura y Visor de Audit Logs.
- **Plan 50.3**: Control de Sesiones y Cierre Remoto.
