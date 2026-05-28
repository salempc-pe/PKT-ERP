---
phase: 66
plan: 2
wave: 1
---

# Plan 66.2: Flujo de Bienvenida y Vinculación Temporal con Código de 6 Dígitos

## Objective
Implementar el motor transaccional de vinculación OTP de 6 dígitos en el backend. Si el número de WhatsApp remitente no está asociado a ningún usuario en el ERP, canalizaremos el mensaje hacia un flujo de bienvenida e invitación a vincularse. Si el usuario envía un código de 6 dígitos que coincida con un token activo y no expirado en Firestore, registraremos la vinculación de su número telefónico de forma definitiva.

## Context
- .gsd/SPEC.md
- .gsd/phases/66/RESEARCH.md
- functions/index.js
- functions/profiles.js

## Tasks

<task type="auto">
  <name>Desarrollar lógica de validación e impacto de vinculación OTP</name>
  <files>
    - functions/profiles.js
  </files>
  <action>
    - En `functions/profiles.js`, importar `getFirestore` y `FieldValue`.
    - Desarrollar la función asíncrona `processWhatsappBinding(phoneNumber, textCode)`:
      - Validar que el código enviado en `textCode` sea un string numérico de exactamente 6 dígitos.
      - Realizar una consulta en la colección `/whatsapp_bindings` buscando documentos donde el campo `code` coincida con el código e ingresado, y cuyo campo `expiresAt` sea mayor a la fecha y hora actuales.
      - Si no se encuentra un código activo, lanzar un error descriptivo (ej. "Código inválido o expirado").
      - Si coincide, recuperar el `userId` y `organizationId` del documento de vinculación.
      - Actualizar el perfil del usuario en la colección principal `/users/{userId}` en Firestore agregando el campo `whatsappNumber: phoneNumber`.
      - Eliminar el documento temporal en la colección `/whatsapp_bindings` para invalidar el código tras su uso exitoso.
      - Retornar un objeto de éxito con los datos del usuario vinculado.
  </action>
  <verify>
    Crear o simular registros en `/whatsapp_bindings` locales y certificar que la función asíncrona los valida, asocia el número al usuario ficticio y depura el token OTP adecuadamente.
  </verify>
  <done>
    La función `processWhatsappBinding` asocia de forma atómica y segura el número de WhatsApp entrante a un usuario activo en el ERP si el códigoOTP de 6 dígitos es válido y vigente.
  </done>
</task>

<task type="auto">
  <name>Actualizar endpoint POST para procesar vinculación de WhatsApp</name>
  <files>
    - functions/index.js
    - functions/profiles.js
  </files>
  <action>
    - Modificar la recepción HTTP POST en `functions/index.js` para detectar si la petición proviene de WhatsApp Cloud API (analizando si posee el formato de Meta `req.body.entry[0].changes[0].value.messages`).
    - Si es una petición de WhatsApp, extraer el número de teléfono remitente (`from`) y el contenido textual del mensaje (`body`).
    - Invocar a `resolveUserProfileByPhone(from)`:
      - **Caso A: No está vinculado**:
        - Evaluar si el texto del mensaje es un código de exactamente 6 dígitos.
        - Si es un código, invocar a `processWhatsappBinding(from, body)`:
          - Si la vinculación tiene éxito, responder confirmando la vinculación: *"¡Vinculación exitosa! Eres [Nombre] en Veló ERP. Ya puedes enviarme comandos."*
          - Si falla, responder con el error: *"Código inválido o expirado. Vuelve a generarlo desde tu perfil."*
        - Si NO es un código de 6 dígitos, disparar el flujo de bienvenida: *"¡Hola! Bienvenido a Veló AI. Para poder interactuar desde aquí, ingresa a Ajustes de Perfil > Vincular WhatsApp en tu ERP, y escríbeme el código de 6 dígitos que aparezca en pantalla."*
      - **Caso B: Vinculación existente**:
        - Procesar el mensaje directamente con la lógica conversacional de Gemini (`getAssistantModel` y la memoria del chat en Firestore) aislando de manera multi-tenant por `organizationId` y enviando la respuesta de vuelta al usuario.
  </action>
  <verify>
    Iniciar el emulador de funciones de Firebase y lanzar peticiones POST simuladas (mediante scripts locales de PowerShell) con estructuras del webhook de Meta para números desconocidos y códigos OTP válidos, y certificar el comportamiento y respuestas del endpoint.
  </verify>
  <done>
    El webhook POST en `index.js` canaliza e identifica de forma atómica a los usuarios de WhatsApp, resolviendo e iniciando la vinculación interactiva segura cuando es requerido.
  </done>
</task>

## Success Criteria
- [ ] Flujo interactivo de bienvenida e instrucciones de vinculación para números desconocidos en WhatsApp.
- [ ] Validación atómica y borrado seguro (single-use) del código OTP temporal de 6 dígitos.
- [ ] Vinculación definitiva del número de teléfono en el perfil de usuario de Firestore al culminar con éxito.
