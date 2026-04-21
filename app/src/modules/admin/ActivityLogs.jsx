import { useAuth } from '../../context/AuthContext';
import { Clock, User, Info, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { useState } from 'react';

export default function ActivityLogs() {
  const { allActivityLogs, allOrganizations } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [orgFilter, setOrgFilter] = useState('all');
  const [actorFilter, setActorFilter] = useState('all');

  const filteredLogs = allActivityLogs.filter(log => 
    (log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (orgFilter === 'all' || log.orgId === orgFilter) &&
    (actorFilter === 'all' || (actorFilter === 'superadmin' ? !log.orgId : log.orgId))
  );

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'warning': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'error': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={14} />;
      case 'warning': return <AlertTriangle size={14} />;
      case 'error': return <AlertTriangle size={14} />;
      default: return <Info size={14} />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3aac4]" size={18} />
            <input 
              type="text" 
              placeholder="Filtrar logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#091328] border border-[#40485d]/30 text-[#dee5ff] rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#85adff]/50 w-64 transition-all"
            />
          </div>
          <select
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value)}
            className="bg-[#091328] border border-[#40485d]/30 text-[#dee5ff] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#85adff]/50 transition-all"
          >
            <option value="all">Todas las Org.</option>
            {allOrganizations.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
          <select
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
            className="bg-[#091328] border border-[#40485d]/30 text-[#dee5ff] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#85adff]/50 transition-all"
          >
            <option value="all">Cualquier Actor</option>
            <option value="org">Organización</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-[#091328]/60 border border-[#40485d]/30 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#060e20] border-b border-[#40485d]/30 text-[10px] uppercase font-bold tracking-widest text-[#a3aac4]">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Organización</th>
                <th className="px-6 py-4">Acción</th>
                <th className="px-6 py-4">Detalles</th>
                <th className="px-6 py-4">Tipo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#40485d]/10">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-[#dee5ff]">
                      <Clock size={12} className="text-[#a3aac4]" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#dee5ff]">
                      <User size={14} className="text-[#85adff]" />
                      {log.user}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-[#a3aac4]">
                      {log.orgId ? (allOrganizations.find(o => o.id === log.orgId)?.name || log.orgId) : '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-black text-[#fbabff] uppercase tracking-wider">{log.action}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-[#a3aac4] max-w-sm truncate" title={log.details}>{log.details}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getTypeStyles(log.type)}`}>
                      {getTypeIcon(log.type)}
                      {log.type.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#a3aac4] italic text-sm">
                    No se encontraron registros de actividad.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
