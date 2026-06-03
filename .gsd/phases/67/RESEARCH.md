# Investigación Técnica: Simulador de WhatsApp de SuperAdmin (Fase 67)

La Fase 67 consiste en construir un simulador de WhatsApp interactivo dentro del portal SuperAdmin de Veló ERP. Esto permite realizar pruebas locales de diálogos, comandos de IA y flujos de vinculación OTP en un entorno controlado de desarrollo, sin depender de la infraestructura física de Meta y de forma totalmente multi-tenant.

---

## 1. Simulación de Payloads del Webhook de WhatsApp (Meta)

El simulador simulará el envío de mensajes desde la app web al endpoint de Cloud Functions local (`http://127.0.0.1:5001/pkt-erp/us-central1/velóAssistantEndpoint`). Para que la Cloud Function procese la petición como si fuera un mensaje real de WhatsApp, el cuerpo de la petición HTTP POST debe estructurarse conforme a la API oficial de Meta:

```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "12345",
      "changes": [
        {
          "field": "messages",
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "15550000000",
              "phone_number_id": "12345"
            },
            "contacts": [
              {
                "profile": { "name": "Usuario Simulado" },
                "wa_id": "51999999999"
              }
            ],
            "messages": [
              {
                "from": "51999999999",
                "id": "wamid.simulated_message_id_uuid",
                "timestamp": "1717381200",
                "text": {
                  "body": "Hola assistant!"
                },
                "type": "text"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

Al recibir este formato, la función `velóAssistantEndpoint`:
1. Reconoce `"object": "whatsapp_business_account"`.
2. Extrae el número del remitente (`51999999999`) y el texto (`Hola assistant!`).
3. Busca al usuario en la colección `/users` por el campo `whatsappNumber`.
4. Si está vinculado, ejecuta el motor de Gemini usando la sesión persistente e historial `whatsapp_session_51999999999`.
5. Si no está vinculado, y el texto es un código de 6 dígitos, procede con la vinculación.

---

## 2. Estructura de la Interfaz del Simulador (Doble Columna)

Para una experiencia premium y utilitaria, el simulador de SuperAdmin adoptará un layout de doble columna responsiva:

### Columna Izquierda: Simulador de Chat (Mock Móvil)
- **Cabecera**: Un selector para ingresar un número de teléfono personalizado, o bien un Dropdown dinámico que liste los usuarios registrados en el sistema (leyendo `/users` de Firestore, lo cual está permitido a SuperAdmin). Al seleccionar un usuario de la lista, su número se establece automáticamente para simular la conversación.
- **Estado de Vinculación**: Si el número ingresado no está en la base de datos de usuarios vinculados, mostrará una insignia de "No Vinculado" y, si existe un código OTP activo en la colección `/whatsapp_bindings` para ese usuario, se expondrá de manera amigable para que el SuperAdmin pueda simplemente dar clic, copiarlo y enviarlo para simular el onboarding interactivo.
- **Contenedor del Chat (Mock de Teléfono)**:
  - Estética premium imitando WhatsApp Web / WhatsApp Móvil: barra de cabecera con avatar e indicador de estado "Online".
  - Burbujas de chat con alineamiento clásico (Usuario a la derecha, Asistente de IA a la izquierda).
  - Listado de sugerencias interactivas (pills) para enviar de forma rápida.
  - Input táctil y botón de envío.

### Columna Derecha: Visor de Logs del Motor de IA
- **Historial de Peticiones y Respuestas**: Captura las llamadas HTTP en vivo realizadas desde la consola del simulador.
- **Detalle de Gemini Function Calling**: Muestra en tiempo real si el motor de IA identificó intenciones o herramientas como `QUERY_STOCK`, `CREATE_SALE` o `DEDUCT_INVENTORY`.
- **Estructura JSON formateada**: Un contenedor con fuente monoespaciada, fondo oscuro y realce sintáctico para los payloads de petición y respuesta, con botones para "Copiar Payload" y "Limpiar Historial".

---

## 3. Ajuste de Reglas de Seguridad de Firestore (`firestore.rules`)

Actualmente, la colección `/whatsapp_bindings` es una colección raíz utilizada por el cliente para almacenar tokens temporales de vinculación OTP y validada en el backend. 
Como se comprobó en la auditoría de reglas, esta colección carece de reglas de acceso granular explícitas, lo que causará rechazos en producción tras la remediación estricta de seguridad.

Se propone añadir la siguiente regla en `firestore.rules`:

```javascript
    // --- Vinculaciones de WhatsApp (OTP) ---
    match /whatsapp_bindings/{code} {
      // Permitir creación si el usuario está autenticado y asocia su propio uid
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      
      // Permitir lectura y eliminación si es el propio dueño del token o si es el SuperAdmin del SaaS
      allow read, delete: if request.auth != null && (
        resource.data.userId == request.auth.uid || 
        isSuperAdmin()
      );
      
      // La actualización no está permitida en códigos OTP
      allow update: if false;
    }
```

Este ajuste garantiza:
1. Que los inquilinos solo puedan ver/crear/borrar sus propios códigos OTP de vinculación.
2. Que el SuperAdmin pueda leer los códigos activos para alimentar el simulador en vivo.
3. El correcto aislamiento y seguridad del flujo OTP.
