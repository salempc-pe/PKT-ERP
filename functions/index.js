const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "PKT ERP <onboarding@resend.dev>";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

exports.sendInvitationEmail = onCall(async (request) => {
  // 1. Verificar autenticación
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "El usuario debe estar autenticado.");
  }

  const { to, name, orgName, inviteUrl } = request.data;

  // 2. Validar inputs básicos
  if (!to || !name || !orgName || !inviteUrl) {
    throw new HttpsError("invalid-argument", "Faltan datos requeridos para el envío.");
  }

  // 3. Validar URL (Plan 38.5)
  if (!inviteUrl.startsWith("http")) {
    throw new HttpsError("invalid-argument", "URL de invitación inválida.");
  }

  // 4. Sanitizar variables (Plan 38.5)
  const safeName = escapeHtml(name);
  const safeOrgName = escapeHtml(orgName);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: [to],
        subject: `¡Bienvenido a ${safeOrgName}! - Invitación a Veló ERP`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #1e293b; line-height: 1.6; }
              .container { max-width: 600px; margin: 40px auto; padding: 32px; border: 1px solid #f1f5f9; border-radius: 24px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
              .logo { font-size: 24px; font-weight: 900; color: #6B4FD8; margin-bottom: 24px; text-align: center; }
              h1 { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
              p { margin-bottom: 16px; }
              .button-container { text-align: center; margin: 32px 0; }
              .button { background-color: #6B4FD8; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 700; display: inline-block; }
              .footer { font-size: 12px; color: #64748b; margin-top: 32px; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 24px; }
              .link { color: #6B4FD8; word-break: break-all; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">Veló ERP</div>
              <h1>¡Hola, ${safeName}!</h1>
              <p>Has sido invitado a unirte a la organización <strong>${safeOrgName}</strong> en nuestra plataforma ERP.</p>
              <p>Estamos emocionados de tenerte a bordo. Para comenzar, debes activar tu cuenta y configurar tu contraseña de acceso.</p>
              
              <div class="button-container">
                <a href="${inviteUrl}" class="button">Activar mi cuenta</a>
              </div>
              
              <p>Si el botón no funciona, puedes copiar y pegar el siguiente enlace en tu navegador:</p>
              <p class="link">${inviteUrl}</p>
              
              <p>Esta invitación expirará pronto, por lo que te recomendamos completar el proceso lo antes posible.</p>
              
              <div class="footer">
                <p>Este es un correo automático enviado por el sistema de Veló ERP.<br>Si no esperabas esta invitación, puedes ignorar este mensaje.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});
