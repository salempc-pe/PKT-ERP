const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Inicializar el cliente de la API de Gemini
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

/**
 * Obtiene la instancia del modelo de Gemini configurado con las instrucciones de sistema.
 * @param {Array} tools - Opcional. Lista de declaraciones de herramientas.
 * @returns {import("@google/generative-ai").GenerativeModel}
 */
function getAssistantModel(tools = []) {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY no configurada en las variables de entorno.");
  }

  const systemInstruction = 
    "Eres 'Veló AI', el asistente inteligente de inteligencia artificial del sistema Veló ERP (anteriormente PKT ERP). " +
    "Tu objetivo es ayudar de forma cortés, proactiva y profesional a los usuarios a interactuar con la plataforma. " +
    "Puedes realizar consultas y preparar acciones para que el usuario las valide (las herramientas te permiten generar intenciones estructuradas). " +
    "Tus respuestas deben estar redactadas en español nativo, con un tono entusiasta pero sofisticado. " +
    "REGLA CRÍTICA: Nunca inventes datos que no conozcas. " +
    "Cuando el usuario te solicite una acción de escritura (como registrar una venta o egresar stock), utiliza la herramienta correspondiente para generar una propuesta de transacción y pídele confirmación visual.";

  const config = {
    model: "gemini-1.5-flash",
    systemInstruction: systemInstruction,
    generationConfig: {
      temperature: 0.2, // Temperatura baja para respuestas estables y precisas
      topP: 0.95,
      responseMimeType: "application/json" // Forzar formato JSON para comunicación limpia con el endpoint
    }
  };

  if (tools.length > 0) {
    config.tools = [{ functionDeclarations: tools }];
  }

  return genAI.getGenerativeModel(config);
}

module.exports = {
  getAssistantModel
};
