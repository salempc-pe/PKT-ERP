import { useState, useMemo } from 'react';
import { Search, Building2, Users, Plus, Box, Check, X, HeartPulse, Trash2, Save, Send, ShieldCheck, Mail, Loader2, ShieldAlert, Settings, Copy } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { calculateHealthScore } from '../../../hooks/useAdminAnalytics';
import LoadingScreen from '../../../components/LoadingScreen';

const AVAILABLE_MODULES = [
  { id: 'crm', name: 'CRM y Ventas' },
  { id: 'inventory', name: 'Inventario' },
  { id: 'sales', name: 'Ventas y Facturación' },
  { id: 'finance', name: 'Contabilidad' },
  { id: 'calendar', name: 'Agenda y Citas' },
  { id: 'projects', name: 'Gestión de Proyectos' },
  { id: 'purchases', name: 'Compras y Proveedores' },
  { id: 'realestate', name: 'Inmobiliaria / Terrenos' },
  { id: 'payroll', name: 'Nóminas y RRHH' }
];

export default function AdminClients() {
  const { 
    allOrganizations: organizations,
    allUsers,
    adminCreateOrg, adminRemoveUser, 
    adminUpdateFullOrg, adminCreateUser, 
    SUBSCRIPTION_PLANS, adminRemoveOrg,
    impersonateUser
  } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isNewOrgModalOpen, setIsNewOrgModalOpen] = useState(false);
  const [isEditOrgModalOpen, setIsEditOrgModalOpen] = useState(false);
  
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [generatedInviteLink, setGeneratedInviteLink] = useState(null);


  // Forms State
  const [newOrgData, setNewOrgData] = useState({ 
    name: '', 
    ruc: '', 
    address: '', 
    maxUsers: 5,
    planId: 'startup',
    activeModules: [],
    adminName: '',
    adminEmail: '',
    logoUrl: '',
    monthlyFee: 0
  });
  
  // Unified Edit State
  const [editOrgState, setEditOrgState] = useState({
    name: '',
    ruc: '',
    address: '',
    maxUsers: 5,
    planId: 'startup',
    activeModules: [],
    logoUrl: '',
    monthlyFee: 0
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
      const createdOrg = await adminCreateOrg(newOrgData);
      setNewOrgData({ 
        name: '', ruc: '', address: '', maxUsers: 5, 
        planId: 'startup', activeModules: [], 
        adminName: '', adminEmail: '',
        logoUrl: '', monthlyFee: 0 
      });
      
      if (createdOrg.adminInviteUrl) {
        setGeneratedInviteLink(createdOrg.adminInviteUrl);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(createdOrg.adminInviteUrl).catch(err => console.error("Error al copiar:", err));
        }
      } else {
        setIsNewOrgModalOpen(false);
      }
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
      activeModules: org.subscription?.activeModules || [],
      logoUrl: org.logoUrl || '',
      monthlyFee: org.subscription?.monthlyFee || 0
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
    const result = await adminCreateUser(selectedOrg.id, editOrgState.name, newUserInOrg);
    setIsInviting(false);
    
    if (result && !result.success) {
      alert(result.error);
      return;
    }

    if (result && result.inviteUrl) {
      setGeneratedInviteLink(result.inviteUrl);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(result.inviteUrl).catch(err => console.error("Error al copiar:", err));
      }
    }

    setNewUserInOrg({ name: '', email: '', role: 'admin' });
  };

  const copyInviteLink = (token) => {
    const inviteUrl = window.location.origin + '/setup-password?token=' + token;
    navigator.clipboard.writeText(inviteUrl);
    alert('Enlace de invitación copiado al portapapeles');
  };

  const handleLogoUpload = async (file, setState) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        canvas.width = 500; // Standard size for logos
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        
        // Draw centered and cropped to square
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;
        ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, 500, 500);
        
        const dataUrl = canvas.toDataURL('image/png');
        setState(prev => ({ ...prev, logoUrl: dataUrl }));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };



  return (
    <div className="space-y-8 animate-fade-in relative pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" size={18} />
            <input 
              type="text" 
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[var(--color-surface-container-low)] border border-[#40485d]/30 text-[var(--color-on-surface)] rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#6B4FD8]/50 w-64 transition-all"
            />
          </div>
          <button 
            onClick={() => setIsNewOrgModalOpen(true)}
            className="group bg-[#6B4FD8] hover:bg-[#9E8AEB] text-white flex items-center gap-2 px-6 py-3 rounded-full font-black text-sm transition-all shadow-xl shadow-[#6B4FD8]/10 hover:scale-105 active:scale-95"
          >
            <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
            <span>Nueva Organización</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredOrgs.map((org) => (
          <div key={org.id} className="bg-[var(--color-surface-container-low)]/60 border border-[#40485d]/30 rounded-3xl p-6 transition-all backdrop-blur-md flex flex-col h-full group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#6B4FD8]/10 rounded-2xl flex items-center justify-center text-[#6B4FD8] group-hover:bg-[#6B4FD8]/20 transition-colors overflow-hidden">
                  {org.logoUrl ? (
                    <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={24} />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-on-surface)] flex items-center gap-3">
                    {org.name}
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full bg-[#4ADE80]/10 text-[#4ADE80]">Activado</span>
                  </h3>
                  <div className="flex gap-2 items-center flex-wrap mt-1">
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-wider font-semibold">ID: {org.id}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      org.subscription?.planId === 'enterprise' ? 'bg-[#2E8B57]/10 text-[#2E8B57] border-[#2E8B57]/20' : 
                      org.subscription?.planId === 'business' ? 'bg-[#6B4FD8]/10 text-[#6B4FD8] border-[#6B4FD8]/20' : 
                      'bg-[#a3aac4]/10 text-[var(--color-on-surface-variant)] border-[#a3aac4]/20'
                    }`}>
                      {org.subscription?.planId?.toUpperCase() || 'STARTUP'}
                    </span>
                    {org.ruc && <span className="text-[10px] text-[#6B4FD8] font-bold bg-[#6B4FD8]/10 px-2 py-0.5 rounded border border-[#6B4FD8]/20">RUC: {org.ruc}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 group-hover:bg-white/[0.05] transition-colors">
                <p className="text-[10px] uppercase font-bold text-[var(--color-on-surface-variant)] mb-1">Usuarios</p>
                <p className="text-lg font-black text-[var(--color-on-surface)]">{org.users.length} <span className="text-xs text-[var(--color-on-surface-variant)]/50 font-normal">/ {org.subscription?.maxUsers || 5}</span></p>
              </div>
              <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 group-hover:bg-white/[0.05] transition-colors">
                <p className="text-[10px] uppercase font-bold text-[var(--color-on-surface-variant)] mb-1">Salud Org</p>
                <div className="flex items-center gap-2">
                  <HeartPulse size={16} className="text-[#4ADE80]" />
                  <p className="text-sm font-bold text-[var(--color-on-surface)]">{calculateHealthScore(org)}</p>
                </div>
              </div>
              <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 group-hover:bg-white/[0.05] transition-colors">
                <p className="text-[10px] uppercase font-bold text-[var(--color-on-surface-variant)] mb-1">Cuota</p>
                <p className="text-sm font-black text-[#2E8B57]">S/. {org.subscription?.monthlyFee || 0}</p>
              </div>
            </div>

            <div className="mb-6 flex-grow">
              <p className="text-[10px] uppercase font-bold text-[var(--color-on-surface-variant)] mb-2 tracking-widest">Módulos Activos</p>
              <div className="flex flex-wrap gap-2">
                {(org.subscription?.activeModules || []).map(m => (
                  <span key={m} className="px-2 py-1 bg-[var(--color-surface-container)] border border-white/10 text-[var(--color-on-surface)] text-[10px] font-bold rounded-lg uppercase tracking-tight">
                    {m}
                  </span>
                ))}
                {(!org.subscription?.activeModules || org.subscription.activeModules.length === 0) && (
                  <span className="text-[10px] text-[var(--color-on-surface-variant)]/40 italic">Ningún módulo activo</span>
                )}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="pt-4 border-t border-[#40485d]/10 grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleOpenEditOrg(org)}
                className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-[#6B4FD8]/10 text-[var(--color-on-surface-variant)] hover:text-[#6B4FD8] rounded-xl text-xs font-black transition-all border border-white/5 hover:border-[#6B4FD8]/30"
              >
                <Settings size={14} />
                Config
              </button>


              
              <button 
                onClick={() => {
                  const mainAdmin = org.users.find(u => u.role === 'admin' && u.status === 'active') || org.users[0];
                  if (mainAdmin) {
                    impersonateUser(mainAdmin);
                  } else {
                    alert("No hay usuarios activos en esta organización para suplantar.");
                  }
                }}
                className="flex items-center justify-center gap-2 py-3 bg-[#6B4FD8]/5 hover:bg-[#6B4FD8]/10 text-[#6B4FD8] rounded-xl text-xs font-black transition-all border border-[#6B4FD8]/10 hover:border-[#6B4FD8]/30"
              >
                <ShieldAlert size={14} />
                Admin
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL: NUEVA ORGANIZACIÓN --- */}
      {isNewOrgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white border border-slate-200 rounded-[2rem] w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden relative">
            {isSaving && (
              <div className="absolute inset-0 z-[60] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
                <LoadingScreen fullScreen={false} message="Creando organización..." />
              </div>
            )}
            {/* CABECERA FIJA */}
            <div className="px-8 py-5 flex justify-between items-center bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#7c7cf5] shadow-sm border border-slate-100">
                  <Building2 size={20} />
                </div>
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">{newOrgData.name || 'Nueva Organización'}</h2>
              </div>
              <button 
                onClick={() => {
                  setIsNewOrgModalOpen(false);
                  setGeneratedInviteLink(null);
                }} 
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {generatedInviteLink ? (
              <div className="p-12 space-y-8 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 min-h-[400px]">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                  <Check size={40} strokeWidth={3} />
                </div>
                <div className="text-center space-y-2 max-w-md">
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">¡Éxito Total!</h3>
                  <p className="text-sm text-slate-500 font-medium">
                    La organización y el administrador han sido creados correctamente. 
                    Copia el enlace de activación y compártelo para completar el registro.
                  </p>
                </div>

                <div className="w-full max-w-lg bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center gap-4 group">
                  <div className="flex-grow">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Enlace de Activación</p>
                    <input 
                      readOnly 
                      value={generatedInviteLink}
                      className="bg-transparent border-none text-xs font-mono text-[#6B4FD8] w-full outline-none font-bold"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(generatedInviteLink);
                      alert("¡Enlace copiado!");
                    }}
                    className="p-3 bg-[#6B4FD8] text-white rounded-xl hover:bg-[#7c7cf5] transition-all shadow-lg shadow-[#6B4FD8]/20"
                  >
                    <Copy size={20} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setIsNewOrgModalOpen(false);
                    setGeneratedInviteLink(null);
                  }}
                  className="px-10 py-4 rounded-xl font-black bg-slate-800 text-white hover:bg-slate-700 transition-all uppercase text-xs tracking-[0.2em]"
                >
                  Continuar
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateOrg} className="flex-grow overflow-y-auto custom-scrollbar p-8">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Columna Izquierda: Datos y Plan */}
                <div className="lg:col-span-3 space-y-10">
                  {/* Datos Básicos */}
                  {/* Datos Básicos */}
                  <section className="space-y-6">
                    <h3 className="text-[10px] font-black text-[#7c7cf5] uppercase tracking-[0.2em] flex items-center gap-2">
                      <Box size={14} /> INFORMACIÓN GENERAL
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">RAZÓN SOCIAL</label>
                        <input 
                          required type="text" value={newOrgData.name} 
                          onChange={e => setNewOrgData({...newOrgData, name: e.target.value})}
                          placeholder="Ej. TechCorp S.A.C"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-5 py-4 text-sm focus:border-[#7c7cf5] focus:bg-white outline-none transition-all shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">RUC</label>
                        <input 
                          type="text" value={newOrgData.ruc} 
                          onChange={e => setNewOrgData({...newOrgData, ruc: e.target.value})}
                          placeholder="20123456789"
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-5 py-4 text-sm focus:border-[#7c7cf5] focus:bg-white outline-none transition-all shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">DIRECCIÓN FISCAL</label>
                        <input 
                          type="text" value={newOrgData.address} 
                          onChange={e => setNewOrgData({...newOrgData, address: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-5 py-4 text-sm focus:border-[#7c7cf5] focus:bg-white outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Logo de la Empresa */}
                  <section className="space-y-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-[10px] font-black text-[#7c7cf5] uppercase tracking-[0.2em] flex items-center gap-2">
                      <Settings size={14} /> LOGO DE LA EMPRESA
                    </h3>
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-white border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center relative group shadow-sm">
                        {newOrgData.logoUrl ? (
                          <img src={newOrgData.logoUrl} alt="Logo preview" className="w-full h-full object-cover" />
                        ) : (
                          <Building2 size={32} className="text-slate-200" />
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <Plus size={24} className="text-white" />
                          <input 
                            type="file" accept="image/*" className="hidden" 
                            onChange={(e) => handleLogoUpload(e.target.files[0], setNewOrgData)} 
                          />
                        </label>
                      </div>
                      <div className="flex-grow space-y-1">
                        <p className="text-xs font-bold text-slate-700">Logo Corporativo</p>
                        <p className="text-[10px] text-slate-400 leading-relaxed">Formato cuadrado (500x500px).</p>
                        <button 
                          type="button"
                          onClick={() => document.querySelector('input[type="file"]').click()}
                          className="mt-1 text-[10px] font-black text-[#7c7cf5] uppercase hover:text-[#9e9efb] transition-colors"
                        >
                          SELECCIONAR IMAGEN
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Planes y Límite */}
                  <section className="space-y-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-[10px] font-black text-[#2E8B57] uppercase tracking-[0.2em] flex items-center gap-2">
                      <HeartPulse size={14} /> PLAN & CAPACIDAD
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(SUBSCRIPTION_PLANS).map(([id, plan]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleSetPlan(id, plan, setNewOrgData)}
                          className={`p-3 rounded-xl border text-left transition-all ${newOrgData.planId === id ? 'bg-white border-[#6B4FD8] ring-1 ring-[#6B4FD8]' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                        >
                          <p className={`text-[10px] font-black uppercase mb-0.5 ${newOrgData.planId === id ? 'text-[#6B4FD8]' : 'text-slate-400'}`}>{plan.name}</p>
                          <p className="text-slate-700 text-[10px] font-bold">{plan.limits.users} Users</p>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Límite Usuarios</label>
                        <span className="text-base font-black text-[#2E8B57]">{newOrgData.maxUsers}</span>
                      </div>
                      <input 
                        type="range" min="1" max="500" step="1"
                        value={newOrgData.maxUsers} 
                        onChange={e => setNewOrgData({...newOrgData, maxUsers: Number(e.target.value)})}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2E8B57]"
                      />
                    </div>

                    {/* Cuota Mensual */}
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Cuota Mensual</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">S/.</span>
                          <input 
                            type="number" 
                            value={newOrgData.monthlyFee} 
                            onChange={e => setNewOrgData({...newOrgData, monthlyFee: e.target.value})}
                            className="bg-white border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-sm focus:border-[#2E8B57] outline-none w-28 font-black"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Cuenta de Administrador */}
                  <section className="space-y-6 bg-slate-50 border border-slate-100 p-6 rounded-3xl shadow-sm">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                      <Mail size={12} /> CUENTA DE ADMINISTRADOR
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Nombre Completo</label>
                        <input 
                          required type="text" placeholder="Primer Admin" 
                          value={newOrgData.adminName} onChange={e => setNewOrgData({...newOrgData, adminName: e.target.value})}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-[10px] focus:border-[#6B4FD8] outline-none shadow-sm" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Correo Corporativo</label>
                        <input 
                          required type="email" placeholder="admin@empresa.com" 
                          value={newOrgData.adminEmail} onChange={e => setNewOrgData({...newOrgData, adminEmail: e.target.value})}
                          className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-[10px] focus:border-[#6B4FD8] outline-none shadow-sm" 
                        />
                      </div>
                    </div>
                  </section>
                </div>

                {/* Columna Derecha: Módulos */}
                <div className="lg:col-span-2 space-y-8 flex flex-col pt-2">
                  <section className="space-y-6 flex-grow">
                    <h3 className="text-[10px] font-black text-[#4ADE80] uppercase tracking-[0.2em] flex items-center gap-2">
                      <Box size={14} /> MÓDULOS INCLUIDOS
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {AVAILABLE_MODULES.map(module => {
                        const isActive = newOrgData.activeModules.includes(module.id);
                        return (
                          <div
                            key={module.id}
                            onClick={() => handleToggleModule(module.id, setNewOrgData)}
                            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 ${isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'}`}
                          >
                            <div className="flex items-center gap-3">
                              <Box size={18} className={isActive ? 'text-green-500' : 'text-slate-300'} />
                              <span className="text-xs font-bold">{module.name}</span>
                            </div>
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isActive ? 'bg-green-500 text-white shadow-sm' : 'bg-white border border-slate-200'}`}>
                              {isActive && <Check size={14} strokeWidth={4} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  {/* PIE DE PÁGINA (Botón de Envío) */}
                  <div className="pt-6">
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="w-full py-4 bg-green-500 text-white font-black rounded-xl shadow-lg shadow-green-200 hover:bg-green-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                          CREANDO...
                        </>
                      ) : (
                        <>
                          <Save size={16} /> Crear Organización
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
          </div>
        </div>
      )}

      {/* --- MODAL: EDITAR ORGANIZACIÓN (UNIFICADO) --- */}
      {isEditOrgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white border border-slate-200 rounded-[2rem] w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden relative">
            {(isSaving || isInviting) && (
              <div className="absolute inset-0 z-[60] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
                <LoadingScreen fullScreen={false} message="Procesando cambios..." />
              </div>
            )}
            {/* CABECERA FIJA */}
            <div className="px-8 py-5 flex justify-between items-center bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#7c7cf5] shadow-sm border border-slate-100">
                  {editOrgState.logoUrl ? (
                    <img src={editOrgState.logoUrl} alt={selectedOrg?.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Building2 size={20} />
                  )}
                </div>
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">{selectedOrg?.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleDeleteOrg} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all" title="Eliminar Organización">
                  <Trash2 size={18} />
                </button>
                <button onClick={() => setIsEditOrgModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                  <X size={20} />
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
                    <h3 className="text-[10px] font-black text-[#7c7cf5] uppercase tracking-[0.2em] flex items-center gap-2">
                      <Box size={14} /> INFORMACIÓN GENERAL
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">RAZÓN SOCIAL</label>
                        <input 
                          type="text" value={editOrgState.name} 
                          onChange={e => setEditOrgState({...editOrgState, name: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-5 py-4 text-sm focus:border-[#7c7cf5] focus:bg-white outline-none transition-all shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">RUC</label>
                        <input 
                          type="text" value={editOrgState.ruc} 
                          onChange={e => setEditOrgState({...editOrgState, ruc: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-5 py-4 text-sm focus:border-[#7c7cf5] focus:bg-white outline-none transition-all shadow-sm"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">DIRECCIÓN FISCAL</label>
                        <input 
                          type="text" value={editOrgState.address} 
                          onChange={e => setEditOrgState({...editOrgState, address: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-5 py-4 text-sm focus:border-[#7c7cf5] focus:bg-white outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Logo de la Empresa (Edit) */}
                  <section className="space-y-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-[10px] font-black text-[#7c7cf5] uppercase tracking-[0.2em] flex items-center gap-2">
                      <Settings size={14} /> LOGO DE LA EMPRESA
                    </h3>
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-white border border-slate-200 rounded-2xl overflow-hidden flex items-center justify-center relative group shadow-sm">
                        {editOrgState.logoUrl ? (
                          <img src={editOrgState.logoUrl} alt="Logo preview" className="w-full h-full object-cover" />
                        ) : (
                          <Building2 size={32} className="text-slate-200" />
                        )}
                        <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                          <Plus size={24} className="text-white" />
                          <input 
                            type="file" accept="image/*" className="hidden" id="logo-upload-edit"
                            onChange={(e) => handleLogoUpload(e.target.files[0], setEditOrgState)} 
                          />
                        </label>
                      </div>
                      <div className="flex-grow space-y-1">
                        <p className="text-xs font-bold text-slate-700">Logo Corporativo</p>
                        <p className="text-[10px] text-slate-400 leading-relaxed">Formato cuadrado (500x500px).</p>
                        <button 
                          type="button"
                          onClick={() => document.getElementById('logo-upload-edit').click()}
                          className="mt-1 text-[10px] font-black text-[#7c7cf5] uppercase hover:text-[#9e9efb] transition-colors"
                        >
                          CAMBIAR IMAGEN
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Planes y Límite */}
                  <section className="space-y-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-[10px] font-black text-[#2E8B57] uppercase tracking-[0.2em] flex items-center gap-2">
                      <HeartPulse size={14} /> PLAN & CAPACIDAD
                    </h3>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(SUBSCRIPTION_PLANS).map(([id, plan]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleSetPlan(id, plan, setEditOrgState)}
                          className={`p-3 rounded-xl border text-left transition-all ${editOrgState.planId === id ? 'bg-white border-[#6B4FD8] ring-1 ring-[#6B4FD8]' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                        >
                          <p className={`text-[10px] font-black uppercase mb-0.5 ${editOrgState.planId === id ? 'text-[#6B4FD8]' : 'text-slate-400'}`}>{plan.name}</p>
                          <p className="text-slate-700 text-[10px] font-bold">{plan.limits.users} Users</p>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Límite Usuarios</label>
                        <span className="text-base font-black text-[#2E8B57]">{editOrgState.maxUsers}</span>
                      </div>
                      <input 
                        type="range" min="1" max="500" step="1"
                        value={editOrgState.maxUsers} 
                        onChange={e => setEditOrgState({...editOrgState, maxUsers: Number(e.target.value)})}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2E8B57]"
                      />
                    </div>

                    {/* Cuota Mensual (Edit) */}
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Cuota Mensual</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">S/.</span>
                          <input 
                            type="number" 
                            value={editOrgState.monthlyFee} 
                            onChange={e => setEditOrgState({...editOrgState, monthlyFee: e.target.value})}
                            className="bg-white border border-slate-200 text-slate-900 rounded-xl pl-9 pr-3 py-2 text-sm focus:border-[#2E8B57] outline-none w-28 font-black"
                          />
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Lista de Usuarios */}
                  <section className="space-y-4 pt-2">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Users size={14} /> USUARIOS VINCULADOS
                    </h3>
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                      {selectedOrg?.users.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-[10px]">No hay usuarios vinculados.</div>
                      ) : (
                        <div className="divide-y divide-slate-50">
                          {selectedOrg?.users.map(u => (
                            <div key={u.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[#7c7cf5] text-[10px] font-black">
                                  {u.name.substring(0,2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-slate-700">{u.name}</p>
                                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                                    {u.email} • 
                                    <span className={`font-bold ${u.role === 'admin' ? 'text-green-600' : 'text-[#7c7cf5]'}`}>
                                      {u.role === 'admin' ? 'Administrador' : 'Usuario'}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                {u.status === 'pending' && (
                                  <button onClick={() => copyInviteLink(u.inviteToken)} className="text-green-600 hover:underline text-[10px] font-bold">Copy Link</button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Invitación por Correo */}
                    {generatedInviteLink ? (
                      <div className="bg-[#2E8B57]/5 border border-[#2E8B57]/20 p-6 rounded-3xl space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className="w-10 h-10 bg-[#2E8B57]/10 rounded-full flex items-center justify-center text-[#2E8B57]">
                            <Check size={20} strokeWidth={3} />
                          </div>
                          <p className="text-xs font-black text-slate-700 uppercase tracking-tight">¡Invitación Lista!</p>
                          <p className="text-[10px] text-slate-500 font-bold">Comparte este enlace para activar la cuenta.</p>
                        </div>
                        
                        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-2">
                          <input 
                            readOnly 
                            value={generatedInviteLink}
                            className="bg-transparent border-none text-[9px] font-mono text-[#6B4FD8] w-full outline-none font-bold"
                          />
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(generatedInviteLink);
                              alert("¡Enlace copiado!");
                            }}
                            className="p-2 text-[#6B4FD8] hover:bg-[#6B4FD8]/10 rounded-lg transition-all"
                          >
                            <Copy size={14} />
                          </button>
                        </div>

                        <button 
                          onClick={() => setGeneratedInviteLink(null)}
                          className="w-full py-2.5 text-[10px] font-black text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-widest"
                        >
                          Cerrar
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleAddUser} className="bg-slate-50 border border-slate-100 p-5 rounded-3xl space-y-4 shadow-sm">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 flex items-center gap-2">
                          <Mail size={12} /> INVITAR ADMINISTRADOR
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input 
                            required type="text" placeholder="Nombre completo" 
                            value={newUserInOrg.name} onChange={e => setNewUserInOrg({...newUserInOrg, name: e.target.value})}
                            className="bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-[10px] outline-none focus:border-[#7c7cf5] shadow-sm" 
                          />
                          <input 
                            required type="email" placeholder="Correo corporativo" 
                            value={newUserInOrg.email} onChange={e => setNewUserInOrg({...newUserInOrg, email: e.target.value})}
                            className="bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-[10px] outline-none focus:border-[#7c7cf5] shadow-sm" 
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={isInviting}
                          className="w-full py-3 bg-[#6B4FD8] text-white rounded-xl text-[10px] font-black hover:bg-[#7c7cf5] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                        >
                          {isInviting ? (
                            <>
                              <div className="w-3 h-3 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                              ENVIANDO...
                            </>
                          ) : (
                            <>
                              <Send size={12} /> ENVIAR ACTIVACIÓN
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </section>
                </div>

                {/* Columna Derecha: Módulos */}
                <div className="lg:col-span-2 space-y-8 flex flex-col pt-2">
                  <section className="space-y-6 flex-grow">
                    <h3 className="text-[10px] font-black text-[#4ade80] uppercase tracking-[0.2em] flex items-center gap-2">
                      <Box size={14} /> CONTROL DE MÓDULOS
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {AVAILABLE_MODULES.map(module => {
                        const isActive = editOrgState.activeModules.includes(module.id);
                        return (
                          <div
                            key={module.id}
                            onClick={() => handleToggleModule(module.id, setEditOrgState)}
                            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 ${isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'}`}
                          >
                            <div className="flex items-center gap-3">
                              <Box size={18} className={isActive ? 'text-green-500' : 'text-slate-300'} />
                              <span className="text-xs font-bold">{module.name}</span>
                            </div>
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isActive ? 'bg-green-500 text-white shadow-sm' : 'bg-white border border-slate-200'}`}>
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

            <div className="bg-slate-50/50 p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-100">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">SINCRONIZACIÓN SEGURA</p>
              <button 
                onClick={handleSaveFullOrg}
                disabled={isSaving}
                className="bg-green-500 text-white font-black rounded-xl shadow-lg shadow-green-200 hover:bg-green-600 hover:scale-105 transition-all active:scale-[0.98] flex items-center justify-center gap-2 px-8 py-3 text-xs uppercase tracking-wider"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                    GUARDANDO...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
