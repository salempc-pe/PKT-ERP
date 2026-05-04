import { useState } from 'react';
import { Settings, X, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';

const MODULE_LABELS = {
  crm: 'CRM y Clientes',
  inventory: 'Inventario y Stock',
  sales: 'Ventas y Facturación',
  projects: 'Proyectos y Tareas',
  calendar: 'Agenda y Calendario',
  finance: 'Finanzas y Caja',
  purchases: 'Compras y Gastos',
  realestate: 'Bienes Raíces',
  warehouse: 'Gestión de Almacenes',
  payroll: 'Planilla y RRHH'
};

export default function DashboardSettingsModal({ isOpen, onClose, user, activeModules }) {
  const [preferences, setPreferences] = useState(user?.dashboardPreferences || activeModules);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const toggleWidget = (modKey) => {
    setPreferences(prev => 
      prev.includes(modKey) 
        ? prev.filter(k => k !== modKey) 
        : [...prev, modKey]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, {
        dashboardPreferences: preferences
      });
      onClose();
    } catch (error) {
      console.error("Error saving dashboard preferences:", error);
      alert("No se pudieron guardar las preferencias.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-outline-variant)] bg-[#0a0a0a] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#6B4FD8]/10 rounded-xl flex items-center justify-center text-[var(--color-primary)]">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--color-on-surface)]">Personalizar Dashboard</h3>
              <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase font-bold tracking-widest">Configura tus widgets activos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[var(--color-on-surface-variant)] hover:text-white rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <p className="text-xs text-[var(--color-on-surface-variant)] mb-4">
            Selecciona los módulos que deseas visualizar en tu pantalla principal. Los cambios se aplicarán a tu perfil personal.
          </p>
          
          <div className="grid grid-cols-1 gap-2">
            {activeModules.map((modKey) => {
              const isVisible = preferences.includes(modKey);
              return (
                <button
                  key={modKey}
                  onClick={() => toggleWidget(modKey)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                    isVisible 
                      ? 'bg-[#6B4FD8]/10 border-[#6B4FD8] text-[var(--color-on-surface)]' 
                      : 'bg-[var(--color-surface-container)] border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isVisible ? <Eye size={18} className="text-[#6B4FD8]" /> : <EyeOff size={18} />}
                    <span className="text-sm font-bold">{MODULE_LABELS[modKey] || modKey}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    isVisible ? 'bg-[#6B4FD8] border-[#6B4FD8] text-[#0a0a0a]' : 'border-[var(--color-outline-variant)]'
                  }`}>
                    {isVisible && <Check size={14} strokeWidth={4} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--color-outline-variant)] bg-[#0a0a0a]/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-sm text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-3 rounded-xl font-black text-sm bg-[#6B4FD8] text-[#0a0a0a] hover:bg-[#a6c3ff] transition-all flex items-center gap-2 shadow-lg shadow-[#6B4FD8]/10 disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
            <span>GUARDAR CONFIGURACIÓN</span>
          </button>
        </div>
      </div>
    </div>
  );
}
