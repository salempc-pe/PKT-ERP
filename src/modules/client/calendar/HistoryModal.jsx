import React from 'react';
import { X, FileClock, User, Clock, Eye, RefreshCcw } from 'lucide-react';

export default function HistoryModal({ isOpen, onClose, appointments, contacts, onView, onStatusUpdate }) {
  if (!isOpen) return null;

  // El modal ahora actúa como un Registro Completo de todas las citas
  const historyAppointments = [...appointments]
    .sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));

  const formatTime12h = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${minutes} ${ampm}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-[var(--color-surface-variant)] w-full max-w-2xl border border-[var(--color-outline-variant)] rounded-3xl shadow-lg relative animate-in zoom-in duration-300">
        
        <div className="p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-surface-container)] rounded-t-3xl">
           <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm flex items-center gap-2">
             <FileClock size={16} className="text-[var(--color-primary)]" /> Registro de Citas
           </h3>
           <button onClick={onClose} className="text-[var(--color-on-surface-variant)] hover:text-white">
             <X size={16}/>
           </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
          {historyAppointments.length === 0 ? (
            <div className="text-center py-12">
              <FileClock size={48} className="mx-auto text-[var(--color-outline-variant)] mb-4 opacity-20" />
              <p className="text-[var(--color-on-surface-variant)]">No hay citas registradas.</p>
            </div>
          ) : (
            historyAppointments.map(appt => {
              const client = contacts.find(c => c.id === appt.clientId);
              const dateObj = new Date(appt.date);
              
              let statusLabel = '';
              let statusColor = '';
              let accentColor = '#6B4FD8';

              const isPast = new Date(`${appt.date}T${appt.time}`) < new Date();

              if (appt.status === 'CANCELLED') {
                statusLabel = 'Cancelada';
                statusColor = 'bg-red-500/10 text-red-500 border-red-500/20';
                accentColor = '#ef4444';
              } else if (appt.status === 'DONE' || (appt.status === 'PENDING' && isPast)) {
                // Si ya pasó o está marcada como DONE, es "Realizada"
                statusLabel = 'Realizada';
                statusColor = 'bg-green-500/10 text-green-500 border-green-500/20';
                accentColor = '#22c55e';
              } else if (appt.status === 'PENDING') {
                // Si es PENDING y futura
                statusLabel = 'Pendiente';
                statusColor = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                accentColor = '#3b82f6';
              }
              
              return (
                <div 
                  key={appt.id} 
                  onClick={() => onView(appt)}
                  className={`group relative overflow-hidden bg-[var(--color-surface-container)]/70 backdrop-blur-md border p-4 rounded-2xl flex justify-between items-center gap-4 transition-all duration-300 cursor-pointer shadow-[0_12px_24px_-4px_rgba(0,0,0,0.3),_inset_0_1.5px_1.5px_rgba(255,255,255,0.08)] hover:shadow-[0_15px_30px_-8px_rgba(0,0,0,0.4),_inset_0_2px_2px_rgba(255,255,255,0.12)] hover:bg-[var(--color-surface-container-high)]/95 hover:-translate-y-0.5 hover:scale-[1.008] ${appt.status === 'CANCELLED' ? 'border-red-500/40 hover:border-red-500/60' : 'border-[var(--color-outline-variant)]/80 hover:border-[#6B4FD8]/60'}`}
                >
                  {/* Background Glow */}
                  <div 
                    className="absolute -right-10 -top-10 w-24 h-24 blur-[50px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                    style={{ backgroundColor: accentColor }}
                  ></div>

                  <div className="flex gap-4 items-center relative z-10">
                    <div className="bg-[var(--color-surface-variant)] px-3 py-2 rounded-xl text-center min-w-[70px] transition-transform duration-500 group-hover:scale-110">
                      <span className="block text-[10px] font-bold uppercase opacity-60">
                        {dateObj.toLocaleDateString('es-ES', { month: 'short', timeZone: 'UTC' })}
                      </span>
                      <span className="block text-lg font-black leading-none">
                        {dateObj.getUTCDate()}
                      </span>
                      <span className="block text-[9px] font-bold opacity-40">
                        {dateObj.getUTCFullYear()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--color-on-surface)] text-sm group-hover:text-[var(--color-primary)] transition-colors">{appt.title}</h4>
                      <div className="flex items-center gap-3 text-[10px] text-[var(--color-on-surface-variant)] mt-1">
                        <span className="flex items-center gap-1 font-semibold"><Clock size={10}/> {formatTime12h(appt.time)}</span>
                        {client && <span className="flex items-center gap-1 font-semibold"><User size={10}/> {client.name}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 relative z-10">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border transition-all duration-300 group-hover:scale-105 ${statusColor}`}>
                      {statusLabel}
                    </span>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onStatusUpdate(appt.id, 'PENDING'); }}
                        className="p-2 bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 hover:border-amber-500/50 rounded-xl transition-all duration-300 shadow-[0_3px_8px_rgba(245,158,11,0.2),_inset_0_1px_1px_rgba(255,255,255,0.08)] hover:shadow-[0_6px_14px_rgba(245,158,11,0.28),_inset_0_1.5px_1.5px_rgba(255,255,255,0.15)] hover:-translate-y-0.5 hover:scale-108 active:scale-95"
                        title="Restaurar a pendiente"
                      >
                        <RefreshCcw size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Hover Stroke */}
                  <div 
                    className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
