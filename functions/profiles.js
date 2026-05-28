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

module.exports = {
  resolveUserProfileByPhone
};
