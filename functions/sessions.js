const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const db = getFirestore();

/**
 * Recupera el historial reciente de chat para una sesión, validando el aislamiento multi-tenant.
 * @param {string} sessionId - ID de la sesión del chat.
 * @param {string} organizationId - ID de la organización del inquilino.
 * @returns {Promise<Array>} Lista de mensajes en formato compatible con Gemini.
 */
async function getChatHistory(sessionId, organizationId) {
  if (!sessionId || !organizationId) {
    throw new Error("Parámetros insuficientes para obtener el historial de chat.");
  }

  const sessionRef = db.collection("ai_sessions").doc(sessionId);
  const sessionDoc = await sessionRef.get();

  // Si la sesión no existe, se inicializará dinámicamente al guardar el primer mensaje.
  if (!sessionDoc.exists) {
    return [];
  }

  const sessionData = sessionDoc.data();

  // Validación de seguridad multi-tenant estricta
  if (sessionData.organizationId !== organizationId) {
    throw new Error("Acceso no autorizado: la sesión no corresponde a la organización del inquilino.");
  }

  // Cargar los últimos 20 mensajes de la subcolección messages
  const messagesSnapshot = await sessionRef
    .collection("messages")
    .orderBy("timestamp", "asc")
    .limit(20)
    .get();

  const history = [];
  messagesSnapshot.forEach((doc) => {
    const data = doc.data();
    // Gemini requiere el rol ('user' o 'model') y la estructura 'parts'
    history.push({
      role: data.role === "assistant" ? "model" : data.role,
      parts: data.parts || [{ text: data.text }]
    });
  });

  return history;
}

/**
 * Guarda un mensaje (de usuario o modelo) en la sesión, inicializando la sesión si no existe.
 * @param {string} sessionId - ID de la sesión.
 * @param {string} organizationId - ID de la organización.
 * @param {string} userId - ID del usuario remitente.
 * @param {Object} message - Objeto de mensaje con campos 'role', 'text', opcionalmente 'action' y 'suggestions'.
 */
async function saveChatMessage(sessionId, organizationId, userId, message) {
  if (!sessionId || !organizationId || !userId || !message) {
    throw new Error("Parámetros insuficientes para guardar el mensaje de chat.");
  }

  const sessionRef = db.collection("ai_sessions").doc(sessionId);
  const sessionDoc = await sessionRef.get();

  const timestamp = FieldValue.serverTimestamp();

  if (!sessionDoc.exists) {
    // Crear el documento de la sesión si es nuevo
    await sessionRef.set({
      organizationId,
      userId,
      createdAt: timestamp,
      lastActive: timestamp
    });
  } else {
    // Si la sesión existe, validar multi-tenant
    const sessionData = sessionDoc.data();
    if (sessionData.organizationId !== organizationId) {
      throw new Error("Acceso no autorizado: la sesión pertenece a otra organización.");
    }
    // Actualizar última actividad
    await sessionRef.update({
      lastActive: timestamp
    });
  }

  // Guardar el mensaje en la subcolección de mensajes
  const messageData = {
    role: message.role, // 'user' o 'assistant'
    text: message.text,
    parts: message.parts || [{ text: message.text }],
    timestamp: timestamp
  };

  if (message.action) {
    messageData.action = message.action; // Payload estructurado de la acción
  }

  if (message.suggestions) {
    messageData.suggestions = message.suggestions; // Botones sugeridos
  }

  await sessionRef.collection("messages").add(messageData);
}

module.exports = {
  getChatHistory,
  saveChatMessage
};
