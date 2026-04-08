import { useState } from 'react';
import { Search, Building2, Users, MoreVertical, Plus } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function AdminClients() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Extended mock data for demonstration
  const [organizations] = useState([
    {
      id: 'org_001',
      name: 'TechCorp Solutions',
      industry: 'Software',
      status: 'active',
      users: [
        { id: 'usr_c1', name: 'Juan Cliente', email: 'test@cliente.com', role: 'admin_tenant' },
        { id: 'usr_c3', name: 'María García', email: 'maria@techcorp.com', role: 'user' }
      ]
    },
    {
      id: 'org_002',
      name: 'Global Industries',
      industry: 'Manufacturing',
      status: 'active',
      users: [
        { id: 'usr_c2', name: 'Alex Smith', email: 'alex.smith@global.com', role: 'admin_tenant' }
      ]
    },
    {
      id: 'org_003',
      name: 'Acme Retail',
      industry: 'Retail',
      status: 'inactive',
      users: [
        { id: 'usr_c4', name: 'Carlos Vazquez', email: 'cvazquez@acme.com', role: 'admin_tenant' }
      ]
    }
  ]);

  const filteredOrgs = organizations.filter(org => 
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    org.users.some(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#dee5ff] tracking-tight mb-2">Inquilinos & Organizaciones</h1>
          <p className="text-[#a3aac4] text-sm">Gestione las empresas cliente y sus usuarios vinculados.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3aac4]" size={18} />
            <input 
              type="text" 
              placeholder="Buscar organización o usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#091328] border border-[#40485d]/30 text-[#dee5ff] rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#85adff]/50 w-64 transition-all focus:w-72"
            />
          </div>
          <button className="bg-[#85adff] hover:bg-[#a6c3ff] text-[#060e20] flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-colors">
            <Plus size={18} />
            <span>Nueva Organización</span>
          </button>
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredOrgs.map((org) => (
          <div key={org.id} className="bg-[#091328]/60 border border-[#40485d]/30 rounded-3xl p-6 transition-all hover:border-[#85adff]/20">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#85adff]/10 rounded-2xl flex items-center justify-center text-[#85adff]">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#dee5ff] flex items-center gap-3">
                    {org.name}
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${
                      org.status === 'active' ? 'bg-[#4ADE80]/10 text-[#4ADE80]' : 'bg-[#F87171]/10 text-[#F87171]'
                    }`}>
                      {org.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </h3>
                  <p className="text-xs text-[#a3aac4] uppercase tracking-wider font-semibold">{org.industry} &bull; ID: {org.id}</p>
                </div>
              </div>
              <button className="text-[#a3aac4] hover:text-[#dee5ff] p-2 bg-[#141f38] rounded-xl transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="border border-[#40485d]/10 rounded-2xl bg-[#060e20]/50 p-4">
              <h4 className="text-xs uppercase tracking-widest text-[#a3aac4] font-bold mb-4 flex items-center gap-2">
                <Users size={14} />
                Usuarios Vinculados ({org.users.length})
              </h4>
              <div className="space-y-3">
                {org.users.map(u => (
                  <div key={u.id} className="flex items-center justify-between text-sm group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#141f38] border border-[#40485d]/20 flex items-center justify-center text-xs font-bold text-[#85adff]">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#dee5ff] group-hover:text-[#85adff] transition-colors">{u.name}</p>
                        <p className="text-xs text-[#a3aac4]">{u.email}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-[#141f38] text-[#fbabff] border border-[#fbabff]/10">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button className="flex-1 bg-[#141f38] hover:bg-[#1e2a4a] text-[#dee5ff] py-2 rounded-xl text-sm font-bold transition-colors">
                Editar Organización
              </button>
              <button className="flex-1 bg-[#85adff]/10 hover:bg-[#85adff]/20 text-[#85adff] border border-[#85adff]/20 py-2 rounded-xl text-sm font-bold transition-colors">
                Administrar Módulos
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredOrgs.length === 0 && (
        <div className="text-center py-16 bg-[#091328]/30 rounded-3xl border border-[#40485d]/20">
          <Building2 size={48} className="mx-auto text-[#a3aac4]/30 mb-4" />
          <p className="text-[#a3aac4] font-medium">No se encontraron organizaciones o usuarios que coincidan con la búsqueda.</p>
        </div>
      )}
    </div>
  );
}
