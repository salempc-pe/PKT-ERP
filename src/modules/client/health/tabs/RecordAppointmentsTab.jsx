import React from 'react';
import { useHealth } from '../useHealth';
import { Calendar, Clock, MapPin, Video, CheckCircle } from 'lucide-react';

export default function RecordAppointmentsTab({ clientId, orgId }) {
  const { citas, updateCita } = useHealth(orgId);

  const clientCitas = citas
    .filter(c => c.client_id === clientId)
    .sort((a, b) => (b.fecha_hora?.toDate ? b.fecha_hora.toDate() : new Date(b.fecha_hora)) - (a.fecha_hora?.toDate ? a.fecha_hora.toDate() : new Date(a.fecha_hora)));

  const handleTogglePaid = async (citaId, currentState) => {
    try {
      await updateCita(citaId, { pagada: !currentState });
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusTag = (estado) => {
    const styles = {
      programada: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      confirmada: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      realizada: 'bg-green-500/10 text-green-400 border-green-500/20',
      cancelada: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return styles[estado] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  if (clientCitas.length === 0) {
    return (
      <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] p-12 rounded-3xl text-center text-[var(--color-on-surface-variant)] font-medium text-sm italic opacity-70">
        Este paciente aún no tiene historial de citas.
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
      {clientCitas.map((cita) => {
        const dateObj = cita.fecha_hora?.toDate ? cita.fecha_hora.toDate() : new Date(cita.fecha_hora);
        const dateStr = dateObj.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'long' });
        const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        return (
          <div 
            key={cita.id} 
            className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all hover:bg-[var(--color-surface-container)]"
          >
            {/* Datestamp Circle */}
            <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-variant)] border border-[var(--color-outline-variant)] flex flex-col items-center justify-center shrink-0">
               <span className="text-[9px] font-black uppercase text-[var(--color-on-surface-variant)] leading-none mb-0.5">{dateObj.toLocaleDateString('es-ES', { month: 'short' })}</span>
               <span className="text-lg font-black text-[var(--color-on-surface)] leading-none">{dateObj.getDate()}</span>
            </div>

            {/* Details Info */}
            <div className="flex-1 min-w-0">
               <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-[var(--color-on-surface)] capitalize">{dateStr}</h4>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 border rounded-full ${getStatusTag(cita.estado)}`}>
                    {cita.estado.replace('_',' ')}
                  </span>
               </div>
               <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-[11px] font-bold text-[var(--color-on-surface-variant)]">
                  <span className="flex items-center gap-1"><Clock size={12} className="opacity-60"/> {timeStr} ({cita.duracion_min} min)</span>
                  <span className="flex items-center gap-1">
                    {cita.modalidad === 'videollamada' ? <Video size={12} className="opacity-60"/> : <MapPin size={12} className="opacity-60"/>}
                    {cita.modalidad}
                  </span>
                  <span className="opacity-60">•</span>
                  <span className="capitalize">{cita.tipo_sesion?.replace('_', ' ')}</span>
               </div>
            </div>

            {/* Money / Billing Actions */}
            <div className="flex items-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-[var(--color-outline-variant)] w-full sm:w-auto pl-0 sm:pl-4 justify-between sm:justify-end">
               {cita.monto > 0 ? (
                 <button 
                   onClick={() => handleTogglePaid(cita.id, cita.pagada)}
                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black border transition-all ${
                     cita.pagada 
                       ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20' 
                       : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                   }`}
                 >
                   <span className="opacity-80">${cita.monto}</span>
                   <CheckCircle size={12} className={cita.pagada ? 'fill-green-400/20' : 'opacity-40'} />
                 </button>
               ) : (
                 <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)] opacity-50 italic">Sin costo</span>
               )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
