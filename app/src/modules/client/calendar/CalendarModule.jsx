import { useState } from 'react';
import { useAppointments } from './useAppointments';
import { useCrm } from '../crm/useCrm';
import { useAuth } from '../../../context/AuthContext';
import { 
  Calendar as CalendarIcon, Plus, User, Clock, 
  X, Loader2, Trash2, CalendarDays, CheckCircle
} from 'lucide-react';

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
    return (
      <div className="flex h-64 items-center justify-center text-[#85adff]">
        <Loader2 className="animate-spin mr-2" /> Cargando Agenda...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#dee5ff] mb-2 tracking-tight">Agenda y Citas</h2>
          <p className="text-[#a3aac4]">Gestiona tus reuniones y reservas con clientes del CRM.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-br from-[#85adff] to-[#4b72ff] text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-[#4b72ff]/20 hover:scale-[1.02] transition-all"
        >
          <Plus size={18} /> Nueva Cita
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content (Weekly / Events list) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#091328] rounded-2xl border border-[#40485d]/10 overflow-hidden shadow-2xl p-6">
            <h3 className="font-bold text-[#dee5ff] mb-4 flex items-center gap-2">
               <CalendarDays size={18} className="text-[#85adff]"/> Próximas Citas (Agenda)
            </h3>
            
            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center p-8 bg-[#141f38] rounded-xl border border-[#40485d]/10">
                   <p className="text-[#a3aac4]">No hay citas programadas.</p>
                </div>
              ) : (
                upcomingAppointments.map((appt) => {
                   const client = contacts.find(c => c.id === appt.clientId);
                   return (
                     <div key={appt.id} className="bg-[#141f38] border border-[#40485d]/20 p-4 rounded-xl flex flex-col md:flex-row justify-between gap-4 hover:border-[#85adff]/40 transition-colors">
                       <div className="flex gap-4">
                         <div className="bg-[#1d2b4a] w-14 h-14 min-w-14 rounded-xl flex flex-col items-center justify-center text-[#85adff]">
                           <span className="text-[10px] font-black uppercase">{new Date(appt.date).toLocaleDateString('es-ES', { month: 'short', timeZone: 'UTC' })}</span>
                           <span className="text-xl font-black leading-none">{new Date(appt.date).getUTCDate()}</span>
                         </div>
                         <div>
                           <h4 className="font-bold text-[#dee5ff]">{appt.title}</h4>
                           <div className="flex items-center gap-3 text-xs text-[#a3aac4] mt-1">
                             <span className="flex items-center gap-1"><Clock size={12}/> {appt.time}</span>
                             {client && <span className="flex items-center gap-1"><User size={12}/> {client.name}</span>}
                           </div>
                           {appt.notes && <p className="text-[10px] mt-2 text-[#65739e] max-w-sm truncate">{appt.notes}</p>}
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-[#40485d]/20 pt-3 md:pt-0 pl-0 md:pl-4 min-w-max">
                         <button onClick={() => markAsDone(appt.id)} className="p-2 hover:bg-[#85ffab]/10 text-[#a3aac4] hover:text-[#85ffab] rounded-lg transition-colors" title="Marcar completada">
                           <CheckCircle size={18} />
                         </button>
                         <button onClick={() => deleteAppointment(appt.id)} className="p-2 hover:bg-red-500/10 text-[#a3aac4] hover:text-red-400 rounded-lg transition-colors" title="Cancelar cita">
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
           <div className="bg-[#141f38] p-6 rounded-2xl border border-[#40485d]/20">
             <h3 className="font-bold text-[#dee5ff] mb-1">Resumen</h3>
             <p className="text-xs text-[#a3aac4] mb-4">Total citas activas</p>
             <h2 className="text-4xl font-black text-[#85adff]">{upcomingAppointments.length}</h2>
           </div>
        </div>

      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          <div className="bg-[#0f1930] w-full max-w-md border border-[#40485d]/30 rounded-3xl shadow-2xl relative animate-in zoom-in duration-300">
            
            <div className="p-6 border-b border-[#40485d]/30 flex justify-between items-center bg-[#141f38] rounded-t-3xl">
               <h3 className="font-black text-[#dee5ff] uppercase tracking-wider text-sm flex items-center gap-2">
                 <CalendarIcon size={16} className="text-[#85adff]" /> Agendar Cita
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="text-[#a3aac4] hover:text-white">
                 <X size={16}/>
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="text-[10px] font-black text-[#a3aac4] uppercase block mb-1">Título de Reservación</label>
                <input 
                  type="text" required
                  value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full bg-[#141f38] text-[#dee5ff] text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#85adff] border border-[#40485d]/30 focus:border-[#85adff] transition-all"
                  placeholder="Ej. Revisión técnica o Demo"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[10px] font-black text-[#a3aac4] uppercase block mb-1">Fecha</label>
                  <input 
                    type="date" required
                    value={date} onChange={e => setDate(e.target.value)}
                    className="w-full bg-[#141f38] text-[#dee5ff] text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#85adff] border border-[#40485d]/30 focus:border-[#85adff] transition-all"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-black text-[#a3aac4] uppercase block mb-1">Hora</label>
                  <input 
                    type="time" required
                    value={time} onChange={e => setTime(e.target.value)}
                    className="w-full bg-[#141f38] text-[#dee5ff] text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#85adff] border border-[#40485d]/30 focus:border-[#85adff] transition-all"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-[#a3aac4] uppercase block mb-1">Cliente Asociado (Opcional)</label>
                <select 
                  value={clientId} onChange={e => setClientId(e.target.value)}
                  className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-xl px-4 py-3 text-[#dee5ff] outline-none text-sm focus:border-[#85adff]"
                >
                  <option value="">-- Sin Cliente --</option>
                  {contacts.map(c => (
                     <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-[#a3aac4] uppercase block mb-1">Notas internas</label>
                <textarea 
                  value={notes} onChange={e => setNotes(e.target.value)}
                  className="w-full bg-[#141f38] text-[#dee5ff] text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#85adff] border border-[#40485d]/30 focus:border-[#85adff] transition-all min-h-[60px]"
                  placeholder="Detalles adicionales..."
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#85adff] text-[#001b5c] font-black px-4 py-3.5 rounded-xl hover:shadow-[0_0_15px_rgba(133,173,255,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
