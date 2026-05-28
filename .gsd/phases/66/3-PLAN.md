---
phase: 66
plan: 3
wave: 2
---

# Plan 66.3: UI de Generación de Tokens de Vinculación en Ajustes de Perfil

## Objective
Desarrollar la interfaz de usuario en el portal web del cliente para generar y mostrar el token OTP de vinculación de WhatsApp de 6 dígitos. Crearemos una sección dedicada en el módulo de ajustes de perfil que generará un código criptográfico temporal seguro, lo guardará en la colección `/whatsapp_bindings` en Firestore y lo expondrá en pantalla con un temporizador dinámico de expiración (10 minutos) y diseño premium.

## Context
- .gsd/SPEC.md
- .gsd/phases/66/RESEARCH.md
- src/modules/settings/SettingsModule.jsx

## Tasks

<task type="auto">
  <name>Implementar panel de vinculación en SettingsModule</name>
  <files>
    - src/modules/settings/SettingsModule.jsx
  </files>
  <action>
    - Modificar `src/modules/settings/SettingsModule.jsx` para importar componentes de iconos de Lucide (ej. Smartphone, RefreshCw, CheckCircle).
    - Diseñar una sección visual dedicada y premium bajo el título "Asistente de IA & WhatsApp" en la pantalla de ajustes de usuario.
    - Implementar la función asíncrona `generateWhatsappToken()` en React:
      - Generar un código aleatorio de 6 dígitos (por ejemplo, mediante una función matemática o caracteres aleatorios robustos).
      - Calcular un tiempo de expiración (10 minutos a partir del momento actual: `new Date(Date.now() + 10 * 60 * 1000)`).
      - Escribir en la colección `/whatsapp_bindings` de Firestore con los campos `code`, `userId` (ID del usuario conectado), `organizationId` (ID del inquilino), y `expiresAt` (fecha de expiración).
      - Mostrar el código de 6 dígitos generado en pantalla en un contenedor llamativo de tipografía ancha y negrita.
    - Implementar un temporizador de cuenta regresiva en React para mostrar en tiempo real la vigencia restante del código en pantalla (ej. "Expira en 09:59").
    - Mostrar el estado de vinculación actual del usuario: si el perfil del usuario ya posee un campo `whatsappNumber`, renderizar una insignia premium verde de "WhatsApp Vinculado" junto con su número oculto (ej. "+51 9*** ***3") y un botón para desvincular el servicio.
  </action>
  <verify>
    Iniciar la aplicación web y navegar a Ajustes de Perfil, pulsar en "Vincular WhatsApp", verificar que el sistema genera el código de 6 dígitos y lo persiste en Firestore en la colección respectiva, y comprobar que la cuenta regresiva en pantalla expira de forma correcta.
  </verify>
  <done>
    El panel de vinculación en `SettingsModule.jsx` emite tokens OTP de 6 dígitos, gestiona su expiración temporal en base de datos y refleja con precisión el estado de vinculación del número del usuario.
  </done>
</task>

## Success Criteria
- [ ] Panel premium en la sección de configuración de perfil del usuario en la web para vincular o desvincular el canal de WhatsApp.
- [ ] Generación automática de códigos de 6 dígitos seguros persistidos en la colección Firestore `/whatsapp_bindings`.
- [ ] Temporizador en tiempo real de 10 minutos y visualización del estado de cuenta vinculada.
