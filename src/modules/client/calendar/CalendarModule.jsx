import { useState, useMemo } from 'react';
import { useCalendar } from './useCalendar';
import { useAuth } from '../../../context/AuthContext';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Grid, 
  List, 
  ChevronDown,
  Info
} from 'lucide-react';
import LoadingScreen from '../../../components/LoadingScreen';
import AgendaModal from './AgendaModal';

export default function CalendarModule() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  const currentUserId = user?.uid || user?.id || null;
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  const { 
    appointments, 
    loading, 
    addAppointment, 
    updateAppointment, 
    deleteAppointment 
  } = useCalendar(orgId, currentUserId);

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'personal', 'company'
  const [viewMode, setViewMode] = useState('agenda'); // 'agenda', 'calendar'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // --- Calendar Date States ---
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const cYear = currentMonthDate.getFullYear();
  const cMonth = currentMonthDate.getMonth();

  // --- Filters ---
  const filteredEvents = useMemo(() => {
    return appointments.filter(appt => {
      if (activeTab === 'personal') return appt.type === 'personal';
      if (activeTab === 'company') return appt.type === 'company';
      return true;
    });
  }, [appointments, activeTab]);

  // Group events by date (for agenda view)
  const groupedEvents = useMemo(() => {
    const groups = {};
    filteredEvents.forEach(appt => {
      if (!groups[appt.date]) groups[appt.date] = [];
      groups[appt.date].push(appt);
    });
    // Sort keys chronologically
    return Object.keys(groups)
      .sort()
      .reduce((acc, key) => {
        acc[key] = groups[key].sort((a, b) => a.time.localeCompare(b.time));
        return acc;
      }, {});
  }, [filteredEvents]);

  // Calendar Days Calculation (Monday-first)
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(cYear, cMonth + 1, 0).getDate();
    const firstDayIndex = new Date(cYear, cMonth, 1).getDay();
    // Map Sunday (0) to index 6, Monday (1) to 0, etc.
    const leadingDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const days = [];
    // Leading padding days
    for (let i = 0; i < leadingDays; i++) {
      days.push({ type: 'empty', id: `leading-${i}` });
    }
    // Actual month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${cYear}-${String(cMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push({
        type: 'day',
        day,
        dateString,
        id: `day-${day}`
      });
    }
    return days;
  }, [cYear, cMonth]);

  // Selected Day Events (for monthly sub-view)
  const selectedDateString = useMemo(() => {
    return `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  }, [selectedDate]);

  const selectedDayEvents = useMemo(() => {
    return filteredEvents.filter(appt => appt.date === selectedDateString);
  }, [filteredEvents, selectedDateString]);

  // --- Handlers ---
  const handleOpenCreateModal = (dateStr = null) => {
    setEditingEvent(null);
    if (dateStr) {
      // Si se pulsa un día en el calendario, preseleccionar esa fecha
      setEditingEvent({ date: dateStr, time: '09:00' });
    }
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (appt) => {
    setEditingEvent(appt);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (payload) => {
    try {
      if (editingEvent && editingEvent.id) {
        await updateAppointment(editingEvent.id, payload);
      } else {
        await addAppointment(payload);
      }
      setIsModalOpen(false);
      setEditingEvent(null);
    } catch (err) {
      alert('Error al guardar el evento: ' + err.message);
    }
  };

  const handleToggleStatus = async (appt) => {
    try {
      const newStatus = appt.status === 'DONE' ? 'PENDING' : 'DONE';
      await updateAppointment(appt.id, { status: newStatus });
    } catch (err) {
      alert('Error al actualizar el estado: ' + err.message);
    }
  };

  const handleDeleteEvent = async (apptId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      try {
        await deleteAppointment(apptId);
      } catch (err) {
        alert('Error al eliminar el evento: ' + err.message);
      }
    }
  };

  const formatTime12h = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${minutes} ${ampm}`;
  };

  const formatDateLabel = (dateStr) => {
    // Parse using local components to avoid UTC offset shifts
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(cYear, cMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(cYear, cMonth + 1, 1));
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  if (loading) {
    return <LoadingScreen fullScreen={false} message="Cargando tu Agenda..." />;
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-10">
      
      {/* Top Header and Control Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Desktop Tabs */}
        <div className="hidden md:flex p-1 bg-[var(--color-surface-container)]/50 rounded-xl w-fit border border-[var(--color-outline-variant)]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'all' 
                ? 'bg-[#6B4FD8] text-[#002150]' 
                : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'personal' 
                ? 'bg-[#6B4FD8] text-[#002150]' 
                : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
            }`}
          >
            Mi Agenda
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'company' 
                ? 'bg-[#6B4FD8] text-[#002150]' 
                : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
            }`}
          >
            Empresa
          </button>
        </div>

        {/* Mobile Tabs Selector */}
        <div className="md:hidden relative w-full">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] font-bold rounded-xl border border-[var(--color-outline-variant)] px-4 py-3 outline-none appearance-none focus:border-[#6B4FD8]"
          >
            <option value="all">Todos</option>
            <option value="personal">Mi Agenda</option>
            <option value="company">Empresa</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--color-on-surface-variant)]">
            <ChevronDown size={18} />
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Switch Vista */}
          <div className="flex p-1 bg-[var(--color-surface-container)]/50 rounded-xl border border-[var(--color-outline-variant)] flex-1 md:flex-initial">
            <button
              onClick={() => setViewMode('agenda')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'agenda'
                  ? 'bg-[#6B4FD8] text-[#002150] shadow-sm'
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
              }`}
              title="Vista Agenda"
            >
              <List size={14} />
              Agenda
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-[#6B4FD8] text-[#002150] shadow-sm'
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
              }`}
              title="Vista Calendario"
            >
              <Grid size={14} />
              Mensual
            </button>
          </div>

          {/* Botón CTA Nuevo Evento */}
          <button
            onClick={() => handleOpenCreateModal()}
            className="bg-[#6B4FD8] text-[#002150] font-black px-4 py-2.5 text-xs rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_2px_10px_rgba(107,79,216,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all shrink-0"
          >
            <Plus size={16} /> Nuevo Evento
          </button>
        </div>
      </div>

      {/* --- Main Screen Layout --- */}
      {viewMode === 'agenda' ? (
        
        /* ================= VISTA AGENDA (PAPEL FÍSICO) ================= */
        <div className="relative bg-[var(--color-surface-container-low)] rounded-2xl border border-[var(--color-outline-variant)] shadow-lg p-6 md:p-8 overflow-hidden min-h-[450px]">
          
          {/* Línea roja/lila vertical estilo margen de libreta física */}
          <div className="absolute left-7 md:left-12 top-0 bottom-0 w-px bg-red-500/20 dark:bg-red-400/15" />
          
          {/* Contenedor de notas */}
          <div className="pl-6 md:pl-12 space-y-8 relative z-10">
            {Object.keys(groupedEvents).length === 0 ? (
              <div className="text-center py-16 pl-4">
                <Info size={40} className="mx-auto text-[var(--color-on-surface-variant)]/40 mb-3" />
                <p className="text-sm text-[var(--color-on-surface-variant)] italic">
                  No hay eventos programados en esta sección.
                </p>
              </div>
            ) : (
              Object.keys(groupedEvents).map(dateStr => (
                <div key={dateStr} className="space-y-4">
                  
                  {/* Fecha de la agenda */}
                  <div className="relative flex items-center">
                    {/* Punto de intersección en el margen */}
                    <div className="absolute -left-[30px] md:-left-[54px] w-2.5 h-2.5 rounded-full bg-[#6B4FD8] border-2 border-[var(--color-surface-container-low)] shadow-sm" />
                    
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#6B4FD8] select-none bg-[var(--color-surface-container-low)] pr-3 py-1">
                      {formatDateLabel(dateStr)}
                    </span>
                  </div>

                  {/* Lista de eventos del día */}
                  <div className="space-y-3 pl-2">
                    {groupedEvents[dateStr].map(appt => {
                      const isCompleted = appt.status === 'DONE';
                      return (
                        <div 
                          key={appt.id}
                          className="group flex items-start justify-between gap-4 p-3.5 bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)]/60 hover:border-[#6B4FD8]/40 rounded-xl transition-all duration-300 shadow-sm"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            {/* Toggle status checkbox */}
                            <button
                              onClick={() => handleToggleStatus(appt)}
                              className="text-[#6B4FD8] hover:scale-110 active:scale-95 transition-transform mt-0.5 shrink-0"
                              title={isCompleted ? "Marcar pendiente" : "Marcar completada"}
                            >
                              {isCompleted ? (
                                <CheckCircle size={18} className="fill-[#6B4FD8] text-[var(--color-surface-container)]" />
                              ) : (
                                <Circle size={18} />
                              )}
                            </button>

                            {/* Event details */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-xs font-bold transition-colors ${
                                  isCompleted 
                                    ? 'line-through text-[var(--color-on-surface-variant)]/60 font-semibold' 
                                    : 'text-[var(--color-on-surface)]'
                                }`}>
                                  {appt.title}
                                </span>
                                
                                {/* Hora */}
                                <span className="text-[10px] font-semibold text-[var(--color-on-surface-variant)] bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)]/40 px-2 py-0.5 rounded-md">
                                  {formatTime12h(appt.time)}
                                </span>

                                {/* Badge Personal vs Empresa */}
                                {appt.type === 'company' ? (
                                  <span className="text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded-full font-black uppercase">
                                    Empresa
                                  </span>
                                ) : (
                                  <span className="text-[8px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded-full font-black uppercase">
                                    Personal
                                  </span>
                                )}
                              </div>
                              
                              {appt.description && (
                                <p className={`text-xs mt-1 text-[var(--color-on-surface-variant)] leading-relaxed ${
                                  isCompleted ? 'line-through opacity-50' : ''
                                }`}>
                                  {appt.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEditModal(appt)}
                              className="p-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500 hover:text-white rounded-lg transition-all"
                              title="Editar evento"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(appt.id)}
                              className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                              title="Eliminar evento"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        
        /* ================= VISTA CALENDARIO MENSUAL ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Calendar Grid Box */}
          <div className="lg:col-span-2 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl p-6 shadow-sm flex flex-col h-fit">
            
            {/* Calendar Controls */}
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-black text-sm uppercase tracking-wider text-[var(--color-on-surface)]">
                {monthNames[cMonth]} {cYear}
              </h4>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1.5 bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] rounded-lg text-[var(--color-on-surface)] transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={handleNextMonth}
                  className="p-1.5 bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] rounded-lg text-[var(--color-on-surface)] transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Grid Header (Weekdays) */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <span 
                  key={day} 
                  className="text-[9px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] py-1.5"
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Grid Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((cell) => {
                if (cell.type === 'empty') {
                  return <div key={cell.id} className="aspect-square bg-transparent" />;
                }

                const hasEvents = appointments.some(a => a.date === cell.dateString);
                const dayEvents = appointments.filter(a => a.date === cell.dateString);
                
                // Filtramos según el tab activo para pintar puntos de color correctos
                const visibleDayEvents = dayEvents.filter(a => {
                  if (activeTab === 'personal') return a.type === 'personal';
                  if (activeTab === 'company') return a.type === 'company';
                  return true;
                });

                const isSelected = selectedDateString === cell.dateString;
                
                // Verificar si es el día actual del dispositivo
                const today = new Date();
                const isToday = today.getFullYear() === cYear && 
                                today.getMonth() === cMonth && 
                                today.getDate() === cell.day;

                return (
                  <div 
                    key={cell.id}
                    onClick={() => setSelectedDate(new Date(cYear, cMonth, cell.day))}
                    onDoubleClick={() => handleOpenCreateModal(cell.dateString)}
                    className={`aspect-square border rounded-xl flex flex-col items-center justify-between p-1.5 cursor-pointer transition-all select-none ${
                      isSelected 
                        ? 'border-[#6B4FD8] bg-[#6B4FD8]/10 text-[var(--color-on-surface)]'
                        : isToday
                          ? 'border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] font-bold text-[#6B4FD8]'
                          : 'border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] text-[var(--color-on-surface)]'
                    }`}
                  >
                    <span className="text-xs font-semibold">{cell.day}</span>
                    
                    {/* Dots indicators */}
                    <div className="flex gap-1 justify-center w-full min-h-[6px]">
                      {visibleDayEvents.slice(0, 3).map(ev => (
                        <div 
                          key={ev.id}
                          className={`w-1.5 h-1.5 rounded-full ${
                            ev.type === 'company' ? 'bg-blue-400' : 'bg-purple-400'
                          }`}
                        />
                      ))}
                      {visibleDayEvents.length > 3 && (
                        <span className="text-[7px] font-black leading-none text-[var(--color-on-surface-variant)]">+</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Selected Day Details Sidebar */}
          <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl p-6 shadow-sm h-fit">
            
            {/* Header Selected Day */}
            <div className="border-b border-[var(--color-outline-variant)] pb-4 mb-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-[#6B4FD8]">
                Eventos del día
              </h4>
              <p className="text-sm font-extrabold text-[var(--color-on-surface)] mt-1">
                {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>

            {/* List */}
            <div className="space-y-3">
              {selectedDayEvents.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-[var(--color-outline-variant)] rounded-xl">
                  <p className="text-xs text-[var(--color-on-surface-variant)] italic">
                    Sin eventos programados.
                  </p>
                  <button
                    onClick={() => handleOpenCreateModal(selectedDateString)}
                    className="mt-3 text-[10px] font-black uppercase text-[#6B4FD8] hover:underline"
                  >
                    + Agregar Evento
                  </button>
                </div>
              ) : (
                selectedDayEvents.map(appt => {
                  const isCompleted = appt.status === 'DONE';
                  return (
                    <div 
                      key={appt.id}
                      className="group flex flex-col gap-1.5 p-3 bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)]/60 rounded-xl transition-all"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <button
                            onClick={() => handleToggleStatus(appt)}
                            className="text-[#6B4FD8] hover:scale-110 active:scale-95 transition-transform"
                          >
                            {isCompleted ? (
                              <CheckCircle size={15} className="fill-[#6B4FD8] text-[var(--color-surface-container)]" />
                            ) : (
                              <Circle size={15} />
                            )}
                          </button>
                          <span className={`text-xs font-bold truncate ${
                            isCompleted ? 'line-through text-[var(--color-on-surface-variant)]/60' : 'text-[var(--color-on-surface)]'
                          }`}>
                            {appt.title}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEditModal(appt)}
                            className="text-amber-400 hover:text-amber-500"
                            title="Editar"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(appt.id)}
                            className="text-red-400 hover:text-red-500"
                            title="Eliminar"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-[9px] font-semibold text-[var(--color-on-surface-variant)]">
                        <span>{formatTime12h(appt.time)}</span>
                        <span>•</span>
                        {appt.type === 'company' ? (
                          <span className="text-blue-400 font-bold uppercase">Empresa</span>
                        ) : (
                          <span className="text-purple-400 font-bold uppercase">Personal</span>
                        )}
                      </div>

                      {appt.description && (
                        <p className={`text-[11px] text-[var(--color-on-surface-variant)] leading-snug italic line-clamp-2 ${
                          isCompleted ? 'line-through opacity-50' : ''
                        }`}>
                          {appt.description}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>
      )}

      {/* COMPONENTE MODAL DE EVENTOS */}
      <AgendaModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveEvent}
        appointment={editingEvent}
        isAdmin={isAdmin}
        currentUserId={currentUserId}
      />

    </div>
  );
}
