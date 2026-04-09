import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Box, Calculator, FileText, Calendar, Compass, Settings, LogOut, Bell, Menu, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';

const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

export default function ClientLayout() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const [tenantName, setTenantName] = useState(user?.organizationName || 'Mi Empresa S.A.');

  useEffect(() => {
    if (!isFirebaseConfigured || !user?.organizationId) return;
    
    const unsub = onSnapshot(doc(db, 'tenants', user.organizationId), (configDoc) => {
      if (configDoc.exists() && configDoc.data().name) {
        setTenantName(configDoc.data().name);
      }
    });

    return () => unsub();
  }, [user]);

  return (
    <div className="bg-[#060e20] text-[#dee5ff] min-h-screen font-body flex relative overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SideNavBar Shell */}
      <aside className={`fixed lg:sticky top-0 h-screen w-64 rounded-r-2xl bg-[#091328] flex flex-col py-8 space-y-6 z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-6 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-[#dee5ff] tracking-tighter">{tenantName}</h1>
            <p className="text-xs text-[#a3aac4] font-bold mt-1">Suscripción Activa</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <Link 
            to="/client/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive('/client/dashboard') ? 'bg-[#192540] text-[#85adff] shadow-inner font-bold' : 'text-[#a3aac4] hover:text-[#dee5ff] hover:bg-[#0f1930] font-semibold'}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <LayoutDashboard size={20} />
            <span className="text-sm">Dashboard</span>
          </Link>
          
          <div className="pt-4 pb-2 px-4 text-xs font-bold uppercase tracking-wider text-[#a3aac4]/70">Mis Módulos</div>
          
          <Link 
            to="/client/crm" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive('/client/crm') ? 'bg-[#192540] text-[#85adff] shadow-inner font-bold' : 'text-[#a3aac4] hover:text-[#dee5ff] hover:bg-[#0f1930] font-semibold'}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Users size={20} />
            <span className="text-sm">CRM y Ventas</span>
          </Link>
          
          <Link 
            to="/client/projects" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive('/client/projects') ? 'bg-[#192540] text-[#85adff] shadow-inner font-bold' : 'text-[#a3aac4] hover:text-[#dee5ff] hover:bg-[#0f1930] font-semibold'}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Briefcase size={20} />
            <span className="text-sm border-0 font-semibold">Proyectos</span>
          </Link>
          
          <Link 
            to="/client/inventory" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive('/client/inventory') ? 'bg-[#192540] text-[#85adff] shadow-inner font-bold' : 'text-[#a3aac4] hover:text-[#dee5ff] hover:bg-[#0f1930] font-semibold'}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Box size={20} />
            <span className="text-sm">Inventario</span>
            <span className="ml-auto w-2 h-2 rounded-full bg-[#fbabff]"></span>
          </Link>
          
          <Link 
            to="/client/finance" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive('/client/finance') ? 'bg-[#192540] text-[#85adff] shadow-inner font-bold' : 'text-[#a3aac4] hover:text-[#dee5ff] hover:bg-[#0f1930] font-semibold'}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Calculator size={20} />
            <span className="text-sm border-0 font-semibold">Contabilidad</span>
          </Link>
          
          <Link 
            to="/client/sales" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive('/client/sales') ? 'bg-[#192540] text-[#fbabff] shadow-inner font-bold' : 'text-[#a3aac4] hover:text-[#dee5ff] hover:bg-[#0f1930] font-semibold'}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <FileText size={20} />
            <span className="text-sm">Ventas y Facturación</span>
          </Link>

          <Link 
            to="/client/calendar" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive('/client/calendar') ? 'bg-[#192540] text-[#85adff] shadow-inner font-bold' : 'text-[#a3aac4] hover:text-[#dee5ff] hover:bg-[#0f1930] font-semibold'}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            <Calendar size={20} />
            <span className="text-sm border-0 font-semibold">Agenda y Citas</span>
          </Link>

          <div className="pt-4 pb-2 px-4 text-xs font-bold uppercase tracking-wider text-[#a3aac4]/70">Explorar</div>

          <Link 
            to="/client/marketplace" 
            className="flex items-center gap-3 px-4 py-3 text-[#fbabff] bg-[#f199f7]/10 hover:bg-[#f199f7]/20 rounded-lg transition-all duration-300"
          >
            <Compass size={20} />
            <span className="text-sm font-bold">Marketplace Módulos</span>
          </Link>
        </nav>
        
        <div className="px-4 pt-4 mt-auto border-t border-[#40485d]/10 space-y-2">
          <Link to="/client/settings" onClick={() => setIsSidebarOpen(false)} className="w-full flex items-center gap-3 text-[#a3aac4] px-4 py-3 hover:text-[#dee5ff] hover:bg-[#0f1930] rounded-lg transition-all cursor-pointer">
            <Settings size={20} />
            <span className="font-semibold text-sm">Configuración</span>
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 text-[#a3aac4] px-4 py-3 hover:text-[#dee5ff] hover:bg-[#0f1930] rounded-lg transition-all">
            <LogOut size={20} />
            <span className="font-semibold text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 p-4 lg:p-8 w-full max-h-screen overflow-y-auto">
        {/* TopAppBar Shell */}
        <header className="flex justify-between items-center w-full mb-8 lg:mb-12">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-[#a3aac4] hover:text-[#dee5ff] transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-xl lg:text-2xl font-black tracking-tighter text-[#dee5ff] capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</h2>
              <p className="text-[#a3aac4] text-xs lg:text-sm font-medium hidden sm:block">Monitoreo y gestión en tiempo real</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="relative group">
              <Bell className="text-[#a3aac4] hover:text-[#85adff] cursor-pointer transition-colors" size={20} />
            </div>
            
            <div className="flex items-center gap-3 bg-[#141f38] rounded-full pl-2 pr-4 py-1.5 border border-[#40485d]/10">
              <div className="w-8 h-8 rounded-full bg-[#primary-dim] flex items-center justify-center font-bold text-xs bg-[#85adff]/20 text-[#85adff]">
                {user?.name?.substring(0, 2).toUpperCase() || 'JU'}
              </div>
              <span className="text-sm font-bold text-[#dee5ff] hidden sm:block">{user?.name || 'Juan Dueño'}</span>
            </div>

            <button 
              onClick={logout}
              className="flex items-center gap-2 bg-[#fbabff]/10 hover:bg-[#fbabff]/20 text-[#fbabff] px-4 py-2 rounded-xl transition-all border border-[#fbabff]/20 font-bold text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <Outlet />
      </main>
    </div>
  );
}
