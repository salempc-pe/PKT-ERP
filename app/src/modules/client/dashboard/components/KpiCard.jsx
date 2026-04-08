import { Divide } from 'lucide-react';

export default function KpiCard({ title, value, icon: Icon, colorClass, loading }) {
  // Ej: colorClass = "text-[#85adff] bg-[#85adff]/20" and "border-[#85adff]/20"
  // Here we'll just pass a base color and derive classes, or pass classes directly.
  
  return (
    <div className={`border bg-[#141f38] p-6 rounded-2xl transition-all duration-300 ${colorClass.border}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${colorClass.iconBg} ${colorClass.iconText}`}>
        {Icon && <Icon size={24} />}
      </div>
      <p className="text-[10px] uppercase font-bold text-[#a3aac4] tracking-widest mb-1">{title}</p>
      {loading ? (
        <div className="h-8 w-24 bg-[#192540] animate-pulse rounded"></div>
      ) : (
        <p className={`text-2xl font-black ${colorClass.valueText || 'text-[#dee5ff]'}`}>{value}</p>
      )}
    </div>
  );
}
