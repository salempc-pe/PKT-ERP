const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore();

/**
 * Busca un usuario registrado en la colección principal /users de Firestore
 * filtrando por su número de teléfono vinculado a WhatsApp.
 * @param {string} phoneNumber - El número de teléfono remitente entrante.
 * @returns {Promise<Object|null>} El perfil estructurado del usuario o null si no está registrado.
 */
async function resolveUserProfileByPhone(phoneNumber) {
  if (!phoneNumber) return null;

  // Sanitizar el número telefónico para conservar únicamente dígitos numéricos
  const sanitizedPhone = phoneNumber.replace(/[^0-9]/g, "");

  // Realizar búsqueda en la colección principal de usuarios en Firestore
  const usersSnapshot = await db
    .collection("users")
    .where("whatsappNumber", "==", sanitizedPhone)
    .limit(1)
    .get();

  if (usersSnapshot.empty) {
    // Intento secundario asumiendo que el número se guardó con el prefijo +
    const fallbackSnapshot = await db
      .collection("users")
      .where("whatsappNumber", "==", `+${sanitizedPhone}`)
      .limit(1)
      .get();
      
    if (fallbackSnapshot.empty) {
      return null;
    }
    
    const doc = fallbackSnapshot.docs[0];
    return { id: doc.id, uid: doc.id, ...doc.data() };
  }

  const doc = usersSnapshot.docs[0];
  return { id: doc.id, uid: doc.id, ...doc.data() };
}

/**
 * Procesa la vinculación OTP de 6 dígitos para un número de WhatsApp.
 * Valida el código contra la colección /whatsapp_bindings y actualiza el usuario.
 * @param {string} phoneNumber - El número de WhatsApp remitente.
 * @param {string} textCode - El código OTP de 6 dígitos enviado por el usuario.
 * @returns {Promise<Object>} El perfil del usuario vinculado de forma exitosa.
 */
async function processWhatsappBinding(phoneNumber, textCode) {
  if (!phoneNumber || !textCode) {
    throw new Error("Parámetros de vinculación insuficientes.");
  }

  const sanitizedPhone = phoneNumber.replace(/[^0-9]/g, "");
  const code = textCode.trim();

  // Validar formato del código (6 dígitos)
  if (!/^\d{6}$/.test(code)) {
    throw new Error("El código debe ser una cadena numérica de exactamente 6 dígitos.");
  }

  // Buscar el código activo y no expirado en la colección /whatsapp_bindings
  const bindingsSnapshot = await db
    .collection("whatsapp_bindings")
    .where("code", "==", code)
    .limit(1)
    .get();

  if (bindingsSnapshot.empty) {
    throw new Error("El código ingresado es inválido o no existe en el sistema.");
  }

  const bindingDoc = bindingsSnapshot.docs[0];
  const bindingData = bindingDoc.data();

  // Validar si el código ha expirado
  const now = Date.now();
  const expiresAt = bindingData.expiresAt ? bindingData.expiresAt.toDate().getTime() : 0;

  if (now > expiresAt) {
    // Borrar el código expirado para no saturar Firestore
    await bindingDoc.ref.delete();
    throw new Error("El código ha expirado. Por favor, genera uno nuevo en tu perfil.");
  }

  const { userId, organizationId } = bindingData;

  // Actualizar el documento de usuario con el número de WhatsApp sanitizado
  const userRef = db.collection("users").doc(userId);
  await userRef.update({
    whatsappNumber: sanitizedPhone
  });

  // Eliminar el token temporal para que sea un solo uso
  await bindingDoc.ref.delete();

  // Recuperar y retornar el perfil del usuario recién vinculado
  const userDoc = await userRef.get();
  return { id: userDoc.id, uid: userDoc.id, ...userDoc.data() };
}

module.exports = {
  resolveUserProfileByPhone,
  processWhatsappBinding
};
