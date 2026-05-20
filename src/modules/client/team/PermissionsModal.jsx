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
  { key: 'health', name: 'Salud / Pacientes' },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => !loading && onClose()}></div>
      
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-[2rem] w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#6B4FD8] rounded-xl flex items-center justify-center text-white">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-[var(--color-on-surface)] uppercase tracking-widest">Permisos de Acceso</h2>
              <p className="text-[9px] text-[#6B4FD8] font-bold uppercase tracking-wider">
                Usuario: {targetUser.name}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] flex items-center justify-center hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-container)] transition-all border border-[var(--color-outline-variant)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="overflow-hidden border border-[var(--color-outline-variant)] rounded-2xl bg-[var(--color-surface-container-low)]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-variant)] border-b border-[var(--color-outline-variant)]">
                  <th className="px-6 py-4 text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Módulo</th>
                  {ACTIONS.map(action => (
                    <th key={action.key} className="px-4 py-4 text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest text-center">
                      {action.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]">
                {availableModules.map(module => (
                  <tr key={module.key} className="hover:bg-[var(--color-surface-container-high)]/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-[var(--color-on-surface)] uppercase tracking-tight">{module.name}</span>
                    </td>
                    {ACTIONS.map(action => {
                      const isActive = permissions[module.key]?.[action.key];
                      return (
                        <td key={action.key} className="px-4 py-4 text-center">
                          <button
                            onClick={() => togglePermission(module.key, action.key)}
                            className={`w-6 h-6 mx-auto rounded-md border flex items-center justify-center transition-all ${
                              isActive 
                                ? 'bg-[#6B4FD8] border-[#6B4FD8] text-white' 
                                : 'bg-white border-[var(--color-outline-variant)] hover:border-[#6B4FD8]/50 text-transparent'
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

        {/* Footer */}
        <div className="p-5 bg-[var(--color-surface-container-low)] border-t border-[var(--color-outline-variant)] flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-all"
          >
            Descartar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-[2] bg-[#6B4FD8] text-white font-black px-6 py-3 rounded-xl hover:shadow-[0_10px_20px_rgba(107,79,216,0.2)] transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
            <span>Guardar Permisos</span>
          </button>
        </div>
      </div>
    </div>
  );
}
