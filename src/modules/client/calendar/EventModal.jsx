import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, User, FileText, Loader2, Info } from 'lucide-react';

export default function EventModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  contacts, 
  resources,
  isSubmitting 
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [clientId, setClientId] = useState('');
  const [resourceId, setResourceId] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await onSubmit({
        title,
        date,
        time,
        duration: parseInt(duration),
        clientId,
        resourceId,
        notes,
        status: 'PENDING'
      });
      onClose();
    } catch (err) {
      setError(err.message || "Error al programar la cita");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && onClose()}></div>
      <div className="bg-[var(--color-surface-variant)] w-full max-w-md border border-[var(--color-outline-variant)] rounded-3xl shadow-lg relative animate-in zoom-in duration-300">
        
        <div className="p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-surface-container)] rounded-t-3xl">
           <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm flex items-center gap-2">
             <CalendarIcon size={16} className="text-[var(--color-primary)]" /> Agendar Cita
           </h3>
           <button onClick={onClose} className="text-[var(--color-on-surface-variant)] hover:text-white">
             <X size={16}/>
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-xl flex items-center gap-2 text-red-500 text-xs animate-in slide-in-from-top-2">
              <Info size={14} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Título de Reservación</label>
            <input 
              type="text" required
              value={title} onChange={e => setTitle(e.target.value)}
              className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#6B4FD8] border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] transition-all"
              placeholder="Ej. Revisión técnica o Demo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Fecha</label>
              <input 
                type="date" required
                value={date} onChange={e => setDate(e.target.value)}
                className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#6B4FD8] border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] transition-all"
                style={{ colorScheme: 'dark' }}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Hora</label>
              <input 
                type="time" required
                value={time} onChange={e => setTime(e.target.value)}
                className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#6B4FD8] border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] transition-all"
                style={{ colorScheme: 'dark' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Duración (min)</label>
              <select 
                value={duration} onChange={e => setDuration(e.target.value)}
                className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] outline-none text-sm focus:border-[#6B4FD8]"
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">1 hora</option>
                <option value="90">1.5 horas</option>
                <option value="120">2 horas</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Recurso Físico</label>
              <select 
                value={resourceId} onChange={e => setResourceId(e.target.value)}
                className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] outline-none text-sm focus:border-[#6B4FD8]"
              >
                <option value="">-- Sin Recurso --</option>
                {resources.map(r => (
                   <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Cliente Asociado (Opcional)</label>
            <select 
              value={clientId} onChange={e => setClientId(e.target.value)}
              className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] outline-none text-sm focus:border-[#6B4FD8]"
            >
              <option value="">-- Sin Cliente --</option>
              {contacts.map(c => (
                 <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Notas internas</label>
            <textarea 
              value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#6B4FD8] border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] transition-all min-h-[60px]"
              placeholder="Detalles adicionales..."
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-[#6B4FD8] text-[#001b5c] font-black px-4 py-3.5 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Confirmar Cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
