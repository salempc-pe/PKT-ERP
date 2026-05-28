# Investigación Técnica: Asistente de IA (Fase 63)

Para implementar con éxito la infraestructura base del asistente de IA de Veló ERP, debemos abordar tres pilares fundamentales:
1. **Infraestructura de Firebase Cloud Functions (v2)**.
2. **Integración con Gemini API (`@google/generative-ai`)**.
3. **Persistencia del Historial de Chat y Estado de Sesión en Firestore**.
4. **Esquema de Function Calling (Tools) para Acciones del ERP**.

---

## 1. Firebase Cloud Functions (Node.js)

### Arquitectura Seleccionada
Utilizaremos **Firebase Functions v2** basadas en HTTPS. Específicamente `onRequest` de `firebase-functions/v2/https` debido a su flexibilidad para recibir peticiones REST desde el cliente web y desde la API de WhatsApp Cloud en el futuro.

### Configuración
En `firebase.json` añadiremos la directiva `"functions"`. Para evitar interacciones manuales complejas con la CLI de Firebase en entornos automatizados, configuraremos el directorio `functions/` manualmente con su propio `package.json` e instalaremos las dependencias necesarias.

**Estructura del directorio `functions/`:**
```
functions/
├── package.json
├── index.js
├── assistant.js
└── config.js
```

---

## 2. Integración con Gemini API

Utilizaremos el paquete oficial `@google/generative-ai` en el backend. 

### Modelo
Usaremos `gemini-1.5-flash` por su balance óptimo entre velocidad, costo y capacidad para seguir instrucciones y ejecutar llamadas a funciones (Function Calling).

### Manejo de API Key
La API Key se pasará a través de variables de entorno de Firebase. En local, configuraremos un archivo `.env` dentro de la carpeta `functions/` (que se agregará a `.gitignore` de functions para evitar fugas). En producción, se configurará a través de los secretos de Google Cloud o la configuración del entorno de Firebase (`functions.config()` o `defineString`).

---

## 3. Persistencia de Sesión e Historial de Chat

Dado que las Cloud Functions HTTPS son *stateless*, la persistencia del historial de conversación para cada `sessionId` se almacenará en Firestore.

### Colección de Sesiones: `ai_sessions`
Estructura propuesta en Firestore:
- `/ai_sessions/{sessionId}`
  - `createdAt`: Timestamp
  - `lastActive`: Timestamp
  - `organizationId`: String (para asegurar aislamiento multi-tenant)
  - `userId`: String
  - `metadata`: Map
  - subcolección `/messages/{messageId}`
    - `role`: String (`user` | `model` | `system`)
    - `parts`: Array of Maps (según formato de la API de Gemini: `[{ text: "..." }]` o payload estructurado)
    - `timestamp`: Timestamp

Antes de llamar a Gemini, el endpoint:
1. Validará el token de autenticación (si se envía desde la web) o buscará la relación de número en WhatsApp para recuperar `organizationId` y `userId`.
2. Cargará los últimos `N` mensajes de la subcolección `/messages` ordenados por timestamp para reconstruir el historial del chat.
3. Enviará este historial junto con el mensaje actual a la API de Gemini.
4. Persistirá el nuevo mensaje del usuario y la respuesta de la IA (incluyendo payloads de acciones) en Firestore de forma atómica.

---

## 4. Function Calling (Tools) en Gemini

Para que la IA pueda "entender" comandos de lenguaje natural como *"Registra una venta de 2 palas para el cliente Juan Pérez"*, utilizaremos la funcionalidad nativa de **Function Calling** de Gemini.

### Tools Definidas
1. `queryStock(productName)`: Consulta el stock actual de un producto.
2. `createSaleDraft(clientName, products)`: Prepara un borrador de venta/cotización (no lo guarda en base de datos directo, sino que retorna el payload detallado para que el frontend renderice la tarjeta de confirmación).
3. `deductInventory(productName, quantity, reason)`: Prepara una solicitud de deducción de stock en el inventario.

### Formato de Respuesta del Asistente
El endpoint responderá con un JSON uniforme:
```json
{
  "text": "He encontrado las palas en el inventario. ¿Deseas que prepare una boleta por 2 unidades para Juan Pérez?",
  "suggestions": [
    "Sí, por favor",
    "No, cancela"
  ],
  "action": {
    "type": "CONFIRM_SALE",
    "payload": {
      "clientName": "Juan Pérez",
      "items": [
        { "productId": "123", "name": "Pala Reforzada", "quantity": 2, "price": 45.00 }
      ],
      "total": 90.00
    }
  }
}
```

---

## 5. Plan de Pruebas y Validación (Local)

1. **Firebase Emulator Suite**: Ejecutaremos el emulador de funciones de Firebase mediante `firebase emulators:start --only functions,firestore`.
2. **Consultas REST**: Utilizaremos peticiones HTTP POST con payloads simulados usando `curl` o herramientas integradas de terminal para verificar la respuesta del backend.
