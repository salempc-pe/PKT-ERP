---
phase: 67
plan: 1
wave: 1
---

# Plan 67.1: Simulador de WhatsApp de SuperAdmin y Visor de Logs de IA

## Objective
Construir un panel de soporte interactivo para el SuperAdmin que contenga un simulador visual de WhatsApp y un visor de logs en tiempo real para las peticiones de IA. Esto permitirá simular la vinculación OTP de usuarios y evaluar las herramientas de Gemini (Function Calling) de forma interactiva y local sin depender de la API de Meta.

## Context
- .gsd/SPEC.md
- .gsd/phases/67/RESEARCH.md
- firestore.rules
- src/App.jsx
- src/layouts/admin/AdminLayout.jsx

## Tasks

<task type="auto">
  <name>Actualizar reglas de Firestore para whatsapp_bindings</name>
  <files>
    - firestore.rules
  </files>
  <action>
    - Modificar `firestore.rules` para añadir una regla explícita y granular para la colección raíz `/whatsapp_bindings/{code}`.
    - Permitir la creación (`create`) de vinculaciones únicamente si el usuario está autenticado y asocia su propio identificador (`request.resource.data.userId == request.auth.uid`).
    - Permitir lectura (`read`) y eliminación (`delete`) si el usuario autenticado coincide con el creador del documento (`resource.data.userId == request.auth.uid`), o bien si el usuario tiene el rol de SuperAdmin (`isSuperAdmin()`).
    - Prohibir explícitamente cualquier actualización (`update: if false`).
  </action>
  <verify>
    Validar sintaxis y compilación de las reglas de seguridad utilizando la CLI local de Firebase o validando mediante las pruebas del entorno.
  </verify>
  <done>
    La colección `whatsapp_bindings` tiene políticas granulares que protegen los tokens OTP de los inquilinos y permiten al SuperAdmin inspeccionarlos de forma segura en el simulador.
  </done>
</task>

<task type="auto">
  <name>Registrar ruta e integrar en sidebar del Admin</name>
  <files>
    - src/App.jsx
    - src/layouts/admin/AdminLayout.jsx
  </files>
  <action>
    - Importar el componente `AdminWhatsappSimulator` (a crearse en `src/modules/admin/whatsapp/AdminWhatsappSimulator.jsx`) en `src/App.jsx`.
    - Registrar la ruta `whatsapp` apuntando a `<AdminWhatsappSimulator />` bajo el layout de administración `/admin` en `src/App.jsx`.
    - Modificar `src/layouts/admin/AdminLayout.jsx` para importar el icono `MessageSquare` de `lucide-react`.
    - Agregar el enlace de navegación para "Simulador WhatsApp" (`/admin/whatsapp`) en la barra lateral del SuperAdmin, usando los estilos consistentes de navegación activa (`activeStyle`).
  </action>
  <verify>
    Iniciar la aplicación con `npm run dev`, iniciar sesión como SuperAdmin (`admin@pkt.com`) y verificar visualmente que el sidebar incluye el nuevo botón, que redirige correctamente a `/admin/whatsapp` y que no arroja errores de ruteo.
  </verify>
  <done>
    El simulador está integrado en el flujo de navegación lateral y ruteo dinámico del portal de administración de Veló ERP.
  </done>
</task>

<task type="auto">
  <name>Desarrollar el Simulador de WhatsApp de SuperAdmin</name>
  <files>
    - [NEW] src/modules/admin/whatsapp/AdminWhatsappSimulator.jsx
  </files>
  <action>
    - Crear el archivo `src/modules/admin/whatsapp/AdminWhatsappSimulator.jsx`.
    - Implementar un diseño responsivo de doble columna usando la estética premium de Veló (fondos HSL, bordes semitransparentes, desenfoque de fondo y fuentes Google Fonts).
    - **Panel de Configuración e Identidad (Columna Izquierda Top)**:
      - Cargar de forma reactiva el listado de usuarios del ERP desde la colección `/users` de Firestore.
      - Mostrar un selector (dropdown) de usuarios registrados que exponga su nombre, empresa y estado de WhatsApp (Vinculado/No Vinculado).
      - Permitir ingresar un número de teléfono de forma manual.
      - Si se selecciona un usuario sin vincular, realizar una consulta a `/whatsapp_bindings` buscando si tiene un OTP activo. Si existe, desplegarlo en una tarjeta con opción de copiado rápido.
    - **Simulador de WhatsApp (Columna Izquierda Bottom)**:
      - Renderizar una réplica interactiva de interfaz de chat móvil:
        - Cabecera con avatar, nombre ("Veló AI Assistant") e indicador de estado "Online" (verde).
        - Historial local de mensajes del chat con burbujas (usuario a la derecha, asistente de IA a la izquierda).
        - Mostrar loader palpitante al esperar respuesta.
        - Renderizar pastillas de sugerencias dinámicas retornadas en la respuesta de la función para enviarlas con un clic.
        - Caja de texto para redactar y presionar Enter o clic en botón para enviar.
      - Al enviar, emular el webhook de WhatsApp enviando un POST con la estructura JSON de Meta a la Cloud Function local de desarrollo (`http://127.0.0.1:5001/pkt-erp/us-central1/velóAssistantEndpoint`).
    - **Visor de Logs del Motor de IA (Columna Derecha)**:
      - Registrar cronológicamente cada petición enviada al webhook (Request JSON) y recibida (Response JSON).
      - Diseñar un inspector de JSON con formato legible (monospace, color sintáctico, estructurado) que sea expansible/colapsible.
      - Mostrar distintivos llamativos cuando Gemini invoque herramientas (Function Calling), por ejemplo, resaltando badges para `QUERY_STOCK`, `CREATE_SALE` o `DEDUCT_INVENTORY`.
      - Proporcionar un botón de copiado del JSON y otro para "Limpiar Logs".
  </action>
  <verify>
    1. Seleccionar un usuario no vinculado del ERP en el dropdown.
    2. Generar un OTP de vinculación en otra pestaña o visualizar el OTP cargado automáticamente en el simulador.
    3. Enviar el código de 6 dígitos en el chat del simulador. Confirmar que la vinculación se realiza con éxito en Firestore y que la respuesta del bot saluda al usuario por su nombre real.
    4. Probar consultas de lenguaje natural (ej. "Ver stock de palas", "Crear cotización para Juan") y verificar en la columna de la derecha que los logs muestran el webhook JSON de Meta y que se identificaron los Function Calling de Gemini correctamente.
  </verify>
  <done>
    El componente `AdminWhatsappSimulator` está completamente operativo en la web del Admin, permitiendo flujos interactivos de chat simulados y depuración en vivo de los JSONs del webhook y llamadas a herramientas (Tools) de Gemini.
  </done>
</task>

## Success Criteria
- [ ] Colección `whatsapp_bindings` protegida con reglas granulares en `firestore.rules`.
- [ ] Enlace y ruta `/admin/whatsapp` funcionando en la barra lateral del SuperAdmin.
- [ ] Interfaz de doble columna operativa: chat emulado de WhatsApp (izquierda) y visor detallado de logs JSON y herramientas de Gemini (derecha).
- [ ] Flujo de vinculación OTP e interacción de IA (Gemini Cloud Function) validados localmente a través de la interfaz.
