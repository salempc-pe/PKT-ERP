import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Box, Calculator, FileText, Calendar, Compass, Settings, LogOut, Bell, Menu, Sun, Moon, Building, Shield, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';

const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

export default function ClientLayout() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, isImpersonating, stopImpersonation } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  if (!user) {
    return <Navigate to="/" replace />;
  }
  const [tenantName, setTenantName] = useState(user?.organizationName || 'Mi Empresa S.A.');
  const [tenantLogo, setTenantLogo] = useState(null);

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
        {/* Botón flotante para menú móvil (aparece cuando sidebar está cerrado y es movil) */}
        <button 
          className="lg:hidden fixed top-6 left-6 z-40 p-3 rounded-xl shadow-lg transition-all duration-300"
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
      <aside style={{ backgroundColor: 'var(--color-surface-container-low)' }} className={`fixed lg:sticky top-0 h-screen w-64 rounded-r-2xl flex flex-col py-8 space-y-6 z-50 transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            {/* Logo Container */}
            <div className="group relative">
               <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-110 shadow-lg"
                style={{ 
                  backgroundColor: 'var(--color-primary-container)', 
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-outline-variant)'
                }}
              >
                {tenantLogo ? (
                  <img src={tenantLogo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building size={24} />
                )}
              </div>
            </div>

            {/* Botón Toggle Tema */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="relative w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 focus:outline-none"
              style={{
                backgroundColor: isDark ? 'var(--color-surface-variant)' : 'var(--color-primary-container)',
              }}
            >
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center shadow-md transition-all duration-300"
                style={{
                  transform: isDark ? 'translateX(0)' : 'translateX(24px)',
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                }}
              >
                {isDark
                  ? <Moon size={10} strokeWidth={2.5} />
                  : <Sun size={10} strokeWidth={2.5} />}
              </span>
            </button>
          </div>

          <div>
            <h1 style={{ color: 'var(--color-on-surface)' }} className="text-xl font-bold tracking-tighter truncate max-w-full" title={tenantName}>{tenantName}</h1>
            <p style={{ color: 'var(--color-on-surface-variant)' }} className="text-[10px] font-bold mt-0.5 uppercase tracking-widest opacity-70">Empresa Verificada</p>
          </div>
        </div>
           <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <Link 
            to="/client/dashboard" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm"
            style={isActive('/client/dashboard') ? { backgroundColor: 'var(--color-surface-variant)', color: 'var(--color-primary)', fontWeight: 700 } : { color: 'var(--color-on-surface-variant)' }}
            onMouseEnter={e => { if (!isActive('/client/dashboard')) { e.currentTarget.style.color = 'var(--color-on-surface)'; e.currentTarget.style.backgroundColor = 'var(--color-surface-container)'; } }}
            onMouseLeave={e => { if (!isActive('/client/dashboard')) { e.currentTarget.style.color = 'var(--color-on-surface-variant)'; e.currentTarget.style.backgroundColor = ''; } }}
            onClick={() => setIsSidebarOpen(false)}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          
          {(user?.subscription?.activeModules?.length > 0) && (
            <div style={{ color: 'var(--color-on-surface-variant)' }} className="pt-4 pb-2 px-4 text-[10px] font-bold uppercase tracking-widest opacity-50">Módulos</div>
          )}
          
          {user?.subscription?.activeModules?.includes('crm') && (
            <Link 
              to="/client/crm" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm"
              style={isActive('/client/crm') ? { backgroundColor: 'var(--color-surface-variant)', color: 'var(--color-primary)', fontWeight: 700 } : { color: 'var(--color-on-surface-variant)' }}
              onMouseEnter={e => { if (!isActive('/client/crm')) { e.currentTarget.style.color = 'var(--color-on-surface)'; e.currentTarget.style.backgroundColor = 'var(--color-surface-container)'; } }}
              onMouseLeave={e => { if (!isActive('/client/crm')) { e.currentTarget.style.color = 'var(--color-on-surface-variant)'; e.currentTarget.style.backgroundColor = ''; } }}
              onClick={() => setIsSidebarOpen(false)}
            >
              <Users size={20} />
              <span>CRM y Ventas</span>
            </Link>
          )}
          
          {user?.subscription?.activeModules?.includes('projects') && (
            <Link 
              to="/client/projects" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm"
              style={isActive('/client/projects') ? { backgroundColor: 'var(--color-surface-variant)', color: 'var(--color-primary)', fontWeight: 700 } : { color: 'var(--color-on-surface-variant)' }}
              onMouseEnter={e => { if (!isActive('/client/projects')) { e.currentTarget.style.color = 'var(--color-on-surface)'; e.currentTarget.style.backgroundColor = 'var(--color-surface-container)'; } }}
              onMouseLeave={e => { if (!isActive('/client/projects')) { e.currentTarget.style.color = 'var(--color-on-surface-variant)'; e.currentTarget.style.backgroundColor = ''; } }}
              onClick={() => setIsSidebarOpen(false)}
            >
              <Briefcase size={20} />
              <span>Proyectos</span>
            </Link>
          )}
          
          {user?.subscription?.activeModules?.includes('inventory') && (
            <Link 
              to="/client/inventory" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm"
              style={isActive('/client/inventory') ? { backgroundColor: 'var(--color-surface-variant)', color: 'var(--color-primary)', fontWeight: 700 } : { color: 'var(--color-on-surface-variant)' }}
              onMouseEnter={e => { if (!isActive('/client/inventory')) { e.currentTarget.style.color = 'var(--color-on-surface)'; e.currentTarget.style.backgroundColor = 'var(--color-surface-container)'; } }}
              onMouseLeave={e => { if (!isActive('/client/inventory')) { e.currentTarget.style.color = 'var(--color-on-surface-variant)'; e.currentTarget.style.backgroundColor = ''; } }}
              onClick={() => setIsSidebarOpen(false)}
            >
              <Box size={20} />
              <span>Inventario</span>
            </Link>
          )}
          
          {user?.subscription?.activeModules?.includes('finance') && (
            <Link 
              to="/client/finance" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm"
              style={isActive('/client/finance') ? { backgroundColor: 'var(--color-surface-variant)', color: 'var(--color-primary)', fontWeight: 700 } : { color: 'var(--color-on-surface-variant)' }}
              onMouseEnter={e => { if (!isActive('/client/finance')) { e.currentTarget.style.color = 'var(--color-on-surface)'; e.currentTarget.style.backgroundColor = 'var(--color-surface-container)'; } }}
              onMouseLeave={e => { if (!isActive('/client/finance')) { e.currentTarget.style.color = 'var(--color-on-surface-variant)'; e.currentTarget.style.backgroundColor = ''; } }}
              onClick={() => setIsSidebarOpen(false)}
            >
              <Calculator size={20} />
              <span>Contabilidad</span>
            </Link>
          )}
          
          {user?.subscription?.activeModules?.includes('sales') && (
            <Link 
              to="/client/sales" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm"
              style={isActive('/client/sales') ? { backgroundColor: 'var(--color-surface-variant)', color: 'var(--color-tertiary)', fontWeight: 700 } : { color: 'var(--color-on-surface-variant)' }}
              onMouseEnter={e => { if (!isActive('/client/sales')) { e.currentTarget.style.color = 'var(--color-on-surface)'; e.currentTarget.style.backgroundColor = 'var(--color-surface-container)'; } }}
              onMouseLeave={e => { if (!isActive('/client/sales')) { e.currentTarget.style.color = 'var(--color-on-surface-variant)'; e.currentTarget.style.backgroundColor = ''; } }}
              onClick={() => setIsSidebarOpen(false)}
            >
              <FileText size={20} />
              <span>Ventas y Facturas</span>
            </Link>
          )}

          {user?.subscription?.activeModules?.includes('purchases') && (
            <Link 
              to="/client/purchases" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm"
              style={isActive('/client/purchases') ? { backgroundColor: 'var(--color-surface-variant)', color: 'var(--color-primary)', fontWeight: 700 } : { color: 'var(--color-on-surface-variant)' }}
              onMouseEnter={e => { if (!isActive('/client/purchases')) { e.currentTarget.style.color = 'var(--color-on-surface)'; e.currentTarget.style.backgroundColor = 'var(--color-surface-container)'; } }}
              onMouseLeave={e => { if (!isActive('/client/purchases')) { e.currentTarget.style.color = 'var(--color-on-surface-variant)'; e.currentTarget.style.backgroundColor = ''; } }}
              onClick={() => setIsSidebarOpen(false)}
            >
              <ShoppingCart size={20} />
              <span>Compras y Proveedores</span>
            </Link>
          )}
  
          {user?.subscription?.activeModules?.includes('calendar') && (
            <Link 
              to="/client/calendar" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm"
              style={isActive('/client/calendar') ? { backgroundColor: 'var(--color-surface-variant)', color: 'var(--color-primary)', fontWeight: 700 } : { color: 'var(--color-on-surface-variant)' }}
              onMouseEnter={e => { if (!isActive('/client/calendar')) { e.currentTarget.style.color = 'var(--color-on-surface)'; e.currentTarget.style.backgroundColor = 'var(--color-surface-container)'; } }}
              onMouseLeave={e => { if (!isActive('/client/calendar')) { e.currentTarget.style.color = 'var(--color-on-surface-variant)'; e.currentTarget.style.backgroundColor = ''; } }}
              onClick={() => setIsSidebarOpen(false)}
            >
              <Calendar size={20} />
              <span>Agenda</span>
            </Link>
          )}

          {user?.role === 'client' && (
            <Link 
              to="/client/team" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm"
              style={isActive('/client/team') ? { backgroundColor: 'var(--color-surface-variant)', color: 'var(--color-primary)', fontWeight: 700 } : { color: 'var(--color-on-surface-variant)' }}
              onMouseEnter={e => { if (!isActive('/client/team')) { e.currentTarget.style.color = 'var(--color-on-surface)'; e.currentTarget.style.backgroundColor = 'var(--color-surface-container)'; } }}
              onMouseLeave={e => { if (!isActive('/client/team')) { e.currentTarget.style.color = 'var(--color-on-surface-variant)'; e.currentTarget.style.backgroundColor = ''; } }}
              onClick={() => setIsSidebarOpen(false)}
            >
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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0" 
              style={{ 
                backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)', 
                color: 'var(--color-primary)',
                border: '1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)'
              }}>
              {user?.name?.substring(0, 2).toUpperCase() || 'JU'}
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <p className="text-xs font-black truncate" style={{ color: 'var(--color-on-surface)' }}>{user?.name || 'Juan Dueño'}</p>
              <p className="text-[10px] font-bold opacity-50 truncate" style={{ color: 'var(--color-on-surface-variant)' }}>Administrador</p>
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
      <main className="flex-1 p-6 lg:p-10 w-full max-h-screen overflow-y-auto" style={{ backgroundColor: 'var(--color-background)' }}>
        {/* Dynamic Route Content (NO HEADER) */}
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
    </>
  );
}

