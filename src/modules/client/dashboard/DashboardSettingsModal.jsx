import { useState } from 'react';
import { Settings, X, Check, Eye, EyeOff, Loader2, User, Camera, Sun, Moon, CreditCard, Briefcase } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';

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
  const { isDark, toggleTheme } = useTheme();
  const { updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'dashboard'
  const [loading, setLoading] = useState(false);
  
  // Local state for preferences & profile
  const [preferences, setPreferences] = useState(user?.dashboardPreferences || activeModules);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    photoUrl: user?.photoUrl || '',
    documentId: user?.documentId || '',
    position: user?.position || ''
  });

  if (!isOpen) return null;

  const toggleWidget = (modKey) => {
    setPreferences(prev => 
      prev.includes(modKey) 
        ? prev.filter(k => k !== modKey) 
        : [...prev, modKey]
    );
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.id || user.uid);
      const finalData = {
        dashboardPreferences: preferences,
        name: profileData.name,
        photoUrl: profileData.photoUrl,
        documentId: profileData.documentId,
        position: profileData.position
      };
      
      await updateDoc(userRef, finalData);
      
      // Inmediate local fallback update
      if (updateUser) {
        updateUser(finalData);
      }
      
      onClose();
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("No se pudieron guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !loading && onClose()}></div>
      
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-[2rem] w-full max-w-xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 pb-0 bg-[var(--color-surface-container-high)] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#6B4FD8] to-[#8b74e7] rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                <Settings size={20} className="animate-[spin_10s_linear_infinite]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-[var(--color-on-surface)] uppercase tracking-widest">Configuración</h3>
                <p className="text-[9px] text-[#6B4FD8] font-bold uppercase tracking-wider">Preferencias de Usuario</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] flex items-center justify-center hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-container)] transition-all border border-[var(--color-outline-variant)]"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tabs Navegation */}
          <div className="flex gap-1 px-1 bg-[var(--color-surface-container)] rounded-t-xl border-x border-t border-[var(--color-outline-variant)] mt-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 text-[10px] uppercase font-black tracking-wider rounded-t-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'profile' ? 'bg-[var(--color-surface)] text-[var(--color-primary)] border-t-2 border-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)] opacity-60 hover:opacity-100'}`}
            >
              <User size={14} />
              <span>Mi Perfil</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-3 text-[10px] uppercase font-black tracking-wider rounded-t-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'dashboard' ? 'bg-[var(--color-surface)] text-[var(--color-primary)] border-t-2 border-[var(--color-primary)]' : 'text-[var(--color-on-surface-variant)] opacity-60 hover:opacity-100'}`}
            >
              <Eye size={14} />
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[var(--color-surface)]">
          
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Quick Settings: Dark Mode */}
              <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--color-surface-variant)] flex items-center justify-center text-[var(--color-primary)]">
                    {isDark ? <Moon size={18} /> : <Sun size={18} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-on-surface)]">Apariencia Visual</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] font-medium">Activar modo oscuro / claro</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="relative w-14 h-7 rounded-full transition-all duration-300 flex items-center px-1 focus:outline-none border border-[var(--color-outline-variant)]"
                  style={{ backgroundColor: isDark ? '#6B4FD8' : 'var(--color-primary-container)' }}
                >
                  <div
                    className="w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 flex items-center justify-center"
                    style={{ transform: isDark ? 'translateX(28px)' : 'translateX(0)' }}
                  >
                    {isDark ? <Moon size={12} className="text-[#6B4FD8]" /> : <Sun size={12} className="text-[#F59E0B]" />}
                  </div>
                </button>
              </div>

              {/* Form Header */}
              <div>
                <h4 className="text-[10px] uppercase font-black tracking-widest text-[var(--color-primary)] mb-4 flex items-center gap-2">
                  <User size={12} /> Información Básica
                </h4>
                
                <div className="grid gap-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface-container-highest)] border border-[var(--color-outline-variant)] overflow-hidden flex items-center justify-center shrink-0 relative group">
                      {profileData.photoUrl ? (
                        <img src={profileData.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="opacity-20 text-[var(--color-on-surface)]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] mb-1.5 ml-1">URL de Foto de Perfil</label>
                      <div className="relative">
                        <input 
                          type="text"
                          name="photoUrl"
                          value={profileData.photoUrl}
                          onChange={handleProfileChange}
                          placeholder="https://ejemplo.com/foto.jpg"
                          className="w-full px-4 py-2.5 pl-9 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-xs text-[var(--color-on-surface)] focus:ring-2 focus:ring-[#6B4FD8]/50 focus:border-[#6B4FD8] outline-none transition-all"
                        />
                        <Camera size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] opacity-50" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] ml-1">Nombre Completo</label>
                    <div className="relative">
                      <input 
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2.5 pl-9 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-xs text-[var(--color-on-surface)] focus:ring-2 focus:ring-[#6B4FD8]/50 focus:border-[#6B4FD8] outline-none transition-all font-semibold"
                      />
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] opacity-50" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] ml-1">Documento / ID</label>
                      <div className="relative">
                        <input 
                          type="text"
                          name="documentId"
                          value={profileData.documentId}
                          onChange={handleProfileChange}
                          className="w-full px-4 py-2.5 pl-9 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-xs text-[var(--color-on-surface)] focus:ring-2 focus:ring-[#6B4FD8]/50 focus:border-[#6B4FD8] outline-none transition-all"
                        />
                        <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] opacity-50" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] ml-1">Puesto / Rol Interno</label>
                      <div className="relative">
                        <input 
                          type="text"
                          name="position"
                          value={profileData.position}
                          onChange={handleProfileChange}
                          placeholder="Ej. Gerente Comercial"
                          className="w-full px-4 py-2.5 pl-9 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-xs text-[var(--color-on-surface)] focus:ring-2 focus:ring-[#6B4FD8]/50 focus:border-[#6B4FD8] outline-none transition-all"
                        />
                        <Briefcase size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] opacity-50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <p className="text-xs text-[var(--color-on-surface-variant)] font-medium leading-relaxed bg-[var(--color-surface-container-low)] p-3 rounded-xl border border-[var(--color-outline-variant)]/50">
                Activa o desactiva las tarjetas de vista rápida en tu página de inicio. Esto solo afecta tu visualización personal.
              </p>
              
              <div className="grid grid-cols-1 gap-2.5">
                {activeModules.map((modKey) => {
                  const isVisible = preferences.includes(modKey);
                  return (
                    <button
                      key={modKey}
                      onClick={() => toggleWidget(modKey)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left group ${
                        isVisible 
                          ? 'bg-[var(--color-primary-container)]/20 border-[#6B4FD8]/40 text-[var(--color-on-surface)] shadow-sm shadow-purple-500/5' 
                          : 'bg-[var(--color-surface-container-low)] border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] opacity-60 hover:opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isVisible ? 'bg-[#6B4FD8] text-white' : 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)]'}`}>
                          {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wide">{MODULE_LABELS[modKey] || modKey}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isVisible ? 'bg-[#6B4FD8] border-[#6B4FD8] text-white' : 'border-[var(--color-outline-variant)] group-hover:border-[var(--color-on-surface-variant)]'
                      }`}>
                        {isVisible && <Check size={12} strokeWidth={4} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-all border border-[var(--color-outline-variant)]"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-[2] bg-[#6B4FD8] text-white font-black px-6 py-3 rounded-xl hover:shadow-[0_10px_25px_rgba(107,79,216,0.3)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
            <span>Guardar Configuración</span>
          </button>
        </div>
      </div>
    </div>
  );
}
