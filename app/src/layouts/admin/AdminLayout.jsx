import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, CreditCard, Blocks, HelpCircle, LogOut, Bell, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const { user, logout } = useAuth();

  return (
    <div className="bg-[#060e20] text-[#dee5ff] min-h-screen font-body flex">
      {/* SideNavBar Shell */}
      <aside className="fixed left-0 top-0 h-full w-64 rounded-r-2xl bg-[#091328] flex flex-col py-8 space-y-6 z-40">
        <div className="px-6 mb-8">
          <h1 className="text-xl font-bold text-[#dee5ff] tracking-tighter">Studio Alpha (Admin)</h1>
          <p className="text-xs text-[#a3aac4] uppercase tracking-widest font-bold mt-1">Design & Planning</p>
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
          
          <Link to="/admin/projects" className="flex items-center gap-3 text-[#a3aac4] px-4 py-3 hover:text-[#dee5ff] hover:bg-[#0f1930] rounded-lg transition-all duration-300 hover:translate-x-1">
            <FolderKanban size={20} />
            <span className="font-semibold text-sm">Projects</span>
          </Link>
          
          <Link to="/admin/clients" className="flex items-center gap-3 text-[#a3aac4] px-4 py-3 hover:text-[#dee5ff] hover:bg-[#0f1930] rounded-lg transition-all duration-300 hover:translate-x-1">
            <Users size={20} />
            <span className="font-semibold text-sm">Tenants / Clients</span>
          </Link>
          
          <Link to="/admin/payments" className="flex items-center gap-3 text-[#a3aac4] px-4 py-3 hover:text-[#dee5ff] hover:bg-[#0f1930] rounded-lg transition-all duration-300 hover:translate-x-1">
            <CreditCard size={20} />
            <span className="font-semibold text-sm">Billing</span>
          </Link>
          
          <Link to="/admin/modules" className="flex items-center gap-3 text-[#a3aac4] px-4 py-3 hover:text-[#dee5ff] hover:bg-[#0f1930] rounded-lg transition-all duration-300 hover:translate-x-1">
            <Blocks size={20} />
            <span className="font-semibold text-sm">Modules</span>
          </Link>
        </nav>
        
        <div className="px-4 pt-4 mt-auto border-t border-[#40485d]/10 space-y-2">
          <button className="w-full flex items-center gap-3 text-[#a3aac4] px-4 py-3 hover:text-[#dee5ff] hover:bg-[#0f1930] rounded-lg transition-all">
            <HelpCircle size={20} />
            <span className="font-semibold text-sm">Support</span>
          </button>
          <button onClick={logout} className="w-full flex items-center gap-3 text-[#a3aac4] px-4 py-3 hover:text-[#dee5ff] hover:bg-[#0f1930] rounded-lg transition-all">
            <LogOut size={20} />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="ml-64 p-8 w-full">
        {/* TopAppBar Shell */}
        <header className="flex justify-between items-center w-full mb-12">
          <div>
            <h2 className="text-2xl font-black tracking-tighter text-[#dee5ff]">ArchitectOS Admin</h2>
            <p className="text-[#a3aac4] text-sm font-medium">Core Administration / Dashboard Overview</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Bell className="text-[#a3aac4] hover:text-[#85adff] cursor-pointer transition-colors" size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#fbabff] rounded-full"></span>
            </div>
            
            <Settings className="text-[#a3aac4] hover:text-[#85adff] cursor-pointer transition-colors" size={20} />
            
            <div className="flex items-center gap-3 bg-[#141f38] rounded-full pl-2 pr-4 py-1.5 border border-[#40485d]/10">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop" 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover" 
              />
              <span className="text-sm font-bold text-[#dee5ff]">{user?.name || 'Super Admin'}</span>
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
