import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, User, FileText, Loader2, Info, ChevronDown } from 'lucide-react';
import CustomDatePicker from './CustomDatePicker';

export default function EventModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  contacts, 
  resources,
  isSubmitting,
  appointment = null,
  isViewOnly = false
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [time, setTime] = useState('09:00'); // Internal 24h format
  
  // 12h format states
  const [h12, setH12] = useState('09');
  const [m12, setM12] = useState('00');
  const [ampm, setAmpm] = useState('AM');

  const [duration, setDuration] = useState('60');
  const [clientId, setClientId] = useState('');
  const [resourceId, setResourceId] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [error, setError] = useState('');

  // Sync internal states when appointment or modal opens
  useEffect(() => {
    if (isOpen) {
      if (appointment) {
        setTitle(appointment.title || '');
        setDate(appointment.date || '');
        const t = appointment.time || '09:00';
        setTime(t);
        
        // Convert 24h to 12h parts
        const [h24, mins] = t.split(':');
        let h = parseInt(h24);
        const period = h >= 12 ? 'PM' : 'AM';
        h = h % 12;
        h = h ? h : 12;
        setH12(String(h).padStart(2, '0'));
        setM12(mins);
        setAmpm(period);

        setDuration(String(appointment.duration || '60'));
        setClientId(appointment.clientId || '');
        setResourceId(appointment.resourceId || '');
        setNotes(appointment.notes || '');
        setStatus(appointment.status || 'PENDING');
      } else {
        // Reset for new
        setTitle('');
        setDate(new Date().toISOString().split('T')[0]); // Default to today
        setTime('09:00');
        setH12('09');
        setM12('00');
        setAmpm('AM');
        setDuration('60');
        setClientId('');
        setResourceId('');
        setNotes('');
        setStatus('PENDING');
      }
      setIsDatePickerOpen(false);
    }
  }, [appointment, isOpen]);

  // Sync 'time' (24h) when 12h parts change
  useEffect(() => {
    let h = parseInt(h12);
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    const h24 = String(h).padStart(2, '0');
    setTime(`${h24}:${m12}`);
  }, [h12, m12, ampm]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isViewOnly) return;
    setError('');
    
    if (!date) {
      setError("Debes seleccionar una fecha");
      return;
    }
    
    try {
      await onSubmit({
        title,
        date,
        time,
        duration: parseInt(duration),
        clientId,
        resourceId,
        notes,
        status
      });
      onClose();
    } catch (err) {
      setError(err.message || "Error al guardar la cita");
    }
  };

  const modalTitle = isViewOnly 
    ? 'Detalles de la Cita' 
    : (appointment ? 'Editar Cita' : 'Agendar Cita');

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

  const formatDisplayDate = (d) => {
    if (!d) return "Seleccionar fecha";
    const [year, month, day] = d.split('-');
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && onClose()}></div>
      <div className="bg-[var(--color-surface-variant)] w-full max-w-md border border-[var(--color-outline-variant)] rounded-3xl shadow-lg relative animate-in zoom-in duration-300">
        
        <div className="p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-surface-container)] rounded-t-3xl">
           <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm flex items-center gap-2">
             <CalendarIcon size={16} className="text-[var(--color-primary)]" /> {modalTitle}
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
              disabled={isViewOnly}
              value={title} onChange={e => setTitle(e.target.value)}
              className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#6B4FD8] border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] transition-all disabled:opacity-70"
              placeholder="Ej. Revisión técnica o Demo"
            />
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Fecha de la Cita</label>
              <button
                type="button"
                disabled={isViewOnly}
                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-xl px-4 py-3 border border-[var(--color-outline-variant)] hover:border-[#6B4FD8] transition-all flex items-center justify-between disabled:opacity-70"
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon size={16} className="text-[#6B4FD8]" />
                  <span className="capitalize">{formatDisplayDate(date)}</span>
                </div>
                <ChevronDown size={16} className={`transition-transform duration-300 ${isDatePickerOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDatePickerOpen && (
                <div className="absolute top-full left-0 z-[60] mt-2">
                  <CustomDatePicker 
                    selectedDate={date} 
                    onChange={(newDate) => {
                      setDate(newDate);
                      setIsDatePickerOpen(false);
                    }}
                    onClose={() => setIsDatePickerOpen(false)}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Hora de Cita (12h)</label>
              <div className="flex gap-2">
                <select 
                  value={h12} onChange={e => setH12(e.target.value)}
                  disabled={isViewOnly}
                  className="flex-1 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-xl px-2 py-3 outline-none border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] transition-all disabled:opacity-70"
                >
                  {hours.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <select 
                  value={m12} onChange={e => setM12(e.target.value)}
                  disabled={isViewOnly}
                  className="flex-1 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-xl px-2 py-3 outline-none border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] transition-all disabled:opacity-70"
                >
                  {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select 
                  value={ampm} onChange={e => setAmpm(e.target.value)}
                  disabled={isViewOnly}
                  className="w-16 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-xs font-bold rounded-xl px-1 py-3 outline-none border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] transition-all disabled:opacity-70"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Duración (min)</label>
              <select 
                disabled={isViewOnly}
                value={duration} onChange={e => setDuration(e.target.value)}
                className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] outline-none text-sm focus:border-[#6B4FD8] disabled:opacity-70"
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
                disabled={isViewOnly}
                value={resourceId} onChange={e => setResourceId(e.target.value)}
                className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] outline-none text-sm focus:border-[#6B4FD8] disabled:opacity-70"
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
              disabled={isViewOnly}
              value={clientId} onChange={e => setClientId(e.target.value)}
              className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] outline-none text-sm focus:border-[#6B4FD8] disabled:opacity-70"
            >
              <option value="">-- Sin Cliente --</option>
              {contacts.map(c => (
                 <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Estado de la Cita</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'PENDING', label: 'Pendiente', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
                { id: 'DONE', label: 'Realizada', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
                { id: 'CANCELLED', label: 'Cancelada', color: 'bg-red-500/10 text-red-500 border-red-500/20' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  disabled={isViewOnly}
                  onClick={() => setStatus(opt.id)}
                  className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase border transition-all ${
                    status === opt.id 
                      ? `${opt.color} ring-1 ring-offset-2 ring-offset-[var(--color-surface-variant)] ring-opacity-50` 
                      : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] border-[var(--color-outline-variant)] opacity-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Notas internas</label>
            <textarea 
              disabled={isViewOnly}
              value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full bg-[var(--color-surface-container)] text-[var(--on-surface)] text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#6B4FD8] border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] transition-all min-h-[60px] disabled:opacity-70"
              placeholder="Detalles adicionales..."
            />
          </div>

          {!isViewOnly && (
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#6B4FD8] text-[#001b5c] font-black px-4 py-3.5 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (appointment ? 'Guardar Cambios' : 'Confirmar Cita')}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
