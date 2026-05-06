import { useGetAuditLogs } from '../../../hooks/useAuditLog';
import { Clock, User, Box, Activity, Search } from 'lucide-react';
import { useState } from 'react';

export default function AuditLogsTab({ orgId }) {
  const { logs, loading, hasMore, loadMore } = useGetAuditLogs(orgId);
  const [filter, setFilter] = useState('');

  const filteredLogs = logs.filter(log => 
    log.userName?.toLowerCase().includes(filter.toLowerCase()) ||
    log.action?.toLowerCase().includes(filter.toLowerCase()) ||
    log.module?.toLowerCase().includes(filter.toLowerCase()) ||
    log.details?.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-10 h-10 border-4 border-[#6B4FD8]/20 border-t-[#6B4FD8] rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest">Cargando historial...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4 bg-[var(--color-surface-container-low)]/60 border border-[var(--color-outline-variant)] p-4 rounded-2xl">
        <div className="flex items-center gap-3 flex-1">
          <Search size={18} className="text-[var(--color-on-surface-variant)]" />
          <input 
            type="text" 
            placeholder="Buscar por usuario, acción o módulo..." 
            className="bg-transparent border-none outline-none text-sm w-full text-[var(--color-on-surface)]"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wider">
          {filteredLogs.length} eventos registrados
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[27px] top-0 bottom-0 w-px bg-[var(--color-outline-variant)]"></div>
        
        <div className="space-y-6">
          {filteredLogs.map((log) => (
            <div key={log.id} className="relative pl-14 group">
              <div className="absolute left-4 top-1 w-7 h-7 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-full flex items-center justify-center z-10 transition-colors group-hover:border-[#6B4FD8]/50">
                <Activity size={14} className="text-[var(--color-primary)]" />
              </div>
              
              <div className="bg-[var(--color-surface-container-low)]/40 border border-[var(--color-outline-variant)] rounded-2xl p-4 hover:border-[#6B4FD8]/30 transition-all hover:shadow-lg hover:shadow-[#6B4FD8]/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-[var(--color-on-surface)]">{log.userName}</span>
                    <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded border tracking-widest leading-none bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] border-[var(--color-outline-variant)]`}>
                      {log.module}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-on-surface-variant)] font-bold">
                    <Clock size={12} />
                    {log.timestamp.toLocaleString()}
                  </div>
                </div>
                
                <p className="text-sm text-[var(--color-on-surface)] leading-relaxed">
                  <span className="font-bold text-[#6B4FD8]">{log.action}:</span> {log.details}
                </p>
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && !loading && (
            <div className="text-center py-20 bg-[var(--color-surface-container-low)]/40 border border-dashed border-[var(--color-outline-variant)] rounded-3xl">
              <Box size={40} className="mx-auto text-[var(--color-on-surface-variant)]/20 mb-4" />
              <p className="text-[var(--color-on-surface-variant)] font-bold">No se encontraron registros de auditoría.</p>
            </div>
          )}
        </div>
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <button 
            onClick={loadMore}
            className="px-6 py-2 bg-[var(--color-surface-container-high)] hover:bg-[var(--color-surface-container-highest)] text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest rounded-xl border border-[var(--color-outline-variant)] transition-all flex items-center gap-2 group"
          >
            <Activity size={14} className="group-hover:animate-pulse" />
            Cargar más registros
          </button>
        </div>
      )}
    </div>
  );
}
