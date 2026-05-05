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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => !loading && onClose()}></div>
      
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-[2rem] w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-high)] flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#6B4FD8] rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="text-sm font-black text-[var(--color-on-surface)] uppercase tracking-widest">Personalizar Dashboard</h3>
              <p className="text-[9px] text-[#6B4FD8] font-bold uppercase tracking-wider">Configuración de Widgets</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] flex items-center justify-center hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-container)] transition-all border border-[var(--color-outline-variant)]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          <p className="text-xs text-[var(--color-on-surface-variant)] mb-4 font-medium leading-relaxed">
            Selecciona los módulos que deseas visualizar en tu pantalla principal. Los cambios se aplicarán a tu perfil personal.
          </p>
          
          <div className="grid grid-cols-1 gap-3">
            {activeModules.map((modKey) => {
              const isVisible = preferences.includes(modKey);
              return (
                <button
                  key={modKey}
                  onClick={() => toggleWidget(modKey)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                    isVisible 
                      ? 'bg-[var(--color-primary-container)]/30 border-[#6B4FD8] text-[var(--color-on-surface)]' 
                      : 'bg-[var(--color-surface-container-low)] border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isVisible ? <Eye size={18} className="text-[#6B4FD8]" /> : <EyeOff size={18} />}
                    <span className="text-xs font-bold uppercase tracking-wide">{MODULE_LABELS[modKey] || modKey}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    isVisible ? 'bg-[#6B4FD8] border-[#6B4FD8] text-white' : 'border-[var(--color-outline-variant)]'
                  }`}>
                    {isVisible && <Check size={14} strokeWidth={4} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] flex gap-4">
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
            <span>Guardar Configuración</span>
          </button>
        </div>
      </div>
    </div>
  );
}
