import { useState } from 'react';
import { useCalendar } from './useCalendar';
import { useCrm } from '../crm/useCrm';
import { useAuth } from '../../../context/AuthContext';
import { 
  Calendar as CalendarIcon, Plus, User, Clock, 
  Trash2, CalendarDays, CheckCircle, Settings, Blocks, Globe
} from 'lucide-react';
import LoadingScreen from '../../../components/LoadingScreen';
import EventModal from './EventModal';
import ResourcesModal from './ResourcesModal';
import IntegrationsModal from './IntegrationsModal';

export default function CalendarModule() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  
  const { 
    appointments, 
    resources,
    loading: appLoading, 
    addAppointment, 
    updateAppointment, 
    deleteAppointment,
    addResource,
    deleteResource
  } = useCalendar(orgId);
  
  const { contacts, loading: crmLoading } = useCrm(orgId);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);
  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const loading = appLoading || crmLoading;

  // -- Derivados --
  const upcomingAppointments = [...appointments]
    .filter(a => a.status !== "DONE" && a.status !== "CANCELLED")
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  const handleAddAppointment = async (apptData) => {
    setIsSubmitting(true);
    try {
      await addAppointment(apptData);
      setIsEventModalOpen(false);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--color-surface-container-low)] p-4 rounded-2xl border border-[var(--color-outline-variant)]">
        <div className="flex items-center gap-3">
          <div className="bg-[var(--color-primary)] p-2.5 rounded-xl text-[var(--color-on-primary)]">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-[var(--color-on-surface)]">Agenda Corporativa</h2>
            <p className="text-xs text-[var(--color-on-surface-variant)]">Gestiona citas, recursos e integraciones.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsIntegrationsModalOpen(true)}
            className="p-2.5 border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] rounded-xl transition-all hover:bg-[var(--color-surface-container)] active:scale-95"
            title="Integraciones externas"
          >
            <Globe size={18} />
          </button>
          <button 
            onClick={() => setIsResourcesModalOpen(true)}
            className="flex-1 md:flex-none border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-[var(--color-surface-container)] active:scale-95"
          >
            <Blocks size={18} /> Recursos
          </button>
          <button 
            onClick={() => setIsEventModalOpen(true)}
            className="flex-1 md:flex-none bg-[#6B4FD8] text-[#001b5c] font-black px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 hover:shadow-lg hover:shadow-[#6B4FD8]/20"
          >
            <Plus size={18} /> Nueva Cita
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content (Weekly / Events list) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--color-surface-container-low)] rounded-3xl border border-[var(--color-outline-variant)] overflow-hidden p-6">
            <h3 className="font-bold text-[var(--color-on-surface)] mb-4 flex items-center gap-2">
               <CalendarDays size={18} className="text-[var(--color-primary)]"/> Próximas Citas (Agenda)
            </h3>
            
            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center p-8 bg-[var(--color-surface-container)] rounded-2xl border border-[var(--color-outline-variant)]">
                   <p className="text-[var(--color-on-surface-variant)]">No hay citas programadas.</p>
                </div>
              ) : (
                upcomingAppointments.map((appt) => {
                   const client = contacts.find(c => c.id === appt.clientId);
                   const resource = resources.find(r => r.id === appt.resourceId);
                   const isOverdue = new Date(`${appt.date}T${appt.time}`) < new Date();
                   
                   return (
                     <div key={appt.id} className={`bg-[var(--color-surface-container)] border p-4 rounded-2xl flex flex-col md:flex-row justify-between gap-4 transition-all ${isOverdue ? 'border-red-500/40 bg-red-500/5' : 'border-[var(--color-outline-variant)] hover:border-[#6B4FD8]/40'}`}>
                       <div className="flex gap-4">
                         <div className="bg-[var(--color-primary-container)] w-14 h-14 min-w-14 rounded-2xl flex flex-col items-center justify-center text-[var(--color-primary)]">
                           <span className="text-[10px] font-black uppercase">{new Date(appt.date).toLocaleDateString('es-ES', { month: 'short', timeZone: 'UTC' })}</span>
                           <span className="text-xl font-black leading-none">{new Date(appt.date).getUTCDate()}</span>
                         </div>
                         <div>
                           <div className="flex items-center gap-2">
                             <h4 className="font-bold text-[var(--color-on-surface)]">{appt.title}</h4>
                             {resource && (
                               <span className="text-[9px] bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] px-2 py-0.5 rounded-full font-black uppercase border border-[var(--color-outline-variant)]">
                                 {resource.name}
                               </span>
                             )}
                           </div>
                           <div className="flex items-center gap-3 text-xs text-[var(--color-on-surface-variant)] mt-1">
                             <span className="flex items-center gap-1 font-semibold"><Clock size={12}/> {appt.time} ({appt.duration || 60} min)</span>
                             {client && <span className="flex items-center gap-1 font-semibold"><User size={12}/> {client.name}</span>}
                           </div>
                           {appt.notes && <p className="text-[10px] mt-2 text-[var(--color-on-surface-variant)] max-w-sm italic line-clamp-1">{appt.notes}</p>}
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-[var(--color-outline-variant)] pt-3 md:pt-0 pl-0 md:pl-4 min-w-max justify-end">
                         <button onClick={() => markAsDone(appt.id)} className="p-2.5 hover:bg-[#85ffab]/10 text-[var(--color-on-surface-variant)] hover:text-[#85ffab] rounded-xl transition-colors" title="Marcar completada">
                           <CheckCircle size={20} />
                         </button>
                         <button onClick={() => deleteAppointment(appt.id)} className="p-2.5 hover:bg-red-500/10 text-[var(--color-on-surface-variant)] hover:text-red-400 rounded-xl transition-colors" title="Cancelar cita">
                           <Trash2 size={20} />
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
           <div className="bg-gradient-to-br from-[#6B4FD8] to-[#8E79F0] p-6 rounded-3xl text-white shadow-xl shadow-[#6B4FD8]/20">
             <h3 className="font-black text-sm uppercase tracking-widest opacity-80 mb-1">Citas Activas</h3>
             <div className="flex items-end gap-2">
               <h2 className="text-5xl font-black">{upcomingAppointments.length}</h2>
               <p className="text-xs font-bold mb-2 opacity-90">Programadas</p>
             </div>
           </div>

           <div className="bg-[var(--color-surface-container)] p-6 rounded-3xl border border-[var(--color-outline-variant)]">
             <h3 className="font-bold text-[var(--color-on-surface)] mb-4 flex items-center gap-2">
               <Settings size={16} className="text-[var(--color-primary)]" /> Ayuda rápida
             </h3>
             <ul className="text-xs space-y-3 text-[var(--color-on-surface-variant)]">
               <li className="flex items-start gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1 shrink-0" />
                 <span>Los **recursos** ayudan a evitar que dos citas usen la misma sala al mismo tiempo.</span>
               </li>
               <li className="flex items-start gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1 shrink-0" />
                 <span>Configura **webhooks** para recibir notificaciones en Slack o WhatsApp.</span>
               </li>
             </ul>
           </div>
        </div>

      </div>

      {/* MODALS */}
      <EventModal 
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSubmit={handleAddAppointment}
        contacts={contacts}
        resources={resources}
        isSubmitting={isSubmitting}
      />

      <ResourcesModal 
        isOpen={isResourcesModalOpen}
        onClose={() => setIsResourcesModalOpen(false)}
        resources={resources}
        onAdd={addResource}
        onDelete={deleteResource}
      />

      <IntegrationsModal 
        isOpen={isIntegrationsModalOpen}
        onClose={() => setIsIntegrationsModalOpen(false)}
        orgId={orgId}
      />

    </div>
  );
}
