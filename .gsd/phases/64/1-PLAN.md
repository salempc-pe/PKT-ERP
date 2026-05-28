---
phase: 64
plan: 1
wave: 1
---

# Plan 64.1: Capa de Datos del Cliente (useAiAssistant) y Eliminación de Feedback

## Objective
Preparar el canal de comunicación reactivo del cliente web con el backend de inteligencia artificial desarrollado en la Fase 63 y realizar limpieza de los componentes obsoletos del sistema. Implementaremos el hook personalizado `useAiAssistant.js` para procesar peticiones asíncronas con aislamiento multi-tenant y eliminaremos el botón de feedback heredado.

## Context
- .gsd/SPEC.md
- .gsd/phases/64/RESEARCH.md
- src/App.jsx
- src/components/FeedbackButton.jsx

## Tasks

<task type="auto">
  <name>Desarrollar el hook personalizado useAiAssistant</name>
  <files>
    - [NEW] src/hooks/useAiAssistant.js
  </files>
  <action>
    - Crear `src/hooks/useAiAssistant.js` para orquestar las consultas al endpoint del asistente de IA.
    - Utilizar `useAuth` para recuperar atómicamente el `organizationId` y `userId` del usuario conectado en la sesión activa del ERP.
    - Implementar un generador de `sessionId` único y robusto de tipo UUID (`crypto.randomUUID()`) que se mantenga en `sessionStorage` para no perder el contexto de la conversación al refrescar el navegador.
    - Mantener estados reactivos claros para `messages` (historial local), `loading` (generación en curso de la IA) y `error`.
    - Implementar la función asíncrona `sendMessage(text)` que lance una petición HTTP POST al endpoint `velóAssistantEndpoint` de Firebase Cloud Functions (usando variables de entorno para alternar entre la URL local de emuladores y la de producción).
    - Persistir el mensaje de usuario en local inmediatamente e incorporar la respuesta devuelta por la IA (incluyendo campos adicionales como `action` y `suggestions`) en el estado reactivo del chat.
  </action>
  <verify>
    Importar el hook temporalmente en una vista de pruebas del sistema y certificar que la llamada asíncrona envía los parámetros esperados de la organización y el usuario.
  </verify>
  <done>
    El hook `useAiAssistant` gestiona adecuadamente la comunicación con el endpoint de backend, actualiza el estado de mensajes en tiempo real y aísla la petición por `organizationId` de forma transparente.
  </done>
</task>

<task type="auto">
  <name>Eliminar componente heredado de Feedback y limpiar el enrutador</name>
  <files>
    - src/App.jsx
    - [DELETE] src/components/FeedbackButton.jsx
    - [DELETE] src/components/FeedbackButton.css
  </files>
  <action>
    - Modificar `src/App.jsx` eliminando la importación de `FeedbackButton` y removiendo la etiqueta `<FeedbackButton />` del renderizado general.
    - Eliminar físicamente los archivos obsoletos `src/components/FeedbackButton.jsx` y `src/components/FeedbackButton.css` para mantener limpia la arquitectura de componentes y liberar espacio.
  </action>
  <verify>
    Arrancar el servidor de desarrollo con `npm run dev` y confirmar que el proyecto compila y se despliega sin errores referentes a dependencias inexistentes de feedback.
  </verify>
  <done>
    El botón de feedback ha sido totalmente erradicado del enrutador y del árbol de componentes, y no existe rastro de los archivos borrados en el espacio de trabajo.
  </done>
</task>

## Success Criteria
- [ ] Hook de datos `useAiAssistant` plenamente operativo y con soporte para persistencia temporal de la sesión del chat.
- [ ] Limpieza e higiene de código finalizada al eliminar el componente obsoleto de feedback en todo el sistema.
- [ ] La aplicación compila sin errores ni advertencias asociadas.
