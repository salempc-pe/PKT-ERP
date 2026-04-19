import { useState, useMemo } from 'react';
import { Users, UserPlus, Mail, Shield, Trash2, Check, X, Copy, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function TeamModule() {
  const { user, mockUsers, adminCreateUser, adminRemoveUser, mockOrganizations } = useAuth();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });
  const [loading, setLoading] = useState(false);

  const orgId = user?.organizationId;
  const currentOrg = mockOrganizations.find(o => o.id === orgId);
  const maxUsers = currentOrg?.subscription?.maxUsers || currentOrg?.maxUsers || 5;

  const teamMembers = useMemo(() => {
    return mockUsers.filter(u => u.organizationId === orgId);
  }, [mockUsers, orgId]);

  const isLimitReached = teamMembers.length >= maxUsers;

  const handleInvite = async (e) => {
    e.preventDefault();
    if (isLimitReached) return;
    setLoading(true);

    try {
      const result = await adminCreateUser(orgId, user.organizationName, newUser);
      if (result.success) {
        setNewUser({ name: '', email: '', role: 'user' });
        setIsInviteModalOpen(false);
        if (result.inviteToken) {
          const inviteUrl = window.location.origin + '/setup-password?token=' + result.inviteToken;
          navigator.clipboard.writeText(inviteUrl);
          alert('¡Invitación generada! El enlace se ha copiado al portapapeles.');
        }
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Error al enviar invitación');
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = (token) => {
    const inviteUrl = window.location.origin + '/setup-password?token=' + token;
    navigator.clipboard.writeText(inviteUrl);
    alert('Enlace de invitación copiado al portapapeles');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#dee5ff] tracking-tight mb-2">Gestión de Equipo</h1>
          <p className="text-[#a3aac4] text-sm">Administra los colaboradores de {user?.organizationName}.</p>
        </div>
        
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          disabled={isLimitReached}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            isLimitReached 
            ? 'bg-[#40485d]/20 text-[#a3aac4] cursor-not-allowed border border-[#40485d]/30' 
            : 'bg-[#85adff] hover:bg-[#a6c3ff] text-[#060e20] shadow-lg shadow-[#85adff]/10'
          }`}
        >
          <UserPlus size={18} />
          <span>{isLimitReached ? 'Límite alcanzado' : 'Invitar Miembro'}</span>
        </button>
      </div>

      {/* Stats / Quota */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#091328]/60 border border-[#40485d]/30 rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-[#85adff]/10 rounded-xl flex items-center justify-center text-[#85adff]">
              <Users size={20} />
            </div>
            <h3 className="text-sm font-bold text-[#a3aac4] uppercase tracking-wider">Capacidad de Usuarios</h3>
          </div>
          <p className="text-2xl font-black text-[#dee5ff] mb-1">{teamMembers.length} / {maxUsers}</p>
          <div className="w-full bg-[#141f38] h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${isLimitReached ? 'bg-red-400' : 'bg-[#85adff]'}`}
              style={{ width: `${Math.min((teamMembers.length / maxUsers) * 100, 100)}%` }}
            ></div>
          </div>
          {isLimitReached && (
            <p className="text-[10px] text-red-400 mt-2 font-bold flex items-center gap-1">
              <Shield size={10} /> Has alcanzado el límite de tu plan.
            </p>
          )}
        </div>
      </div>

      {/* Team List */}
      <div className="bg-[#091328]/60 border border-[#40485d]/30 rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#060e20]/50 border-b border-[#40485d]/30">
              <th className="px-6 py-4 text-xs font-bold text-[#a3aac4] uppercase tracking-wider">Colaborador</th>
              <th className="px-6 py-4 text-xs font-bold text-[#a3aac4] uppercase tracking-wider">Rol</th>
              <th className="px-6 py-4 text-xs font-bold text-[#a3aac4] uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-xs font-bold text-[#a3aac4] uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#40485d]/10">
            {teamMembers.map((member) => (
              <tr key={member.id} className="hover:bg-[#141f38]/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#141f38] border border-[#85adff]/20 flex items-center justify-center text-xs font-bold text-[#85adff]">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#dee5ff]">{member.name}</p>
                      <p className="text-xs text-[#a3aac4] flex items-center gap-1">
                        <Mail size={10} /> {member.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] uppercase font-black px-2 py-1 rounded border tracking-widest leading-none flex items-center w-fit gap-1 ${
                    member.role === 'admin' 
                      ? 'bg-[#fbabff]/10 text-[#fbabff] border-[#fbabff]/20' 
                      : 'bg-[#85adff]/10 text-[#85adff] border-[#85adff]/20'
                  }`}>
                    {member.role === 'admin' ? <Shield size={10} /> : <Users size={10} />}
                    {member.role === 'admin' ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-[#4ADE80]' : 'bg-amber-400'}`}></div>
                    <span className={`text-xs font-bold ${member.status === 'active' ? 'text-[#4ADE80]' : 'text-amber-400'}`}>
                      {member.status === 'active' ? 'Activo' : 'Pendiente'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {member.status === 'pending' && (
                      <button 
                        onClick={() => copyInviteLink(member.inviteToken)}
                        className="p-2 text-[#85adff] hover:bg-[#85adff]/10 rounded-lg transition-all"
                        title="Copiar Link de Invitación"
                      >
                        <Copy size={16} />
                      </button>
                    )}
                    {member.id !== user.id && (
                      <button 
                        onClick={() => {
                          if (window.confirm(`¿Quitar a ${member.name} del equipo?`)) {
                            adminRemoveUser(member.id);
                          }
                        }}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Eliminar Miembro"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {teamMembers.length === 0 && (
          <div className="p-12 text-center">
            <Users size={48} className="mx-auto text-[#40485d]/30 mb-4" />
            <p className="text-[#a3aac4]">No hay otros colaboradores en tu equipo.</p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#091328] border border-[#40485d]/50 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 z-[60] bg-[#060e20]/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-[#85adff]/20 border-t-[#85adff] rounded-full animate-spin"></div>
                  <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#85adff] animate-pulse" size={20} />
                </div>
                <p className="mt-4 text-[#85adff] font-bold tracking-[0.2em] text-[10px] uppercase animate-pulse">
                  Generando invitación...
                </p>
              </div>
            )}
            <div className="p-6 border-b border-[#40485d]/30 flex justify-between items-center bg-[#060e20] rounded-t-3xl">
              <h2 className="text-xl font-black text-[#dee5ff]">Invitar Miembro</h2>
              <button 
                onClick={() => setIsInviteModalOpen(false)} 
                className="p-2 text-[#a3aac4] hover:text-white rounded-xl"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#a3aac4] uppercase tracking-wider ml-1">Nombre Completo</label>
                <input 
                  required 
                  type="text" 
                  value={newUser.name} 
                  onChange={e => setNewUser({...newUser, name: e.target.value})} 
                  className="w-full bg-[#141f38] border border-[#40485d]/30 text-[#dee5ff] rounded-xl px-4 py-3 text-sm focus:border-[#85adff]/50 outline-none" 
                  placeholder="Ej: Ana García" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#a3aac4] uppercase tracking-wider ml-1">Correo Electrónico</label>
                <input 
                  required 
                  type="email" 
                  value={newUser.email} 
                  onChange={e => setNewUser({...newUser, email: e.target.value})} 
                  className="w-full bg-[#141f38] border border-[#40485d]/30 text-[#dee5ff] rounded-xl px-4 py-3 text-sm focus:border-[#85adff]/50 outline-none" 
                  placeholder="ana@empresa.com" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[#a3aac4] uppercase tracking-wider ml-1">Rol en el Equipo</label>
                <select 
                  value={newUser.role} 
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                  className="w-full bg-[#141f38] border border-[#40485d]/30 text-[#dee5ff] rounded-xl px-4 py-3 text-sm focus:border-[#85adff]/50 outline-none"
                >
                  <option value="user">Usuario Regular</option>
                  <option value="admin">Administrador del Equipo</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 rounded-xl font-black bg-[#85adff] text-[#060e20] hover:bg-[#a6c3ff] transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Procesando...' : 'Generar Invitación'}
              </button>
              <p className="text-[10px] text-center text-[#a3aac4]">
                Al generar la invitación, se creará un enlace que podrás copiar y compartir con el nuevo miembro.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
