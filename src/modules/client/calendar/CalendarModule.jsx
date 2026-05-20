import { useState } from 'react';
import { useCalendar } from './useCalendar';
import { useCrm } from '../crm/useCrm';
import { useAuth } from '../../../context/AuthContext';
import { 
  Calendar as CalendarIcon, Plus, User, Clock, 
  Trash2, CalendarDays, CheckCircle, Settings, Blocks,
  Eye, Edit2, History
} from 'lucide-react';
import LoadingScreen from '../../../components/LoadingScreen';
import EventModal from './EventModal';
import ResourcesModal from './ResourcesModal';

import HistoryModal from './HistoryModal';

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
    updateResource,
    deleteResource
  } = useCalendar(orgId);
  
  const { contacts, loading: crmLoading } = useCrm(orgId);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isViewOnlyModal, setIsViewOnlyModal] = useState(false);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const loading = appLoading || crmLoading;

  // -- Derivados --
  const upcomingAppointments = [...appointments]
    .filter(a => {
      const isFuture = new Date(`${a.date}T${a.time}`) > new Date();
      return a.status === "PENDING" && isFuture;
    })
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  const handleSaveAppointment = async (apptData) => {
    setIsSubmitting(true);
    try {
      if (selectedAppointment) {
        await updateAppointment(selectedAppointment.id, apptData);
      } else {
        await addAppointment(apptData);
      }
      setIsEventModalOpen(false);
      setSelectedAppointment(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openNewEvent = () => {
    setSelectedAppointment(null);
    setIsViewOnlyModal(false);
    setIsEventModalOpen(true);
  };

  const handleEdit = (appt) => {
    setSelectedAppointment(appt);
    setIsViewOnlyModal(false);
    setIsEventModalOpen(true);
  };

  const handleView = (appt) => {
    setSelectedAppointment(appt);
    setIsViewOnlyModal(true);
    setIsEventModalOpen(true);
  };

  const formatTime12h = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours);
    const m = minutes;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // la hora '0' debe ser '12'
    return `${h}:${m} ${ampm}`;
  };

  const markAsDone = async (id) => {
    try {
      await updateAppointment(id, { status: "DONE" });
    } catch (err) {
      alert(err.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await updateAppointment(id, { status });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <LoadingScreen fullScreen={false} message="Cargando Agenda..." />;
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-end items-center gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">

          <button 
            onClick={() => setIsHistoryModalOpen(true)}
            className="p-2 border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] rounded-lg transition-all hover:bg-[var(--color-surface-container)] active:scale-95"
            title="Historial de citas"
          >
            <History size={16} />
          </button>
          <button 
            onClick={() => setIsResourcesModalOpen(true)}
            className="flex-1 md:flex-none border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] font-bold px-4 py-2 text-sm rounded-lg flex items-center justify-center gap-2 transition-all hover:bg-[var(--color-surface-container)] active:scale-95"
          >
            <Blocks size={16} /> Recursos
          </button>
          <button 
            onClick={openNewEvent}
            className="flex-1 md:flex-none bg-[#6B4FD8] text-[#002150] font-bold px-4 py-2 text-sm rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(133,173,255,0.3)] transition-all"
          >
            <Plus size={16} /> Nueva Cita
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content (Weekly / Events list) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--color-surface-container-low)] rounded-3xl border border-[var(--color-outline-variant)] overflow-hidden p-6">
            <h3 className="font-black text-[var(--color-on-surface)] mb-6 flex items-center gap-2 uppercase tracking-wider text-xs opacity-70">
               <CalendarDays size={16} className="text-[var(--color-primary)]"/> Próximas Citas
            </h3>
            
            <div className="space-y-6">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center p-8 bg-[var(--color-surface-container)] rounded-2xl border border-[var(--color-outline-variant)]">
                   <p className="text-[var(--color-on-surface-variant)]">No hay citas programadas.</p>
                </div>
              ) : (
                (() => {
                  const groups = {};
                  upcomingAppointments.forEach(appt => {
                    if (!groups[appt.date]) groups[appt.date] = [];
                    groups[appt.date].push(appt);
                  });

                  return Object.keys(groups).sort().map(dateStr => (
                    <div key={dateStr} className="space-y-3">
                      <div className="flex items-center gap-2 px-2">
                        <div className="h-px flex-1 bg-[var(--color-outline-variant)] opacity-30"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">
                          {new Date(dateStr).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })}
                        </span>
                        <div className="h-px flex-1 bg-[var(--color-outline-variant)] opacity-30"></div>
                      </div>
                      {groups[dateStr].map(appt => {
                        const client = contacts.find(c => c.id === appt.clientId);
                        const resource = resources.find(r => r.id === appt.resourceId);
                        const isOverdue = new Date(`${appt.date}T${appt.time}`) < new Date();
                        const cardColor = isOverdue ? '#ef4444' : '#6B4FD8';

                        return (
                          <div 
                            key={appt.id} 
                            className={`group relative overflow-hidden bg-[var(--color-surface-container)] border p-4 rounded-2xl flex flex-col md:flex-row justify-between gap-4 transition-all duration-300 hover:bg-[var(--color-surface-container-high)] hover:-translate-y-1 ${isOverdue ? 'border-red-500/30' : 'border-[var(--color-outline-variant)] hover:border-[#6B4FD8]/30'}`}
                          >
                            {/* Background Glow */}
                            <div 
                              className="absolute -right-10 -top-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                              style={{ backgroundColor: cardColor }}
                            ></div>

                            <div className="flex gap-4 relative z-10">
                              <div className="bg-[var(--color-primary-container)] w-14 h-14 min-w-14 rounded-2xl flex flex-col items-center justify-center text-[var(--color-primary)] transition-transform duration-500 group-hover:scale-110">
                                <span className="text-[10px] font-black uppercase">{new Date(appt.date).toLocaleDateString('es-ES', { month: 'short', timeZone: 'UTC' })}</span>
                                <span className="text-xl font-black leading-none">{new Date(appt.date).getUTCDate()}</span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">{appt.title}</h4>
                                  {resource && (
                                    <span className="text-[9px] bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] px-2 py-0.5 rounded-full font-black uppercase border border-[var(--color-outline-variant)]">
                                      {resource.name}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-[var(--color-on-surface-variant)] mt-1">
                                  <span className="flex items-center gap-1 font-semibold"><Clock size={12}/> {formatTime12h(appt.time)} ({appt.duration || 60} min)</span>
                                  {client && <span className="flex items-center gap-1 font-semibold"><User size={12}/> {client.name}</span>}
                                </div>
                                {appt.notes && <p className="text-[10px] mt-2 text-[var(--color-on-surface-variant)] max-w-sm italic line-clamp-1 opacity-60 group-hover:opacity-100">{appt.notes}</p>}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-[var(--color-outline-variant)] pt-3 md:pt-0 pl-0 md:pl-4 min-w-max justify-end relative z-10">
                              <button onClick={() => handleView(appt)} className="p-1.5 hover:bg-blue-500/10 text-[var(--color-on-surface-variant)] hover:text-blue-400 rounded-lg transition-colors" title="Ver detalles">
                                <Eye size={16} />
                              </button>
                              <button onClick={() => handleEdit(appt)} className="p-1.5 hover:bg-amber-500/10 text-[var(--color-on-surface-variant)] hover:text-amber-400 rounded-lg transition-colors" title="Editar cita">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => markAsDone(appt.id)} className="p-1.5 hover:bg-[#85ffab]/10 text-[var(--color-on-surface-variant)] hover:text-[#85ffab] rounded-lg transition-colors" title="Marcar completada">
                                <CheckCircle size={16} />
                              </button>
                              <button onClick={() => deleteAppointment(appt.id)} className="p-1.5 hover:bg-red-500/10 text-[var(--color-on-surface-variant)] hover:text-red-400 rounded-lg transition-colors" title="Cancelar cita">
                                <Trash2 size={16} />
                              </button>
                            </div>

                            {/* Hover Stroke */}
                            <div 
                              className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                              style={{ backgroundColor: cardColor }}
                            ></div>
                          </div>
                        );
                      })}
                    </div>
                  ));
                })()
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-[#6B4FD8] to-[#8E79F0] p-6 rounded-3xl text-white">
             <h3 className="font-black text-sm uppercase tracking-widest opacity-80 mb-1">Citas Activas</h3>
             <div className="flex items-end gap-2">
               <h2 className="text-5xl font-black">{upcomingAppointments.length}</h2>
               <p className="text-xs font-bold mb-2 opacity-90">Programadas</p>
             </div>
           </div>


        </div>

      </div>

      {/* MODALS */}
      <EventModal 
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSubmit={handleSaveAppointment}
        contacts={contacts}
        resources={resources}
        isSubmitting={isSubmitting}
        appointment={selectedAppointment}
        isViewOnly={isViewOnlyModal}
      />

      <ResourcesModal 
        isOpen={isResourcesModalOpen}
        onClose={() => setIsResourcesModalOpen(false)}
        resources={resources}
        onAdd={addResource}
        onUpdate={updateResource}
        onDelete={deleteResource}
      />



      <HistoryModal 
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        appointments={appointments}
        contacts={contacts}
        onView={(appt) => {
          handleView(appt);
          setIsHistoryModalOpen(false);
        }}
        onStatusUpdate={updateStatus}
      />

    </div>
  );
}
