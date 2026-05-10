import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Clock, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, Trash2, X, Edit3, ArrowRight, ArrowLeft, Layout, BarChart2, Calendar, FileText, Timer, ChevronDown } from 'lucide-react';
import ProjectGantt from './ProjectGantt';
import ProjectTimesheet from './ProjectTimesheet';
import ProjectDocuments from './ProjectDocuments';

export default function ProjectKanban({ 
  project, 
  tasks, 
  timesheets,
  projectDocuments,
  addTask, 
  updateTaskStatus, 
  updateTask, 
  addTimesheetEntry,
  deleteTimesheetEntry,
  addProjectDocument,
  deleteProjectDocument,
  onBack 
}) {
  const [activeTab, setActiveTab] = useState('board'); // board, gantt, timesheet, docs
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskData, setTaskData] = useState({ 
    title: '', 
    priority: 'medium', 
    description: '',
    startDate: '',
    dueDate: '',
    progress: 0,
    dependencies: []
  });

  const columns = [
    { id: 'todo', title: 'Por Hacer', color: 'bg-slate-500', next: 'in_progress', prev: null },
    { id: 'in_progress', title: 'En Curso', color: 'bg-blue-500', next: 'done', prev: 'todo' },
    { id: 'done', title: 'Finalizado', color: 'bg-emerald-500', next: null, prev: 'in_progress' }
  ];

  const tabs = [
    { id: 'board', label: 'Tablero', icon: Layout },
    { id: 'gantt', label: 'Gantt', icon: BarChart2 },
    { id: 'timesheet', label: 'Horas', icon: Timer },
    { id: 'docs', label: 'Documentos', icon: FileText },
  ];

  const handleOpenNewTask = () => {
    setEditingTask(null);
    setTaskData({ 
      title: '', 
      priority: 'medium', 
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0,
      dependencies: []
    });
    setShowTaskModal(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setTaskData({ 
        title: task.title, 
        priority: task.priority || 'medium', 
        description: task.description || '',
        startDate: task.startDate || '',
        dueDate: task.dueDate || '',
        progress: task.progress || 0,
        dependencies: task.dependencies || []
    });
    setShowTaskModal(true);
  };

  const handleSaveTask = async (e) => {
    if (e) e.preventDefault();
    console.log("Intentando guardar tarea...", taskData);
    
    if (!taskData.title.trim()) {
        alert("El título es obligatorio");
        return;
    }

    try {
        if (editingTask) {
            await updateTask(editingTask.id, taskData);
        } else {
            if (!project?.id) {
                console.error("Error: project.id no definido");
                return;
            }
            await addTask({
                ...taskData,
                projectId: project.id,
                status: 'todo'
            });
        }
        setShowTaskModal(false);
        setEditingTask(null);
    } catch (err) {
        console.error("Error al guardar tarea:", err);
        alert("Error al guardar la tarea. Revisa la consola.");
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high': return <span className="text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20 uppercase font-bold">Alta</span>;
      case 'medium': return <span className="text-[9px] bg-[#6B4FD8]/10 text-[var(--color-primary)] px-1.5 py-0.5 rounded border border-[#6B4FD8]/20 uppercase font-bold">Media</span>;
      case 'low': return <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase font-bold">Baja</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 h-full animate-in fade-in duration-500">
      {/* Header Unificada */}
      <div className="flex flex-col gap-6 bg-[var(--color-surface-variant)]/30 p-6 rounded-3xl border border-[var(--color-outline-variant)] shadow-xl">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
            <button 
                onClick={onBack}
                className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] flex items-center gap-2 font-black uppercase text-[10px] tracking-widest transition-all bg-[var(--color-surface-container)] px-4 py-2.5 rounded-xl border border-[var(--color-outline-variant)] hover:border-[#6B4FD8]/50"
            >
                <ChevronLeft size={16} /> Volver
            </button>
            
            <div className="flex flex-col">
                <h2 className="text-xl font-black text-[var(--color-on-surface)] leading-tight">{project.name}</h2>
                {project.dueDate && (
                <span className={`text-[10px] font-bold flex items-center gap-1 uppercase tracking-tighter ${new Date(project.dueDate + 'T23:59:59') < new Date() ? 'text-red-400 animate-pulse' : 'text-[var(--color-primary)]'}`}>
                    <Clock size={12} /> {new Date(project.dueDate + 'T23:59:59') < new Date() ? 'PROYECTO VENCIDO' : 'Entrega'}: {new Date(project.dueDate).toLocaleDateString()}
                </span>
                )}
            </div>
            </div>

            <button 
            onClick={handleOpenNewTask}
            className="bg-[#6B4FD8] text-[#002150] font-black px-6 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(133,173,255,0.4)] transition-all transform active:scale-95 border border-[#6B4FD8]/20"
            >
            <Plus size={20} /> Nueva Tarea
            </button>
        </div>

        {/* Desktop Tabs Selector */}
        <div className="hidden md:flex gap-2 p-1 bg-[var(--color-surface-container)] rounded-2xl border border-[var(--color-outline-variant)] w-fit self-center">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#6B4FD8] text-[#002150] shadow-lg' : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)]'}`}
                >
                    <tab.icon size={16} />
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Mobile Tabs Selector */}
        <div className="md:hidden w-full relative self-center max-w-md">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] font-black uppercase text-xs tracking-widest rounded-xl border border-[var(--color-outline-variant)] px-4 py-3 outline-none appearance-none focus:border-[#6B4FD8]"
          >
            <option value="board">Tablero</option>
            <option value="gantt">Gantt</option>
            <option value="timesheet">Horas</option>
            <option value="docs">Documentos</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--color-on-surface-variant)]">
            <ChevronDown size={18} />
          </div>
        </div>
      </div>

      {/* Renderizado Condicional de Vistas */}
      <div className="min-h-[60vh]">
        {activeTab === 'board' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                {columns.map(col => (
                    <div key={col.id} className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-tighter text-[var(--color-on-surface-variant)]">
                                <div className={`w-1.5 h-1.5 rounded-full ${col.color}`}></div>
                                {col.title}
                            </div>
                            <span className="text-[var(--color-on-surface-variant)] font-bold text-xs">
                                {tasks.filter(t => t.status === col.id).length}
                            </span>
                        </div>

                        <div className="flex flex-col gap-3 p-3 bg-[var(--color-surface-variant)]/40 border border-[var(--color-outline-variant)] rounded-2xl min-h-[400px]">
                            {tasks.filter(t => t.status === col.id).map(task => (
                                <div 
                                    key={task.id} 
                                    onClick={() => col.next && updateTaskStatus(task.id, col.next)}
                                    className="bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] p-4 rounded-xl shadow-sm hover:border-[#6B4FD8]/50 transition-all group cursor-pointer"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="space-y-1">
                                            <p className="font-bold text-[var(--color-on-surface)] text-sm leading-tight group-hover:text-[var(--color-primary)] transition-colors">{task.title}</p>
                                            {task.description && <p className="text-[11px] text-[var(--color-on-surface-variant)] line-clamp-2 leading-tight">{task.description}</p>}
                                        </div>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenEditTask(task);
                                            }}
                                            className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors p-1"
                                        >
                                            <MoreVertical size={16}/>
                                        </button>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        {getPriorityBadge(task.priority)}
                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {col.prev && (
                                                <button onClick={(e) => { e.stopPropagation(); updateTaskStatus(task.id, col.prev); }} className="p-1 text-amber-400"><ArrowLeft size={14}/></button>
                                            )}
                                            {col.next && (
                                                <button onClick={(e) => { e.stopPropagation(); updateTaskStatus(task.id, col.next); }} className="p-1 text-green-400"><ArrowRight size={14}/></button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )}

        {activeTab === 'gantt' && <ProjectGantt tasks={tasks} />}
        {activeTab === 'timesheet' && <ProjectTimesheet tasks={tasks} timesheets={timesheets} addEntry={addTimesheetEntry} deleteEntry={deleteTimesheetEntry} />}
        {activeTab === 'docs' && <ProjectDocuments documents={projectDocuments} addDoc={addProjectDocument} deleteDoc={deleteProjectDocument} />}
      </div>

      {/* Modal Nueva/Editar Tarea Extendido */}
      {showTaskModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTaskModal(false)}></div>
            <form onSubmit={handleSaveTask} className="bg-[var(--color-surface-variant)] w-full max-w-md border border-[var(--color-outline-variant)] rounded-3xl shadow-2xl relative animate-in zoom-in duration-300 overflow-hidden">
                <div className="p-6 border-b border-[#40485d]/20 flex justify-between items-center">
                    <h4 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-xs">
                        {editingTask ? 'Editar Tarea' : 'Añadir Nueva Tarea'}
                    </h4>
                    <button type="button" onClick={() => setShowTaskModal(false)} className="text-[var(--color-on-surface-variant)] hover:text-white">
                        <X size={18}/>
                    </button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Título</label>
                        <input autoFocus type="text" className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none text-sm" value={taskData.title} onChange={(e) => setTaskData({...taskData, title: e.target.value})} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Inicio</label>
                            <input type="date" className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] text-xs outline-none" value={taskData.startDate} onChange={(e) => setTaskData({...taskData, startDate: e.target.value})} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Fin</label>
                            <input type="date" className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] text-xs outline-none" value={taskData.dueDate} onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase flex justify-between">
                            Progreso <span>{taskData.progress}%</span>
                        </label>
                        <input type="range" min="0" max="100" className="w-full h-1.5 bg-[var(--color-surface-container)] rounded-lg appearance-none cursor-pointer accent-[#6B4FD8]" value={taskData.progress} onChange={(e) => setTaskData({...taskData, progress: parseInt(e.target.value)})} />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Prioridad</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['low', 'medium', 'high'].map(p => (
                                <button key={p} type="button" onClick={() => setTaskData({...taskData, priority: p})} className={`py-2 rounded-xl text-[10px] font-bold border transition-all uppercase ${taskData.priority === p ? 'bg-[#6B4FD8] text-[#002150] border-[#6B4FD8]' : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] border-[var(--color-outline-variant)]'}`}>
                                    {p === 'low' ? 'Baja' : p === 'medium' ? 'Media' : 'Alta'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Descripción</label>
                        <textarea rows="2" className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] outline-none text-sm resize-none" value={taskData.description} onChange={(e) => setTaskData({...taskData, description: e.target.value})} />
                    </div>
                </div>
                <div className="p-6 bg-[var(--color-surface-container)] flex gap-3">
                    <button 
                        type="button" 
                        onClick={handleSaveTask}
                        className="flex-1 bg-[#6B4FD8] text-[#002150] font-black py-3 rounded-xl text-sm shadow-lg shadow-[#6B4FD8]/10 hover:shadow-[#6B4FD8]/20 transition-all"
                    >
                        {editingTask ? 'Actualizar Tarea' : 'Crear Tarea'}
                    </button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
}
