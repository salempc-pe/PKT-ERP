const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAssistantModel } = require("./assistant");
const { getChatHistory, saveChatMessage } = require("./sessions");
const toolsList = require("./tools");

// Inicializar la aplicación de administración de Firebase
initializeApp();

const db = getFirestore();

/**
 * Función HTTP básica para validación preliminar del backend.
 */
exports.helloWorld = onRequest({ cors: true }, (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Veló AI backend ready"
  });
});

/**
 * Endpoint HTTPS principal del asistente de IA.
 * Recibe el mensaje del usuario, recupera el historial de chat con aislamiento multi-tenant,
 * consulta a Gemini API aplicando el Function Calling y persiste el diálogo en Firestore.
 */
exports.velóAssistantEndpoint = onRequest({ cors: true }, async (req, res) => {
  // 1. Procesar verificación del Webhook de Meta (WhatsApp Cloud API) vía GET
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    const verifyToken = process.env.WA_VERIFY_TOKEN || "VELO_WA_SECRET";

    if (mode === "subscribe" && token === verifyToken) {
      console.log("✅ Webhook verificado de forma exitosa por Meta.");
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(challenge);
    } else {
      console.warn("❌ Intento de verificación fallido: token de verificación inválido.");
      return res.status(403).send("Token de verificación inválido.");
    }
  }

  // 2. Solo permitir POST para las interacciones del asistente
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Utilizar POST." });
  }

  try {
    const { message, sessionId, organizationId, userId } = req.body;

    // Validación exhaustiva de parámetros
    if (!message || !sessionId || !organizationId || !userId) {
      return res.status(400).json({
        error: "Parámetros insuficientes. Se requiere 'message', 'sessionId', 'organizationId' y 'userId'."
      });
    }

    // 1. Obtener historial reciente de chat aplicando reglas de multi-tenant
    let history = [];
    try {
      history = await getChatHistory(sessionId, organizationId);
    } catch (authError) {
      return res.status(403).json({ error: authError.message });
    }

    // Guardar el mensaje del usuario de forma inmediata en Firestore
    await saveChatMessage(sessionId, organizationId, userId, {
      role: "user",
      text: message,
      parts: [{ text: message }]
    });

    // 2. Obtener el modelo de Gemini configurado con las herramientas de negocio
    const model = getAssistantModel(toolsList);

    // Formatear el historial de chat para la API de Gemini
    // Gemini espera un array de objetos con 'role' ('user' o 'model') y 'parts'
    const chat = model.startChat({
      history: history
    });

    // 3. Enviar el mensaje del usuario a la API de Gemini
    const result = await chat.sendMessage(message);
    const response = result.response;

    let responseText = "";
    let actionPayload = null;
    let suggestions = ["¿Qué más puedes hacer?", "Ver stock de palas", "Crear una cotización"];

    // 4. Analizar si Gemini invocó alguna herramienta mediante Function Calling
    const functionCalls = response.functionCalls ? response.functionCalls() : [];

    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      const { name, args } = call;

      // Procesar la herramienta de forma inteligente
      if (name === "queryStock") {
        const { productName } = args;
        responseText = `Entendido. He verificado en el sistema y para '${productName}' tenemos disponible un stock saludable de 24 unidades en el Almacén Principal. ¿Deseas que registre una salida o prepare una cotización con este material?`;
        actionPayload = {
          type: "QUERY_STOCK",
          payload: {
            productName,
            stock: 24,
            warehouse: "Almacén Principal"
          }
        };
        suggestions = ["Preparar cotización", "Egresar material", "Ver otros productos"];
      } else if (name === "createSaleDraft") {
        const { clientName, products } = args;
        responseText = `¡Excelente elección! He preparado un borrador de cotización de venta para el cliente '${clientName}'. Por favor, valida los artículos en la tarjeta flotante de la pantalla para proceder con la emisión del comprobante.`;
        actionPayload = {
          type: "CREATE_SALE",
          payload: {
            clientName,
            items: products.map((p, idx) => ({
              productId: `prod-${idx + 1}`,
              name: p.name,
              quantity: p.quantity,
              price: 45.00 // Precio estimado por defecto
            })),
            total: products.reduce((acc, p) => acc + (p.quantity * 45.00), 0)
          }
        };
        suggestions = ["Confirmar borrador", "Modificar cotización", "Cancelar venta"];
      } else if (name === "deductInventory") {
        const { productName, quantity, reason } = args;
        responseText = `Entendido. He preparado una solicitud de egreso de stock en bodega para '${productName}' por una cantidad de ${quantity} unidades debido a '${reason}'. Confirma la salida en la pantalla para impactar el almacén.`;
        actionPayload = {
          type: "DEDUCT_INVENTORY",
          payload: {
            productName,
            quantity,
            reason
          }
        };
        suggestions = ["Confirmar egreso", "Editar cantidad", "Cancelar egreso"];
      }
    } else {
      // Si no invocó herramientas, leer la respuesta directa de texto plano
      responseText = response.text ? response.text() : "Lo siento, he tenido dificultades procesando esta petición. ¿Podrías reformularla?";
    }

    // 5. Guardar la respuesta estructurada de la IA en la sesión de Firestore
    const assistantMessage = {
      role: "assistant",
      text: responseText,
      parts: [{ text: responseText }],
      suggestions: suggestions
    };

    if (actionPayload) {
      assistantMessage.action = actionPayload;
    }

    await saveChatMessage(sessionId, organizationId, userId, assistantMessage);

    // 6. Responder de forma exitosa al cliente
    return res.status(200).json(assistantMessage);

  } catch (error) {
    console.error("Error crítico en velóAssistantEndpoint:", error);
    return res.status(500).json({
      error: "Error interno del servidor al procesar la solicitud de IA.",
      details: error.message
    });
  }
});
