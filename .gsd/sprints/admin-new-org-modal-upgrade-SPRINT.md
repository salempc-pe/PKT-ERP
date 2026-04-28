# Sprint 3 — Admin Create Org Modal Upgrade

> **Duration**: 2026-04-19 to 2026-04-20
> **Status**: In Progress

## Goal
Expandir el modal de "Nueva Organización" en AdminClients.jsx para que incluya todas las opciones de configuración (plan, módulos, límites y primer usuario admin) que tiene el modal de edición, permitiendo un alta completa desde el primer paso.

## Scope

### Included
- Actualizar el estado `newOrgData` para incluir `planId`, `activeModules` y datos del primer admin.
- Reutilizar o duplicar los componentes visuales de selección de plan y módulos en el modal de creación.
- Ajustar la función `handleCreateOrg` para procesar el alta completa.
- Asegurar que la estética premium se mantenga en el nuevo diseño expandido.

### Explicitly Excluded
- Cambios en el backend/Firestore (se asume que la función de orquestación ya soporta o se ajustará mínimamente).
- Nuevas funcionalidades de facturación aparte de la selección del plan.

## Tasks

| Task | Assignee | Status | Est. Hours |
|------|----------|--------|------------|
| Unificar estados de creación y edición en AdminClients.jsx | Claude | ✅ Hecho | 0.5 |
| Implementar UI de selección de plan y módulos en NewOrgModal | Claude | ✅ Hecho | 1.0 |
| Añadir sección de invitado (Primer Admin) en NewOrgModal | Claude | ✅ Hecho | 0.5 |
| Ajustar lógica de guardado handleCreateOrg | Claude | ✅ Hecho | 0.5 |

## Daily Log

### 2026-04-19
- Sprint 3 creado.
- Rediseño completo del `NewOrgModal` con layout de dos columnas.
- Sincronización de lógica de planes y módulos entre creación y edición.
- Integración de creación de primer usuario administrador automátizada en `AuthContext`.

## Retrospective (2026-04-19)

### What Went Well
- La reutilización de la estructura del modal de edición permitió una implementación coherente y rápida.
- La automatización de la invitación del primer admin simplifica enormemente el flujo de onboarding para el SuperAdmin.
- El deploy fue exitoso y sin errores de construcción.

### What Could Improve
- Sería ideal añadir una validación de "correo corporativo" basado en el dominio, aunque por ahora se deja libre por flexibilidad.

### Action Items
- [ ] Validar que los Correos de Bienvenida (SMTP/Firebase) se envíen correctamente (Tarea de TODO).
