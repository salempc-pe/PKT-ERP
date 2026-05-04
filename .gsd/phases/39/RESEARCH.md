# Research: Phase 39 - Agenda y Citas Mejoras Avanzadas

## Discovery Protocol
**Level 2 - Standard Research**: Integrating external sync conceptually, webhook notifications, and physical resources conflict detection.

## 1. Integración Externa (Google Calendar / Outlook)
En lugar de implementar Oauth2 completo en esta fase (lo que excedería el alcance típico sin endpoints dedicados), prepararemos el modelo de datos y la UI:
- **UI de Configuración**: Añadir una pestaña de "Integraciones" en `CalendarModule` (o usar Settings) donde el usuario ingrese URLs o conecte cuentas.
- **Data Model**: `events` debe poder almacenar un campo `externalId` o `syncStatus`.

## 2. Recordatorios Multicanal (Webhooks)
- El sistema debe poder enviar la información de la cita a un webhook externo (ej: Make/Integromat/Zapier) para disparar recordatorios por WhatsApp o correo.
- **UI**: Un modal de configuración de "Notificaciones/Webhooks".

## 3. Gestión de Recursos Físicos
- **Model**: `resources` collection en Firebase (id, name, type, capacity, status).
- **Events Model**: Añadir un array `resourceIds` a los eventos.
- **Conflicto**: Al crear o editar un evento que requiere un recurso, revisar si otro evento en ese mismo rango de tiempo ya usa ese `resourceId`.
- **UI**: Añadir selector de recursos en el modal del evento y una vista o filtro de recursos.

## Decisión de Implementación
1. **Modelado de Recursos**: Crear un nuevo hook `useResources.js` o integrarlo en `useCalendar.js`. Dado el alcance, extender `useCalendar.js` para incluir fetching de `resources` es más rápido.
2. **Webhooks**: Añadir botón "Configurar Integraciones" en `CalendarModule` que abra un modal para guardar las URLs de webhook (persistencia en `organizations/{orgId}/settings/calendar`).
3. **Conflictos**: Al guardar un evento en `useCalendar.js`, realizar una pre-validación de los eventos existentes en memoria (ya los tenemos descargados en el state de react) para detectar superposición de tiempo para el mismo recurso.

## Estructura de Tareas
- **Plan 39.1**: Gestión de Recursos y Conflictos (Data model + UI en evento).
- **Plan 39.2**: Configuraciones de Integración y Webhooks (Modal y lógica base).
