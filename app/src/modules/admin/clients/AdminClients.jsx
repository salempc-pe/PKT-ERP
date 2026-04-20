import { useState, useMemo } from 'react';
import { Search, Building2, Users, MoreVertical, Plus, Box, Check, X, HeartPulse, Trash2, Save, Send, ShieldCheck, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { calculateHealthScore } from '../../../hooks/useAdminAnalytics';

const AVAILABLE_MODULES = [
  { id: 'crm', name: 'CRM y Ventas' },
  { id: 'inventory', name: 'Inventario' },
  { id: 'sales', name: 'Ventas y Facturación' },
  { id: 'finance', name: 'Contabilidad' },
  { id: 'calendar', name: 'Agenda y Citas' },
  { id: 'projects', name: 'Gestión de Proyectos' }
];

export default function AdminClients() {
  const { 
    mockOrganizations: organizations,
    mockUsers: allUsers,
    adminCreateOrg, adminRemoveUser, 
    adminUpdateFullOrg, adminCreateUser, 
    SUBSCRIPTION_PLANS, adminRemoveOrg
  } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isNewOrgModalOpen, setIsNewOrgModalOpen] = useState(false);
  const [isEditOrgModalOpen, setIsEditOrgModalOpen] = useState(false);
  
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  // Forms State
  const [newOrgData, setNewOrgData] = useState({ 
    name: '', 
    ruc: '', 
    address: '', 
    maxUsers: 5,
    planId: 'startup',
    activeModules: [],
    adminName: '',
    adminEmail: ''
  });
  
  // Unified Edit State
  const [editOrgState, setEditOrgState] = useState({
    name: '',
    ruc: '',
    address: '',
    maxUsers: 5,
    planId: 'startup',
    activeModules: []
  });

  const [newUserInOrg, setNewUserInOrg] = useState({ name: '', email: '', role: 'admin' });

  // Unir organizaciones con sus usuarios de forma reactiva
  const organizationsWithUsers = useMemo(() => {
    return organizations.map(org => ({
      ...org,
      users: allUsers.filter(u => u.organizationId === org.id)
    }));
  }, [organizations, allUsers]);

  const filteredOrgs = organizationsWithUsers.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (org.ruc && org.ruc.includes(searchTerm)) ||
    org.users.some(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // --- Handlers Generales ---
  const handleToggleModule = (moduleId, setState) => {
    setState(prev => ({
      ...prev,
      activeModules: prev.activeModules.includes(moduleId)
        ? prev.activeModules.filter(id => id !== moduleId)
        : [...prev.activeModules, moduleId]
    }));
  };

  const handleSetPlan = (planId, plan, setState) => {
    setState(prev => ({
      ...prev,
      planId,
      maxUsers: plan.limits.users
    }));
  };

  // --- Handlers para Organizaciones ---
  const handleCreateOrg = async (e) => {
    e.preventDefault();
    if (!newOrgData.name.trim()) return;
    
    setIsSaving(true);
    try {
      await adminCreateOrg(newOrgData);
      setNewOrgData({ 
        name: '', ruc: '', address: '', maxUsers: 5, 
        planId: 'startup', activeModules: [], 
        adminName: '', adminEmail: '' 
      });
      setIsNewOrgModalOpen(false);
    } catch (error) {
      alert("Error al crear la organización: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenEditOrg = (org) => {
    setSelectedOrg(org);
    setEditOrgState({ 
      name: org.name, 
      ruc: org.ruc || '', 
      address: org.address || '',
      maxUsers: org.subscription?.maxUsers || 5,
      planId: org.subscription?.planId || 'startup',
      activeModules: org.subscription?.activeModules || []
    });
    setIsEditOrgModalOpen(true);
  };


  const handleSaveFullOrg = async () => {
    setIsSaving(true);
    try {
      const result = await adminUpdateFullOrg(selectedOrg.id, editOrgState);
      if (result.success) {
        setIsEditOrgModalOpen(false);
      } else {
        alert("Error al guardar: " + result.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteOrg = () => {
    if (!window.confirm(`¿Eliminar "${selectedOrg?.name}"? Esta acción no se puede deshacer.`)) return;
    adminRemoveOrg(selectedOrg.id);
    setIsEditOrgModalOpen(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUserInOrg.name || !newUserInOrg.email) return;
    
    setIsInviting(true);
    // Simulamos envío de correo
    setTimeout(async () => {
      const result = await adminCreateUser(selectedOrg.id, editOrgState.name, newUserInOrg);
      setIsInviting(false);
      
      if (result && !result.success) {
        alert(result.error);
        return;
      }

      if (result && result.inviteToken) {
        const inviteUrl = window.location.origin + '/setup-password?token=' + result.inviteToken;
        navigator.clipboard.writeText(inviteUrl);
        alert('📩 ¡Invitación enviada por sistema!\n\nSe ha generado el acceso para ' + newUserInOrg.email + '.\nEl enlace de activación ha sido copiado al portapapeles por si deseas enviarlo manualmente.');
      }

      setNewUserInOrg({ name: '', email: '', role: 'admin' });
    }, 1500);
  };

  const copyInviteLink = (token) => {
    const inviteUrl = window.location.origin + '/setup-password?token=' + token;
    navigator.clipboard.writeText(inviteUrl);
    alert('Enlace de invitación copiado al portapapeles');
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3aac4]" size={18} />
            <input 
              type="text" 
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#091328] border border-[#40485d]/30 text-[#dee5ff] rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#85adff]/50 w-64 transition-all"
            />
          </div>
          <button 
            onClick={() => setIsNewOrgModalOpen(true)}
            className="group bg-[#85adff] hover:bg-[#a3c4ff] text-[#060e20] flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm transition-all shadow-xl shadow-[#85adff]/10 hover:scale-105 active:scale-95"
          >
            <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            <span>Nueva Organización</span>
          </button>
        </div>
      </div>

      {/* Grid de Organizaciones */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredOrgs.map((org) => (
          <div key={org.id} className="bg-[#091328]/60 border border-[#40485d]/30 rounded-3xl p-6 transition-all hover:border-[#85adff]/20 flex flex-col h-full group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#85adff]/10 rounded-2xl flex items-center justify-center text-[#85adff] group-hover:bg-[#85adff]/20 transition-colors">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#dee5ff] flex items-center gap-3">
                    {org.name}
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full bg-[#4ADE80]/10 text-[#4ADE80]">Activado</span>
                  </h3>
                  <div className="flex gap-2 items-center flex-wrap mt-1">
                    <p className="text-[10px] text-[#a3aac4] uppercase tracking-wider font-semibold">ID: {org.id}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      org.subscription?.planId === 'enterprise' ? 'bg-[#fbabff]/10 text-[#fbabff] border-[#fbabff]/20' : 
                      org.subscription?.planId === 'business' ? 'bg-[#85adff]/10 text-[#85adff] border-[#85adff]/20' : 
                      'bg-[#a3aac4]/10 text-[#a3aac4] border-[#a3aac4]/20'
                    }`}>
                      {org.subscription?.planId?.toUpperCase() || 'STARTUP'}
                    </span>
                    {org.ruc && <span className="text-[10px] text-[#85adff] font-bold bg-[#85adff]/10 px-2 py-0.5 rounded border border-[#85adff]/20">RUC: {org.ruc}</span>}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleOpenEditOrg(org)}
                className="p-2 hover:bg-[#85adff]/10 text-[#a3aac4] hover:text-[#85adff] rounded-xl transition-all"
              >
                <MoreVertical size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#060e20]/40 p-3 rounded-2xl border border-[#40485d]/20">
                <p className="text-[10px] uppercase font-bold text-[#a3aac4] mb-1">Usuarios</p>
                <p className="text-lg font-black text-[#dee5ff]">{org.users.length} <span className="text-xs text-[#a3aac4]/50 font-normal">/ {org.subscription?.maxUsers || 5}</span></p>
              </div>
              <div className="bg-[#060e20]/40 p-3 rounded-2xl border border-[#40485d]/20">
                <p className="text-[10px] uppercase font-bold text-[#a3aac4] mb-1">Salud Org</p>
                <div className="flex items-center gap-2">
                  <HeartPulse size={16} className="text-[#4ADE80]" />
                  <p className="text-sm font-bold text-[#dee5ff]">{calculateHealthScore(org)}</p>
                </div>
              </div>
            </div>

            <div className="mb-6 flex-grow">
              <p className="text-[10px] uppercase font-bold text-[#a3aac4] mb-2 tracking-widest">Módulos Activos</p>
              <div className="flex flex-wrap gap-2">
                {(org.subscription?.activeModules || []).map(m => (
                  <span key={m} className="px-2 py-1 bg-[#141f38] border border-[#40485d]/30 text-[#dee5ff] text-[10px] font-bold rounded-lg uppercase tracking-tight">
                    {m}
                  </span>
                ))}
                {(!org.subscription?.activeModules || org.subscription.activeModules.length === 0) && (
                  <span className="text-[10px] text-[#a3aac4]/40 italic">Ningún módulo activo</span>
                )}
              </div>
            </div>

            {/* Se eliminó el botón de suplantación */}
          </div>
        ))}
      </div>

      {/* --- MODAL: NUEVA ORGANIZACIÓN --- */}
      {isNewOrgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#091328] border border-[#40485d]/50 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden relative">
            {isSaving && (
              <div className="absolute inset-0 z-[60] bg-[#060e20]/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[#85adff]/20 border-t-[#85adff] rounded-full animate-spin"></div>
                  <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#85adff] animate-pulse" size={24} />
                </div>
                <p className="mt-4 text-[#85adff] font-bold tracking-[0.3em] text-[10px] uppercase animate-pulse">
                  Creando organización...
                </p>
              </div>
            )}
            {/* CABECERA FIJA */}
            <div className="p-8 border-b border-[#40485d]/30 flex justify-between items-center bg-[#060e20]/90 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#85adff]/10 rounded-2xl flex items-center justify-center text-[#85adff]">
                  <Building2 size={24} />
                </div>
                <div>
                  <p className="text-xs text-[#a3aac4] font-medium uppercase tracking-widest leading-none mb-1">Nueva Organización</p>
                  <h2 className="text-2xl font-black text-[#dee5ff] leading-none">{newOrgData.name || 'Registro de Empresa'}</h2>
                </div>
              </div>
              <button onClick={() => setIsNewOrgModalOpen(false)} className="p-3 text-[#a3aac4] hover:text-[#fbabff] transition-all">
                <X size={24} />
              </button>
            </div>

            {/* CONTENIDO DESPLAZABLE */}
            <form onSubmit={handleCreateOrg} className="flex-grow overflow-y-auto custom-scrollbar p-8">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Columna Izquierda: Datos y Plan */}
                <div className="lg:col-span-3 space-y-10">
                  {/* Datos Básicos */}
                  <section className="space-y-6">
                    <h3 className="text-sm font-black text-[#85adff] uppercase tracking-[0.2em] flex items-center gap-2">
                      <Box size={16} /> Información General
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold text-[#a3aac4] uppercase ml-1">Razón Social</label>
                        <input 
                          required type="text" value={newOrgData.name} 
                          onChange={e => setNewOrgData({...newOrgData, name: e.target.value})}
                          placeholder="Ej. TechCorp S.A.C"
                          className="w-full bg-[#060e20] border border-[#40485d]/30 text-[#dee5ff] rounded-2xl px-5 py-4 text-sm focus:border-[#85adff]/50 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#a3aac4] uppercase ml-1">RUC</label>
                        <input 
                          type="text" value={newOrgData.ruc} 
                          onChange={e => setNewOrgData({...newOrgData, ruc: e.target.value})}
                          placeholder="20123456789"
                          className="w-full bg-[#060e20] border border-[#40485d]/30 text-[#dee5ff] rounded-2xl px-5 py-4 text-sm focus:border-[#85adff]/50 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#a3aac4] uppercase ml-1">Dirección Fiscal</label>
                        <input 
                          type="text" value={newOrgData.address} 
                          onChange={e => setNewOrgData({...newOrgData, address: e.target.value})}
                          className="w-full bg-[#060e20] border border-[#40485d]/30 text-[#dee5ff] rounded-2xl px-5 py-4 text-sm focus:border-[#85adff]/50 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Planes y Límite */}
                  <section className="space-y-6 bg-[#060e20]/30 p-6 rounded-[2rem] border border-[#40485d]/20">
                    <h3 className="text-sm font-black text-[#fbabff] uppercase tracking-[0.2em] flex items-center gap-2">
                      <HeartPulse size={16} /> Plan & Capacidad
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(SUBSCRIPTION_PLANS).map(([id, plan]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleSetPlan(id, plan, setNewOrgData)}
                          className={`p-4 rounded-2xl border text-left transition-all ${newOrgData.planId === id ? 'bg-[#85adff]/10 border-[#85adff]/50 ring-1 ring-[#85adff]/50' : 'bg-[#141f38]/50 border-[#40485d]/20 hover:border-[#40485d]/50'}`}
                        >
                          <p className={`text-[10px] font-black uppercase mb-1 ${newOrgData.planId === id ? 'text-[#85adff]' : 'text-[#a3aac4]'}`}>{plan.name}</p>
                          <p className="text-white text-xs font-bold">{plan.limits.users} Users</p>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[#40485d]/10">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-[#a3aac4] uppercase">Límite de Usuarios Manual</label>
                        <span className="text-lg font-black text-[#fbabff]">{newOrgData.maxUsers}</span>
                      </div>
                      <input 
                        type="range" min="1" max="500" step="1"
                        value={newOrgData.maxUsers} 
                        onChange={e => setNewOrgData({...newOrgData, maxUsers: Number(e.target.value)})}
                        className="w-full h-1.5 bg-[#091328] rounded-lg appearance-none cursor-pointer accent-[#fbabff]"
                      />
                    </div>
                  </section>

                  {/* Cuenta de Administrador */}
                  <section className="space-y-6 bg-[#f0f7ff] p-6 rounded-[2rem] border border-[#85adff]/30 shadow-xl">
                    <p className="text-[10px] font-black text-[#5676b8] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                      <Mail size={14} /> Cuenta de Administrador
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#5676b8]/70 uppercase ml-1">Nombre Completo</label>
                        <input 
                          required type="text" placeholder="Primer Admin" 
                          value={newOrgData.adminName} onChange={e => setNewOrgData({...newOrgData, adminName: e.target.value})}
                          className="w-full bg-white border border-[#85adff]/30 text-[#060e20] rounded-xl px-4 py-3 text-sm focus:border-[#85adff] outline-none transition-all placeholder:text-[#5676b8]/30" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#5676b8]/70 uppercase ml-1">Correo Corporativo</label>
                        <input 
                          required type="email" placeholder="admin@empresa.com" 
                          value={newOrgData.adminEmail} onChange={e => setNewOrgData({...newOrgData, adminEmail: e.target.value})}
                          className="w-full bg-white border border-[#85adff]/30 text-[#060e20] rounded-xl px-4 py-3 text-sm focus:border-[#85adff] outline-none transition-all placeholder:text-[#5676b8]/30" 
                        />
                      </div>
                    </div>
                    <p className="text-[10px] text-[#5676b8]/50 italic text-center">Se enviará automáticamente un enlace de activación de contraseña a este correo.</p>
                  </section>
                </div>

                {/* Columna Derecha: Módulos */}
                <div className="lg:col-span-2 space-y-8 flex flex-col pt-2">
                  <section className="space-y-6 flex-grow">
                    <h3 className="text-sm font-black text-[#4ADE80] uppercase tracking-[0.2em] flex items-center gap-2">
                      <Box size={16} /> Módulos Incluidos
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {AVAILABLE_MODULES.map(module => {
                        const isActive = newOrgData.activeModules.includes(module.id);
                        return (
                          <div
                            key={module.id}
                            onClick={() => handleToggleModule(module.id, setNewOrgData)}
                            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 group ${isActive ? 'bg-[#4ADE80]/10 border-[#4ADE80]/40 text-[#4ADE80] shadow-[0_0_15px_rgba(74,222,128,0.05)]' : 'bg-[#060e20]/40 border-[#40485d]/20 text-[#a3aac4] hover:border-[#40485d]/50'}`}
                          >
                            <div className="flex items-center gap-3">
                              <Box size={18} className={isActive ? 'animate-pulse' : 'opacity-40'} />
                              <span className="text-sm font-bold tracking-tight">{module.name}</span>
                            </div>
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isActive ? 'bg-[#4ADE80] text-[#060e20] scale-110' : 'bg-[#091328] border border-[#40485d]/30 group-hover:border-[#40485d]/60'}`}>
                              {isActive && <Check size={14} strokeWidth={4} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* PIE DE PÁGINA (Botón de Envío) */}
                  <div className="pt-8">
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="w-full py-6 bg-[#85adff] text-[#060e20] font-black rounded-2xl shadow-xl shadow-[#85adff]/10 hover:bg-[#a3c4ff] hover:shadow-[#85adff]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-[#060e20] border-t-transparent animate-spin rounded-full"></div>
                          Iniciando...
                        </>
                      ) : (
                        <>
                          <Save size={20} /> Crear Organización
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDITAR ORGANIZACIÓN (UNIFICADO) --- */}
      {isEditOrgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-[#091328] border border-[#40485d]/50 rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden relative">
            {(isSaving || isInviting) && (
              <div className="absolute inset-0 z-[60] bg-[#060e20]/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-[#85adff]/20 border-t-[#85adff] rounded-full animate-spin"></div>
                  <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#85adff] animate-pulse" size={24} />
                </div>
                <p className="mt-4 text-[#85adff] font-bold tracking-[0.3em] text-[10px] uppercase animate-pulse">
                  Procesando cambios...
                </p>
              </div>
            )}
            {/* CABECERA FIJA */}
            <div className="p-8 border-b border-[#40485d]/30 flex justify-between items-center bg-[#060e20]/90 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#85adff]/10 rounded-2xl flex items-center justify-center text-[#85adff]">
                  <Building2 size={24} />
                </div>
                <div>
                  <p className="text-xs text-[#a3aac4] font-medium uppercase tracking-widest">{selectedOrg?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleDeleteOrg} className="p-3 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all" title="Eliminar Organización">
                  <Trash2 size={20} />
                </button>
                <button onClick={() => setIsEditOrgModalOpen(false)} className="p-3 text-[#a3aac4] hover:text-[#fbabff] transition-all">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* CONTENIDO DESPLAZABLE */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-8">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Columna Izquierda: Datos y Plan */}
                <div className="lg:col-span-3 space-y-10">
                  {/* Datos Básicos */}
                  <section className="space-y-6">
                    <h3 className="text-sm font-black text-[#85adff] uppercase tracking-[0.2em] flex items-center gap-2">
                      <Box size={16} /> Información General
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#a3aac4] uppercase ml-1">Razón Social</label>
                        <input 
                          type="text" value={editOrgState.name} 
                          onChange={e => setEditOrgState({...editOrgState, name: e.target.value})}
                          className="w-full bg-[#060e20] border border-[#40485d]/30 text-[#dee5ff] rounded-2xl px-5 py-4 text-sm focus:border-[#85adff]/50 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#a3aac4] uppercase ml-1">RUC</label>
                        <input 
                          type="text" value={editOrgState.ruc} 
                          onChange={e => setEditOrgState({...editOrgState, ruc: e.target.value})}
                          className="w-full bg-[#060e20] border border-[#40485d]/30 text-[#dee5ff] rounded-2xl px-5 py-4 text-sm focus:border-[#85adff]/50 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold text-[#a3aac4] uppercase ml-1">Dirección Fiscal</label>
                        <input 
                          type="text" value={editOrgState.address} 
                          onChange={e => setEditOrgState({...editOrgState, address: e.target.value})}
                          className="w-full bg-[#060e20] border border-[#40485d]/30 text-[#dee5ff] rounded-2xl px-5 py-4 text-sm focus:border-[#85adff]/50 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Planes y Límite */}
                  <section className="space-y-6 bg-[#060e20]/30 p-6 rounded-[2rem] border border-[#40485d]/20">
                    <h3 className="text-sm font-black text-[#fbabff] uppercase tracking-[0.2em] flex items-center gap-2">
                      <HeartPulse size={16} /> Plan & Capacidad
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(SUBSCRIPTION_PLANS).map(([id, plan]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleSetPlan(id, plan, setEditOrgState)}
                          className={`p-4 rounded-2xl border text-left transition-all ${editOrgState.planId === id ? 'bg-[#85adff]/10 border-[#85adff]/50 ring-1 ring-[#85adff]/50' : 'bg-[#141f38]/50 border-[#40485d]/20 hover:border-[#40485d]/50'}`}
                        >
                          <p className={`text-[10px] font-black uppercase mb-1 ${editOrgState.planId === id ? 'text-[#85adff]' : 'text-[#a3aac4]'}`}>{plan.name}</p>
                          <p className="text-white text-xs font-bold">{plan.limits.users} Users</p>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-[#40485d]/10">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-[#a3aac4] uppercase">Límite de Usuarios Manual</label>
                        <span className="text-lg font-black text-[#fbabff]">{editOrgState.maxUsers}</span>
                      </div>
                      <input 
                        type="range" min="1" max="500" step="1"
                        value={editOrgState.maxUsers} 
                        onChange={e => setEditOrgState({...editOrgState, maxUsers: Number(e.target.value)})}
                        className="w-full h-1.5 bg-[#091328] rounded-lg appearance-none cursor-pointer accent-[#fbabff]"
                      />
                    </div>
                  </section>

                  {/* Lista de Usuarios */}
                  <section className="space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                      <Users size={16} /> Usuarios Vinculados
                    </h3>
                    <div className="bg-[#060e20]/50 rounded-2xl border border-[#40485d]/20 overflow-hidden">
                      {selectedOrg?.users.length === 0 ? (
                        <div className="p-8 text-center text-[#a3aac4] text-xs">No hay usuarios vinculados.</div>
                      ) : (
                        <div className="divide-y divide-[#40485d]/10">
                          {selectedOrg?.users.map(u => (
                            <div key={u.id} className="p-4 flex items-center justify-between hover:bg-[#85adff]/5 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#85adff] to-[#fbabff] flex items-center justify-center text-[#060e20] text-[10px] font-black">
                                  {u.name.substring(0,2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-[#dee5ff]">{u.name}</p>
                                  <p className="text-[10px] text-[#a3aac4] flex items-center gap-1">
                                    {u.email} • 
                                    <span className={`font-bold ${u.role === 'admin' ? 'text-[#fbabff]' : 'text-[#85adff]'}`}>
                                      {u.role === 'admin' ? 'Administrador' : 'Usuario'}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                {u.status === 'pending' && (
                                  <button onClick={() => copyInviteLink(u.inviteToken)} className="text-[#fbabff] hover:underline text-[10px] font-bold">Copy Link</button>
                                )}
                                <button onClick={() => adminRemoveUser(u.id)} className="p-2 text-[#a3aac4] hover:text-red-400 transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Invitación por Correo */}
                    <form onSubmit={handleAddUser} className="bg-[#f0f7ff] p-6 rounded-[2rem] border border-[#85adff]/30 space-y-4 shadow-xl">
                      <p className="text-[10px] font-black text-[#5676b8] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <Mail size={14} /> Invitar Administrador
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                          required type="text" placeholder="Nombre completo" 
                          value={newUserInOrg.name} onChange={e => setNewUserInOrg({...newUserInOrg, name: e.target.value})}
                          className="bg-white border border-[#85adff]/30 text-[#060e20] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#85adff] placeholder:text-[#5676b8]/30" 
                        />
                        <input 
                          required type="email" placeholder="Correo corporativo" 
                          value={newUserInOrg.email} onChange={e => setNewUserInOrg({...newUserInOrg, email: e.target.value})}
                          className="bg-white border border-[#85adff]/30 text-[#060e20] rounded-xl px-4 py-3 text-xs outline-none focus:border-[#85adff] placeholder:text-[#5676b8]/30" 
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={isInviting}
                        className="w-full py-4 bg-[#85adff] text-[#060e20] rounded-xl text-xs font-black hover:bg-[#a6c3ff] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        {isInviting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#060e20] border-t-transparent animate-spin rounded-full"></div>
                            Enviando Invitación por Correo...
                          </>
                        ) : (
                          <>
                            <Send size={14} /> Enviar Enlace de Activación
                          </>
                        )}
                      </button>
                    </form>
                  </section>
                </div>

                {/* Columna Derecha: Módulos */}
                <div className="lg:col-span-2 space-y-8 flex flex-col pt-2">
                  <section className="space-y-6 flex-grow">
                    <h3 className="text-sm font-black text-[#4ADE80] uppercase tracking-[0.2em] flex items-center gap-2">
                      <Box size={16} /> Control de Módulos
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {AVAILABLE_MODULES.map(module => {
                        const isActive = editOrgState.activeModules.includes(module.id);
                        return (
                          <div
                            key={module.id}
                            onClick={() => handleToggleModule(module.id, setEditOrgState)}
                            className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 group ${isActive ? 'bg-[#4ADE80]/10 border-[#4ADE80]/40 text-[#4ADE80] shadow-[0_0_15px_rgba(74,222,128,0.05)]' : 'bg-[#060e20]/40 border-[#40485d]/20 text-[#a3aac4] hover:border-[#40485d]/50'}`}
                          >
                            <div className="flex items-center gap-3">
                              <Box size={18} className={isActive ? 'animate-pulse' : 'opacity-40'} />
                              <span className="text-sm font-bold tracking-tight">{module.name}</span>
                            </div>
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isActive ? 'bg-[#4ADE80] text-[#060e20] scale-110' : 'bg-[#091328] border border-[#40485d]/30 group-hover:border-[#40485d]/60'}`}>
                              {isActive && <Check size={14} strokeWidth={4} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                </div>
              </div>
            </div>

            {/* PIE DE PÁGINA FIJO */}
            <div className="bg-[#060e20] p-8 border-t border-[#40485d]/30 space-y-4 rounded-b-[2.5rem]">
              <button 
                onClick={handleSaveFullOrg}
                disabled={isSaving}
                className="w-full py-6 bg-[#4ADE80] text-[#060e20] font-black rounded-2xl shadow-xl shadow-[#4ADE80]/10 hover:bg-[#63e695] hover:shadow-[#4ADE80]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#060e20] border-t-transparent animate-spin rounded-full"></div>
                    Guardando Cambios...
                  </>
                ) : (
                  <>
                    <Save size={20} /> Guardar Todos los Cambios
                  </>
                )}
              </button>
              <p className="text-[10px] text-[#a3aac4] text-center font-bold uppercase tracking-widest opacity-60">Sincronización segura con base de datos real</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
