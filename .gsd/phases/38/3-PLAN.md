---
phase: 38
plan: 3
wave: 2
---

# Plan 38.3: Mover Resend API al Backend (Cloud Function)

## Objective
Eliminar la API key de Resend del bundle del cliente creando una Firebase Cloud Function que maneje el envío de emails. Esto resuelve el hallazgo CRÍTICO #1 del security audit. El frontend llamará a la Cloud Function en lugar de hacer fetch directo a la API de Resend.

## Context
- src/services/mailer.js (actualmente expone VITE_RESEND_API_KEY en el frontend)
- src/context/AuthContext.jsx (invoca sendInvitationEmail)
- .env (contiene VITE_RESEND_API_KEY que debe ser eliminada del frontend)
- firebase.json (necesita configuración de functions)

## Tasks

<task type="auto">
  <name>Crear Firebase Cloud Function para envío de emails</name>
  <files>functions/index.js, functions/package.json</files>
  <action>
    1. Inicializar el directorio de Cloud Functions:
       ```bash
       mkdir functions
       ```
    2. Crear `functions/package.json` con dependencias mínimas:
       ```json
       {
         "name": "pkt-erp-functions",
         "main": "index.js",
         "engines": { "node": "18" },
         "dependencies": {
           "firebase-admin": "^12.0.0",
           "firebase-functions": "^5.0.0"
         }
       }
       ```
    3. Crear `functions/index.js` con la Cloud Function callable:
       - Usar `onCall` de firebase-functions/v2/https.
       - Verificar `request.auth` (solo usuarios autenticados).
       - Leer la API key de Resend desde `defineSecret()` o variable de entorno del runtime (NO del código).
       - Sanitizar `name` y `orgName` con `.replace(/[<>"'&]/g, '')` antes de interpolarlo en el HTML.
       - Reusar el template HTML actual de `mailer.js`.
       - Retornar `{ success: true }` o `{ success: false, error }`.
    
    - NO instalar el paquete `resend` — usar `fetch` nativo de Node 18.
    - La API key se configurará con `firebase functions:secrets:set RESEND_API_KEY`.
  </action>
  <verify>Test-Path "functions/index.js" && Test-Path "functions/package.json"</verify>
  <done>Cloud Function `sendInvitationEmail` creada con autenticación obligatoria y sanitización de inputs.</done>
</task>

<task type="auto">
  <name>Refactorizar frontend para usar Cloud Function</name>
  <files>src/services/mailer.js, .env</files>
  <action>
    1. Reescribir `src/services/mailer.js` para llamar a la Cloud Function:
       ```javascript
       import { getFunctions, httpsCallable } from 'firebase/functions';
       import app from './firebase';
       
       const functions = getFunctions(app);
       
       export const sendInvitationEmail = async (to, name, orgName, inviteUrl) => {
         try {
           const sendEmail = httpsCallable(functions, 'sendInvitationEmail');
           const result = await sendEmail({ to, name, orgName, inviteUrl });
           return result.data;
         } catch (error) {
           console.error("Error al enviar correo:", error);
           return { success: false, error: error.message };
         }
       };
       ```
    2. Eliminar `VITE_RESEND_API_KEY` y `VITE_EMAIL_FROM` del archivo `.env`.
    3. Agregar `firebase/functions` al import en firebase.js si no está (ya viene con el SDK de Firebase).
    4. Actualizar `firebase.json` para incluir la configuración de functions:
       ```json
       "functions": {
         "source": "functions"
       }
       ```
    
    - NO modificar AuthContext.jsx — la firma de `sendInvitationEmail` se mantiene idéntica.
    - NO eliminar el archivo mailer.js — se reescribe completamente.
  </action>
  <verify>$content = Get-Content "src/services/mailer.js" -Raw; ($content -notmatch "RESEND_API_KEY") -and ($content -match "httpsCallable")</verify>
  <done>El frontend llama a la Cloud Function. No hay API keys de Resend en el bundle del cliente. La firma del servicio se mantiene compatible.</done>
</task>

## Success Criteria
- [ ] `VITE_RESEND_API_KEY` eliminada del `.env` del frontend.
- [ ] `src/services/mailer.js` usa `httpsCallable` en lugar de `fetch` directo.
- [ ] Cloud Function en `functions/index.js` sanitiza inputs y verifica autenticación.
- [ ] `firebase.json` incluye configuración de functions.
- [ ] La app compila sin errores.
