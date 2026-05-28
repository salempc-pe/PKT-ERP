const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");

// Inicializar la aplicación de administración de Firebase
initializeApp();

/**
 * Función HTTP básica para validación preliminar del backend.
 * Responde con un estado 200 y confirmación estructurada en formato JSON.
 */
exports.helloWorld = onRequest({ cors: true }, (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Veló AI backend ready"
  });
});
