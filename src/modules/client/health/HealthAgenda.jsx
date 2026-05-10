import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useHealth } from './useHealth';
import { useCrm } from '../crm/useCrm';
import LoadingScreen from '../../../components/LoadingScreen';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Video,
  MapPin,
  Clock,
  Filter,
  Grid3X3,
  List
} from 'lucide-react';
import AppointmentModal from './components/AppointmentModal';
import AppointmentSidePanel from './components/AppointmentSidePanel';

export default function HealthAgenda() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  
  const { citas, expedientes, createCita, updateCita, loading: loadingHealth } = useHealth(orgId);
  const { contacts, loading: loadingCrm } = useCrm(orgId);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewType, setViewType] = useState('month'); // 'month' | 'list'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedCita, setSelectedCita] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const loading = loadingHealth || loadingCrm;

  // -- Date Utilities --
  const getDaysInMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  const goToToday = () => setCurrentMonth(new Date());

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const dayNames = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

  const handleSaveAppointment = async (data) => {
    setIsSaving(true);
    try {
      await createCita(data);
      setIsModalOpen(false);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingScreen fullScreen={false} message="Sincronizando agenda..." />;

  const getCitasForDay = (dayNumber) => {
    return citas.filter(cita => {
      const d = cita.fecha_hora?.toDate ? cita.fecha_hora.toDate() : new Date(cita.fecha_hora);
      return d.getFullYear() === currentMonth.getFullYear() && 
             d.getMonth() === currentMonth.getMonth() &&
             d.getDate() === dayNumber;
    }).sort((a,b) => (a.fecha_hora?.toDate ? a.fecha_hora.toDate() : new Date(a.fecha_hora)) - (b.fecha_hora?.toDate ? b.fecha_hora.toDate() : new Date(b.fecha_hora)));
  };

  const getStatusColor = (estado) => {
    switch(estado) {
      case 'programada': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'confirmada': return 'bg-[#6B4FD8]/30 text-[#9ca3af] border-[#6B4FD8]/40 text-purple-300'; // override light Purple
      case 'realizada': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'cancelada': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] border-[var(--color-outline-variant)]';
    }
  };

  // Render Helpers
  const totalDays = getDaysInMonth(currentMonth);
  const startPadding = getFirstDayOfMonth(currentMonth);
  const daysArr = Array.from({ length: totalDays }, (_, i) => i + 1);
  const blankArr = Array.from({ length: startPadding });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Calendar Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] p-4 rounded-2xl">
        
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 hover:bg-[var(--color-surface-variant)] rounded-xl text-[var(--color-on-surface-variant)] transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-lg font-black text-[var(--color-on-surface)] min-w-[160px] text-center uppercase tracking-wide">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-[var(--color-surface-variant)] rounded-xl text-[var(--color-on-surface-variant)] transition-colors">
            <ChevronRight size={20} />
          </button>
          <button onClick={goToToday} className="text-xs font-bold text-[#6B4FD8] hover:underline px-2 ml-2">Hoy</button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Toggle Views */}
          <div className="flex bg-[var(--color-surface-variant)]/50 p-1 rounded-xl border border-[var(--color-outline-variant)]">
            <button 
              onClick={() => setViewType('month')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${viewType === 'month' ? 'bg-[#6B4FD8] text-[#002150] shadow-sm' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
            >
              <Grid3X3 size={14} /> Mes
            </button>
            <button 
              onClick={() => setViewType('list')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${viewType === 'list' ? 'bg-[#6B4FD8] text-[#002150] shadow-sm' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
            >
              <List size={14} /> Lista
            </button>
          </div>

          <button 
            onClick={() => { setSelectedDay(new Date()); setIsModalOpen(true); }}
            className="flex-1 md:flex-none bg-[#6B4FD8] text-[#002150] font-black px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95"
          >
            <Plus size={18} /> Agendar
          </button>
        </div>
      </div>

      {/* Calendar Grid Body */}
      {viewType === 'month' ? (
        <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl overflow-hidden shadow-sm">
          {/* Day Header Labels */}
          <div className="grid grid-cols-7 border-b border-[var(--color-outline-variant)]">
            {dayNames.map(day => (
              <div key={day} className="p-3 text-center text-[10px] font-black uppercase text-[var(--color-on-surface-variant)] tracking-widest opacity-60 border-r border-[var(--color-outline-variant)] last:border-none bg-[var(--color-surface-variant)]">
                {day}
              </div>
            ))}
          </div>

          {/* The Grid */}
          <div className="grid grid-cols-7 auto-rows-[120px]">
            {blankArr.map((_, idx) => (
              <div key={`blank-${idx}`} className="bg-[var(--color-background)]/30 border-b border-r border-[var(--color-outline-variant)]/40 opacity-30 last:border-r-0" />
            ))}
            
            {daysArr.map(dayNum => {
              const dayCitas = getCitasForDay(dayNum);
              const isToday = new Date().getDate() === dayNum && new Date().getMonth() === currentMonth.getMonth() && new Date().getFullYear() === currentMonth.getFullYear();
              
              return (
                <div 
                  key={dayNum}
                  onClick={() => {
                    const d = new Date(currentMonth);
                    d.setDate(dayNum);
                    setSelectedDay(d);
                    setIsModalOpen(true);
                  }}
                  className="border-b border-r border-[var(--color-outline-variant)] last:border-r-0 group relative p-2 cursor-pointer hover:bg-[var(--color-surface-container)] transition-colors overflow-hidden flex flex-col"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-black w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-[#6B4FD8] text-white shadow-md shadow-[#6B4FD8]/30' : 'text-[var(--color-on-surface-variant)]'}`}>
                      {dayNum}
                    </span>
                  </div>
                  
                  {/* Citas summary in Cell */}
                  <div className="space-y-1 overflow-y-auto custom-scrollbar flex-1 pr-0.5">
                    {dayCitas.slice(0, 3).map(cita => {
                      const contact = contacts.find(c => c.id === cita.client_id);
                      const style = getStatusColor(cita.estado);
                      const date = cita.fecha_hora?.toDate ? cita.fecha_hora.toDate() : new Date(cita.fecha_hora);
                      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      
                      return (
                        <div 
                          key={cita.id}
                          onClick={(e) => { e.stopPropagation(); setSelectedCita(cita); }}
                          className={`px-1.5 py-1 rounded text-[9px] font-bold border truncate transition-transform hover:scale-[1.02] relative z-10 ${style}`}
                          title={`${timeStr} - ${contact?.name}`}
                        >
                          <span className="opacity-70 font-black mr-1">{timeStr}</span> {contact?.name}
                        </div>
                      );
                    })}
                    {dayCitas.length > 3 && (
                      <div className="text-[9px] font-black text-[var(--color-primary)] text-center opacity-70 mt-1">
                        +{dayCitas.length - 3} más
                      </div>
                    )}
                  </div>
                  
                  {/* Mini Add Button visible on hover */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#6B4FD8] pointer-events-none">
                     <Plus size={12} strokeWidth={3} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ListView Mode (Sequential grouped by date) */
        <div className="space-y-4">
           {citas.length === 0 ? (
             <div className="p-12 text-center bg-[var(--color-surface-container-low)] rounded-2xl border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] italic opacity-70">
               No hay citas registradas aún.
             </div>
           ) : (
             <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl overflow-hidden divide-y divide-[var(--color-outline-variant)]/50">
               {[...citas]
                 .sort((a,b) => (b.fecha_hora?.toDate ? b.fecha_hora.toDate() : new Date(b.fecha_hora)) - (a.fecha_hora?.toDate ? a.fecha_hora.toDate() : new Date(a.fecha_hora)))
                 .map(cita => {
                    const contact = contacts.find(c => c.id === cita.client_id);
                    const date = cita.fecha_hora?.toDate ? cita.fecha_hora.toDate() : new Date(cita.fecha_hora);
                    const style = getStatusColor(cita.estado);
                    
                    return (
                      <div 
                        key={cita.id} 
                        onClick={() => setSelectedCita(cita)}
                        className="p-4 flex flex-col md:flex-row md:items-center gap-4 hover:bg-[var(--color-surface-container)] transition-colors cursor-pointer group"
                      >
                         <div className="w-14 shrink-0 text-center">
                           <p className="text-[10px] font-black uppercase text-[#6B4FD8]">{date.toLocaleDateString('es-ES', { month: 'short' })}</p>
                           <p className="text-xl font-black text-[var(--color-on-surface)] leading-none">{date.getDate()}</p>
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-[var(--color-on-surface)] group-hover:text-[#6B4FD8] transition-colors">{contact?.name || 'Paciente Desconocido'}</h4>
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border uppercase ${style}`}>{cita.estado.replace('_',' ')}</span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px] font-bold text-[var(--color-on-surface-variant)]">
                               <span className="flex items-center gap-1"><Clock size={12}/> {date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                               <span className="flex items-center gap-1"><CalendarIcon size={12}/> {cita.tipo_sesion?.replace('_',' ')}</span>
                               <span className="flex items-center gap-1">
                                 {cita.modalidad === 'videollamada' ? <Video size={12}/> : <MapPin size={12}/>}
                                 {cita.modalidad}
                               </span>
                            </div>
                         </div>
                         <div className="text-right shrink-0">
                            <button className="text-[10px] font-black text-[#6B4FD8] opacity-0 group-hover:opacity-100 transition-all">VER DETALLES →</button>
                         </div>
                      </div>
                    );
                 })}
             </div>
           )}
        </div>
      )}

      {/* Modals & Overlay Panels */}
      <AppointmentModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedDay(null); }}
        onSave={handleSaveAppointment}
        contacts={contacts}
        expedientes={expedientes}
        isSaving={isSaving}
        initialDate={selectedDay}
      />

      {selectedCita && (
        <AppointmentSidePanel 
          isOpen={!!selectedCita}
          onClose={() => setSelectedCita(null)}
          appointment={selectedCita}
          contact={contacts.find(c => c.id === selectedCita.client_id)}
          onUpdateStatus={updateCita}
        />
      )}
      
    </div>
  );
}
