import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Configuración de Firebase
// Nota: Las variables deben empezar con VITE_ para que sean accesibles en el cliente
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validación detallada para el entorno de desarrollo
if (import.meta.env.DEV && !import.meta.env.VITE_FIREBASE_API_KEY) {
    console.error("❌ Firebase Error: VITE_FIREBASE_API_KEY no detectado.");
    console.info("Asegúrate de que el archivo /app/.env existe y contiene las variables correctas.");
}

// Initialize Firebase
let app, db, auth;
try {
  if (!firebaseConfig.apiKey) {
    throw new Error("Falta VITE_FIREBASE_API_KEY. Verifica tus variables de entorno.");
  }
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);

  // Inicializar App Check
  if (typeof window !== 'undefined') {
    // En desarrollo, permitimos el uso de tokens de depuración
    if (import.meta.env.DEV) {
      self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'TU_SITE_KEY_AQUÍ'),
      isTokenAutoRefreshEnabled: true
    });
    console.log("🛡️ App Check inicializado");
  }

  console.log("✅ Firebase inicializado correctamente");
} catch (error) {
  console.error("❌ Error al inicializar Firebase:", error.message);
  // No lanzamos el error para permitir que la UI cargue aunque sea un mensaje de error
}

export { db, auth };
export default app;
