import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, Loader2, CheckCircle } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export default function AppointmentModal({ isOpen, onClose, onSave, contacts, expedientes, isSaving, initialDate = null }) {
  const [formData, setFormData] = useState({
    client_id: '',
    expediente_id: '',
    fecha_hora: '',
    duracion_min: 60,
    tipo_sesion: 'seguimiento',
    modalidad: 'presencial',
    monto: '',
    pagada: false
  });

  // Preset datetime if provided (like clicking a day)
  useEffect(() => {
    if (initialDate) {
      const d = new Date(initialDate);
      d.setHours(9, 0, 0, 0); // default 9 am
      const offsetStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setFormData(prev => ({ ...prev, fecha_hora: offsetStr }));
    } else {
      // Now rounded to nearest hour
      const d = new Date();
      d.setMinutes(0,0,0);
      d.setHours(d.getHours() + 1);
      const offsetStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setFormData(prev => ({ ...prev, fecha_hora: offsetStr }));
    }
  }, [initialDate, isOpen]);

  // Auto select active expediente when client changes
  useEffect(() => {
    if (formData.client_id) {
      const activeExp = expedientes.find(e => e.client_id === formData.client_id && e.estado === 'activo');
      if (activeExp) {
        setFormData(prev => ({ ...prev, expediente_id: activeExp.id }));
      } else {
        setFormData(prev => ({ ...prev, expediente_id: '' }));
      }
    }
  }, [formData.client_id, expedientes]);

  if (!isOpen) return null;

  // Filtrar solo clientes que ya tienen un expediente abierto (requisito para cita salud)
  const validClients = contacts.filter(c => 
    expedientes.some(e => e.client_id === c.id && e.estado === 'activo')
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.expediente_id) {
      alert("El cliente seleccionado no cuenta con un expediente activo. Créalo primero.");
      return;
    }
    
    const dateObj = new Date(formData.fecha_hora);
    await onSave({
      ...formData,
      fecha_hora: Timestamp.fromDate(dateObj),
      duracion_min: Number(formData.duracion_min),
      monto: formData.monto ? Number(formData.monto) : null,
      estado: 'programada'
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => !isSaving && onClose()}></div>
      <form 
        onSubmit={handleSubmit} 
        className="bg-[var(--color-surface-variant)] border border-[var(--color-outline-variant)] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in duration-200"
      >
        <div className="p-6 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] flex justify-between items-center">
          <div className="flex items-center gap-3 text-[#6B4FD8]">
            <div className="p-2 bg-[#6B4FD8]/10 rounded-xl">
              <Calendar size={20} />
            </div>
            <h3 className="font-black uppercase tracking-wider text-sm text-[var(--color-on-surface)]">Agendar Nueva Cita</h3>
          </div>
          <button type="button" onClick={onClose} disabled={isSaving} className="text-[var(--color-on-surface-variant)] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Paciente */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-[var(--color-on-surface-variant)] flex items-center gap-1.5">
              <Users size={12} /> Paciente
            </label>
            <select
              required
              value={formData.client_id}
              onChange={(e) => setFormData({...formData, client_id: e.target.value})}
              className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none transition-colors font-bold"
            >
              <option value="">-- Seleccionar Paciente --</option>
              {validClients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {!formData.expediente_id && formData.client_id && (
               <p className="text-[10px] text-red-400 font-bold mt-1">⚠ Advertencia: Este cliente no tiene expediente activo.</p>
            )}
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-[var(--color-on-surface-variant)] flex items-center gap-1.5">
                <Clock size={12} /> Fecha y Hora
              </label>
              <input
                required
                type="datetime-local"
                value={formData.fecha_hora}
                onChange={(e) => setFormData({...formData, fecha_hora: e.target.value})}
                className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none transition-colors text-sm font-bold"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-[var(--color-on-surface-variant)]">Duración (min)</label>
              <select
                value={formData.duracion_min}
                onChange={(e) => setFormData({...formData, duracion_min: Number(e.target.value)})}
                className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2 text-[var(--color-on-surface)] outline-none focus:border-[#6B4FD8] text-sm font-bold"
              >
                <option value="30">30 mins</option>
                <option value="45">45 mins</option>
                <option value="60">60 mins (1 hr)</option>
                <option value="90">90 mins</option>
                <option value="120">120 mins</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             {/* Tipo */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-[var(--color-on-surface-variant)]">Tipo de Sesión</label>
              <select
                value={formData.tipo_sesion}
                onChange={(e) => setFormData({...formData, tipo_sesion: e.target.value})}
                className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2 text-[var(--color-on-surface)] outline-none text-xs font-bold"
              >
                <option value="primera_consulta">Primera Consulta</option>
                <option value="seguimiento">Seguimiento</option>
                <option value="evaluacion">Evaluación</option>
                <option value="cierre">Cierre</option>
              </select>
            </div>
            {/* Modalidad */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-[var(--color-on-surface-variant)]">Modalidad</label>
              <select
                value={formData.modalidad}
                onChange={(e) => setFormData({...formData, modalidad: e.target.value})}
                className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2 text-[var(--color-on-surface)] outline-none text-xs font-bold"
              >
                <option value="presencial">Presencial</option>
                <option value="videollamada">Videollamada</option>
                <option value="telefono">Teléfono</option>
              </select>
            </div>
          </div>

          {/* Cobro */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-[var(--color-surface-container)]/50 border border-[var(--color-outline-variant)] rounded-2xl mt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-[var(--color-on-surface-variant)]">Monto (Opcional)</label>
              <input
                type="number"
                placeholder="0.00"
                value={formData.monto}
                onChange={(e) => setFormData({...formData, monto: e.target.value})}
                className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2 text-[var(--color-on-surface)] outline-none focus:border-[#6B4FD8] font-bold"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
               <input 
                 type="checkbox" 
                 id="pagada"
                 checked={formData.pagada}
                 onChange={(e) => setFormData({...formData, pagada: e.target.checked})}
                 className="w-4 h-4 accent-[#6B4FD8] rounded"
               />
               <label htmlFor="pagada" className="text-xs font-bold text-[var(--color-on-surface)] cursor-pointer">Pagada por adelantado</label>
            </div>
          </div>

        </div>

        <div className="p-6 bg-[var(--color-surface-container)] border-t border-[var(--color-outline-variant)] flex gap-3">
          <button type="button" onClick={onClose} disabled={isSaving} className="flex-1 px-4 py-3 rounded-xl text-xs font-bold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-colors">Cancelar</button>
          <button 
            type="submit" 
            disabled={isSaving || !formData.client_id || !formData.expediente_id} 
            className="flex-[2] bg-[#6B4FD8] text-[#002150] rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(107,79,216,0.4)] disabled:opacity-50 transition-all"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle size={16}/> Crear Cita</>}
          </button>
        </div>
      </form>
    </div>
  );
}
