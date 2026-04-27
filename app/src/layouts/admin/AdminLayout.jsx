import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, CreditCard, Blocks, HelpCircle, LogOut, Bell, Settings, FileText, Activity, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import VeloLogo from '../../components/VeloLogo';

export default function AdminLayout() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-on-surface)' }} className="min-h-screen font-body flex transition-colors duration-300">
      {/* SideNavBar Shell */}
      <aside style={{ backgroundColor: 'var(--color-surface-container-low)' }} className="fixed lg:sticky left-0 top-0 h-screen w-64 rounded-r-2xl flex flex-col py-8 space-y-6 z-40 transition-all duration-300">
        <div className="px-6 mb-8 flex justify-between items-center gap-2">
          <div className="flex-1 min-w-0">
            <VeloLogo variant="horizontal" mode={isDark ? 'dark' : 'light'} size="150" className="w-full" />
          </div>
          {/* Botón Toggle Tema */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="relative w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 focus:outline-none shrink-0"
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
        
        <nav className="flex-1 px-4 space-y-2">
          {/* Active Tab: Dashboard */}
          <Link 
            to="/admin/dashboard" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm"
            style={isActive('/admin/dashboard') ? { backgroundColor: 'var(--color-surface-variant)', color: 'var(--color-primary)', fontWeight: 700 } : { color: 'var(--color-on-surface-variant)' }}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          
          <Link 
            to="/admin/clients" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm"
            style={isActive('/admin/clients') ? { backgroundColor: 'var(--color-surface-variant)', color: 'var(--color-primary)', fontWeight: 700 } : { color: 'var(--color-on-surface-variant)' }}
          >
            <Users size={20} />
            <span>Clientes</span>
          </Link>
          
          <Link 
            to="/admin/sales" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm"
            style={isActive('/admin/sales') ? { backgroundColor: 'var(--color-surface-variant)', color: 'var(--color-primary)', fontWeight: 700 } : { color: 'var(--color-on-surface-variant)' }}
          >
            <FileText size={20} />
            <span>Ventas y Facturas</span>
          </Link>
          
          <Link 
            to="/admin/logs" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm"
            style={isActive('/admin/logs') ? { backgroundColor: 'var(--color-surface-variant)', color: 'var(--color-primary)', fontWeight: 700 } : { color: 'var(--color-on-surface-variant)' }}
          >
            <Activity size={20} />
            <span>Auditoría / Logs</span>
          </Link>
        </nav>
        
        <div className="px-4 pt-4 mt-auto border-t space-y-2" style={{ borderColor: 'var(--color-outline-variant)' }}>
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-semibold hover:bg-[var(--color-surface-container)]"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 p-6 lg:p-10 w-full max-h-screen overflow-y-auto" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
