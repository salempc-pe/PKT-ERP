---
phase: 66
plan: 1
wave: 1
---

# Plan 66.1: Verificación de Webhook de WhatsApp e Identificación Multi-Tenant en el Backend

## Objective
Establecer la infraestructura de soporte para el canal de WhatsApp Cloud API en las Cloud Functions. Implementaremos la validación del protocolo de verificación GET que exige Meta (WhatsApp) para certificar el Webhook, y desarrollaremos la lógica de base de datos para identificar al inquilino (`organizationId`) a partir del número de teléfono en Firestore, asegurando un estricto aislamiento de los datos.

## Context
- .gsd/SPEC.md
- .gsd/phases/66/RESEARCH.md
- functions/index.js
- functions/sessions.js

## Tasks

<task type="auto">
  <name>Implementar verificación GET de WhatsApp Webhook</name>
  <files>
    - functions/index.js
  </files>
  <action>
    - Modificar la Cloud Function `velóAssistantEndpoint` en `functions/index.js` para discernir el tipo de método de la petición.
    - Si el método HTTP es GET, implementar la verificación del webhook de Meta (WhatsApp Cloud API):
      - Extraer de la query `hub.mode`, `hub.verify_token` y `hub.challenge`.
      - Validar que `hub.mode` sea igual a "subscribe" y que `hub.verify_token` coincida con una clave secreta configurada en las variables de entorno (ej. `process.env.WA_VERIFY_TOKEN` o un valor por defecto seguro de desarrollo como "VELO_WA_SECRET").
      - Si coincide, responder con estado 200 y retornar el string de `hub.challenge` directamente en formato de texto plano.
      - Si no coincide, responder con estado 403 (Acceso Prohibido).
  </action>
  <verify>
    Iniciar el emulador local de Firebase Cloud Functions y lanzar una petición HTTP GET simulando el protocolo de Meta (ej. con parámetros hub.mode=subscribe, hub.verify_token=VELO_WA_SECRET y un hub.challenge de prueba). Validar que la función responde con código 200 y el challenge exacto enviado.
  </verify>
  <done>
    El endpoint `velóAssistantEndpoint` valida de forma exitosa el protocolo de suscripción GET de Meta y retorna el challenge como texto plano cuando las credenciales coinciden.
  </done>
</task>

<task type="auto">
  <name>Desarrollar el resolvedor de perfiles de WhatsApp en Firestore</name>
  <files>
    - [NEW] functions/profiles.js
  </files>
  <action>
    - Crear `functions/profiles.js` para interactuar con la colección de usuarios `/users` en Firestore.
    - Desarrollar la función asíncrona `resolveUserProfileByPhone(phoneNumber)`:
      - Realizar una búsqueda en Firestore consultando todos los documentos de la colección `/users` donde el campo `whatsappNumber` sea igual al número de teléfono remitente (`phoneNumber`).
      - Si se encuentra un usuario registrado, recuperar su perfil incluyendo: `userId`, `name`, `role`, `organizationId` y los privilegios asignados.
      - Si no se encuentra, retornar `null`.
    - Esta capa asegurará que no se procese ningún mensaje sin conocer a qué inquilino y organización pertenece el emisor.
  </action>
  <verify>
    Crear un script temporal de prueba en `functions/test-profile.js` que intente buscar un usuario ficticio por su número de WhatsApp en las colecciones locales de Firestore y certificar que devuelve la estructura del perfil.
  </verify>
  <done>
    La función `resolveUserProfileByPhone` lee adecuadamente de la colección `/users`, identificando al inquilino correcto de forma segura y aislando por `organizationId`.
  </done>
</task>

## Success Criteria
- [ ] Endpoint HTTPS capacitado para validar la suscripción y verificación del Webhook de WhatsApp (Meta).
- [ ] Resolvedor de perfiles en Firestore operativo y protegido contra accesos cruzados de inquilinos.
- [ ] La compilación y pruebas de sintaxis locales finalizan sin errores de dependencias.
