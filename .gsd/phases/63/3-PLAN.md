---
phase: 63
plan: 3
wave: 2
---

# Plan 63.3: Endpoint del Asistente y Persistencia de Sesiones en Firestore

## Objective
Implementar el endpoint HTTP HTTPS final `velóAssistantEndpoint` y la capa de persistencia de las conversaciones. Desarrollaremos la lógica para almacenar y recuperar el historial de chats directamente en Firestore bajo la estructura `/ai_sessions/{sessionId}/messages`, garantizando un aislamiento multi-tenant estricto basado en `organizationId`. El endpoint integrará la lógica de Gemini para responder con texto, sugerencias rápidas y payloads de acciones listos para el frontend.

## Context
- .gsd/SPEC.md
- .gsd/phases/63/RESEARCH.md
- functions/index.js
- functions/assistant.js

## Tasks

<task type="auto">
  <name>Implementar gestión de sesiones e historial en Firestore</name>
  <files>
    - [NEW] functions/sessions.js
  </files>
  <action>
    - Crear `functions/sessions.js` para interactuar con Firestore mediante la librería de administración `firebase-admin/firestore`.
    - Desarrollar la función `getChatHistory(sessionId, organizationId)`: recupera los últimos 15 o 20 mensajes de la subcolección `/messages` dentro del documento de la sesión en `/ai_sessions/{sessionId}`, ordenados por fecha ascendente. Valida que el documento de sesión pertenezca al `organizationId` solicitado para garantizar la seguridad multi-tenant.
    - Desarrollar la función `saveChatMessage(sessionId, organizationId, message)`: persiste atómicamente un nuevo mensaje (de tipo `user` o `model`) con su timestamp, contenido textual, sugerencias dinámicas y el payload de acciones (si aplica) en la base de datos de Firestore.
    - Asegurar el aislamiento: si no coincide la `organizationId` de la sesión con la petición, abortar con un error de acceso no autorizado.
  </action>
  <verify>
    Crear o modificar el script de prueba local para validar que al mandar un mensaje ficticio a una sesión en Firestore, se guarda de forma correcta respetando la ruta multi-tenant configurada.
  </verify>
  <done>
    Las funciones de lectura y escritura operan de manera reactiva sobre Firestore, permitiendo almacenar el flujo bidireccional del chat y filtrarlo por identificadores únicos de sesión y organización.
  </done>
</task>

<task type="auto">
  <name>Desarrollar el endpoint HTTPS final velóAssistantEndpoint</name>
  <files>
    - functions/index.js
    - functions/assistant.js
    - functions/sessions.js
  </files>
  <action>
    - En `functions/index.js`, importar las funciones de sesiones y el asistente de IA.
    - Desarrollar la Cloud Function HTTPS `velóAssistantEndpoint` (v2) que acepte peticiones POST.
    - Extraer del cuerpo de la petición (`req.body`): `message` (texto enviado), `sessionId` (identificador de chat), `organizationId` (del inquilino) y `userId`.
    - Validar que los campos críticos no estén vacíos.
    - Recuperar el historial de chat con `getChatHistory`.
    - Enviar el historial y el nuevo mensaje al motor de Gemini en `functions/assistant.js`.
    - Si Gemini devuelve un resultado directo (texto), guardarlo. Si devuelve un `functionCall`, procesarlo para resolver datos de Firestore si es necesario (ej. buscar el stock actual de un producto) y alimentar la respuesta de la IA.
    - Guardar de forma atómica tanto la petición del usuario como la respuesta final estructurada de la IA en Firestore.
    - Responder al cliente con un código de estado HTTP 200 y el JSON unificado que contiene el texto de respuesta, sugerencias inteligentes y el payload de acción para confirmar en el frontend.
  </action>
  <verify>
    Iniciar el emulador de Firebase Functions y lanzar una petición HTTP POST simulada (mediante un script local en PowerShell) con un JSON que envíe un mensaje a un ID de sesión de prueba. Validar que la respuesta contiene el texto generado por Gemini, un arreglo de sugerencias y la estructura JSON de la acción correspondiente.
  </verify>
  <done>
    El endpoint `velóAssistantEndpoint` funciona de extremo a extremo en local, respondiendo con datos consistentes y persistiendo adecuadamente el flujo en las colecciones Firestore asociadas.
  </done>
</task>

## Success Criteria
- [ ] La base de datos de Firestore almacena correctamente cada interacción del chat con fecha y autor, garantizando un chat con memoria histórica.
- [ ] El aislamiento multi-tenant bloquea cualquier cruce de información o acceso no autorizado a sesiones de otras empresas (`organizationId`).
- [ ] El endpoint HTTPS final retorna una respuesta estructurada que combina el diálogo del asistente con la detección automática de intenciones en el ERP.
