import { useState } from 'react';
import { Timer, Plus, Trash2, Clock, Calendar, User, Briefcase, ChevronDown, Eye, X } from 'lucide-react';

export default function ProjectTimesheet({ tasks, timesheets, addEntry, deleteEntry, userId }) {
  const [showForm, setShowForm] = useState(false);
  const [viewingEntry, setViewingEntry] = useState(null);
  const [formData, setFormData] = useState({
    taskId: '',
    date: new Date().toISOString().split('T')[0],
    hours: 1,
    description: ''
  });

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.taskId || !formData.hours || parseFloat(formData.hours) <= 0) {
        alert("Por favor selecciona una tarea y asigna horas válidas.");
        return;
    }

    try {
        console.log("Intentando registrar horas:", formData);
        const entryToAdd = {
            ...formData,
            hours: parseFloat(formData.hours),
            userId: userId || 'demo'
        };
        await addEntry(entryToAdd);
        
        setFormData({
            taskId: '',
            date: new Date().toISOString().split('T')[0],
            hours: 1,
            description: ''
        });
        setShowForm(false);
    } catch (error) {
        console.error("Error al registrar horas:", error);
        alert("Hubo un error al guardar el registro. Por favor intente de nuevo.");
    }
  };

  const totalHours = timesheets.reduce((acc, curr) => acc + (parseFloat(curr.hours) || 0), 0);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[var(--color-surface-container)] p-6 rounded-3xl border border-[var(--color-outline-variant)] shadow-lg flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div className="p-3 bg-blue-500/10 rounded-2xl">
                    <Timer size={24} className="text-blue-400" />
                </div>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/5 px-2 py-1 rounded-lg border border-blue-500/10">Registradas</span>
            </div>
            <div className="mt-4">
                <h4 className="text-3xl font-black text-[var(--color-on-surface)]">{totalHours} <span className="text-sm text-[var(--color-on-surface-variant)]">Hrs</span></h4>
                <p className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase mt-1">Total tiempo invertido</p>
            </div>
        </div>

        <div className="md:col-span-3 bg-[var(--color-surface-container)] p-6 rounded-3xl border border-[var(--color-outline-variant)] shadow-lg flex items-center justify-between">
            <div className="space-y-1">
                <h3 className="text-lg font-black text-[var(--color-on-surface)] leading-tight uppercase tracking-tight">Registro de Actividad</h3>
                <p className="text-xs text-[var(--color-on-surface-variant)] font-medium">Control detallado de horas hombre por tarea.</p>
            </div>
            <button 
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-[#6B4FD8] to-[#4F37A8] text-white font-black px-8 py-3 rounded-2xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(107,79,216,0.5)] transition-all hover:-translate-y-1 active:translate-y-0"
            >
                <Plus size={20} /> Registrar Horas
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {showForm && (
            <div className="lg:col-span-1 animate-in slide-in-from-left-4 duration-300">
                <form className="bg-[var(--color-surface-variant)] border border-[var(--color-outline-variant)] p-6 rounded-3xl space-y-4 sticky top-6 shadow-2xl">
                    <h4 className="font-black text-[var(--color-on-surface)] text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Clock size={16} className="text-[var(--color-primary)]" /> Nuevo Registro
                    </h4>
                    
                    <div className="space-y-1.5 relative">
                        <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Tarea Asociada</label>
                        <div className="relative">
                            <select 
                                required
                                className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] outline-none text-sm appearance-none focus:border-[#6B4FD8] focus:shadow-[0_0_10px_rgba(107,79,216,0.2)] transition-all"
                                value={formData.taskId}
                                onChange={(e) => setFormData({...formData, taskId: e.target.value})}
                            >
                                <option value="" className="bg-[var(--color-surface-variant)]">Seleccionar tarea...</option>
                                {tasks.map(t => (
                                    <option key={t.id} value={t.id} className="bg-[var(--color-surface-variant)]">{t.title}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] pointer-events-none" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Fecha</label>
                            <input 
                                type="date" 
                                className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] text-xs outline-none"
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Horas</label>
                            <input 
                                type="number" 
                                step="0.5"
                                min="0.5"
                                className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] text-xs outline-none font-bold"
                                value={formData.hours}
                                onChange={(e) => setFormData({...formData, hours: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Comentarios</label>
                        <textarea 
                            rows="3"
                            className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] outline-none text-sm resize-none"
                            placeholder="¿Qué se hizo en este tiempo?"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button 
                            type="button" 
                            onClick={() => setShowForm(false)}
                            className="flex-1 px-4 py-3 border border-[var(--color-outline-variant)] rounded-xl text-[10px] font-black uppercase text-[var(--color-on-surface-variant)] hover:bg-white/5 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="button" 
                            onClick={handleSubmit}
                            className="flex-1 bg-gradient-to-r from-[#6B4FD8] to-[#4F37A8] text-white font-black py-3 rounded-xl text-[10px] uppercase shadow-lg shadow-[#6B4FD8]/20 hover:shadow-[#6B4FD8]/40 transition-all hover:-translate-y-0.5 active:translate-y-0 group relative overflow-hidden"
                        >
                            <span className="relative z-10">Confirmar</span>
                        </button>
                    </div>
                </form>
            </div>
        )}

        <div className={showForm ? 'lg:col-span-2' : 'lg:col-span-3'}>
            <div className="bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-surface-variant)]/50 border-b border-[var(--color-outline-variant)]">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">Fecha</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">Tarea</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">Horas</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">Comentarios</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-outline-variant)]/30">
                            {timesheets.length > 0 ? (
                                timesheets.map(entry => {
                                    const task = tasks.find(t => t.id === entry.taskId);
                                    return (
                                        <tr key={entry.id} className="hover:bg-white/5 transition-colors group relative overflow-hidden">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-[var(--color-on-surface)] text-xs font-bold">
                                                    <Calendar size={14} className="text-[var(--color-on-surface-variant)]" />
                                                    {new Date(entry.date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-[var(--color-surface-variant)] rounded-lg">
                                                        <Briefcase size={12} className="text-[#6B4FD8]" />
                                                    </div>
                                                    <span className="text-xs font-bold text-[var(--color-on-surface)]">{task?.title || 'Tarea eliminada'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black border border-blue-500/20">
                                                    {entry.hours}h
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-[11px] text-[var(--color-on-surface-variant)] font-medium max-w-[200px] truncate">{entry.description || '-'}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => setViewingEntry(entry)}
                                                        className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all border border-blue-500/20"
                                                        title="Ver detalles"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteEntry(entry.id)}
                                                        className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                                                        title="Eliminar registro"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center text-[var(--color-on-surface-variant)] italic text-xs opacity-50">
                                        No hay registros de tiempo en este proyecto
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>

      {viewingEntry && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div 
                className="bg-[#1e1e2d] w-full max-w-md rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 border-b border-white/10 flex items-center justify-between bg-gradient-to-br from-blue-600/20 to-purple-600/20">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg">
                            <Clock size={28} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight">Detalles</h3>
                            <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Activity Log</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setViewingEntry(null)}
                        className="p-3 rounded-2xl hover:bg-white/10 text-slate-400 transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-8 space-y-5">
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-5 rounded-3xl bg-white/5 border border-white/5">
                            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Tarea</p>
                                <p className="text-white font-bold text-lg">{tasks.find(t => t.id === viewingEntry.taskId)?.title || 'Tarea no encontrada'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-4 p-5 rounded-3xl bg-white/5 border border-white/5">
                                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Fecha</p>
                                    <p className="text-white font-bold">{new Date(viewingEntry.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-5 rounded-3xl bg-white/5 border border-white/5">
                                <div className="p-2.5 rounded-xl bg-green-500/20 text-green-400">
                                    <Timer size={20} />
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Inversión</p>
                                    <p className="text-white font-black text-xl">{viewingEntry.hours}h</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-5 rounded-3xl bg-white/5 border border-white/5">
                            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Usuario</p>
                                <p className="text-white font-semibold text-xs truncate max-w-[200px]">{viewingEntry.userId || 'demo'}</p>
                            </div>
                        </div>

                        {viewingEntry.description && (
                            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-3">
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Comentarios</p>
                                <p className="text-slate-300 leading-relaxed italic text-sm">"{viewingEntry.description}"</p>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={() => setViewingEntry(null)}
                        className="w-full py-5 rounded-3xl bg-gradient-to-r from-[#6B4FD8] to-[#4F37A8] text-white font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                    >
                        ENTENDIDO
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
