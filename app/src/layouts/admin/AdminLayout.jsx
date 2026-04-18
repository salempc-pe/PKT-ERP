import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, CreditCard, Blocks, HelpCircle, LogOut, Bell, Settings, FileText, Activity, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function AdminLayout() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-[#060e20] text-[#dee5ff] min-h-screen font-body flex">
      {/* SideNavBar Shell */}
      <aside className="fixed lg:sticky left-0 top-0 h-screen w-64 rounded-r-2xl bg-[#091328] flex flex-col py-8 space-y-6 z-40">
        <div className="px-6 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-[#dee5ff] tracking-tighter">Studio Alpha (Admin)</h1>
            <p className="text-xs text-[#a3aac4] uppercase tracking-widest font-bold mt-1">Design & Planning</p>
          </div>
          {/* Botón Toggle Tema */}
          <button
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
        
        <nav className="flex-1 px-4 space-y-2">
          {/* Active Tab: Dashboard */}
          <Link 
            to="/admin/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:translate-x-1 ${isActive('/admin/dashboard') ? 'bg-[#192540] text-[#85adff] shadow-inner' : 'text-[#a3aac4] hover:text-[#dee5ff] hover:bg-[#0f1930]'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-semibold text-sm">Dashboard</span>
          </Link>
          
          <Link to="/admin/clients" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:translate-x-1 ${isActive('/admin/clients') ? 'bg-[#192540] text-[#85adff] shadow-inner' : 'text-[#a3aac4] hover:text-[#dee5ff] hover:bg-[#0f1930]'}`}>
            <Users size={20} />
            <span className="font-semibold text-sm">Tenants / Clients</span>
          </Link>
          
          <Link to="/admin/sales" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:translate-x-1 ${isActive('/admin/sales') ? 'bg-[#192540] text-[#85adff] shadow-inner' : 'text-[#a3aac4] hover:text-[#dee5ff] hover:bg-[#0f1930]'}`}>
            <FileText size={20} />
            <span className="font-semibold text-sm">Ventas y Facturas</span>
          </Link>
          
          <Link to="/admin/logs" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:translate-x-1 ${isActive('/admin/logs') ? 'bg-[#192540] text-[#85adff] shadow-inner' : 'text-[#a3aac4] hover:text-[#dee5ff] hover:bg-[#0f1930]'}`}>
            <Activity size={20} />
            <span className="font-semibold text-sm">Auditoría / Logs</span>
          </Link>
          

        </nav>
        
        <div className="px-4 pt-4 mt-auto border-t border-[#40485d]/10 space-y-2">
          <button onClick={logout} className="w-full flex items-center gap-3 text-[#a3aac4] px-4 py-3 hover:text-[#dee5ff] hover:bg-[#0f1930] rounded-lg transition-all">
            <LogOut size={20} />
            <span className="font-semibold text-sm">Logout</span>
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
