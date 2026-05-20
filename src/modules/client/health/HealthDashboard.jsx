import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useHealth } from './useHealth';
import { useCrm } from '../crm/useCrm';
import LoadingScreen from '../../../components/LoadingScreen';
import { 
  Calendar as CalendarIcon, 
  Users, 
  ClipboardList, 
  Plus, 
  Clock, 
  Video, 
  MapPin, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HealthDashboard() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  
  // 1. Load Health State
  const { expedientes, citas, notasSesion, loading: loadingHealth } = useHealth(orgId);
  
  // 2. Load CRM (for contacts names/details joined client-side)
  const { contacts, loading: loadingCrm } = useCrm(orgId);

  if (loadingHealth || loadingCrm) {
    return <LoadingScreen fullScreen={false} message="Preparando resumen de salud..." />;
  }

  // Helpers
  const now = new Date();
  const getFormattedDate = (timestamp) => {
    if (!timestamp) return null;
    const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return d;
  };

  // Data Processing
  const todayStr = now.toISOString().split('T')[0];
  
  const citasHoy = citas.filter(c => {
    const cDate = getFormattedDate(c.fecha_hora);
    return cDate && cDate.toISOString().split('T')[0] === todayStr;
  }).sort((a, b) => getFormattedDate(a.fecha_hora) - getFormattedDate(b.fecha_hora));

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const totalProximas = citas.filter(c => {
    const date = getFormattedDate(c.fecha_hora);
    return date && date > now && date <= nextWeek;
  }).length;

  const totalActivos = expedientes.filter(e => e.estado === 'activo').length;

  // Citas realizadas que no tienen nota de sesión vinculada
  const pendingNotesCitas = citas.filter(c => {
    if (c.estado !== 'realizada') return false;
    const hasNote = notasSesion.some(n => n.cita_id === c.id);
    return !hasNote;
  });

  const getContact = (id) => contacts.find(c => c.id === id) || { name: 'Paciente Desconocido' };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-2xl p-6 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6B4FD8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-12 h-12 rounded-xl bg-[#6B4FD8]/10 flex items-center justify-center text-[#6B4FD8] shrink-0">
            <CalendarIcon size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-on-surface-variant)] opacity-70">Citas Próximas (7d)</p>
            <p className="text-3xl font-black text-[var(--color-on-surface)] leading-tight">{totalProximas}</p>
          </div>
        </div>

        <div className="bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-2xl p-6 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-[var(--color-on-surface-variant)] opacity-70">Pacientes Activos</p>
            <p className="text-3xl font-black text-[var(--color-on-surface)] leading-tight">{totalActivos}</p>
          </div>
        </div>

        <div className="bg-[#6B4FD8] text-[#002150] rounded-2xl p-6 relative overflow-hidden flex items-center justify-between">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-wider text-[#002150]/60 mb-1">Acceso Rápido</p>
            <h3 className="text-lg font-black mb-3 leading-tight">Gestionar Agenda</h3>
            <Link to="/client/salud/agenda" className="inline-flex items-center gap-2 bg-white/90 text-[#6B4FD8] px-4 py-2 rounded-lg font-bold text-xs hover:bg-white transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.6)] hover:-translate-y-0.5 active:translate-y-0">
              Abrir Calendario
            </Link>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-20 scale-[2]">
            <CalendarIcon size={64} />
          </div>
        </div>
      </div>

      {/* Main View Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Citas de Hoy */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-6 bg-[#6B4FD8] rounded-full"></div>
              <h2 className="font-black text-[var(--color-on-surface)] uppercase tracking-tight">Citas para Hoy</h2>
            </div>
            <span className="text-[10px] font-bold bg-[var(--color-surface-variant)] px-2 py-1 rounded text-[var(--color-on-surface-variant)] uppercase">
              {citasHoy.length} Programadas
            </span>
          </div>

          <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl overflow-hidden flex-1 min-h-[300px]">
            {citasHoy.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-60">
                <div className="w-16 h-16 mb-4 rounded-full bg-[var(--color-surface-variant)] flex items-center justify-center text-[var(--color-on-surface-variant)]">
                  <CalendarIcon size={28} strokeWidth={1.5} />
                </div>
                <p className="font-bold text-[var(--color-on-surface)]">No hay citas agendadas hoy</p>
                <p className="text-xs">Tu agenda está libre por el momento.</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-outline-variant)]/40">
                {citasHoy.map(cita => {
                  const contact = getContact(cita.client_id);
                  const date = getFormattedDate(cita.fecha_hora);
                  const timeStr = date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
                  
                  return (
                    <div key={cita.id} className="group flex items-center gap-4 p-5 hover:bg-[var(--color-surface-variant)]/30 transition-all cursor-pointer relative">
                      {/* Left timeline accent */}
                      <div className="w-16 shrink-0 flex flex-col items-center border-r border-[var(--color-outline-variant)]/50 mr-2">
                        <span className="text-sm font-black text-[var(--color-primary)]">{timeStr}</span>
                        <span className="text-[9px] font-bold opacity-50 uppercase">{cita.duracion_min}m</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-[var(--color-on-surface)] group-hover:text-[#6B4FD8] transition-colors truncate">
                          {contact.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[10px] font-bold text-[var(--color-on-surface-variant)]">
                          <span className="flex items-center gap-1 uppercase bg-[var(--color-primary-container)]/30 px-1.5 py-0.5 rounded text-[var(--color-primary)]">
                            {cita.tipo_sesion?.replace('_', ' ')}
                          </span>
                          <span className="flex items-center gap-1">
                            {cita.modalidad === 'videollamada' ? <Video size={12} /> : <MapPin size={12} />}
                            {cita.modalidad}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                         <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full border ${
                           cita.estado === 'realizada' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                           cita.estado === 'programada' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                           'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                         }`}>
                           {cita.estado}
                         </span>
                         <Link to={`/client/salud/pacientes/${cita.client_id}`} className="p-2 rounded-lg bg-[var(--color-surface-variant)] opacity-0 group-hover:opacity-100 transition-all hover:text-[#6B4FD8]">
                           <ChevronRight size={16} />
                         </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Alerts & Actions */}
        <div className="flex flex-col gap-6">
          
          {/* Task Pending Alerts */}
          <div className="space-y-3">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-[var(--color-on-surface-variant)] px-2">Tareas Pendientes</h3>
            
            {pendingNotesCitas.length > 0 ? (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="text-amber-400 shrink-0 mt-0.5">
                    <AlertCircle size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-200">Notas de Sesión Faltantes</h4>
                    <p className="text-xs text-amber-200/70 mb-3 leading-relaxed">
                      Tienes {pendingNotesCitas.length} cita(s) realizada(s) sin registro clínico. Recuerda que se bloquean tras 24h.
                    </p>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                      {pendingNotesCitas.slice(0, 3).map(cita => (
                        <Link 
                          key={cita.id}
                          to={`/client/salud/pacientes/${cita.client_id}`} 
                          className="flex items-center justify-between bg-black/20 hover:bg-black/30 p-2.5 rounded-xl border border-white/5 transition-all group"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{getContact(cita.client_id).name}</p>
                            <p className="text-[9px] opacity-60">{getFormattedDate(cita.fecha_hora)?.toLocaleDateString()}</p>
                          </div>
                          <Plus size={14} className="text-amber-400 opacity-50 group-hover:opacity-100" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-500/5 border border-green-500/10 rounded-2xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 text-green-400 mb-2">
                  <ClipboardList size={20} />
                </div>
                <p className="text-xs font-bold text-green-200/80">¡Todo al día!</p>
                <p className="text-[10px] text-[var(--color-on-surface-variant)] mt-1">No hay notas pendientes por escribir.</p>
              </div>
            )}
          </div>

          {/* Fast Action Buttons */}
          <div className="space-y-3">
            <h3 className="font-black text-[10px] uppercase tracking-widest text-[var(--color-on-surface-variant)] px-2">Acciones</h3>
            
            <Link to="/client/salud/pacientes" className="flex items-center gap-3 w-full p-4 rounded-xl border border-[var(--color-outline-variant)] hover:border-[#6B4FD8]/50 bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-variant)]/50 transition-all group">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-container)] text-[var(--color-primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={16} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[var(--color-on-surface)]">Nuevo Paciente</p>
                <p className="text-[10px] text-[var(--color-on-surface-variant)]">Vincular desde base de datos</p>
              </div>
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}
