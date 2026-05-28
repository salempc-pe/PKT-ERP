import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, Trash2 } from 'lucide-react';
import { useAiAssistant } from '../hooks/useAiAssistant';
import './AiAssistantDrawer.css';

/**
 * Componente que representa el Drawer deslizable y translúcido de la IA (Veló AI).
 * Admite burbujas de diálogo estructuradas, estados de carga y pastillas con Comandos Rápidos.
 */
export default function AiAssistantDrawer({ isOpen, onClose }) {
  const { messages, loading, error, sendMessage, clearSession } = useAiAssistant();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Desplazar automáticamente hacia el último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    const textToSend = input;
    setInput('');
    await sendMessage(textToSend);
  };

  const handleQuickCommand = async (text) => {
    if (loading) return;
    await sendMessage(text);
  };

  if (!isOpen) return null;

  const quickCommands = [
    { label: "📦 Stock de palas", text: "¿Cuál es mi stock de palas?" },
    { label: "🧾 Preparar venta", text: "Prepara una venta para el cliente Juan Pérez" },
    { label: "⚠️ Salida de cemento", text: "Egresa 5 bolsas de cemento de bodega por rotura" }
  ];

  return (
    <div className="ai-assistant-overlay" onClick={onClose}>
      <div className="ai-assistant-drawer" onClick={(e) => e.stopPropagation()}>
        
        {/* Cabecera del Asistente */}
        <div className="ai-header">
          <div className="ai-logo-title">
            <div className="ai-icon-container animate-pulse">
              <Sparkles size={18} className="ai-sparkles" />
            </div>
            <div>
              <h3>Veló AI</h3>
              <p>Asistente Inteligente ERP</p>
            </div>
          </div>
          <div className="ai-actions">
            <button onClick={clearSession} className="ai-action-btn" title="Limpiar chat">
              <Trash2 size={16} />
            </button>
            <button onClick={onClose} className="ai-action-btn" title="Cerrar">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Feed de la Conversación */}
        <div className="ai-feed">
          {messages.length === 0 ? (
            <div className="ai-empty-state">
              <div className="ai-bot-avatar-large">
                <Bot size={36} />
              </div>
              <h4>¡Hola! Soy Veló AI</h4>
              <p>Estoy listo para ayudarte a registrar borradores de ventas, consultar stocks de inventario o egresar materiales en bodega utilizando lenguaje natural. ¿En qué puedo apoyarte hoy?</p>
              
              <div className="ai-quick-commands">
                <p className="ai-quick-title">Comandos Rápidos</p>
                <div className="ai-commands-grid">
                  {quickCommands.map((cmd, idx) => (
                    <button key={idx} onClick={() => handleQuickCommand(cmd.text)} className="ai-cmd-pill">
                      {cmd.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="ai-messages-list">
              {messages.map((msg, idx) => (
                <div key={idx} className={`ai-message-row ${msg.role === 'user' ? 'user-row' : 'assistant-row'}`}>
                  <div className="ai-avatar shadow-sm">
                    {msg.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  <div className="ai-bubble-container">
                    <div className="ai-bubble">
                      <p>{msg.text}</p>
                      
                      {/* Si la IA devuelve un payload estructurado de acción */}
                      {msg.action && (
                        <div className="ai-action-preview">
                          <span className="ai-action-badge">{msg.action.type}</span>
                          <pre className="ai-action-code">{JSON.stringify(msg.action.payload, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="ai-message-row assistant-row">
                  <div className="ai-avatar">
                    <Bot size={13} />
                  </div>
                  <div className="ai-bubble-container">
                    <div className="ai-bubble ai-writing-bubble">
                      <div className="ai-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="p-3 mx-4 my-2 text-xs rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="ai-footer">
          <input
            type="text"
            placeholder="Escribe un comando o pregunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={!input.trim() || loading} className="ai-send-btn">
            <Send size={15} />
          </button>
        </form>

      </div>
    </div>
  );
}
