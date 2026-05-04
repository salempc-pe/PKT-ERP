import React, { useState } from 'react';
import { X, Calendar, MessageSquare, Phone, Mail, Loader2 } from 'lucide-react';

export const InteractionHistory = ({ entity, entityType, interactions, onClose, onAddInteraction }) => {
  const [type, setType] = useState('Llamada');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!notes.trim()) return;

    setIsSaving(true);
    setError(null);
    try {
      await onAddInteraction({
        type,
        notes: notes.trim(),
        [entityType === 'contact' ? 'contactId' : 'leadId']: entity.id
      });
      setNotes('');
      setType('Llamada');
    } catch (err) {
      console.error("[InteractionHistory] Error al registrar interacción:", err);
      setError("No se pudo registrar la interacción.");
    } finally {
      setIsSaving(false);
    }
  };

  // Filtrar interacciones para esta entidad específica
  const entityInteractions = interactions.filter(i => 
    entityType === 'contact' ? i.contactId === entity.id : i.leadId === entity.id
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[var(--color-surface-variant)] border-l border-[var(--color-outline-variant)] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-surface-container)]">
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#6B4FD8] uppercase">Historial & CRM</span>
            <h3 className="text-base font-black text-[var(--color-on-surface)] flex items-center gap-2 mt-1">
              {entity.name}
            </h3>
            <p className="text-xs text-[var(--color-on-surface-variant)]">{entity.company || 'Sin Empresa'}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-[var(--color-on-surface-variant)] hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Interaction Form */}
        <div className="p-6 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)]">
          <h4 className="text-xs font-black text-[var(--color-on-surface)] uppercase tracking-wider mb-3">Registrar Nueva Interacción</h4>
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl text-red-300 text-xs animate-pulse">
                {error}
              </div>
            )}
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'Llamada', label: 'Llamada', icon: <Phone size={14} /> },
                { id: 'Correo', label: 'Correo', icon: <Mail size={14} /> },
                { id: 'Reunión', label: 'Reunión', icon: <Calendar size={14} /> },
                { id: 'Nota', label: 'Nota', icon: <MessageSquare size={14} /> }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setType(opt.id)}
                  className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border font-bold text-[10px] transition-all select-none ${type === opt.id ? 'bg-[#6B4FD8]/20 border-[#6B4FD8] text-[var(--color-primary)] shadow-md' : 'bg-[var(--color-surface-container)] border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]'}`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              <textarea 
                rows="3"
                placeholder="Escribe notas de la conversación, acuerdos, o próximos pasos..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                required
                disabled={isSaving}
                className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50"
              />
            </div>
            <button 
              type="submit"
              disabled={isSaving || !notes.trim()}
              className="w-full bg-[#6B4FD8] text-[#002150] font-black px-4 py-2.5 rounded-xl hover:shadow-[0_0_15px_rgba(133,173,255,0.4)] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2 text-xs"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : 'Guardar y Sumar Score (+10)'}
            </button>
          </form>
        </div>

        {/* Timeline Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <h4 className="text-xs font-black text-[var(--color-on-surface)] uppercase tracking-wider mb-2">Cronología</h4>
          {entityInteractions.length > 0 ? (
            <div className="relative border-l-2 border-[var(--color-outline-variant)] ml-3 space-y-5">
              {entityInteractions.map((interaction) => {
                const date = interaction.createdAt?.seconds 
                  ? new Date(interaction.createdAt.seconds * 1000).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
                  : 'Fecha reciente';

                return (
                  <div key={interaction.id} className="relative pl-6 animate-in fade-in duration-300">
                    {/* Circle Node */}
                    <div className="absolute top-1 -left-[9px] w-4 h-4 rounded-full bg-[#6B4FD8] flex items-center justify-center text-white border-2 border-[var(--color-surface-variant)] shadow">
                      {interaction.type === 'Llamada' && <Phone size={8} />}
                      {interaction.type === 'Correo' && <Mail size={8} />}
                      {interaction.type === 'Reunión' && <Calendar size={8} />}
                      {interaction.type === 'Nota' && <MessageSquare size={8} />}
                    </div>

                    <div className="bg-[var(--color-surface-container)]/60 border border-[var(--color-outline-variant)] p-3 rounded-xl hover:border-[#6B4FD8]/30 transition-all select-none">
                      <div className="flex justify-between items-center mb-1 flex-wrap gap-1">
                        <span className="text-xs font-black text-[var(--color-on-surface)] uppercase tracking-wider">
                          {interaction.type}
                        </span>
                        <span className="text-[10px] text-[var(--color-on-surface-variant)] opacity-70">
                          {date}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-on-surface)] leading-relaxed whitespace-pre-wrap">
                        {interaction.notes}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 border border-dashed border-[var(--color-outline-variant)] rounded-2xl p-6 text-center text-[var(--color-on-surface-variant)] select-none">
              <MessageSquare size={24} className="opacity-40 mb-2" />
              <p className="text-xs italic leading-tight">No se han registrado interacciones previas con esta entidad.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
