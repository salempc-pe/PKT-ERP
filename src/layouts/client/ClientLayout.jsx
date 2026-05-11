import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, Menu, Building, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import VeloLogo from '../../components/VeloLogo';
import ErrorBoundary from '../../components/ErrorBoundary';

import { 
  getAccessibleModules, 
  getOrderedModules, 
  MODULES_CATALOG 
} from '../../modules/modulesConfig';

const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

export default function ClientLayout() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, isImpersonating, stopImpersonation } = useAuth();
  const { isDark } = useTheme();

  if (!user) {
    return <Navigate to="/" replace />;
  }
  const [tenantName, setTenantName] = useState(user?.organizationName || 'Mi Empresa S.A.');
  const [tenantLogo, setTenantLogo] = useState(null);

  // Dynamic Modules Order calculation
  const accessibleKeys = getAccessibleModules(user);
  const orderedKeys = getOrderedModules(accessibleKeys, user?.modulesOrder);
  
  // Map keys to actual catalog objects
  const sidebarItems = orderedKeys.map(key => MODULES_CATALOG.find(m => m.id === key)).filter(Boolean);

  const activeStyle = (colorVar = 'var(--color-primary)') => ({
    backgroundColor: 'var(--color-surface-variant)',
    color: colorVar,
    fontWeight: 800,
    boxShadow: '0 4px 12px rgba(107, 79, 216, 0.08)'
  });

  useEffect(() => {
    if (!isFirebaseConfigured || !user?.organizationId) return;
    
    const unsub = onSnapshot(doc(db, 'organizations', user.organizationId), (configDoc) => {
      if (configDoc.exists()) {
        const data = configDoc.data();
        if (data.name) setTenantName(data.name);
        if (data.logoUrl) setTenantLogo(data.logoUrl);
      }
    });

    return () => unsub();
  }, [user]);

  const moduleTitles = {
    '/client/dashboard': 'Dashboard',
    '/client/crm': 'CRM y Ventas',
    '/client/realestate': 'Inmobiliaria',
    '/client/projects': 'Proyectos',
    '/client/inventory': 'Inventario',
    '/client/warehouse': 'Bodega',
    '/client/finance': 'Contabilidad',
    '/client/sales': 'Ventas y Facturas',
    '/client/purchases': 'Compras',
    '/client/calendar': 'Agenda',
    '/client/payroll': 'Nóminas y RRHH',
    '/client/salud': 'Gestión de Salud',
    '/client/team': 'Mi Equipo',
    '/client/settings': 'Configuración'
  };

  const currentTitle = moduleTitles[location.pathname] || 'Veló ERP';

  return (
    <>
      {isImpersonating && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-6 shadow-md text-sm font-bold animate-in slide-in-from-top-full duration-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            <span>Modo Soporte: Está viendo la cuenta de {user?.name} ({tenantName})</span>
          </div>
          <button 
            onClick={stopImpersonation} 
            className="bg-white text-red-600 px-4 py-1 rounded-full text-xs hover:bg-red-50 hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            Salir del Modo Soporte
          </button>
        </div>
      )}
      <div style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-on-surface)' }} className={`min-h-screen font-body flex relative overflow-hidden transition-colors duration-300 ${isImpersonating ? 'pt-10' : ''}`}>
        
        {/* Mobile Fixed Menu Button */}
        <button 
          className="lg:hidden fixed top-6 left-6 z-40 p-3 rounded-xl shadow-lg transition-all active:scale-95 duration-300"
          style={{ 
            backgroundColor: 'var(--color-surface-container-high)', 
            color: 'var(--color-on-surface)',
            border: '1px solid var(--color-outline-variant)'
          }}
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SideNavBar Shell */}
      <aside style={{ backgroundColor: 'var(--color-surface-container-low)' }} className={`fixed lg:sticky top-0 h-screen w-64 rounded-r-2xl flex flex-col py-8 z-50 transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-6 mb-8 space-y-6">
          {/* Top Branding Row */}
          <div className="flex justify-between items-center gap-2">
            <VeloLogo variant="horizontal" mode={isDark ? 'dark' : 'light'} size="auto" className="w-[120px] lg:w-[150px] shrink min-w-0" />
          </div>

          {/* Tenant Info Row */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-sm"
              style={{ 
                backgroundColor: 'var(--color-primary-container)', 
                color: 'var(--color-primary)',
                border: '1px solid var(--color-outline-variant)'
              }}
            >
              {tenantLogo ? (
                <img src={tenantLogo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <Building size={20} />
              )}
            </div>
            <div className="min-w-0">
              <h1 style={{ color: 'var(--color-on-surface)' }} className="text-sm font-bold tracking-tight truncate" title={tenantName}>{tenantName}</h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <Link 
            to="/client/dashboard" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm"
            style={isActive('/client/dashboard') ? { backgroundColor: 'var(--color-surface-variant)', color: 'var(--color-primary)', fontWeight: 800, boxShadow: '0 4px 12px rgba(107, 79, 216, 0.08)' } : { color: 'var(--color-on-surface-variant)' }}
            onClick={() => setIsSidebarOpen(false)}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          
          {sidebarItems.length > 0 && (
            <div style={{ color: 'var(--color-on-surface-variant)' }} className="pt-4 pb-2 px-4 text-[10px] font-bold uppercase tracking-widest opacity-50">Módulos</div>
          )}
          
          {/* Render dynamic ordered modules */}
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.id}
                to={item.path} 
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm" 
                style={isActive(item.path) ? activeStyle() : { color: 'var(--color-on-surface-variant)' }} 
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {(user?.role === 'admin') && (
            <Link to="/client/team" className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm" style={isActive('/client/team') ? activeStyle() : { color: 'var(--color-on-surface-variant)' }} onClick={() => setIsSidebarOpen(false)}>
              <Shield size={20} />
              <span>Mi Equipo</span>
            </Link>
          )}

        </nav>
        
        {/* Footer Sidebar: Profile & Settings */}
        <div className="px-4 py-4 space-y-4" style={{ borderTop: '1px solid color-mix(in srgb, var(--color-outline-variant) 20%, transparent)' }}>
          {(user?.role === 'client' || user?.role === 'admin') && (
            <Link to="/client/settings" onClick={() => setIsSidebarOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-semibold hover:bg-[var(--color-surface-container)]"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              <Settings size={18} />
              <span>Configuración</span>
            </Link>
          )}

          {/* User Profile Card */}
          <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ backgroundColor: 'var(--color-surface-container)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 overflow-hidden" 
              style={{ 
                backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)', 
                color: 'var(--color-primary)',
                border: '1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)'
              }}>
              {user?.photoUrl ? (
                <img src={user.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.substring(0, 2).toUpperCase() || 'US'
              )}
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <p className="text-xs font-black truncate" style={{ color: 'var(--color-on-surface)' }}>{user?.name || 'Usuario'}</p>
              <p className="text-[10px] font-bold opacity-50 truncate" style={{ color: 'var(--color-on-surface-variant)' }}>
                {user?.role || 'no-role'}
              </p>
            </div>
            <button 
              onClick={logout}
              title="Cerrar Sesión"
              className="p-2 rounded-lg transition-all shrink-0 hover:bg-red-500/10 hover:text-red-500"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 p-4 pt-24 lg:p-10 w-full max-h-screen overflow-y-auto" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Mobile Dynamic Title (Part of Scroll) */}
          {location.pathname !== '/client/dashboard' && (
            <div className="lg:hidden mb-10 px-2 animate-in fade-in slide-in-from-top-4 duration-700">
               <h1 className="text-2xl font-bold text-[var(--color-on-surface)] tracking-tight leading-none">
                 {currentTitle}
               </h1>
            </div>
          )}
          
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>
    </div>
    </>
  );
}
