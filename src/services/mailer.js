import { getFunctions, httpsCallable } from 'firebase/functions';
import app from './firebase';

const functions = getFunctions(app);

/**
 * Servicio para envío de correos electrónicos mediante Firebase Cloud Functions.
 * Esto protege la API Key de Resend al mantenerla exclusivamente en el backend.
 */
export const sendInvitationEmail = async (to, name, orgName, inviteUrl) => {
  try {
    const sendEmail = httpsCallable(functions, 'sendInvitationEmail');
    const result = await sendEmail({ to, name, orgName, inviteUrl });
    
    if (result.data && result.data.success) {
      console.log("✅ Correo enviado con éxito (vía Cloud Function)");
      return { success: true, data: result.data.data };
    } else {
      console.error("❌ Error al enviar correo:", result.data?.error);
      return { success: false, error: result.data?.error || 'Error desconocido' };
    }
  } catch (error) {
    console.error("❌ Error de red/autenticación al invocar Cloud Function:", error);
    return { success: false, error: error.message };
  }
};
