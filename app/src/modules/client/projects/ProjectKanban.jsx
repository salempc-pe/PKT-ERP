import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Clock, AlertCircle, CheckCircle2, Circle, HelpCircle } from 'lucide-react';

export default function ProjectKanban({ project, tasks, addTask, updateTaskStatus }) {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskData, setTaskData] = useState({ title: '', priority: 'medium' });

  const columns = [
    { id: 'todo', title: 'Por Hacer', color: 'bg-slate-500' },
    { id: 'in_progress', title: 'En Curso', color: 'bg-blue-500' },
    { id: 'done', title: 'Finalizado', color: 'bg-emerald-500' }
  ];

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskData.title.trim()) return;
    await addTask({
      ...taskData,
      projectId: project.id,
      status: 'todo'
    });
    setTaskData({ title: '', priority: 'medium' });
    setShowTaskModal(false);
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high': return <span className="text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 uppercase">Alta</span>;
      case 'medium': return <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase">Media</span>;
      case 'low': return <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">Baja</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 h-full">
      <div className="flex justify-between items-center">
        <h3 className="text-[#a3aac4] font-black text-xs uppercase tracking-widest">Tablero de Tareas</h3>
        <button 
          onClick={() => setShowTaskModal(true)}
          className="text-[11px] bg-[#141f38] text-[#85adff] px-3 py-1.5 rounded-lg border border-[#85adff]/20 hover:bg-[#85adff] hover:text-[#002150] transition-all font-bold"
        >
          + Nueva Tarea
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
                  className="bg-[#141f38] border border-[#40485d]/30 p-4 rounded-xl shadow-sm hover:border-[#85adff]/50 transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-bold text-[#dee5ff] text-sm leading-tight">{task.title}</p>
                    <button className="text-[#40485d] hover:text-[#dee5ff]"><MoreVertical size={14}/></button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    {getPriorityBadge(task.priority)}
                    
                    <div className="flex gap-1">
                        {col.id !== 'todo' && (
                            <button 
                                onClick={() => updateTaskStatus(task.id, col.id === 'done' ? 'in_progress' : 'todo')}
                                className="p-1.5 text-[#40485d] hover:text-[#dee5ff] bg-[#0f1930] rounded-md transition-colors"
                                title="Mover atrás"
                            >
                                <Circle size={14} />
                            </button>
                        )}
                        {col.id !== 'done' && (
                            <button 
                                onClick={() => updateTaskStatus(task.id, col.id === 'todo' ? 'in_progress' : 'done')}
                                className="p-1.5 text-[#40485d] hover:text-[#85adff] bg-[#0f1930] rounded-md transition-colors"
                                title="Avanzar"
                            >
                                <CheckCircle2 size={14} />
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

      {/* Modal Nueva Tarea */}
      {showTaskModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTaskModal(false)}></div>
            <form onSubmit={handleAddTask} className="bg-[#0f1930] w-full max-w-sm border border-[#40485d]/30 rounded-3xl shadow-2xl relative animate-in zoom-in duration-300">
                <div className="p-5 border-b border-[#40485d]/20">
                    <h4 className="font-black text-[#dee5ff] uppercase tracking-wider text-xs">Añadir Tarea</h4>
                </div>
                <div className="p-5 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#a3aac4] uppercase">Título de la Tarea</label>
                        <input 
                            required
                            autoFocus
                            type="text" 
                            className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-xl px-4 py-2 text-[#dee5ff] focus:border-[#85adff] outline-none text-sm"
                            value={taskData.title}
                            onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#a3aac4] uppercase">Prioridad</label>
                        <select 
                            className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-xl px-4 py-2 text-[#dee5ff] focus:border-[#85adff] outline-none text-sm"
                            value={taskData.priority}
                            onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
                        >
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                        </select>
                    </div>
                </div>
                <div className="p-5 bg-[#141f38] flex gap-3 rounded-b-3xl">
                    <button type="submit" className="flex-1 bg-[#85adff] text-[#002150] font-black py-2 rounded-xl text-sm">Guardar</button>
                    <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 text-[#a3aac4] font-bold text-sm">Cerrar</button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
}
