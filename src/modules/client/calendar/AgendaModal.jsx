import { useState, useEffect } from 'react';
import { X, Calendar, Clock, FileText, Check } from 'lucide-react';

export default function AgendaModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  appointment = null, 
  isAdmin = false, 
  currentUserId = null 
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('personal'); // 'personal' o 'company'
  const [error, setError] = useState('');

  useEffect(() => {
    if (appointment) {
      setTitle(appointment.title || '');
      setDate(appointment.date || '');
      setTime(appointment.time || '');
      setDescription(appointment.description || '');
      setType(appointment.type || 'personal');
    } else {
      setTitle('');
      setDate('');
      setTime('');
      setDescription('');
      setType('personal');
    }
    setError('');
  }, [appointment, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('El título es requerido.');
      return;
    }
    if (!date) {
      setError('La fecha es requerida.');
      return;
    }
    if (!time) {
      setError('La hora es requerida.');
      return;
    }

    const payload = {
      title: title.trim(),
      date,
      time,
      description: description.trim(),
      type: isAdmin ? type : 'personal',
      userId: appointment?.userId || currentUserId,
      status: appointment?.status || 'PENDING'
    };

    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-[var(--color-surface-container)] rounded-2xl border border-[var(--color-outline-variant)] shadow-2xl overflow-hidden animate-in zoom-in duration-300 z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)]">
          <h3 className="font-black text-sm uppercase tracking-wider text-[var(--color-on-surface)] flex items-center gap-2">
            <Calendar size={18} className="text-[#6B4FD8]" />
            {appointment ? 'Editar Evento' : 'Nuevo Evento'}
          </h3>
          <button 
            onClick={onClose}
            className="p-1 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-highest)] rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content / Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl font-semibold">
              ⚠️ {error}
            </div>
          )}

          {/* Título */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">
              Título del Evento
            </label>
            <input 
              type="text" 
              placeholder="Ej. Reunión de equipo, Dentista..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl text-[var(--color-on-surface)] placeholder-[var(--color-on-surface-variant)]/50 focus:outline-none focus:border-[#6B4FD8] transition-colors text-sm"
              required
            />
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                Fecha
              </label>
              <div className="relative">
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl text-[var(--color-on-surface)] focus:outline-none focus:border-[#6B4FD8] transition-colors text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                Hora
              </label>
              <div className="relative">
                <input 
                  type="time" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl text-[var(--color-on-surface)] focus:outline-none focus:border-[#6B4FD8] transition-colors text-sm"
                  required
                />
              </div>
            </div>
          </div>

          {/* Tipo de Evento (Solo para administradores) */}
          {isAdmin && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                Tipo de Evento
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[var(--color-surface-container-low)] p-1 rounded-xl border border-[var(--color-outline-variant)]">
                <button
                  type="button"
                  onClick={() => setType('personal')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                    type === 'personal'
                      ? 'bg-[#6B4FD8] text-[#002150] shadow-sm'
                      : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)]'
                  }`}
                >
                  Personal
                </button>
                <button
                  type="button"
                  onClick={() => setType('company')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                    type === 'company'
                      ? 'bg-[#6B4FD8] text-[#002150] shadow-sm'
                      : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-high)]'
                  }`}
                >
                  Empresa
                </button>
              </div>
            </div>
          )}

          {/* Descripción */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">
              Descripción (Opcional)
            </label>
            <textarea 
              rows={3}
              placeholder="Detalles sobre la tarea o reunión..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl text-[var(--color-on-surface)] placeholder-[var(--color-on-surface-variant)]/50 focus:outline-none focus:border-[#6B4FD8] transition-colors text-sm resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-3 border-t border-[var(--color-outline-variant)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container-highest)] border border-[var(--color-outline-variant)] rounded-xl text-xs font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#6B4FD8] text-[#002150] hover:bg-[#7b61df] rounded-xl text-xs font-black flex items-center gap-1.5 shadow-[0_2px_8px_rgba(107,79,216,0.2)] hover:shadow-[0_4px_12px_rgba(107,79,216,0.3)] transition-all"
            >
              <Check size={14} />
              {appointment ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
