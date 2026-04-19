import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardCard({ 
  title, 
  description, 
  icon: Icon, 
  path, 
  color, 
  loading, 
  metrics 
}) {
  return (
    <Link 
      to={path} 
      className="group relative bg-[#141f38] border border-white/5 rounded-[2rem] p-8 hover:bg-[#1a264a] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
      style={{ borderColor: `${color}15` }}
    >
      {/* Background Glow */}
      <div 
        className="absolute -right-4 -top-4 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ backgroundColor: color }}
      ></div>

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          {Icon && <Icon size={28} strokeWidth={2.5} />}
        </div>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
          <ExternalLink size={14} className="text-[#dee5ff]/40" />
        </div>
      </div>

      <div className="mb-8 relative z-10">
        <h3 className="text-2xl font-black text-[#dee5ff] mb-2">{title}</h3>
        <p className="text-sm text-[#a3aac4] font-medium leading-relaxed">{description}</p>
      </div>

      {/* Metrics Section */}
      <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-white/5 relative z-10">
        {metrics.map((m, idx) => (
          <div key={idx}>
            <p className="text-[10px] uppercase font-bold text-[#a3aac4] tracking-widest mb-1.5">{m.label}</p>
            {loading ? (
              <div className="h-6 w-16 bg-white/5 animate-pulse rounded"></div>
            ) : (
              <p className="text-lg font-black text-[#dee5ff]">{m.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Hover Stroke */}
      <div 
        className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
        style={{ backgroundColor: color }}
      ></div>
    </Link>
  );
}
