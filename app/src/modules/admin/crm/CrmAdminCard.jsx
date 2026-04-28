import { Users } from 'lucide-react';

export default function CrmAdminCard({ analytics }) {
  const contacts = analytics.stickiness?.globalContacts?.toLocaleString() || '0';
  
  return (
    <div className="bg-[var(--color-surface-container-low)]/60 border border-[#40485d]/30 rounded-3xl p-6 transition-all backdrop-blur-md">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#2E8B57]/10 flex items-center justify-center group-hover:bg-[#2E8B57]/20 transition-colors">
          <Users size={20} className="text-[#2E8B57]" />
        </div>
      </div>
      <p className="text-[var(--color-on-surface-variant)] text-xs font-bold uppercase tracking-wider mb-1">Contactos en CRM</p>
      <h4 className="text-2xl font-black text-[var(--color-on-surface)]">{contacts}</h4>
      <p className="text-[10px] text-[#40485d] mt-2 font-medium">Leads y clientes capturados</p>
    </div>
  );
}
