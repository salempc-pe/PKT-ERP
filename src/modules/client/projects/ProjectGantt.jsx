import React, { useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Info } from 'lucide-react';

export default function ProjectGantt({ tasks }) {
  // Configuración de la escala de tiempo (4 semanas)
  const timeScale = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 7); // Empezar una semana atrás
    
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
    
    const start = new Date(task.startDate);
    const end = new Date(task.dueDate);
    const scaleStart = timeScale[0];
    const scaleEnd = timeScale[timeScale.length - 1];

    if (end < scaleStart || start > scaleEnd) return null;

    const startIndex = Math.max(0, Math.floor((start - scaleStart) / (1000 * 60 * 60 * 24)));
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      gridColumnStart: startIndex + 2, // +1 for grid index, +1 for task list column
      gridColumnEnd: `span ${duration}`
    };
  };

  return (
    <div className="bg-[var(--color-surface-container)] rounded-3xl border border-[var(--color-outline-variant)] overflow-hidden shadow-xl animate-in slide-in-from-bottom-4 duration-500">
      {/* Header del Gantt */}
      <div className="p-4 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-surface-variant)]/50">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-[#6B4FD8]/10 rounded-xl">
                <Calendar size={18} className="text-[var(--color-primary)]" />
            </div>
            <div>
                <h3 className="text-sm font-black text-[var(--color-on-surface)] uppercase tracking-wider">Cronograma del Proyecto</h3>
                <p className="text-[10px] text-[var(--color-on-surface-variant)] font-bold uppercase">Vista de 30 días</p>
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
                <div className="h-14 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] sticky left-0 z-10 flex items-center px-6 group hover:bg-[var(--color-surface-variant)] transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-[var(--color-on-surface)] line-clamp-1">{task.title}</span>
                    <span className="text-[9px] font-medium text-[var(--color-on-surface-variant)] uppercase">{task.status.replace('_', ' ')}</span>
                  </div>
                </div>

                {/* Línea de tiempo de la tarea */}
                {pos ? (
                  <div className="h-14 border-b border-[var(--color-outline-variant)] relative" style={{ gridColumn: `${pos.gridColumnStart} / ${pos.gridColumnEnd}` }}>
                    <div className="absolute inset-y-3 left-0 right-0 bg-[#6B4FD8]/20 rounded-lg border border-[#6B4FD8]/30 overflow-hidden flex items-center group/bar cursor-pointer">
                        {/* Barra de progreso real */}
                        <div 
                            className="h-full bg-gradient-to-r from-[#6B4FD8] to-[#85adff] relative transition-all duration-500" 
                            style={{ width: `${task.progress || 0}%` }}
                        >
                            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                        </div>
                        <span className="absolute left-3 text-[9px] font-black text-white drop-shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity">
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
