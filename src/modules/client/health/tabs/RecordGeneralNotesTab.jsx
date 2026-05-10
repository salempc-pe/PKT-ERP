import React, { useState } from 'react';
import { useHealth } from '../useHealth';
import { Plus, ClipboardList, Trash2, Save, Loader2, Lock, Unlock, Tag } from 'lucide-react';

export default function RecordGeneralNotesTab({ clientId, expedienteId, orgId }) {
  const { notasGenerales, createNotaGeneral, deleteNotaGeneral } = useHealth(orgId);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    titulo: '',
    contenido: '',
    privada: true,
    tagInput: ''
  });
  
  const [tags, setTags] = useState([]);

  const clientNotes = notasGenerales.filter(n => n.client_id === clientId);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.contenido.trim()) return;
    
    setIsSaving(true);
    try {
      await createNotaGeneral({
        client_id: clientId,
        expediente_id: expedienteId,
        titulo: form.titulo,
        contenido: form.contenido,
        privada: form.privada,
        etiquetas: tags
      });
      setIsAdding(false);
      setForm({ titulo: '', contenido: '', privada: true, tagInput: '' });
      setTags([]);
    } catch(e) {
      alert(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    if (form.tagInput.trim() && !tags.includes(form.tagInput.trim())) {
      setTags([...tags, form.tagInput.trim()]);
      setForm({ ...form, tagInput: '' });
    }
  };

  const removeTag = (tagRem) => setTags(tags.filter(t => t !== tagRem));

  const handleDelete = async (id) => {
    if(window.confirm("¿Estás seguro de eliminar esta nota general? Esta acción no se puede deshacer.")) {
      try { await deleteNotaGeneral(id); } catch(e) { alert(e.message); }
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
       <div className="flex justify-between items-center">
          <h3 className="text-sm font-black uppercase tracking-widest text-[var(--color-on-surface)] flex items-center gap-2">
             <ClipboardList size={16} className="text-[#6B4FD8]"/> Notas de Seguimiento General
          </h3>
          {!isAdding && (
             <button 
               onClick={() => setIsAdding(true)}
               className="bg-[#6B4FD8] text-[#002150] text-xs font-black uppercase px-4 py-2 rounded-xl flex items-center gap-1.5 hover:shadow-lg transition-all"
             >
                <Plus size={16}/> Anotación
             </button>
          )}
       </div>

       {isAdding && (
          <form onSubmit={handleSave} className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl p-5 space-y-4 shadow-lg relative">
             <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase text-[#6B4FD8]">Nueva Nota General</p>
                <button type="button" onClick={() => setIsAdding(false)} className="text-xs font-bold text-[var(--color-on-surface-variant)] hover:text-red-400 transition-colors">Cerrar</button>
             </div>
             
             <input 
               type="text"
               placeholder="Título de la nota (Ej. Resumen primer mes)"
               value={form.titulo}
               onChange={e => setForm({...form, titulo: e.target.value})}
               className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl p-3 text-sm font-bold text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none"
             />

             <textarea 
               required
               placeholder="Detalla aquí cualquier apunte extra que no corresponda estrictamente a una sesión..."
               value={form.contenido}
               onChange={e => setForm({...form, contenido: e.target.value})}
               className="w-full h-32 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl p-3 text-sm font-medium text-[var(--color-on-surface)] outline-none focus:border-[#6B4FD8] resize-none"
             />

             {/* Tags input */}
             <div className="space-y-2">
                <div className="flex gap-2">
                   <input 
                     type="text" 
                     placeholder="Agregar etiqueta..."
                     value={form.tagInput}
                     onChange={e => setForm({...form, tagInput: e.target.value})}
                     onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                     className="flex-1 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-3 py-2 text-xs font-bold text-[var(--color-on-surface)]"
                   />
                   <button type="button" onClick={addTag} className="bg-[var(--color-surface-variant)] text-[var(--color-on-surface)] text-xs font-black px-3 rounded-xl border border-[var(--color-outline-variant)]">Agregar</button>
                </div>
                <div className="flex flex-wrap gap-2">
                   {tags.map(t => (
                      <span key={t} className="flex items-center gap-1 bg-[#6B4FD8]/10 text-[#6B4FD8] text-[9px] font-black uppercase px-2 py-1 rounded-md border border-[#6B4FD8]/20">
                         {t} <button type="button" onClick={() => removeTag(t)} className="hover:text-red-400">×</button>
                      </span>
                   ))}
                </div>
             </div>

             <div className="flex items-center justify-between pt-3 border-t border-[var(--color-outline-variant)]">
                <label className="flex items-center gap-2 cursor-pointer">
                   <input 
                     type="checkbox"
                     checked={form.privada}
                     onChange={e => setForm({...form, privada: e.target.checked})}
                     className="w-4 h-4 accent-[#6B4FD8] rounded"
                   />
                   <span className="text-xs font-bold text-[var(--color-on-surface-variant)] flex items-center gap-1">
                      {form.privada ? <Lock size={12} className="text-amber-400"/> : <Unlock size={12} className="text-green-400"/>}
                      Privada
                   </span>
                </label>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#6B4FD8] text-[#002150] text-xs font-black uppercase px-5 py-2 rounded-xl flex items-center gap-2 hover:shadow-md disabled:opacity-50 transition-all"
                >
                   {isSaving ? <Loader2 size={14} className="animate-spin"/> : <><Save size={14}/> Guardar</>}
                </button>
             </div>
          </form>
       )}

       {/* Notes Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clientNotes.map(note => (
             <div key={note.id} className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl p-5 flex flex-col hover:border-[var(--color-primary)]/30 transition-all group relative">
                <div className="flex justify-between items-start mb-3">
                   <div>
                      {note.titulo && <h4 className="font-black text-[var(--color-on-surface)] text-sm">{note.titulo}</h4>}
                      <p className="text-[9px] font-black uppercase text-[var(--color-on-surface-variant)] opacity-60">
                         {note.created_at?.toDate ? note.created_at.toDate().toLocaleDateString() : 'Recién creada'}
                      </p>
                   </div>
                   <div className="flex items-center gap-2">
                      {note.privada ? <Lock size={12} className="text-amber-400 opacity-70"/> : <Unlock size={12} className="text-green-400 opacity-70"/>}
                      <button 
                        onClick={() => handleDelete(note.id)}
                        className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 p-1"
                      >
                         <Trash2 size={14}/>
                      </button>
                   </div>
                </div>
                
                <p className="text-xs font-medium text-[var(--color-on-surface-variant)] flex-1 line-clamp-4 whitespace-pre-wrap mb-4">
                   {note.contenido}
                </p>

                {note.etiquetas?.length > 0 && (
                   <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-[var(--color-outline-variant)]/30">
                      {note.etiquetas.map(t => (
                         <span key={t} className="text-[8px] font-black uppercase bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] px-1.5 py-0.5 rounded-md border border-[var(--color-outline-variant)] flex items-center gap-1">
                            <Tag size={8}/> {t}
                         </span>
                      ))}
                   </div>
                )}
             </div>
          ))}

          {clientNotes.length === 0 && !isAdding && (
             <div className="md:col-span-2 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] p-10 rounded-3xl text-center text-[var(--color-on-surface-variant)] opacity-60 italic text-sm">
                No hay notas generales todavía.
             </div>
          )}
       </div>
    </div>
  );
}
