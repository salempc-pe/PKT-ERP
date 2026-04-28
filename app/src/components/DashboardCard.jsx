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
      className="group relative bg-[var(--color-surface-container)] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 shadow-sm hover:shadow-xl hover:bg-[var(--color-surface-container-high)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
      style={{ borderColor: `${color}15` }}
    >
      {/* Background Glow */}
      <div 
        className="absolute -right-4 -top-4 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{ backgroundColor: color }}
      ></div>

      <div className="flex items-start gap-4 mb-4 md:mb-6 relative z-10">
        <div 
          className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          {Icon && <Icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-black text-[var(--color-on-surface)] leading-tight">{title}</h3>
          <p className="text-[10px] md:text-xs text-[var(--color-on-surface-variant)] font-medium leading-tight mt-0.5 line-clamp-1">{description}</p>
        </div>
        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shrink-0">
          <ExternalLink size={12} className="text-[var(--color-on-surface)]/40" />
        </div>
      </div>

      {/* Metrics Section */}
      <div className="mt-auto grid grid-cols-2 gap-4 pt-4 md:pt-6 border-t border-white/5 relative z-10">
        {metrics.map((m, idx) => (
          <div key={idx}>
            <p className="text-[9px] md:text-[10px] uppercase font-bold text-[var(--color-on-surface-variant)] tracking-widest mb-1 md:mb-1.5">{m.label}</p>
            {loading ? (
              <div className="h-6 w-16 bg-white/5 animate-pulse rounded"></div>
            ) : (
              <p className={`text-base md:text-lg font-black ${m.color || 'text-[var(--color-on-surface)]'}`}>{m.value}</p>
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
