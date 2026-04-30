const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

// Nota: La funcionalidad de envío de correos vía Resend ha sido removida.
// Las invitaciones ahora se manejan exclusivamente mediante links directos.

