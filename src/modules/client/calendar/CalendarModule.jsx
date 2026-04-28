import { useState } from 'react';
import { useAppointments } from './useAppointments';
import { useCrm } from '../crm/useCrm';
import { useAuth } from '../../../context/AuthContext';
import { 
  Calendar as CalendarIcon, Plus, User, Clock, 
  X, Loader2, Trash2, CalendarDays, CheckCircle
} from 'lucide-react';
import LoadingScreen from '../../../components/LoadingScreen';

export default function CalendarModule() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  
  const { appointments, loading: appLoading, addAppointment, updateAppointment, deleteAppointment } = useAppointments(orgId);
  const { contacts, loading: crmLoading } = useCrm(orgId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // -- Form State --
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [clientId, setClientId] = useState('');
  const [notes, setNotes] = useState('');

  const loading = appLoading || crmLoading;

  // -- Derivados --
  const upcomingAppointments = [...appointments]
    .filter(a => a.status !== "DONE" && a.status !== "CANCELLED")
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !date || !time) return;
    
    setIsSubmitting(true);
    try {
      await addAppointment({
        title,
        date,
        time,
        clientId,
        status: 'PENDING',
        notes
      });
      
      // Reset form
      setTitle('');
      setDate('');
      setTime('');
      setClientId('');
      setNotes('');
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error added appointment", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const markAsDone = async (id) => {
    await updateAppointment(id, { status: "DONE" });
  };

  if (loading) {
    return <LoadingScreen fullScreen={false} message="Cargando Agenda..." />;
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#6B4FD8] text-[#001b5c] font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus size={18} /> Nueva Cita
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content (Weekly / Events list) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--color-surface-container-low)] rounded-xl border border-[var(--color-outline-variant)] overflow-hidden p-6">
            <h3 className="font-bold text-[var(--color-on-surface)] mb-4 flex items-center gap-2">
               <CalendarDays size={18} className="text-[var(--color-primary)]"/> Próximas Citas (Agenda)
            </h3>
            
            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center p-8 bg-[var(--color-surface-container)] rounded-xl border border-[var(--color-outline-variant)]">
                   <p className="text-[var(--color-on-surface-variant)]">No hay citas programadas.</p>
                </div>
              ) : (
                upcomingAppointments.map((appt) => {
                   const client = contacts.find(c => c.id === appt.clientId);
                   const isOverdue = new Date(`${appt.date}T${appt.time}`) < new Date();
                   
                   return (
                     <div key={appt.id} className={`bg-[var(--color-surface-container)] border p-4 rounded-xl flex flex-col md:flex-row justify-between gap-4 transition-colors ${isOverdue ? 'border-red-500/40 bg-red-500/5 animate-pulse' : 'border-[#40485d]/20 hover:border-[#6B4FD8]/40'}`}>
                       <div className="flex gap-4">
                         <div className="bg-[var(--color-primary-container)] w-14 h-14 min-w-14 rounded-xl flex flex-col items-center justify-center text-[var(--color-primary)]">
                           <span className="text-[10px] font-black uppercase">{new Date(appt.date).toLocaleDateString('es-ES', { month: 'short', timeZone: 'UTC' })}</span>
                           <span className="text-xl font-black leading-none">{new Date(appt.date).getUTCDate()}</span>
                         </div>
                         <div>
                           <h4 className="font-bold text-[var(--color-on-surface)]">{appt.title}</h4>
                           <div className="flex items-center gap-3 text-xs text-[var(--color-on-surface-variant)] mt-1">
                             <span className="flex items-center gap-1"><Clock size={12}/> {appt.time}</span>
                             {client && <span className="flex items-center gap-1"><User size={12}/> {client.name}</span>}
                           </div>
                           {appt.notes && <p className="text-[10px] mt-2 text-[#65739e] max-w-sm truncate">{appt.notes}</p>}
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-[#40485d]/20 pt-3 md:pt-0 pl-0 md:pl-4 min-w-max">
                         <button onClick={() => markAsDone(appt.id)} className="p-2 hover:bg-[#85ffab]/10 text-[var(--color-on-surface-variant)] hover:text-[#85ffab] rounded-lg transition-colors" title="Marcar completada">
                           <CheckCircle size={18} />
                         </button>
                         <button onClick={() => deleteAppointment(appt.id)} className="p-2 hover:bg-red-500/10 text-[var(--color-on-surface-variant)] hover:text-red-400 rounded-lg transition-colors" title="Cancelar cita">
                           <Trash2 size={18} />
                         </button>
                       </div>
                     </div>
                   );
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <div className="bg-[var(--color-surface-container)] p-6 rounded-2xl border border-[#40485d]/20">
             <h3 className="font-bold text-[var(--color-on-surface)] mb-1">Resumen</h3>
             <p className="text-xs text-[var(--color-on-surface-variant)] mb-4">Total citas activas</p>
             <h2 className="text-4xl font-black text-[var(--color-primary)]">{upcomingAppointments.length}</h2>
           </div>
        </div>

      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          <div className="bg-[var(--color-surface-variant)] w-full max-w-md border border-[var(--color-outline-variant)] rounded-3xl shadow-lg relative animate-in zoom-in duration-300">
            
            <div className="p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-surface-container)] rounded-t-3xl">
               <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm flex items-center gap-2">
                 <CalendarIcon size={16} className="text-[var(--color-primary)]" /> Agendar Cita
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="text-[var(--color-on-surface-variant)] hover:text-white">
                 <X size={16}/>
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Título de Reservación</label>
                <input 
                  type="text" required
                  value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#6B4FD8] border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] transition-all"
                  placeholder="Ej. Revisión técnica o Demo"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Fecha</label>
                  <input 
                    type="date" required
                    value={date} onChange={e => setDate(e.target.value)}
                    className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#6B4FD8] border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] transition-all"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Hora</label>
                  <input 
                    type="time" required
                    value={time} onChange={e => setTime(e.target.value)}
                    className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#6B4FD8] border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] transition-all"
                    style={{ colorScheme: 'dark' }}
                  />
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
      )}

    </div>
  );
}
