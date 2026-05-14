import { useState, useRef } from 'react';
import { Settings, X, Check, Eye, EyeOff, Loader2, User, Camera, Sun, Moon, Briefcase, UploadCloud } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { getAccessibleModules, getOrderedModules } from '../../modulesConfig';

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
  payroll: 'Planilla y RRHH',
  health: 'Salud / Clínicas'
};

export default function DashboardSettingsModal({ isOpen, onClose, user }) {
  const { isDark, toggleTheme } = useTheme();
  const { updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'dashboard'
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Local state for preferences & profile
  const accessibleKeys = getAccessibleModules(user);
  const [preferences, setPreferences] = useState(user?.dashboardPreferences || accessibleKeys);
  const orderedModules = getOrderedModules(accessibleKeys);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    photoUrl: user?.photoUrl || '',
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

  // Convert local image to optimized base64
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // Limit to 2MB pre-compression
      alert('La imagen original debe ser menor a 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 256; // 256px optimization for profile pics
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress image to 0.7 quality jpeg data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setProfileData(prev => ({ ...prev, photoUrl: dataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.id || user.uid);
      const finalData = {
        dashboardPreferences: preferences,
        name: profileData.name,
        photoUrl: profileData.photoUrl,
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !loading && onClose()}></div>
      
      <div className="bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-[2rem] w-full max-w-xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden relative animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 pb-4 bg-[var(--color-surface-container-high)] flex flex-col border-b border-[var(--color-outline-variant)]">
          <div className="flex justify-between items-center">
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
        </div>

        {/* Standard Module-Style Tab Navigation */}
        <div className="flex items-center gap-2 py-3 px-6 bg-[var(--color-surface-container-high)] border-b border-[var(--color-outline-variant)] overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
              activeTab === 'profile' 
                ? 'bg-[#6B4FD8] text-white shadow-lg shadow-purple-500/20' 
                : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-highest)] border border-transparent hover:border-[var(--color-outline-variant)]'
            }`}
          >
            <User size={13} />
            <span>Mi Perfil</span>
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
              activeTab === 'dashboard' 
                ? 'bg-[#6B4FD8] text-white shadow-lg shadow-purple-500/20' 
                : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-highest)] border border-transparent hover:border-[var(--color-outline-variant)]'
            }`}
          >
            <Eye size={13} />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 bg-[var(--color-surface)]">
          
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Theme Setting */}
              <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[var(--color-surface-variant)] flex items-center justify-center text-[var(--color-primary)]">
                    {isDark ? <Moon size={18} /> : <Sun size={18} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-on-surface)]">Apariencia Visual</p>
                    <p className="text-[10px] text-[var(--color-on-surface-variant)] font-medium">Modo oscuro / claro</p>
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

              {/* Basic Information Form */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase font-black tracking-widest text-[var(--color-primary)] flex items-center gap-2 px-1">
                  <User size={12} /> Información Básica
                </h4>
                
                <div className="grid gap-4">
                  {/* Photo upload UI */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-[var(--color-surface-container-low)] p-4 rounded-2xl border border-[var(--color-outline-variant)]">
                    <div className="relative group">
                      <div className="w-20 h-20 rounded-full bg-[var(--color-surface-container-highest)] border-2 border-[var(--color-outline-variant)] overflow-hidden flex items-center justify-center shrink-0 relative transition-all group-hover:border-[#6B4FD8]">
                        {profileData.photoUrl ? (
                          <img src={profileData.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User size={32} className="opacity-30 text-[var(--color-on-surface)]" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                          <Camera size={20} className="text-white" />
                        </div>
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageUpload} 
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-xs font-bold text-[var(--color-on-surface)]">Foto de Perfil</p>
                      <p className="text-[10px] text-[var(--color-on-surface-variant)] mb-3">Sube una imagen desde tu equipo</p>
                      
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface)] hover:bg-[var(--color-primary-container)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all active:scale-95"
                      >
                        <UploadCloud size={14} />
                        Subir Foto
                      </button>
                    </div>
                  </div>

                  {/* Form inputs */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-on-surface-variant)] ml-1">Nombre Completo</label>
                    <div className="relative">
                      <input 
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        placeholder="Tu nombre"
                        className="w-full px-4 py-3 pl-10 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-xs text-[var(--color-on-surface)] focus:ring-2 focus:ring-[#6B4FD8]/30 focus:border-[#6B4FD8] outline-none transition-all font-semibold"
                      />
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] opacity-50" />
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
                        placeholder="Ej. Gerente Comercial, Asesor, etc."
                        className="w-full px-4 py-3 pl-10 rounded-xl bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-xs text-[var(--color-on-surface)] focus:ring-2 focus:ring-[#6B4FD8]/30 focus:border-[#6B4FD8] outline-none transition-all"
                      />
                      <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] opacity-50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-[var(--color-surface-container-low)] p-3 rounded-xl border border-[var(--color-outline-variant)] flex gap-3 items-start">
                <Eye size={16} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[var(--color-on-surface-variant)] font-medium leading-relaxed">
                  Activa o desactiva las tarjetas de vista rápida en tu página de inicio. Esto solo afecta tu visualización personal.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-2.5">
                {orderedModules.map((modKey, index) => {
                  const isVisible = preferences.includes(modKey);
                  return (
                    <div
                      key={modKey}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                        isVisible 
                          ? 'bg-[var(--color-primary-container)]/20 border-[#6B4FD8]/40 text-[var(--color-on-surface)]' 
                          : 'bg-[var(--color-surface-container-low)] border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] opacity-80 hover:opacity-100 hover:bg-[var(--color-surface-variant)]'
                      }`}
                    >
                      {/* Toggle Info Area */}
                      <button
                        type="button"
                        onClick={() => toggleWidget(modKey)}
                        className="flex-1 flex items-center justify-between p-2 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all shadow-sm ${isVisible ? 'bg-[#6B4FD8] text-white' : 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)]'}`}>
                            {isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-wide">{MODULE_LABELS[modKey] || modKey}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isVisible ? 'bg-[#6B4FD8] border-[#6B4FD8] text-white' : 'border-[var(--color-outline-variant)] group-hover:border-[var(--color-on-surface-variant)]'
                        }`}>
                          {isVisible && <Check size={12} strokeWidth={4} />}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer - Highly optimized for mobile layout */}
        <div className="p-4 sm:p-5 border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full sm:w-auto sm:flex-1 px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-all border border-[var(--color-outline-variant)]"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full sm:flex-[1.5] bg-[#6B4FD8] text-white font-black px-6 py-3 rounded-xl hover:shadow-[0_10px_25px_rgba(107,79,216,0.3)] hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 text-[10px] uppercase tracking-widest disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>
    </div>
  );
}
