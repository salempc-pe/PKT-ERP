import React, { useState } from 'react';
import { X, User, Calendar, Clock, MapPin, Video, DollarSign, CheckSquare, XCircle, AlertCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AppointmentSidePanel({ isOpen, onClose, appointment, contact, onUpdateStatus }) {
  const [isWorking, setIsWorking] = useState(false);

  if (!isOpen || !appointment) return null;

  const handleStatusChange = async (newStatus) => {
    setIsWorking(true);
    try {
      await onUpdateStatus(appointment.id, { estado: newStatus });
      onClose();
    } catch (e) {
      alert("Error updating status: " + e.message);
    } finally {
      setIsWorking(false);
    }
  };

  const d = appointment.fecha_hora?.toDate ? appointment.fecha_hora.toDate() : new Date(appointment.fecha_hora);
  const dateStr = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const stateStyles = {
    programada: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/40' },
    confirmada: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/40' },
    realizada: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/40' },
    cancelada: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/40' },
    no_presento: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/40' },
  };
  const currentStyle = stateStyles[appointment.estado] || stateStyles.programada;

  return (
    <div className="fixed inset-0 z-[150] overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      {/* Sliding Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-[var(--color-surface-container)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-[var(--color-outline-variant)]">
        
        {/* Header Header with close */}
        <div className="p-6 flex items-center justify-between border-b border-[var(--color-outline-variant)]">
          <div>
            <h3 className="text-lg font-black text-[var(--color-on-surface)] uppercase tracking-wide leading-tight">Detalle de Cita</h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase mt-1 border ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border}`}>
              {appointment.estado.replace('_', ' ')}
            </span>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-[var(--color-surface-variant)] hover:bg-red-500/10 text-[var(--color-on-surface-variant)] hover:text-red-400 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Client mini-profile */}
          <div className="flex items-center gap-4 p-4 bg-[var(--color-surface-variant)] rounded-2xl border border-[var(--color-outline-variant)]">
            <div className="w-14 h-14 rounded-2xl bg-[#6B4FD8]/20 flex items-center justify-center text-[#6B4FD8] font-black text-xl shrink-0">
              {contact?.name?.charAt(0) || "?"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-black text-[var(--color-on-surface)] text-lg truncate">{contact?.name || 'Paciente Desconocido'}</p>
              <p className="text-xs text-[var(--color-on-surface-variant)] opacity-70 font-bold">{contact?.email || 'Sin correo'}</p>
              
              <Link 
                to={`/client/salud/pacientes/${appointment.client_id}`}
                className="inline-flex items-center gap-1 text-[10px] font-black text-[#6B4FD8] uppercase mt-2 hover:underline"
              >
                Ver Expediente Clínico <User size={10} />
              </Link>
            </div>
          </div>

          {/* Detail Items */}
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="mt-1 text-[#6B4FD8]"><Calendar size={20} /></div>
              <div>
                <p className="text-[10px] uppercase font-black text-[var(--color-on-surface-variant)] tracking-wider">Fecha</p>
                <p className="text-base font-bold text-[var(--color-on-surface)] capitalize">{dateStr}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 text-[#6B4FD8]"><Clock size={20} /></div>
              <div className="flex-1">
                <p className="text-[10px] uppercase font-black text-[var(--color-on-surface-variant)] tracking-wider">Horario</p>
                <p className="text-base font-bold text-[var(--color-on-surface)]">{timeStr} ({appointment.duracion_min} min)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 text-[#6B4FD8]">
                {appointment.modalidad === 'videollamada' ? <Video size={20} /> : <MapPin size={20} />}
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-[var(--color-on-surface-variant)] tracking-wider">Modalidad & Tipo</p>
                <p className="text-base font-bold text-[var(--color-on-surface)] capitalize">{appointment.modalidad} — {appointment.tipo_sesion?.replace('_', ' ')}</p>
              </div>
            </div>

            {appointment.monto > 0 && (
              <div className="flex items-start gap-4">
                <div className="mt-1 text-green-400"><DollarSign size={20} /></div>
                <div>
                  <p className="text-[10px] uppercase font-black text-[var(--color-on-surface-variant)] tracking-wider">Costo de Consulta</p>
                  <p className="text-base font-black text-green-300 flex items-center gap-2">
                    ${appointment.monto}
                    {appointment.pagada ? (
                      <span className="text-[9px] bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full font-black uppercase">Pagada</span>
                    ) : (
                      <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-black uppercase">Pendiente</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Danger/Warning area if not updated */}
          {appointment.estado === 'realizada' && (
             <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-2xl flex items-start gap-3">
                <CheckSquare className="text-green-400 shrink-0 mt-0.5" size={18}/>
                <div className="text-xs text-green-200/80 font-medium">
                  Cita completada. Asegúrate de llenar la nota de sesión para este paciente desde su expediente.
                </div>
             </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="p-6 bg-[var(--color-surface-container-low)] border-t border-[var(--color-outline-variant)] flex flex-col gap-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-1">Acciones Rápidas</p>
          
          {appointment.estado === 'programada' && (
            <button 
              disabled={isWorking}
              onClick={() => handleStatusChange('confirmada')}
              className="w-full bg-[#6B4FD8] text-[#002150] py-3 rounded-xl font-black text-sm hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Confirmar Cita
            </button>
          )}

          {(appointment.estado === 'programada' || appointment.estado === 'confirmada') && (
             <>
               <button 
                disabled={isWorking}
                onClick={() => handleStatusChange('realizada')}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-black text-sm hover:bg-green-500 hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
               >
                 <CheckSquare size={16}/> Marcar como Realizada
               </button>

               <div className="grid grid-cols-2 gap-3">
                 <button 
                  disabled={isWorking}
                  onClick={() => handleStatusChange('cancelada')}
                  className="bg-red-500/10 text-red-400 border border-red-500/20 py-2.5 rounded-xl font-bold text-xs hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                 >
                   <XCircle size={14}/> Cancelar
                 </button>
                 <button 
                  disabled={isWorking}
                  onClick={() => handleStatusChange('no_presento')}
                  className="bg-amber-500/10 text-amber-400 border border-amber-500/20 py-2.5 rounded-xl font-bold text-xs hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center gap-2"
                 >
                   <AlertCircle size={14}/> No Presentó
                 </button>
               </div>
             </>
          )}
          
          {/* Enlace a nota rapida si ya fue realizada o en proceso */}
          {appointment.estado === 'realizada' && (
            <Link 
               to={`/client/salud/pacientes/${appointment.client_id}`}
               className="w-full bg-[#6B4FD8]/20 text-[#6B4FD8] border border-[#6B4FD8]/30 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#6B4FD8] hover:text-white transition-all"
            >
               Crear Nota de Sesión
            </Link>
          )}

        </div>
      </div>
    </div>
  );
}
