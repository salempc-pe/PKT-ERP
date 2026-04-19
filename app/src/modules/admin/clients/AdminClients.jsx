import { useState, useMemo } from 'react';
import { Search, Building2, Users, MoreVertical, Plus, Box, Check, X, HeartPulse, Trash2 } from 'lucide-react';
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
    getClientUsers, adminUpdateOrgModules, 
    mockOrganizations, adminCreateOrg, adminRemoveUser, 
    adminUpdateOrg, adminCreateUser, adminUpdateOrgPlan, 
    SUBSCRIPTION_PLANS, impersonateUser, adminRemoveOrg
  } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isManageModulesModalOpen, setIsManageModulesModalOpen] = useState(false);
  const [isNewOrgModalOpen, setIsNewOrgModalOpen] = useState(false);
  const [isEditOrgModalOpen, setIsEditOrgModalOpen] = useState(false);
  
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [activeModulesForEdit, setActiveModulesForEdit] = useState([]);

  // Forms State
  const [newOrgData, setNewOrgData] = useState({ name: '', ruc: '', address: '', maxUsers: 5 });
  const [editOrgData, setEditOrgData] = useState({ name: '', ruc: '', address: '', maxUsers: 5 });
  const [newUserInOrg, setNewUserInOrg] = useState({ name: '', email: '', role: 'client' });

  const clientUsers = getClientUsers();

  // Unir organizaciones con sus usuarios de forma reactiva
  const organizationsWithUsers = useMemo(() => {
    return mockOrganizations.map(org => ({
      ...org,
      users: clientUsers.filter(u => u.organizationId === org.id)
    }));
  }, [mockOrganizations, clientUsers]);

  const filteredOrgs = organizationsWithUsers.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (org.ruc && org.ruc.includes(searchTerm)) ||
    org.users.some(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // --- Handlers para Módulos ---
  const handleOpenManageModules = (org) => {
    setSelectedOrg(org);
    setActiveModulesForEdit(org.subscription?.activeModules || []);
    setIsManageModulesModalOpen(true);
  };

  const handleToggleModule = (moduleId) => {
    setActiveModulesForEdit(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleSaveModules = () => {
    if (selectedOrg) {
      adminUpdateOrgModules(selectedOrg.id, activeModulesForEdit);
    }
    setIsManageModulesModalOpen(false);
  };

  // --- Handlers para Organizaciones ---
  const handleCreateOrg = async (e) => {
    e.preventDefault();
    if (!newOrgData.name.trim()) return;
    
    try {
      await adminCreateOrg(newOrgData);
      setNewOrgData({ name: '', ruc: '', address: '', maxUsers: 5 });
      setIsNewOrgModalOpen(false);
    } catch (error) {
      alert("Error al crear la organización: " + error.message);
    }
  };

  const handleOpenEditOrg = (org) => {
    setSelectedOrg(org);
    setEditOrgData({ 
      name: org.name, 
      ruc: org.ruc || '', 
      address: org.address || '',
      maxUsers: org.subscription?.maxUsers || org.maxUsers || 5
    });
    setIsEditOrgModalOpen(true);
  };

  const handleSaveOrgDetails = () => {
    adminUpdateOrg(selectedOrg.id, editOrgData);
  };

  const handleDeleteOrg = () => {
    if (!window.confirm(`¿Eliminar "${selectedOrg?.name}"? Esta acción no se puede deshacer.`)) return;
    adminRemoveOrg(selectedOrg.id);
    setIsEditOrgModalOpen(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUserInOrg.name || !newUserInOrg.email) return;
    
    const result = await adminCreateUser(selectedOrg.id, editOrgData.name, newUserInOrg);
    
    if (result && !result.success) {
      alert(result.error);
      return;
    }

    if (result && result.inviteToken) {
      const inviteUrl = window.location.origin + '/setup-password?token=' + result.inviteToken;
      navigator.clipboard.writeText(inviteUrl);
      alert('¡Usuario creado en Firestore! El enlace de invitación se ha copiado al portapapeles:\n' + inviteUrl);
    }

    setNewUserInOrg({ name: '', email: '', role: 'client' });
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
        <div>
          <h1 className="text-3xl font-black text-[#dee5ff] tracking-tight mb-2">Inquilinos & Organizaciones</h1>
          <p className="text-[#a3aac4] text-sm">Panel de control de empresas y acceso a módulos.</p>
        </div>
        
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
            className="bg-[#85adff] hover:bg-[#a6c3ff] text-[#060e20] flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors"
          >
            <Plus size={18} />
            <span>Nueva Organización</span>
          </button>
        </div>
      </div>

      {/* Grid de Organizaciones */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredOrgs.map((org) => (
          <div key={org.id} className="bg-[#091328]/60 border border-[#40485d]/30 rounded-3xl p-6 transition-all hover:border-[#85adff]/20 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#85adff]/10 rounded-2xl flex items-center justify-center text-[#85adff]">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#dee5ff] flex items-center gap-3">
                    {org.name}
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full bg-[#4ADE80]/10 text-[#4ADE80]">Activado</span>
                  </h3>
                  <div className="flex gap-2 items-center flex-wrap">
                    <p className="text-xs text-[#a3aac4] uppercase tracking-wider font-semibold">ID: {org.id}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      org.subscription?.planId === 'enterprise' ? 'bg-[#fbabff]/10 text-[#fbabff] border-[#fbabff]/20' : 
                      org.subscription?.planId === 'business' ? 'bg-[#85adff]/10 text-[#85adff] border-[#85adff]/20' : 
                      'bg-[#a3aac4]/10 text-[#a3aac4] border-[#a3aac4]/20'
                    }`}>
                      {org.subscription?.planId?.toUpperCase() || 'STARTUP'}
                    </span>
                    {org.ruc && <span className="text-[10px] text-[#85adff] font-bold bg-[#85adff]/10 px-2 py-0.5 rounded border border-[#85adff]/20">RUC: {org.ruc}</span>}
                    {(() => {
                      const health = calculateHealthScore(org);
                      const colors = {
                        'Excellent': 'bg-[#4ADE80]/10 text-[#4ADE80] border-[#4ADE80]/20',
                        'Good': 'bg-amber-400/10 text-amber-400 border-amber-400/20',
                        'At Risk': 'bg-red-400/10 text-red-400 border-red-400/20'
                      };
                      return (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${colors[health]}`}>
                          <HeartPulse size={10} />
                          {health}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#40485d]/10 rounded-2xl bg-[#060e20]/50 p-4 flex-1">
              <h4 className="text-xs uppercase tracking-widest text-[#a3aac4] font-bold mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  Usuarios ({org.users.length})
                </div>
                <span className="text-[10px] text-[#85adff]/50">Límite: {org.subscription?.maxUsers || org.maxUsers || 5}</span>
              </h4>
              <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                {org.users.map(u => (
                  <div key={u.id} className="flex items-center justify-between text-sm group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#141f38] flex items-center justify-center text-[10px] font-bold text-[#85adff]">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <p className="font-semibold text-[#dee5ff] truncate max-w-[120px]">{u.name}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#141f38] text-[#fbabff] border border-[#fbabff]/10">
                      {u.role}
                    </span>
                  </div>
                ))}
                {org.users.length === 0 && <p className="text-xs text-[#a3aac4] italic opacity-50">Sin colaboradores vinculados</p>}
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => handleOpenEditOrg(org)}
                className="flex-1 bg-[#141f38] hover:bg-[#1e2a4a] text-[#dee5ff] py-2.5 rounded-xl text-sm font-bold transition-colors"
              >
                Editar Organización
              </button>
              <button 
                onClick={() => handleOpenManageModules(org)}
                className="flex-1 bg-[#85adff]/10 hover:bg-[#85adff]/20 text-[#85adff] border border-[#85adff]/20 py-2.5 rounded-xl text-sm font-bold transition-colors"
                disabled={org.users.length === 0}
                title={org.users.length === 0 ? "Primero agrega un usuario" : ""}
              >
                Módulos
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL: NUEVA ORGANIZACIÓN --- */}
      {isNewOrgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#091328] border border-[#40485d]/50 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#40485d]/30 flex justify-between items-center bg-[#060e20] rounded-t-3xl">
              <h2 className="text-xl font-black text-[#dee5ff]">Nueva Organización</h2>
              <button onClick={() => setIsNewOrgModalOpen(false)} className="p-2 text-[#a3aac4] hover:text-white rounded-xl"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateOrg} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#a3aac4] uppercase tracking-wider ml-1">Nombre de la Empresa</label>
                <input required type="text" value={newOrgData.name} onChange={e => setNewOrgData({...newOrgData, name: e.target.value})} className="w-full bg-[#141f38] border border-[#40485d]/30 text-[#dee5ff] rounded-xl px-4 py-3 text-sm focus:border-[#85adff]/50 outline-none" placeholder="Ej: PKT Industrial" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#a3aac4] uppercase tracking-wider ml-1">RUC</label>
                  <input type="text" value={newOrgData.ruc} onChange={e => setNewOrgData({...newOrgData, ruc: e.target.value})} className="w-full bg-[#141f38] border border-[#40485d]/30 text-[#dee5ff] rounded-xl px-4 py-3 text-sm focus:border-[#85adff]/50 outline-none" placeholder="10XXXXXXXXX" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#a3aac4] uppercase tracking-wider ml-1">Límite Usuarios</label>
                  <input required type="number" min="1" value={newOrgData.maxUsers} onChange={e => setNewOrgData({...newOrgData, maxUsers: parseInt(e.target.value)})} className="w-full bg-[#141f38] border border-[#40485d]/30 text-[#dee5ff] rounded-xl px-4 py-3 text-sm focus:border-[#85adff]/50 outline-none" placeholder="5" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 rounded-xl font-bold bg-[#85adff] text-[#060e20] hover:bg-[#a6c3ff] transition-all">Crear Registro</button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDITAR ORGANIZACIÓN & USUARIOS --- */}
      {isEditOrgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#091328] border border-[#40485d]/50 rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 border-b border-[#40485d]/30 flex justify-between items-center bg-[#060e20]">
              <div>
                <h2 className="text-xl font-black text-[#dee5ff]">Editar {selectedOrg?.name}</h2>
                <p className="text-xs text-[#a3aac4]">ID Sistema: {selectedOrg?.id}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDeleteOrg}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold hover:bg-red-500/20 transition-all"
                >
                  <Trash2 size={14} /> Eliminar Org
                </button>
                <button onClick={() => setIsEditOrgModalOpen(false)} className="p-2 text-[#a3aac4] hover:text-white rounded-xl"><X size={20} /></button>
              </div>
            </div>

            <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Sección Nombre Org */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#85adff] uppercase tracking-widest">Datos Maestros</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#a3aac4] uppercase px-1">Nombre</label>
                    <input type="text" value={editOrgData.name} onChange={e => setEditOrgData({...editOrgData, name: e.target.value})} className="w-full bg-[#141f38] border border-[#40485d]/30 text-[#dee5ff] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#85adff]/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#a3aac4] uppercase px-1">RUC</label>
                    <input type="text" value={editOrgData.ruc} onChange={e => setEditOrgData({...editOrgData, ruc: e.target.value})} className="w-full bg-[#141f38] border border-[#40485d]/30 text-[#dee5ff] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#85adff]/50" placeholder="RUC" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#a3aac4] uppercase px-1">Dirección</label>
                    <input type="text" value={editOrgData.address} onChange={e => setEditOrgData({...editOrgData, address: e.target.value})} className="w-full bg-[#141f38] border border-[#40485d]/30 text-[#dee5ff] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#85adff]/50" placeholder="Dirección" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#a3aac4] uppercase px-1">Límite Usuarios</label>
                    <input type="number" min="1" value={editOrgData.maxUsers} onChange={e => setEditOrgData({...editOrgData, maxUsers: parseInt(e.target.value)})} className="w-full bg-[#141f38] border border-[#40485d]/30 text-[#dee5ff] rounded-xl px-4 py-2 text-sm outline-none focus:border-[#85adff]/50" />
                  </div>
                </div>

                {/* NUEVO: Selector de Plan */}
                <div className="bg-[#141f38]/50 p-4 rounded-2xl border border-[#40485d]/30 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-[#dee5ff] uppercase tracking-wider">Plan de Suscripción</h4>
                    <span className="text-[10px] text-[#a3aac4]">Este cambio activa módulos automáticamente</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(SUBSCRIPTION_PLANS).map((planId) => (
                      <button
                        key={planId}
                        onClick={() => adminUpdateOrgPlan(selectedOrg.id, planId)}
                        className={`py-2 rounded-xl text-[10px] font-bold transition-all border ${
                          selectedOrg?.subscription?.planId === planId 
                            ? 'bg-[#85adff] text-[#060e20] border-[#85adff]' 
                            : 'bg-[#060e20] text-[#a3aac4] border-[#40485d]/30 hover:border-[#85adff]/50'
                        }`}
                      >
                        {SUBSCRIPTION_PLANS[planId].name.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={handleSaveOrgDetails} className="w-full bg-[#85adff]/10 text-[#85adff] border border-[#85adff]/20 py-2 rounded-xl text-xs font-bold hover:bg-[#85adff]/20">Actualizar Datos de Empresa</button>
              </div>

              {/* Sección Usuarios */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#fbabff] uppercase tracking-widest">Colaboradores Vinculados</h3>
                
                {/* Listado de Usuarios */}
                <div className="space-y-2">
                  {organizationsWithUsers.find(o => o.id === selectedOrg.id)?.users.map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 bg-[#060e20] rounded-xl border border-[#40485d]/10">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${u.status === 'pending' ? 'bg-amber-400/10 text-amber-400' : 'bg-[#fbabff]/10 text-[#fbabff]'} flex items-center justify-center text-xs font-black relative`}>
                          {u.name.substring(0,2).toUpperCase()}
                          {u.status === 'pending' && <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#dee5ff] leading-none flex items-center gap-2">
                            {u.name}
                            <span className={`text-[8px] uppercase px-1.5 py-0.5 rounded ${u.status === 'pending' ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20' : 'bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20'}`}>
                              {u.status || 'active'}
                            </span>
                          </p>
                          <p className="text-[10px] text-[#a3aac4]">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {u.status === 'pending' ? (
                          <button onClick={() => copyInviteLink(u.inviteToken)} className="text-amber-400 hover:text-amber-300 px-2 py-1 bg-amber-400/10 rounded-md text-xs font-bold transition-all">Copiar Link</button>
                        ) : (
                          <button onClick={() => impersonateUser(u)} className="text-[#85adff] hover:text-[#dee5ff] px-2 py-1 bg-[#85adff]/10 rounded-md text-xs font-bold transition-all">Entrar como...</button>
                        )}
                        <button onClick={() => adminRemoveUser(u.id)} className="text-red-400 hover:text-red-300 px-2 py-1 text-xs font-bold transition-all">Quitar</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formulario para agregar usuario */}
                <form onSubmit={handleAddUser} className="bg-[#141f38]/30 p-4 rounded-2xl border border-dashed border-[#40485d]/40">
                  <p className="text-[10px] font-bold text-[#a3aac4] uppercase mb-3">Agregar nuevo miembro</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <input required type="text" placeholder="Nombre completo" value={newUserInOrg.name} onChange={e => setNewUserInOrg({...newUserInOrg, name: e.target.value})} className="bg-[#060e20] border border-[#40485d]/30 text-[#dee5ff] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#85adff]/50" />
                    <input required type="email" placeholder="Email" value={newUserInOrg.email} onChange={e => setNewUserInOrg({...newUserInOrg, email: e.target.value})} className="bg-[#060e20] border border-[#40485d]/30 text-[#dee5ff] rounded-lg px-3 py-2 text-xs outline-none focus:border-[#85adff]/50" />
                    <select 
                      value={newUserInOrg.role} 
                      onChange={e => setNewUserInOrg({...newUserInOrg, role: e.target.value})}
                      className="bg-[#060e20] border border-[#40485d]/30 text-[#dee5ff] rounded-lg px-2 py-2 text-xs outline-none focus:border-[#85adff]/50"
                    >
                      <option value="client">Administrador</option>
                      <option value="employee">Empleado</option>
                      <option value="accountant">Contador</option>
                      <option value="sales">Vendedor</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-2 bg-[#fbabff]/10 text-[#fbabff] rounded-lg text-xs font-bold hover:bg-[#fbabff]/20 transition-all">+ Vincular Usuario</button>
                </form>
              </div>

              {/* Sección Módulos Adicionales */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#4ADE80] uppercase tracking-widest">Módulos Adicionales</h3>
                <p className="text-[10px] text-[#a3aac4]">Activa o desactiva módulos individuales para todos los usuarios de esta organización.</p>
                <div className="space-y-2">
                  {AVAILABLE_MODULES.map(module => {
                    const orgActiveModules = selectedOrg?.subscription?.activeModules || [];
                    const isActive = orgActiveModules.includes(module.id);
                    return (
                      <div
                        key={module.id}
                        onClick={() => {
                          const toggled = isActive
                            ? orgActiveModules.filter(id => id !== module.id)
                            : [...orgActiveModules, module.id];
                          adminUpdateOrgModules(selectedOrg.id, toggled);
                        }}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isActive ? 'bg-[#4ADE80]/10 border-[#4ADE80]/30 text-[#4ADE80]' : 'bg-[#141f38]/50 border-[#40485d]/20 text-[#dee5ff]'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Box size={16} opacity={isActive ? 1 : 0.5} />
                          <span className="text-sm font-bold">{module.name}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isActive ? 'bg-[#4ADE80] text-[#060e20]' : 'bg-[#060e20] border border-[#40485d]/30'}`}>
                          {isActive && <Check size={12} strokeWidth={4} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: GESTIONAR MÓDULOS --- */}
      {isManageModulesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#091328] border border-[#40485d]/50 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#40485d]/30 flex justify-between items-center bg-[#060e20]">
              <div>
                <h2 className="text-xl font-black text-[#dee5ff]">Suscripción</h2>
                <p className="text-xs text-[#a3aac4]">Org: <span className="text-[#85adff] font-bold">{selectedOrg?.name}</span></p>
              </div>
              <button onClick={() => setIsManageModulesModalOpen(false)} className="p-2 text-[#a3aac4] hover:text-white rounded-xl"><X size={20} /></button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-3">
              {AVAILABLE_MODULES.map(module => {
                const isSelected = activeModulesForEdit.includes(module.id);
                return (
                  <div key={module.id} onClick={() => handleToggleModule(module.id)} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${isSelected ? 'bg-[#85adff]/10 border-[#85adff]/30 text-[#85adff]' : 'bg-[#141f38]/50 border-[#40485d]/20 text-[#dee5ff]'}`}>
                    <div className="flex items-center gap-3"><Box size={20} opacity={isSelected ? 1 : 0.5} /><span className="font-bold">{module.name}</span></div>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center ${isSelected ? 'bg-[#85adff] text-[#060e20]' : 'bg-[#060e20] border'}`}>
                      {isSelected && <Check size={14} strokeWidth={4} />}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-6 border-t border-[#40485d]/30 flex gap-3 bg-[#060e20]">
              <button onClick={() => setIsManageModulesModalOpen(false)} className="flex-1 py-3 text-[#a3aac4] text-sm font-bold">Cerrar</button>
              <button onClick={handleSaveModules} className="flex-1 py-3 bg-[#85adff] text-[#060e20] rounded-xl font-bold text-sm">Guardar Módulos</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
