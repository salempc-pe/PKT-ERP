import React, { useMemo } from 'react';
import { BarChart2, Calendar, ChevronLeft, ChevronRight, Info, Edit3, Trash2 } from 'lucide-react';

export default function ProjectGantt({ tasks, onEditTask, onDeleteTask }) {
  // Configuración de la escala de tiempo (4 semanas)
  const timeScale = useMemo(() => {
    const today = new Date();
    // Establecer a las 00:00:00.000 locales para cálculos precisos
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    start.setDate(start.getDate() - 7); // Empezar una semana atrás
    
    const days = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }
    return days;
  }, []);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0));
  }, [tasks]);

  const getTaskPosition = (task) => {
    if (!task.startDate || !task.dueDate) return null;
    
    // Parsing forzando medianoche local (yyyy-mm-dd) para evitar corrimientos de zona horaria UTC
    const parseLocalDate = (dateStr) => {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      }
      const d = new Date(dateStr);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    };

    const start = parseLocalDate(task.startDate);
    const end = parseLocalDate(task.dueDate);
    
    const scaleStart = timeScale[0];
    const scaleEnd = timeScale[timeScale.length - 1];

    // Si la tarea termina antes de que empiece el calendario o empieza después de que termine
    if (end < scaleStart || start > scaleEnd) return null;

    const diffDays = (d2, d1) => Math.round((d2 - d1) / (1000 * 60 * 60 * 24));

    // Calcular el índice de inicio relativo a la escala
    const startIndex = Math.max(0, diffDays(start, scaleStart));
    // Calcular el índice final relativo a la escala (+1 para cubrir el día completo)
    const endIndex = Math.min(timeScale.length, diffDays(end, scaleStart) + 1);

    // Asegurar una longitud mínima
    const safeEndIndex = endIndex <= startIndex ? startIndex + 1 : endIndex;
    
    return {
      gridColumnStart: startIndex + 2, // +2 porque la columna 1 es fija para nombres de tareas
      gridColumnEnd: safeEndIndex + 2
    };
  };

  const getProgressBarColor = (progress) => {
    if (progress <= 30) return 'from-red-600 via-red-500 to-red-600';
    if (progress <= 50) return 'from-orange-600 via-orange-500 to-orange-600';
    if (progress <= 80) return 'from-emerald-900 via-emerald-800 to-emerald-900';
    return 'from-green-500 via-green-400 to-green-500';
  };

  const formatDateRange = (start, due) => {
    if (!start || !due) return null;
    try {
      const s = new Date(start).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      const d = new Date(due).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      return `${s} - ${d}`;
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="bg-[var(--color-surface-container)] rounded-3xl border border-[var(--color-outline-variant)] overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
      {/* Header del Gantt */}
      <div className="p-4 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-surface-variant)]/50">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-[#6B4FD8]/10 rounded-xl">
                <BarChart2 size={18} className="text-[var(--color-primary)]" />
            </div>
            <div>
                <h3 className="text-sm font-black text-[var(--color-on-surface)] uppercase tracking-wider">Diagrama de Gantt</h3>
                <p className="text-[10px] text-[var(--color-on-surface-variant)] font-bold uppercase">Cronograma de 30 días</p>
            </div>
        </div>
        <div className="flex gap-2">
            <div className="flex items-center gap-4 px-4 py-2 bg-[var(--color-surface-container)] rounded-xl border border-[var(--color-outline-variant)]">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#6B4FD8]"></div>
                    <span className="text-[9px] font-black uppercase text-[var(--color-on-surface-variant)]">Planificado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[9px] font-black uppercase text-[var(--color-on-surface-variant)]">Progreso</span>
                </div>
            </div>
        </div>
      </div>

      {/* Grid del Gantt */}
      <div className="overflow-x-auto">
        <div className="min-w-[1200px] grid" style={{ gridTemplateColumns: `250px repeat(${timeScale.length}, 1fr)` }}>
          
          {/* Header de Fechas */}
          <div className="h-12 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-variant)]/20 sticky left-0 z-10 flex items-center px-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">Tareas</span>
          </div>
          {timeScale.map((date, i) => (
            <div 
                key={i} 
                className={`h-12 border-b border-l border-[var(--color-outline-variant)] flex flex-col items-center justify-center ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-black/10' : ''}`}
            >
              <span className="text-[9px] font-bold text-[var(--color-on-surface-variant)] uppercase">{date.toLocaleDateString('es-ES', { weekday: 'short' })}</span>
              <span className={`text-[10px] font-black ${date.toDateString() === new Date().toDateString() ? 'text-[#6B4FD8] bg-[#6B4FD8]/10 px-1.5 py-0.5 rounded-md' : 'text-[var(--color-on-surface)]'}`}>
                {date.getDate()}
              </span>
            </div>
          ))}

          {/* Filas de Tareas */}
          {sortedTasks.map(task => {
            const pos = getTaskPosition(task);
            return (
              <React.Fragment key={task.id}>
                {/* Nombre de Tarea (Columna Fija) */}
                <div className="h-14 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] sticky left-0 z-10 flex items-center px-6 group transition-all duration-300 hover:bg-[#6B4FD8]/5 relative overflow-hidden">
                  {/* Hover Stroke Vertical (Luz que se completa de arriba a abajo) */}
                  <div className="absolute left-0 top-0 w-1 h-0 group-hover:h-full transition-all duration-500 bg-[#6B4FD8] z-20"></div>
                  
                  <div className="flex flex-col flex-1">
                    <span className="text-[11px] font-bold text-[var(--color-on-surface)] line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">{task.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-medium text-[var(--color-on-surface-variant)] uppercase">{task.status.replace('_', ' ')}</span>
                      {formatDateRange(task.startDate, task.dueDate) && (
                        <div className="flex items-center gap-1 text-[8px] font-black text-[#6B4FD8] bg-[#6B4FD8]/5 px-1.5 py-0.5 rounded border border-[#6B4FD8]/10">
                          <Calendar size={10} />
                          <span>{formatDateRange(task.startDate, task.dueDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acciones en hover */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <button 
                      onClick={() => onEditTask?.(task)}
                      className="p-1.5 bg-[#6B4FD8]/10 text-[var(--color-primary)] hover:bg-[#6B4FD8] hover:text-white rounded-lg transition-all border border-[#6B4FD8]/20"
                      title="Editar"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button 
                      onClick={() => onDeleteTask?.(task.id)}
                      className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-red-500/20"
                      title="Eliminar"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* Línea de tiempo de la tarea */}
                {pos ? (
                  <div className="h-14 border-b border-[var(--color-outline-variant)] relative" style={{ gridColumn: `${pos.gridColumnStart} / ${pos.gridColumnEnd}` }}>
                    <div className="absolute inset-y-2.5 left-0 right-0 bg-[var(--color-surface-container)] rounded-full border border-[#6B4FD8]/30 overflow-hidden flex items-center group/bar cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                        {/* Barra de progreso real con efecto 3D y animación */}
                        <div 
                            className={`h-full bg-gradient-to-r ${getProgressBarColor(task.progress || 0)} relative transition-all duration-500 origin-left group-hover/bar:animate-scale-progress shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.2)]`} 
                            style={{ width: `${task.progress || 0}%` }}
                        >
                            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                        </div>
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] opacity-100 z-10 transition-all group-hover/bar:scale-110">
                            {task.progress || 0}% COMPLETADO
                        </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-14 border-b border-[var(--color-outline-variant)]" style={{ gridColumn: `2 / span ${timeScale.length}` }}>
                    <div className="h-full flex items-center px-4 opacity-20">
                        <span className="text-[9px] italic">Sin fechas definidas</span>
                    </div>
                  </div>
                )}

                {/* Background Cells (Para las columnas de días) */}
                {timeScale.map((date, i) => (
                    <div 
                        key={`bg-${task.id}-${i}`} 
                        className={`h-14 border-b border-l border-[var(--color-outline-variant)]/30 ${date.getDay() === 0 || date.getDay() === 6 ? 'bg-black/5' : ''}`}
                        style={{ gridColumn: i + 2 }}
                    ></div>
                ))}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {sortedTasks.length === 0 && (
        <div className="p-20 flex flex-col items-center justify-center gap-4 text-[var(--color-on-surface-variant)]">
            <Info size={40} className="opacity-20" />
            <p className="font-bold text-sm uppercase tracking-tighter opacity-40">No hay tareas planificadas para este proyecto</p>
        </div>
      )}
    </div>
  );
}
