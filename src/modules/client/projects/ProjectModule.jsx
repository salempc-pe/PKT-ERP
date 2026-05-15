import { useState } from 'react';
import { Briefcase, Plus, Search, MoreVertical, Layout, List, Loader2, X, AlertCircle, Folder, Clock, CheckCircle2 } from 'lucide-react';
import { useProjects } from './useProjects';
import { useAuth } from '../../../context/AuthContext';
import ProjectKanban from './ProjectKanban';
import LoadingScreen from '../../../components/LoadingScreen';

export default function ProjectModule() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  const { 
    projects, tasks, timesheets, projectDocuments, loading, 
    addProject, updateProject, deleteProject, setActiveProjectId, 
    addTask, updateTaskStatus, updateTask, deleteTask,
    addTimesheetEntry, deleteTimesheetEntry, addProjectDocument, deleteProjectDocument 
  } = useProjects(orgId);

  const userId = user?.id || user?.uid || 'demo';
  
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState(null); 
  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const [formData, setFormData] = useState({ name: '', description: '', color: '#6B4FD8', dueDate: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleSelectProject = (project) => {
    setSelectedProjectId(project.id);
    setActiveProjectId(project.id);
  };

  const handleBackToList = () => {
    setSelectedProjectId(null);
    setActiveProjectId(null);
  };

  const handleOpenEditProject = (e, project) => {
    e.stopPropagation();
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      color: project.color || '#6B4FD8',
      dueDate: project.dueDate || ''
    });
    setShowModal(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      if (editingProject) {
        await updateProject(editingProject.id, formData);
      } else {
        await addProject(formData);
      }
      setShowModal(false);
      setEditingProject(null);
      setFormData({ name: '', description: '', color: '#6B4FD8', dueDate: '' });
    } catch (err) {
      console.error("Error al guardar proyecto:", err);
      setSaveError("No se pudo guardar el proyecto. Intenta nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen fullScreen={false} message="Cargando Proyectos..." />;
  }

  // Si hay un proyecto seleccionado, mostramos el Kanban con navegación integrada
  if (selectedProject) {
    return (
        <ProjectKanban 
            project={selectedProject} 
            tasks={tasks} 
            timesheets={timesheets}
            projectDocuments={projectDocuments}
            addTask={addTask} 
            updateTaskStatus={updateTaskStatus} 
            updateTask={updateTask}
            deleteTask={deleteTask}
            addTimesheetEntry={addTimesheetEntry}
            deleteTimesheetEntry={deleteTimesheetEntry}
            addProjectDocument={addProjectDocument}
            deleteProjectDocument={deleteProjectDocument}
            onBack={handleBackToList}
            userId={userId}
        />
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4">
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#6B4FD8] text-[#002150] font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(133,173,255,0.3)] active:scale-95 transition-all"
        >
          <Plus size={18} /> Nuevo Proyecto
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? projects.map(project => (
          <div 
            key={project.id} 
            onClick={() => handleSelectProject(project)}
            className="group relative bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/30 rounded-xl text-[var(--color-primary)] shadow-sm transition-all">
                <Folder size={24} />
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                <button 
                  onClick={(e) => handleOpenEditProject(e, project)}
                  className="p-2 bg-[#6B4FD8]/10 text-[var(--color-primary)] hover:bg-[#6B4FD8] hover:text-white rounded-xl transition-all border border-[#6B4FD8]/20 shadow-sm"
                  title="Editar Proyecto"
                >
                  <MoreVertical size={18}/>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto y TODAS sus tareas?')) {
                      deleteProject(project.id);
                    }
                  }}
                  className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-500/20 shadow-sm"
                  title="Eliminar Proyecto"
                >
                  <X size={18}/>
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-[var(--color-on-surface)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">{project.name}</h3>
            <p className="text-[var(--color-on-surface-variant)] text-sm line-clamp-2 mb-6 h-10">{project.description}</p>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-tight">
                <span className="text-[var(--color-on-surface-variant)]">Actividad</span>
                <span className="text-[var(--color-on-surface)]">Reciente</span>
              </div>
              <div className="w-full bg-[var(--color-surface-container)] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#6B4FD8] h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-[var(--color-primary-container)] border border-[var(--color-outline-variant)]/50 flex items-center justify-center text-[10px] font-bold text-[var(--color-primary)] uppercase">
                      {user?.name?.substring(0, 2) || 'US'}
                    </div>
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-bold ${project.dueDate && new Date(project.dueDate + 'T23:59:59') < new Date() ? 'text-red-400 animate-pulse' : 'text-[var(--color-on-surface-variant)]'}`}>
                    <Clock size={14} /> {project.dueDate ? `Entrega: ${new Date(project.dueDate).toLocaleDateString()}` : 'Sin fecha'}
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 bg-[var(--color-surface-variant)]/20 rounded-3xl border border-dashed border-[#40485d]/20 flex flex-col items-center justify-center text-[var(--color-on-surface-variant)]">
            <Briefcase size={48} className="mb-4 opacity-10" />
            <p className="font-bold">No hay proyectos activos.</p>
            <p className="text-sm">Comienza creando el primero para organizar tu trabajo.</p>
          </div>
        )}
      </div>

      {/* Modal Nueva Tarea */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSaving && setShowModal(false)}></div>
          <form 
            onSubmit={handleAddSubmit}
            className="bg-[var(--color-surface-variant)] w-full max-w-md border border-[var(--color-outline-variant)] rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in duration-300"
          >
            <div className="p-6 bg-[var(--color-surface-container)] border-b border-[var(--color-outline-variant)] flex justify-between items-center">
              <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm">
                {editingProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
              </h3>
              <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSaving}
                  className="text-[var(--color-on-surface-variant)] hover:text-white transition-colors"
                >
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {saveError && (
                <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-xl flex items-center gap-3 text-red-300 text-xs animate-pulse">
                  <AlertCircle size={18} />
                  {saveError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Nombre del Proyecto</label>
                <input 
                  required
                  type="text" 
                  autoFocus
                  disabled={isSaving}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50"
                  placeholder="Ej: Rediseño Web 2026"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Descripción / Objetivo</label>
                <textarea 
                  rows="3"
                  disabled={isSaving}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50 resize-none"
                  placeholder="Describe brevemente de qué trata este proyecto..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Fecha de Entrega (Opcional)</label>
                <input 
                  type="date" 
                  disabled={isSaving}
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Color de Identificación</label>
                <div className="flex gap-3">
                    {['#6B4FD8', '#2E8B57', '#ffab85', '#affbab', '#dee5ff'].map(c => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setFormData({...formData, color: c})}
                            className={`w-8 h-8 rounded-full border-2 transition-transform ${formData.color === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-[var(--color-surface-container)] flex gap-3 border-t border-[var(--color-outline-variant)]">
              <button 
                type="button"
                onClick={() => setShowModal(false)}
                disabled={isSaving}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-colors border border-[var(--color-outline-variant)]/50"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-[#6B4FD8] text-[#002150] font-bold px-4 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(133,173,255,0.3)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : (editingProject ? 'Guardar Cambios' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
