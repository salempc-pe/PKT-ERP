import { useState, useMemo } from 'react';
import { Users, UserPlus, Mail, Shield, Trash2, Check, X, Copy, Loader2, AlertCircle, Download, ShieldAlert, Database } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '../../../context/AuthContext';
import { db } from '../../../services/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function TeamModule() {
  const { user, allUsers, adminCreateUser, adminRemoveUser, allOrganizations } = useAuth();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const InviteSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Correo electrónico inválido"),
    role: z.enum(['user', 'admin'], "Rol inválido")
  });

  const orgId = user?.organizationId;
  const currentOrg = allOrganizations.find(o => o.id === orgId);
  const maxUsers = currentOrg?.subscription?.maxUsers || currentOrg?.maxUsers || 5;

  const teamMembers = useMemo(() => {
    return allUsers.filter(u => u.organizationId === orgId);
  }, [allUsers, orgId]);

  const isLimitReached = teamMembers.length >= maxUsers;

  const handleInvite = async (e) => {
    e.preventDefault();
    if (isLimitReached) return;
    setValidationErrors({});

    const validation = InviteSchema.safeParse(newUser);
    if (!validation.success) {
      const errors = {};
      validation.error.errors.forEach(err => {
        errors[err.path[0]] = err.message;
      });
      setValidationErrors(errors);
      return;
    }

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

  const handleExportData = async () => {
    if (!window.confirm("¿Deseas exportar todos los datos del sistema? Se descargará un archivo JSON con toda la información de tu organización para tu resguardo.")) return;
    
    setLoadingExport(true);
    try {
      const data = {
        exportDate: new Date().toISOString(),
        organization: currentOrg,
        users: teamMembers,
        data: {}
      };

      const collectionsToExport = [
        'invoices',
        'realEstateTerrains',
        'suppliers',
        'purchases',
        'products',
        'projects',
        'tasks',
        'transactions',
        'contacts',
        'leads',
        'appointments'
      ];

      for (const collName of collectionsToExport) {
        try {
          const collRef = collection(db, `organizations/${orgId}/${collName}`);
          const snap = await getDocs(collRef);
          data.data[collName] = snap.docs.map(d => ({ 
            id: d.id, 
            ...d.data(),
            // Convert timestamps to string if they exist
            createdAt: d.data().createdAt?.toDate?.()?.toISOString() || d.data().createdAt,
            updatedAt: d.data().updatedAt?.toDate?.()?.toISOString() || d.data().updatedAt,
            date: d.data().date?.toDate?.()?.toISOString() || d.data().date,
          }));
        } catch (e) {
          console.warn(`Could not export collection ${collName}:`, e);
          data.data[collName] = [];
        }
      }

      // Audit logs (root collection)
      try {
        const logsRef = collection(db, 'audit_logs');
        const qLogs = query(logsRef, where('orgId', '==', orgId));
        const logsSnap = await getDocs(qLogs);
        data.audit_logs = logsSnap.docs.map(d => ({ 
          id: d.id, 
          ...d.data(),
          timestamp: d.data().timestamp?.toDate?.()?.toISOString() || d.data().timestamp 
        }));
      } catch (e) {
        console.warn("Could not export audit logs:", e);
        data.audit_logs = [];
      }

      // Download process
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PKT_ERP_Respaldo_${user.organizationName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error al exportar datos:", error);
      alert("Hubo un error al generar el respaldo de datos.");
    } finally {
      setLoadingExport(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        <button
          onClick={() => setIsInviteModalOpen(true)}
          disabled={isLimitReached}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${isLimitReached
              ? 'bg-[#40485d]/20 text-[var(--color-on-surface-variant)] cursor-not-allowed border border-[var(--color-outline-variant)]'
              : 'bg-[#6B4FD8] hover:bg-[#a6c3ff] text-[#0a0a0a] shadow-lg shadow-[#6B4FD8]/10'
            }`}
        >
          <UserPlus size={18} />
          <span>{isLimitReached ? 'Límite alcanzado' : 'Invitar Miembro'}</span>
        </button>
      </div>

      {/* Stats / Quota */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-surface-container-low)]/60 border border-[var(--color-outline-variant)] rounded-3xl p-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-[#6B4FD8]/10 rounded-xl flex items-center justify-center text-[var(--color-primary)]">
              <Users size={20} />
            </div>
            <h3 className="text-sm font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Capacidad de Usuarios</h3>
          </div>
          <p className="text-2xl font-black text-[var(--color-on-surface)] mb-1">{teamMembers.length} / {maxUsers}</p>
          <div className="w-full bg-[var(--color-surface-container)] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${isLimitReached ? 'bg-red-400' : 'bg-[#6B4FD8]'}`}
              style={{ width: `${Math.min((teamMembers.length / maxUsers) * 100, 100)}%` }}
            ></div>
          </div>
          {isLimitReached && (
            <p className="text-[10px] text-red-400 mt-2 font-bold flex items-center gap-1">
              <Shield size={10} /> Has alcanzado el límite de tu plan.
            </p>
          )}
        </div>

        {/* Zona de Seguridad (Solo Admin) */}
        {user?.role === 'admin' && (
          <div className="md:col-span-2 bg-[var(--color-surface-container-low)]/60 border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldAlert size={120} />
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                    <Database size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider">Zona de Resguardo de Datos</h3>
                </div>
                <p className="text-[var(--color-on-surface)] font-bold">Respaldo Total del Sistema</p>
                <p className="text-xs text-[var(--color-on-surface-variant)] max-w-md">
                  Descarga una copia local de toda la información de tu empresa (clientes, ventas, inventario y más). 
                  Útil para auditorías o como medida de seguridad ante cualquier eventualidad.
                </p>
              </div>

              <button
                onClick={handleExportData}
                disabled={loadingExport}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] transition-all shadow-lg shadow-amber-500/10 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingExport ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>PROCESANDO...</span>
                  </>
                ) : (
                  <>
                    <Download size={20} />
                    <span>RESCATAR TODOS LOS DATOS</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Team List */}
      <div className="bg-[var(--color-surface-container-low)]/60 border border-[var(--color-outline-variant)] rounded-3xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0a0a0a]/50 border-b border-[var(--color-outline-variant)]">
              <th className="px-6 py-4 text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Colaborador</th>
              <th className="px-6 py-4 text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Rol</th>
              <th className="px-6 py-4 text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#40485d]/10">
            {teamMembers.map((member) => (
              <tr key={member.id} className="hover:bg-[var(--color-surface-container)]/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container)] border border-[#6B4FD8]/20 flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[var(--color-on-surface)]">{member.name}</p>
                      <p className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1">
                        <Mail size={10} /> {member.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] uppercase font-black px-2 py-1 rounded border tracking-widest leading-none flex items-center w-fit gap-1 ${member.role === 'admin'
                      ? 'bg-[#2E8B57]/10 text-[#2E8B57] border-[#2E8B57]/20'
                      : 'bg-[#6B4FD8]/10 text-[var(--color-primary)] border-[#6B4FD8]/20'
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
                        className="p-2 text-[var(--color-primary)] hover:bg-[#6B4FD8]/10 rounded-lg transition-all"
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
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
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
            <Users size={48} className="mx-auto text-[var(--color-on-surface-variant)]/30 mb-4" />
            <p className="text-[var(--color-on-surface-variant)]">No hay otros colaboradores en tu equipo.</p>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-surface-container-low)] border border-[#40485d]/50 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 z-[60] bg-[#0a0a0a]/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-[#6B4FD8]/20 border-t-[#6B4FD8] rounded-full animate-spin"></div>
                  <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--color-primary)] animate-pulse" size={20} />
                </div>
                <p className="mt-4 text-[var(--color-primary)] font-bold tracking-[0.2em] text-[10px] uppercase animate-pulse">
                  Generando invitación...
                </p>
              </div>
            )}
            <div className="p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[#0a0a0a] rounded-t-3xl">
              <h2 className="text-xl font-black text-[var(--color-on-surface)]">Invitar Miembro</h2>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-2 text-[var(--color-on-surface-variant)] hover:text-white rounded-xl"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1">Nombre Completo</label>
                <input
                  required
                  type="text"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm focus:border-[#6B4FD8]/50 outline-none"
                  placeholder="Ej: Ana García"
                />
                {validationErrors.name && (
                  <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1 font-bold">
                    <AlertCircle size={10} /> {validationErrors.name}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1">Correo Electrónico</label>
                <input
                  required
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm focus:border-[#6B4FD8]/50 outline-none"
                  placeholder="ana@empresa.com"
                />
                {validationErrors.email && (
                  <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1 font-bold">
                    <AlertCircle size={10} /> {validationErrors.email}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1">Rol en el Equipo</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] rounded-xl px-4 py-3 text-sm focus:border-[#6B4FD8]/50 outline-none"
                >
                  <option value="user">Usuario Regular</option>
                  <option value="admin">Administrador del Equipo</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-black bg-[#6B4FD8] text-[#0a0a0a] hover:bg-[#a6c3ff] transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Procesando...' : 'Generar Invitación'}
              </button>
              <p className="text-[10px] text-center text-[var(--color-on-surface-variant)]">
                Al generar la invitación, se creará un enlace que podrás copiar y compartir con el nuevo miembro.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
