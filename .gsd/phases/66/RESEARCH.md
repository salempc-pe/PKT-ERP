# Investigación Técnica: Canal de WhatsApp y Vinculación Multi-Tenant (Fase 66)

La expansión de **Veló AI** a WhatsApp requiere un mecanismo de autenticación súper seguro y no interactivo (en el sentido de no requerir contraseñas por chat) que asocie los números de teléfono entrantes a perfiles de usuarios del ERP, garantizando el aislamiento de datos (multi-tenancy) y el cumplimiento de permisos por rol.

---

## 1. Webhook de WhatsApp Cloud API (Meta)

El webhook de Meta opera sobre HTTPS y exige dos métodos en el mismo endpoint:
1. **Verificación (GET)**: Utilizado por Meta al configurar el webhook para verificar que el servidor es auténtico.
2. **Eventos (POST)**: Utilizado para recibir notificaciones en tiempo real (mensajes entrantes).

### Lógica GET (Verificación)
Query parameters requeridos:
- `hub.mode`: Debe ser `"subscribe"`.
- `hub.verify_token`: Un token secreto definido por nosotros (ej. `VELO_WA_VERIFY_TOKEN`).
- `hub.challenge`: Una cadena aleatoria enviada por Meta que debemos responder directamente como texto plano con estado 200.

### Lógica POST (Recepción de Mensajes)
El cuerpo enviado por Meta tiene la siguiente estructura simplificada:
```json
{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "ACCOUNT_ID",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": { "display_phone_number": "PHONE", "phone_number_id": "ID" },
            "contacts": [ { "profile": { "name": "Nombre Usuario" }, "wa_id": "PHONE_SENDER" } ],
            "messages": [
              {
                "from": "PHONE_SENDER",
                "id": "MSG_ID",
                "timestamp": "UNIX_TIME",
                "text": { "body": "Texto del mensaje" },
                "type": "text"
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

---

## 2. Flujo de Vinculación Multi-Tenant Seguro (OTP de 6 Dígitos)

Para vincular un número de teléfono de WhatsApp a un usuario del ERP sin comprometer la seguridad:

### Colección `/whatsapp_bindings`
Cuando el usuario genera un código en el frontend, se crea un documento:
- `/whatsapp_bindings/{bindingId}`
  - `code`: "184920" (OTP de 6 dígitos aleatorio)
  - `userId`: String
  - `organizationId`: String
  - `createdAt`: Timestamp
  - `expiresAt`: Timestamp (createdAt + 10 minutos)

### Algoritmo de Vinculación en el Webhook:
```
Remitente (from) envía mensaje ->
  Buscar en /users si whatsappNumber === from
  Si existe:
    Procesar mensaje directamente con Gemini usando su organizationId e historial.
  Si no existe:
    ¿El mensaje es un código de 6 dígitos?
    Sí:
      Buscar en /whatsapp_bindings donde code === mensaje y expiresAt > ahora
      Si se encuentra:
        Actualizar /users/{userId} -> whatsappNumber: from
        Borrar el documento de /whatsapp_bindings
        Responder: "¡Vinculación exitosa! Eres [Nombre]. Ya puedes pedirme consultar stocks o crear ventas."
      No:
        Responder: "Número no vinculado. Ingresa a Configuración del ERP > Vincular WhatsApp y envíame el código de 6 dígitos."
```

---

## 3. Aislamiento de Roles en WhatsApp

Una vez vinculado:
- El webhook cargará el perfil del usuario antes de invocar a Gemini.
- Validará su rol (`admin` vs `user`).
- Si el usuario tiene rol `user` y solicita una acción exclusiva de administración (como ver estados de caja consolidados de finanzas o alterar permisos), el resolvedor del backend interceptará la petición y responderá cortésmente con un denegado de accesibilidad, respetando el modelo de permisos (ACL) del ERP.
