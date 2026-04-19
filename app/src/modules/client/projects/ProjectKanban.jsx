import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Clock, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Trash2, X, Edit3, ArrowRight, ArrowLeft } from 'lucide-react';

export default function ProjectKanban({ project, tasks, addTask, updateTaskStatus, updateTask, onBack }) {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskData, setTaskData] = useState({ title: '', priority: 'medium', description: '' });

  const columns = [
    { id: 'todo', title: 'Por Hacer', color: 'bg-slate-500', next: 'in_progress', prev: null },
    { id: 'in_progress', title: 'En Curso', color: 'bg-blue-500', next: 'done', prev: 'todo' },
    { id: 'done', title: 'Finalizado', color: 'bg-emerald-500', next: null, prev: 'in_progress' }
  ];

  const handleOpenNewTask = () => {
    setEditingTask(null);
    setTaskData({ title: '', priority: 'medium', description: '' });
    setShowTaskModal(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setTaskData({ 
        title: task.title, 
        priority: task.priority || 'medium', 
        description: task.description || '' 
    });
    setShowTaskModal(true);
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!taskData.title.trim()) return;

    if (editingTask) {
        await updateTask(editingTask.id, taskData);
    } else {
        await addTask({
            ...taskData,
            projectId: project.id,
            status: 'todo'
        });
    }

    setTaskData({ title: '', priority: 'medium', description: '' });
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high': return <span className="text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 uppercase font-bold">Alta</span>;
      case 'medium': return <span className="text-[9px] bg-[#85adff]/10 text-[#85adff] px-1.5 py-0.5 rounded border border-[#85adff]/20 uppercase font-bold">Media</span>;
      case 'low': return <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase font-bold">Baja</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 h-full animate-in fade-in duration-500">
      {/* Header Unificada */}
      <div className="flex justify-between items-center bg-[#0f1930]/30 p-4 rounded-2xl border border-[#40485d]/10">
        <button 
          onClick={onBack}
          className="text-[#a3aac4] hover:text-[#85adff] flex items-center gap-2 font-black uppercase text-[10px] tracking-widest transition-all bg-[#141f38] px-4 py-2.5 rounded-xl border border-[#40485d]/30 hover:border-[#85adff]/50 shadow-lg"
        >
          <ChevronLeft size={16} /> Volver a Proyectos
        </button>

        <button 
          onClick={handleOpenNewTask}
          className="bg-[#85adff] text-[#002150] font-black px-6 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(133,173,255,0.4)] transition-all transform active:scale-95 border border-[#85adff]/20"
        >
          <Plus size={20} /> Nueva Tarea
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
        {columns.map(col => (
          <div key={col.id} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-tighter text-[#a3aac4]">
                    <div className={`w-1.5 h-1.5 rounded-full ${col.color}`}></div>
                    {col.title}
                </div>
                <span className="text-[#40485d] font-bold text-xs">
                    {tasks.filter(t => t.status === col.id).length}
                </span>
            </div>

            <div className="flex flex-col gap-3 p-3 bg-[#0f1930]/40 border border-[#40485d]/10 rounded-2xl min-h-[400px]">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div 
                  key={task.id} 
                  onClick={() => col.next && updateTaskStatus(task.id, col.next)}
                  className="bg-[#141f38] border border-[#40485d]/30 p-4 rounded-xl shadow-sm hover:border-[#85adff]/50 transition-all group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                        <p className="font-bold text-[#dee5ff] text-sm leading-tight group-hover:text-[#85adff] transition-colors">{task.title}</p>
                        {task.description && <p className="text-[11px] text-[#a3aac4] line-clamp-2 leading-tight">{task.description}</p>}
                    </div>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditTask(task);
                        }}
                        className="text-[#40485d] hover:text-[#85adff] transition-colors p-1"
                        title="Editar Tarea"
                    >
                        <MoreVertical size={16}/>
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    {getPriorityBadge(task.priority)}
                    
                    <div className="flex gap-1.5">
                        {col.prev && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    updateTaskStatus(task.id, col.prev);
                                }}
                                className="p-1.5 text-amber-400 hover:text-white bg-amber-500/10 hover:bg-amber-500 rounded-lg border border-amber-500/20 transition-all"
                                title="Mover atrás"
                            >
                                <ArrowLeft size={14} />
                            </button>
                        )}
                        {col.next && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    updateTaskStatus(task.id, col.next);
                                }}
                                className="p-1.5 text-green-400 hover:text-white bg-green-500/10 hover:bg-green-500 rounded-lg border border-green-500/20 transition-all"
                                title="Avanzar"
                            >
                                <ArrowRight size={14} />
                            </button>
                        )}
                    </div>
                  </div>
                </div>
              ))}
              
              {tasks.filter(t => t.status === col.id).length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-[#40485d] opacity-30 italic text-xs py-10">
                   Vacío
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nueva/Editar Tarea */}
      {showTaskModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTaskModal(false)}></div>
            <form onSubmit={handleSaveTask} className="bg-[#0f1930] w-full max-w-sm border border-[#40485d]/30 rounded-3xl shadow-2xl relative animate-in zoom-in duration-300">
                <div className="p-6 border-b border-[#40485d]/20 flex justify-between items-center">
                    <h4 className="font-black text-[#dee5ff] uppercase tracking-wider text-xs">
                        {editingTask ? 'Editar Tarea' : 'Añadir Nueva Tarea'}
                    </h4>
                    <button type="button" onClick={() => setShowTaskModal(false)} className="text-[#a3aac4] hover:text-white">
                        <X size={18}/>
                    </button>
                </div>
                <div className="p-6 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#a3aac4] uppercase">Título de la Tarea</label>
                        <input 
                            required
                            autoFocus
                            type="text" 
                            className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-xl px-4 py-2.5 text-[#dee5ff] focus:border-[#85adff] outline-none text-sm"
                            value={taskData.title}
                            onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                            placeholder="Ej: Diseñar landing page"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#a3aac4] uppercase">Descripción (Opcional)</label>
                        <textarea 
                            rows="3"
                            className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-xl px-4 py-2.5 text-[#dee5ff] focus:border-[#85adff] outline-none text-sm resize-none"
                            value={taskData.description}
                            onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                            placeholder="Detalles adicionales sobre la tarea..."
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#a3aac4] uppercase">Prioridad principal</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['low', 'medium', 'high'].map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setTaskData({...taskData, priority: p})}
                                    className={`py-2 rounded-xl text-[10px] font-bold border transition-all uppercase ${taskData.priority === p ? 'bg-[#85adff] text-[#002150] border-[#85adff]' : 'bg-[#141f38] text-[#a3aac4] border-[#40485d]/30'}`}
                                >
                                    {p === 'low' ? 'Baja' : p === 'medium' ? 'Media' : 'Alta'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-[#141f38] flex gap-3 rounded-b-3xl">
                    <button type="submit" className="flex-1 bg-[#85adff] text-[#002150] font-black py-3 rounded-xl text-sm shadow-lg shadow-[#85adff]/10 hover:shadow-[#85adff]/20 transition-all">
                        {editingTask ? 'Actualizar Tarea' : 'Crear Tarea'}
                    </button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
}
