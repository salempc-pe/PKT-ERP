import { useState, useEffect } from 'react';
import { useCalendar } from './useCalendar';
import { useCrm } from '../crm/useCrm';
import { useAuth } from '../../../context/AuthContext';
import { 
  Calendar as CalendarIcon, Plus, User, Clock, 
  Trash2, CalendarDays, CheckCircle, Settings, Blocks, Globe,
  Eye, Edit2, FileClock, Smartphone, X, MessageSquare
} from 'lucide-react';
import LoadingScreen from '../../../components/LoadingScreen';
import EventModal from './EventModal';
import ResourcesModal from './ResourcesModal';
import IntegrationsModal from './IntegrationsModal';
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
  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activePushNotification, setActivePushNotification] = useState(null);

  useEffect(() => {
    if (activePushNotification) {
      const timer = setTimeout(() => {
        setActivePushNotification(null);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [activePushNotification]);
  
  const loading = appLoading || crmLoading;

  // -- Derivados --
  const upcomingAppointments = [...appointments]
    .filter(a => a.status === "PENDING")
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

      // Disparar simulador de notificación de celular después de 1.8 segundos
      if (apptData.syncGoogleCalendar) {
        setTimeout(() => {
          setActivePushNotification({
            title: apptData.title,
            time: apptData.time,
            date: apptData.date,
            phone: apptData.syncPhone || '+51 948 537 030'
          });
        }, 1800);
      }
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

  const maskPhone = (phoneStr) => {
    if (!phoneStr) return '';
    const parts = phoneStr.trim().split(/\s+/);
    if (parts.length >= 3) {
      return `${parts[0]} ${parts[1]} ••• •••`;
    }
    if (phoneStr.length > 6) {
      return phoneStr.substring(0, phoneStr.length - 6) + ' ••• •••';
    }
    return phoneStr.replace(/\d/g, '•');
  };

  const handleWhatsAppSend = (appt) => {
    const displayDate = new Date(appt.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
    const displayTime = formatTime12h(appt.time);
    const text = `Hola, te recordamos tu cita "${appt.title}" programada para el día ${displayDate} a las ${displayTime}. ¡Te esperamos!`;
    const phoneDigits = appt.syncPhone ? appt.syncPhone.replace(/\D/g, '') : '51948537030';
    const finalPhone = phoneDigits.startsWith('51') ? phoneDigits : `51${phoneDigits}`;
    const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
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
            onClick={() => setIsIntegrationsModalOpen(true)}
            className="p-2.5 bg-[#8E79F0]/5 text-[#8E79F0] hover:text-[#a08ff5] border border-[#8E79F0]/20 hover:border-[#8E79F0]/40 rounded-xl transition-all duration-300 shadow-[0_2px_6px_rgba(142,121,240,0.15),_inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_6px_12px_rgba(142,121,240,0.25),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 hover:scale-105 active:scale-95"
            title="Integraciones externas"
          >
            <Globe size={18} />
          </button>
          <button 
            onClick={() => setIsHistoryModalOpen(true)}
            className="p-2.5 bg-[#8E79F0]/10 text-[#8E79F0] border border-[#8E79F0]/30 hover:border-[#8E79F0]/50 rounded-xl transition-all duration-300 shadow-[0_2px_6px_rgba(142,121,240,0.15),_inset_0_1px_1px_rgba(255,255,255,0.08)] hover:shadow-[0_6px_12px_rgba(142,121,240,0.25),_inset_0_1px_1px_rgba(255,255,255,0.12)] hover:-translate-y-0.5 hover:scale-105 active:scale-95"
            title="Historial de citas"
          >
            <FileClock size={18} />
          </button>
          <button 
            onClick={() => setIsResourcesModalOpen(true)}
            className="px-4 py-2.5 bg-[#8E79F0]/5 text-[#8E79F0] hover:text-[#a08ff5] border border-[#8E79F0]/20 hover:border-[#8E79F0]/40 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_2px_6px_rgba(142,121,240,0.15),_inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_6px_12px_rgba(142,121,240,0.25),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 hover:scale-105 active:scale-95 font-bold"
          >
            <Blocks size={18} /> Recursos
          </button>
          <button 
            onClick={openNewEvent}
            className="bg-[#6B4FD8] text-[#001b5c] font-black px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_3px_10px_rgba(107,79,216,0.2),_inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_18px_rgba(107,79,216,0.35),_inset_0_1.5px_1.5px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 hover:scale-105 active:scale-95"
          >
            <Plus size={18} /> Nueva Cita
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
                            onClick={() => handleView(appt)}
                            className={`group relative overflow-hidden bg-[var(--color-surface-container)]/70 backdrop-blur-md border p-4 rounded-2xl flex flex-col md:flex-row justify-between gap-4 transition-all duration-300 cursor-pointer shadow-[0_12px_24px_-4px_rgba(0,0,0,0.3),_inset_0_1.5px_1.5px_rgba(255,255,255,0.08)] hover:shadow-[0_15px_30px_-8px_rgba(0,0,0,0.4),_inset_0_2px_2px_rgba(255,255,255,0.12)] hover:bg-[var(--color-surface-container-high)]/95 hover:-translate-y-0.5 hover:scale-[1.008] ${isOverdue ? 'border-red-500/40 hover:border-red-500/50' : 'border-[var(--color-outline-variant)]/80 hover:border-[#6B4FD8]/40'}`}
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
                            
                            <div className="flex items-center gap-1.5 border-t md:border-t-0 md:border-l border-[var(--color-outline-variant)] pt-3 md:pt-0 pl-0 md:pl-3 min-w-max justify-end relative z-10">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleWhatsAppSend(appt); }}
                                className="p-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 hover:border-[#25D366]/50 rounded-lg transition-all duration-300 shadow-[0_2px_4px_rgba(37,211,102,0.1),_inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_8px_rgba(37,211,102,0.2),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-[1px] hover:scale-103 active:scale-95"
                                title="Enviar recordatorio por WhatsApp"
                              >
                                <MessageSquare size={13} />
                              </button>
                              <button 
                                onClick={async (e) => { 
                                  e.stopPropagation(); 
                                  const isCurrentlySynced = appt.syncGoogleCalendar;
                                  try {
                                    await updateAppointment(appt.id, { 
                                      syncGoogleCalendar: !isCurrentlySynced,
                                      syncPhone: appt.syncPhone || '+51 948 537 030'
                                    });
                                    if (!isCurrentlySynced) {
                                      setActivePushNotification({
                                        title: appt.title,
                                        time: appt.time,
                                        date: appt.date,
                                        phone: appt.syncPhone || '+51 948 537 030'
                                      });
                                    }
                                  } catch (err) {
                                    alert(err.message);
                                  }
                                }} 
                                className={`p-1.5 rounded-lg transition-all duration-300 shadow-[0_2px_4px_rgba(142,121,240,0.1),_inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_8px_rgba(142,121,240,0.2),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-[1px] hover:scale-103 active:scale-95 border ${
                                  appt.syncGoogleCalendar 
                                    ? 'bg-[#8E79F0]/25 text-[#a08ff5] border-[#8E79F0]/60' 
                                    : 'bg-[#8E79F0]/5 text-[#8E79F0]/60 hover:text-[#8E79F0] border-[#8E79F0]/20 hover:border-[#8E79F0]/50'
                                }`} 
                                title={appt.syncGoogleCalendar ? "Sincronizado con celular" : "Sincronizar con celular"}
                              >
                                <Smartphone size={13} className={appt.syncGoogleCalendar ? "animate-pulse" : ""} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleEdit(appt); }} 
                                className="p-1.5 bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 hover:border-amber-500/50 rounded-lg transition-all duration-300 shadow-[0_2px_4px_rgba(245,158,11,0.12),_inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_8px_rgba(245,158,11,0.2),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-[1px] hover:scale-103 active:scale-95" 
                                title="Editar cita"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); markAsDone(appt.id); }} 
                                className="p-1.5 bg-[#85ffab]/10 hover:bg-[#85ffab]/25 text-[#85ffab] border border-[#85ffab]/30 hover:border-[#85ffab]/50 rounded-lg transition-all duration-300 shadow-[0_2px_4px_rgba(133,255,171,0.12),_inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_8px_rgba(133,255,171,0.2),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-[1px] hover:scale-103 active:scale-95" 
                                title="Marcar completada"
                              >
                                <CheckCircle size={13} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); deleteAppointment(appt.id); }} 
                                className="p-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all duration-300 shadow-[0_2px_4px_rgba(239,68,68,0.12),_inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_4px_8px_rgba(239,68,68,0.2),_inset_0_1px_1px_rgba(255,255,255,0.1)] hover:-translate-y-[1px] hover:scale-103 active:scale-95" 
                                title="Cancelar cita"
                              >
                                <Trash2 size={13} />
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

      <IntegrationsModal 
        isOpen={isIntegrationsModalOpen}
        onClose={() => setIsIntegrationsModalOpen(false)}
        orgId={orgId}
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

      {/* SIMULADOR DE NOTIFICACIÓN PUSH MÓVIL (GOOGLE CALENDAR) */}
      {activePushNotification && (
        <div className="fixed bottom-6 right-6 z-[100] w-80 bg-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6),_inset_0_2px_2px_rgba(255,255,255,0.15)] animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div className="flex items-start gap-3">
            {/* Google Calendar Brand Icon */}
            <div className="w-10 h-10 min-w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <CalendarIcon size={20} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Google Calendar</span>
                <span className="text-[8px] font-semibold text-white/50">Hace un momento</span>
              </div>
              <h4 className="text-xs font-black text-white mt-1.5 flex items-center gap-1.5">
                <span>🔔 Recordatorio de Cita</span>
              </h4>
              <p className="text-[10px] text-white/80 mt-1 leading-relaxed">
                Tu cita <span className="text-blue-300 font-bold">"{activePushNotification.title}"</span> para el día <span className="text-blue-300 font-bold">{new Date(activePushNotification.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', timeZone: 'UTC' })}</span> a las <span className="text-blue-300 font-bold">{formatTime12h(activePushNotification.time)}</span> ha sido agendada con éxito.
              </p>
              <div className="mt-3 pt-2.5 border-t border-white/10 flex justify-between items-center text-[8px] font-black text-white/40 uppercase">
                <span>Notificación SMS/WhatsApp</span>
                <span className="text-emerald-400">{maskPhone(activePushNotification.phone)}</span>
              </div>
            </div>

            <button 
              onClick={() => setActivePushNotification(null)}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          </div>
          
          {/* Barra de progreso de auto-cierre */}
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400 rounded-b-3xl w-full" style={{ animation: 'shrink 8s linear forwards' }}></div>
        </div>
      )}

    </div>
  );
}
