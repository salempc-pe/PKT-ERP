import React, { useState } from 'react';
import { MessageSquare, Send, X, CheckCircle2 } from 'lucide-react';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './FeedbackButton.css';

export default function FeedbackButton() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('idle'); // idle, sending, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setStatus('sending');
    try {
      // Save feedback to Firestore
      await addDoc(collection(db, 'feedback'), {
        message: feedback,
        timestamp: serverTimestamp(),
        userEmail: user?.email || 'anonymous',
        userId: user?.uid || user?.id || 'anonymous',
        organizationId: user?.organizationId || null,
        url: window.location.href,
        userAgent: navigator.userAgent
      });

      setFeedback(''); 
      setIsOpen(false); // Cerrar inmediatamente
      setStatus('idle');
      
      // Opcional: Podríamos mostrar un toast global aquí si el proyecto tuviera uno, 
      // pero por ahora cumplimos con cerrar el modal inmediatamente.
    } catch (error) {
      console.error('❌ Error detallado al enviar feedback:', error);
      // Si el error es por permisos, probablemente sea por las reglas no desplegadas
      if (error.code === 'permission-denied') {
        console.warn('⚠️ Sugerencia: Asegúrate de haber desplegado las nuevas reglas de Firestore con: firebase deploy --only firestore:rules');
      }
      setStatus('error');
    }
  };

  if (!user) return null;

  return (
    <div className="feedback-container">
      {isOpen && (
        <div className="feedback-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3>Feedback</h3>
              <p>¿Tienes alguna sugerencia o encontraste un error?</p>
            </div>
            <button 
              className="btn-cancel" 
              onClick={() => setIsOpen(false)}
              style={{ padding: '4px', minWidth: 'auto' }}
            >
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="Cuéntanos qué podemos mejorar..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={status === 'sending'}
              required
            />
            {status === 'error' && (
              <p style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginBottom: '12px' }}>
                Error al enviar. Inténtalo de nuevo.
              </p>
            )}
            <div className="buttons">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={() => setIsOpen(false)}
                disabled={status === 'sending'}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn-submit"
                disabled={status === 'sending' || !feedback.trim()}
              >
                {status === 'sending' ? 'Enviando...' : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Enviar <Send size={16} />
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <button 
        className="feedback-button"
        onClick={() => setIsOpen(!isOpen)}
        title="Enviar feedback"
        aria-label="Botón de feedback"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
