---
phase: 68
plan: 1
wave: 1
---

# Plan 68.1: Optimización de Bundle y Auditoría de Seguridad

## Objective
Realizar la optimización del bundle frontend implementando carga perezosa (lazy load) para el asistente de IA, auditar las reglas de seguridad de Firestore y el aislamiento multi-tenant del backend, y generar el reporte final de verificación de la fase.

## Context
- .gsd/SPEC.md
- src/layouts/client/ClientLayout.jsx
- firestore.rules
- functions/index.js
- functions/sessions.js

## Tasks

<task type="auto">
  <name>Optimizar carga perezosa en ClientLayout.jsx</name>
  <files>
    - [MODIFY] src/layouts/client/ClientLayout.jsx
  </files>
  <action>
    - Modificar `src/layouts/client/ClientLayout.jsx` para importar `AiAssistantDrawer` mediante `React.lazy`.
    - Implementar un estado de control `hasBeenOpened` que inicie en false y cambie a true una vez que se activa `isAssistantOpen`.
    - Renderizar `<AiAssistantDrawer>` condicionado a `hasBeenOpened` y envuelto en `<Suspense fallback={null}>`.
  </action>
  <verify>
    Compilar con `npm run build` y asegurar que no haya errores de empaquetado.
  </verify>
  <done>
    El Drawer de IA se carga de forma diferida en el cliente web y conserva el historial de chats cuando el usuario abre y cierra el panel repetidamente.
  </done>
</task>

<task type="auto">
  <name>Auditoría de Aislamiento y Reglas de Seguridad</name>
  <files>
    - [MODIFY] firestore.rules
    - [MODIFY] functions/index.js
  </files>
  <action>
    - Verificar que las reglas de Firestore apliquen aislamiento multi-tenant estricto a todas las colecciones.
    - Confirmar que la colección `ai_sessions` no posee permisos de lectura/escritura directos para el cliente.
    - Validar que las llamadas al backend de Cloud Functions validen el `organizationId` del remitente contra su sesión para prevenir cruces de datos.
  </action>
  <verify>
    Revisar el código de seguridad e inspeccionar si existen vulnerabilidades en el manejo de tokens o variables.
  </verify>
  <done>
    Las reglas de seguridad y la lógica del backend están completamente auditadas y garantizan aislamiento multi-tenant estricto.
  </done>
</task>

<task type="auto">
  <name>Creación de WALKTHROUGH.md de Verificación</name>
  <files>
    - [NEW] WALKTHROUGH.md
  </files>
  <action>
    - Crear `WALKTHROUGH.md` en la raíz del proyecto.
    - Explicar la arquitectura final de Veló AI, su vinculación con WhatsApp y las optimizaciones de rendimiento y seguridad aplicadas.
  </action>
  <verify>
    Verificar que el archivo se visualiza correctamente en markdown.
  </verify>
  <done>
    El archivo `WALKTHROUGH.md` está creado y documenta de manera completa y profesional las características funcionales de la fase.
  </done>
</task>

## Success Criteria
- [ ] Carga diferida (lazy load) de `AiAssistantDrawer` implementada y operativa.
- [ ] Seguridad y multi-tenancy auditados en reglas de Firestore y endpoints.
- [ ] Documentación final en `WALKTHROUGH.md` creada con detalles técnicos y funcionales.
