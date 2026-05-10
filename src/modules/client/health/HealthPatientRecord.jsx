import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useHealth } from './useHealth';
import { useCrm } from '../crm/useCrm';
import LoadingScreen from '../../../components/LoadingScreen';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  CalendarDays, 
  FileText, 
  Activity, 
  FolderClosed, 
  Save,
  Edit,
  CheckCircle2,
  ClipboardList
} from 'lucide-react';

// Tabs
import RecordAppointmentsTab from './tabs/RecordAppointmentsTab';
import RecordSessionNotesTab from './tabs/RecordSessionNotesTab';
import RecordGeneralNotesTab from './tabs/RecordGeneralNotesTab';
import RecordFilesTab from './tabs/RecordFilesTab';

export default function HealthPatientRecord() {
  const { clientId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const orgId = user?.organizationId || "default_org";
  
  const { expedientes, citas, loading: loadingHealth, updateExpediente } = useHealth(orgId);
  const { contacts, loading: loadingCrm } = useCrm(orgId);

  const [activeTab, setActiveTab] = useState('session_notes');
  const [isEditingDossier, setIsEditingDossier] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [dossierData, setDossierData] = useState({
    motivo_consulta: '',
    antecedentes: '',
    diagnostico: '',
    estado: ''
  });

  const loading = loadingHealth || loadingCrm;

  // Match data
  const contact = contacts.find(c => c.id === clientId);
  const expediente = expedientes.find(e => e.client_id === clientId && e.estado === 'activo') || 
                     expedientes.find(e => e.client_id === clientId); // fallback if inactive

  useEffect(() => {
    if (expediente) {
      setDossierData({
        motivo_consulta: expediente.motivo_consulta || '',
        antecedentes: expediente.antecedentes || '',
        diagnostico: expediente.diagnostico || '',
        estado: expediente.estado || 'activo'
      });
    }
  }, [expediente]);

  if (loading) return <LoadingScreen fullScreen={false} message="Abriendo expediente..." />;

  if (!contact) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl text-[var(--color-on-surface)]">Paciente no encontrado.</h2>
        <Link to="/client/salud/pacientes" className="text-[#6B4FD8] underline mt-4 inline-block">Volver al listado</Link>
      </div>
    );
  }

  const handleSaveDossier = async () => {
    if (!expediente) return;
    setIsSaving(true);
    try {
      await updateExpediente(expediente.id, dossierData);
      setIsEditingDossier(false);
    } catch (e) {
      alert("Error guardando expediente: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const stats = {
    citasRealizadas: citas.filter(c => c.client_id === clientId && c.estado === 'realizada').length,
    citasProximas: citas.filter(c => c.client_id === clientId && c.estado === 'programada').length
  };

  const tabs = [
    { id: 'session_notes', label: 'Notas de Sesión', icon: FileText },
    { id: 'appointments', label: 'Historial de Citas', icon: CalendarDays },
    { id: 'general_notes', label: 'Notas Generales', icon: ClipboardList },
    { id: 'files', label: 'Documentos', icon: FolderClosed },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
      {/* Top Nav bar */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl bg-[var(--color-surface-variant)] hover:bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)] transition-all hover:text-[#6B4FD8]"
        >
          <ArrowLeft size={20}/>
        </button>
        <h2 className="text-sm font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">Expediente Clínico</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COL: PERFIL Y DOSSIER ESTATICO */}
        <div className="space-y-6 lg:sticky lg:top-4">
          
          {/* Patient Card */}
          <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-3xl overflow-hidden">
             <div className="bg-gradient-to-r from-[#6B4FD8] to-[#8E79F0] p-6 flex items-center gap-4 text-white relative">
                {/* Background Decor */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
                
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black text-2xl border border-white/30 shadow-lg shrink-0 relative z-10">
                   {contact.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1 relative z-10">
                   <h3 className="text-xl font-black leading-tight truncate">{contact.name}</h3>
                   <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase bg-white/20 border border-white/30 mt-1">
                     PACIENTE {expediente ? expediente.estado.replace('_', ' ') : 'SIN EXPEDIENTE'}
                   </span>
                </div>
             </div>
             
             <div className="p-6 space-y-4">
                <div className="space-y-3">
                   {contact.email && (
                      <div className="flex items-center gap-3 text-sm text-[var(--color-on-surface-variant)]">
                         <Mail size={16} className="opacity-60"/>
                         <span className="font-bold truncate">{contact.email}</span>
                      </div>
                   )}
                   {contact.phone && (
                      <div className="flex items-center gap-3 text-sm text-[var(--color-on-surface-variant)]">
                         <Phone size={16} className="opacity-60"/>
                         <span className="font-bold">{contact.phone}</span>
                      </div>
                   )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                   <div className="bg-[var(--color-surface-variant)]/50 border border-[var(--color-outline-variant)] p-3 rounded-2xl text-center">
                      <p className="text-2xl font-black text-[var(--color-on-surface)]">{stats.citasRealizadas}</p>
                      <p className="text-[9px] font-black uppercase text-[var(--color-on-surface-variant)]">Asistidas</p>
                   </div>
                   <div className="bg-[var(--color-surface-variant)]/50 border border-[var(--color-outline-variant)] p-3 rounded-2xl text-center">
                      <p className="text-2xl font-black text-[#6B4FD8]">{stats.citasProximas}</p>
                      <p className="text-[9px] font-black uppercase text-[var(--color-on-surface-variant)]">Pendientes</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Dossier Medico (Motivo, Diagnostico) */}
          <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-3xl overflow-hidden">
             <div className="p-5 border-b border-[var(--color-outline-variant)] flex justify-between items-center">
                <h3 className="font-black text-[var(--color-on-surface)] flex items-center gap-2 uppercase tracking-wider text-xs opacity-70">
                   <Activity size={16} className="text-[#6B4FD8]"/> Historia Base
                </h3>
                {!isEditingDossier ? (
                   <button onClick={() => setIsEditingDossier(true)} className="p-1.5 hover:bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] hover:text-[#6B4FD8] rounded-lg transition-colors" title="Editar Info Médica">
                     <Edit size={16}/>
                   </button>
                ) : (
                   <button 
                     onClick={handleSaveDossier} 
                     disabled={isSaving}
                     className="bg-[#6B4FD8] text-[#002150] text-[10px] font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-1 hover:shadow-md disabled:opacity-50"
                   >
                     {isSaving ? 'Guardando...' : <><Save size={12}/> Guardar</>}
                   </button>
                )}
             </div>

             <div className="p-5 space-y-5">
                {/* Dynamic Field Renderer */}
                {[{label: 'Motivo de Consulta', key: 'motivo_consulta'}, {label: 'Antecedentes', key: 'antecedentes'}, {label: 'Diagnóstico Preliminar', key: 'diagnostico'}].map(field => (
                   <div key={field.key} className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-[var(--color-on-surface-variant)] flex items-center gap-1.5">
                         {field.label}
                      </label>
                      {isEditingDossier ? (
                         <textarea 
                           value={dossierData[field.key]}
                           onChange={e => setDossierData({...dossierData, [field.key]: e.target.value})}
                           className="w-full text-xs font-bold bg-[var(--color-surface-variant)]/50 border border-[var(--color-outline-variant)] rounded-xl p-3 focus:border-[#6B4FD8] outline-none transition-colors resize-none h-24 text-[var(--color-on-surface)]"
                           placeholder={`Escribir ${field.label.toLowerCase()}...`}
                         />
                      ) : (
                         <p className="text-xs font-medium text-[var(--color-on-surface)] bg-[var(--color-surface-container)] p-3 rounded-xl border border-[var(--color-outline-variant)]/30 whitespace-pre-wrap min-h-[40px]">
                            {expediente?.[field.key] || <span className="italic opacity-40">No especificado</span>}
                         </p>
                      )}
                   </div>
                ))}

                {/* Estado de Expediente Toggle only in edit mode */}
                {isEditingDossier && (
                   <div className="space-y-1.5 pt-2">
                      <label className="text-[10px] font-black uppercase text-[var(--color-on-surface-variant)]">Estado del Expediente</label>
                      <select 
                        value={dossierData.estado}
                        onChange={e => setDossierData({...dossierData, estado: e.target.value})}
                        className="w-full text-xs font-bold bg-[var(--color-surface-variant)]/50 border border-[var(--color-outline-variant)] rounded-xl p-2.5 text-[var(--color-on-surface)]"
                      >
                         <option value="activo">Activo</option>
                         <option value="en_pausa">En Pausa</option>
                         <option value="alta">Alta Médica</option>
                         <option value="archivado">Archivado</option>
                      </select>
                   </div>
                )}
             </div>
          </div>
        </div>

        {/* RIGHT COL: CONTENT TABS */}
        <div className="lg:col-span-2 space-y-6">
           {/* Navigation Tab Bar */}
           <div className="flex items-center p-1 bg-[var(--color-surface-container-low)] rounded-2xl border border-[var(--color-outline-variant)] overflow-x-auto custom-scrollbar">
              {tabs.map(tab => {
                 const Icon = tab.icon;
                 const isSel = activeTab === tab.id;
                 return (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black whitespace-nowrap transition-all flex-1 justify-center ${isSel ? 'bg-[#6B4FD8] text-[#002150] shadow-lg shadow-[#6B4FD8]/20' : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
                    >
                       <Icon size={16} />
                       <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                 );
              })}
           </div>

           {/* Active Tab Render */}
           <div className="min-h-[400px]">
              {!expediente ? (
                 <div className="bg-[var(--color-surface-container-low)] border border-dashed border-[var(--color-outline-variant)] p-12 rounded-3xl flex flex-col items-center justify-center text-center opacity-70">
                    <FileText size={48} className="text-[var(--color-on-surface-variant)] mb-4" />
                    <p className="text-[var(--color-on-surface)] font-bold">El paciente no cuenta con un expediente clínico activo.</p>
                    <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">Debes darlo de alta para comenzar a registrar notas.</p>
                 </div>
              ) : (
                 <>
                    {activeTab === 'session_notes' && <RecordSessionNotesTab clientId={clientId} orgId={orgId} />}
                    {activeTab === 'appointments' && <RecordAppointmentsTab clientId={clientId} orgId={orgId} />}
                    {activeTab === 'general_notes' && <RecordGeneralNotesTab clientId={clientId} expedienteId={expediente.id} orgId={orgId} />}
                    {activeTab === 'files' && <RecordFilesTab clientId={clientId} orgId={orgId} />}
                 </>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
