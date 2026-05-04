import { useState } from 'react';
import { Shield, X, Check, Loader2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';

const MODULES_CONFIG = [
  { key: 'crm', name: 'CRM y Clientes' },
  { key: 'inventory', name: 'Inventario y Almacén' },
  { key: 'sales', name: 'Ventas y Facturación' },
  { key: 'purchases', name: 'Compras y Proveedores' },
  { key: 'projects', name: 'Proyectos y Tareas' },
  { key: 'finance', name: 'Finanzas y Caja' },
  { key: 'calendar', name: 'Agenda y Citas' },
  { key: 'team', name: 'Equipo y Seguridad' }
];

const ACTIONS = [
  { key: 'read', name: 'Ver', color: 'blue' },
  { key: 'create', name: 'Crear', color: 'green' },
  { key: 'update', name: 'Editar', color: 'amber' },
  { key: 'delete', name: 'Eliminar', color: 'red' }
];

export default function PermissionsModal({ isOpen, onClose, targetUser, activeModules = [] }) {
  const [permissions, setPermissions] = useState(targetUser?.permissions || {});
  const [loading, setLoading] = useState(false);

  const togglePermission = (moduleKey, actionKey) => {
    setPermissions(prev => {
      const modulePerms = prev[moduleKey] || { read: false, create: false, update: false, delete: false };
      return {
        ...prev,
        [moduleKey]: {
          ...modulePerms,
          [actionKey]: !modulePerms[actionKey]
        }
      };
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', targetUser.id);
      await updateDoc(userRef, { permissions });
      onClose();
    } catch (error) {
      console.error("Error updating permissions:", error);
      alert("Error al guardar los permisos.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Filtrar solo los módulos que la organización tiene activos
  const availableModules = MODULES_CONFIG.filter(m => activeModules.includes(m.key));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-3xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[#0a0a0a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6B4FD8]/10 rounded-xl flex items-center justify-center text-[var(--color-primary)]">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[var(--color-on-surface)]">Permisos de Acceso</h2>
              <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase font-bold tracking-widest">
                Configurando a: {targetUser.name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[var(--color-on-surface-variant)] hover:text-white rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="overflow-hidden border border-[var(--color-outline-variant)] rounded-2xl bg-[#0a0a0a]/30">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0a0a0a]/50 border-b border-[var(--color-outline-variant)]">
                  <th className="px-6 py-4 text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-wider">Módulo</th>
                  {ACTIONS.map(action => (
                    <th key={action.key} className="px-4 py-4 text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-wider text-center">
                      {action.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]">
                {availableModules.map(module => (
                  <tr key={module.key} className="hover:bg-[var(--color-surface-container)]/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[var(--color-on-surface)]">{module.name}</span>
                    </td>
                    {ACTIONS.map(action => {
                      const isActive = permissions[module.key]?.[action.key];
                      return (
                        <td key={action.key} className="px-4 py-4 text-center">
                          <button
                            onClick={() => togglePermission(module.key, action.key)}
                            className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                              isActive 
                                ? 'bg-[#6B4FD8] border-[#6B4FD8] text-[#0a0a0a]' 
                                : 'border-[var(--color-outline-variant)] hover:border-[#6B4FD8]/50 text-transparent'
                            }`}
                          >
                            <Check size={14} strokeWidth={4} />
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 bg-[#0a0a0a]/50 border-t border-[var(--color-outline-variant)] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-sm text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-3 rounded-xl font-black text-sm bg-[#6B4FD8] text-[#0a0a0a] hover:bg-[#a6c3ff] transition-all flex items-center gap-2 shadow-lg shadow-[#6B4FD8]/10"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
            <span>GUARDAR PERMISOS</span>
          </button>
        </div>
      </div>
    </div>
  );
}
