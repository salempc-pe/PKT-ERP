import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ENDPOINT_URL = import.meta.env.DEV
  ? 'http://127.0.0.1:5001/pkt-erp/us-central1/velóAssistantEndpoint'
  : `https://us-central1-${import.meta.env.VITE_FIREBASE_PROJECT_ID || 'pkt-erp'}.cloudfunctions.net/velóAssistantEndpoint`;

/**
 * Hook personalizado de React para interactuar con el asistente de IA de Veló ERP.
 * Administra el feed de conversación, los estados de carga y errores de forma aislada
 * por organización (multi-tenant).
 */
export function useAiAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener o inicializar el sessionId en sessionStorage
  const [sessionId, setSessionId] = useState(() => {
    let savedId = sessionStorage.getItem('veló_ai_session_id');
    if (!savedId) {
      savedId = crypto.randomUUID();
      sessionStorage.setItem('veló_ai_session_id', savedId);
    }
    return savedId;
  });

  // Limpiar el feed al cambiar de ID de sesión
  useEffect(() => {
    setMessages([]);
    setError(null);
  }, [sessionId]);

  /**
   * Resetea el chat actual generando un nuevo ID de sesión de forma atómica.
   */
  const clearSession = () => {
    const newId = crypto.randomUUID();
    sessionStorage.setItem('veló_ai_session_id', newId);
    setSessionId(newId);
  };

  /**
   * Envía un mensaje en lenguaje natural al asistente de IA en el backend.
   * @param {string} text - El texto del mensaje.
   */
  const sendMessage = async (text) => {
    if (!text || !text.trim()) return;
    if (!user || !user.organizationId) {
      setError("Usuario no autenticado o sin organización vinculada.");
      return;
    }

    const userMessage = {
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(ENDPOINT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          sessionId,
          organizationId: user.organizationId,
          userId: user.uid || user.id || 'anonymous'
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Error en la petición: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage = {
        role: 'assistant',
        text: data.text || 'Sin respuesta',
        timestamp: new Date(),
        suggestions: data.suggestions || [],
        action: data.action || null
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (err) {
      console.error("❌ Error en useAiAssistant:", err);
      setError(err.message || "Error al comunicarse con el asistente de IA.");
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "Lo siento, en este momento no puedo procesar tu solicitud debido a problemas de conexión con el servidor. ¿Podrías volver a intentarlo en unos instantes?",
          timestamp: new Date(),
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearSession
  };
}
