import React, { useState } from 'react';
import { useHealth } from '../useHealth';
import { Lock, Unlock, Plus, StickyNote, CalendarDays, Loader2, Save, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export default function RecordSessionNotesTab({ clientId, orgId }) {
  const { citas, notasSesion, createNotaSesion, updateNotaSesion } = useHealth(orgId);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    cita_id: '',
    contenido: '',
    privada: true
  });

  // -- Data joins --
  // Solamente permitir citas realizadas que no tengan nota aún (o si estamos editando una nota existente para un cita id ya ligada)
  const linkedCitaIds = notasSesion.map(n => n.cita_id);
  const pendingCitas = citas.filter(c => 
     c.client_id === clientId && 
     c.estado === 'realizada' && 
     !linkedCitaIds.includes(c.id)
  );

  const clientNotes = notasSesion
    .filter(n => n.client_id === clientId)
    .sort((a, b) => (b.created_at?.toDate ? b.created_at.toDate() : new Date()) - (a.created_at?.toDate ? a.created_at.toDate() : new Date()));

  const isLocked = (createdAt) => {
    if (!createdAt) return false;
    const created = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const hoursDiff = (new Date() - created) / (1000 * 60 * 60);
    return hoursDiff > 24;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.contenido.trim()) return;
    setIsSaving(true);
    try {
      if (editingId) {
         await updateNotaSesion(editingId, { contenido: form.contenido, privada: form.privada });
         setEditingId(null);
      } else {
         await createNotaSesion({ ...form, client_id: clientId, etiquetas: [] });
         setIsAdding(false);
      }
      setForm({ cita_id: '', contenido: '', privada: true });
    } catch (e) {
      alert(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const openEdit = (note) => {
    if (isLocked(note.created_at)) return; // Block edit logic
    setEditingId(note.id);
    setForm({ cita_id: note.cita_id, contenido: note.contenido, privada: note.privada });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
      
      {/* Add Note Area */}
      {!isAdding && !editingId && (
         <div className="flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-widest text-[var(--color-on-surface)] flex items-center gap-2">
               <StickyNote size={16} className="text-[#6B4FD8]"/> Notas Clínicas
            </h3>
            {pendingCitas.length > 0 && (
               <button 
                 onClick={() => setIsAdding(true)}
                 className="bg-[#6B4FD8] text-[#002150] text-xs font-black uppercase px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95"
               >
                  <Plus size={16}/> Nueva Nota
               </button>
            )}
         </div>
      )}

      {/* Form Editor (either creating or editing) */}
      {(isAdding || editingId) && (
         <form onSubmit={handleSave} className="bg-[var(--color-surface-container-low)] border border-[#6B4FD8]/30 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center">
               <h4 className="text-xs font-black uppercase text-[var(--color-on-surface)] flex items-center gap-2">
                  {editingId ? 'Editando Nota (Bloqueo en < 24h)' : 'Registrar Evolución de Sesión'}
                  <ShieldCheck className="text-green-400" size={14}/>
               </h4>
               <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); setForm({cita_id:'', contenido:'', privada:true}); }} className="text-xs font-bold text-[var(--color-on-surface-variant)] hover:text-red-400 transition-colors">Cancelar</button>
            </div>

            {!editingId && (
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase opacity-70 text-[var(--color-on-surface)]">Seleccionar Cita Sin Nota</label>
                  <select 
                     required
                     value={form.cita_id}
                     onChange={e => setForm({...form, cita_id: e.target.value})}
                     className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl p-2 text-xs font-bold text-[var(--color-on-surface)]"
                  >
                     <option value="">-- Elegir una cita completada --</option>
                     {pendingCitas.map(c => {
                        const d = c.fecha_hora?.toDate ? c.fecha_hora.toDate() : new Date(c.fecha_hora);
                        return <option key={c.id} value={c.id}>{d.toLocaleDateString()} - {c.tipo_sesion}</option>;
                     })}
                  </select>
               </div>
            )}

            <textarea 
               required
               value={form.contenido}
               onChange={e => setForm({...form, contenido: e.target.value})}
               placeholder="Describe la evolución del paciente, observaciones y plan..."
               className="w-full h-40 bg-[var(--color-surface-variant)]/50 border border-[var(--color-outline-variant)] rounded-xl p-4 text-sm font-medium text-[var(--color-on-surface)] outline-none focus:border-[#6B4FD8] transition-colors"
            />

            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-outline-variant)]/50">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={form.privada}
                    onChange={e => setForm({...form, privada: e.target.checked})}
                    className="w-4 h-4 accent-[#6B4FD8] rounded"
                  />
                  <span className="text-xs font-bold text-[var(--color-on-surface-variant)] flex items-center gap-1">
                     {form.privada ? <Lock size={12} className="text-amber-400"/> : <Unlock size={12} className="text-green-400"/>}
                     Nota Privada
                  </span>
               </label>

               <button 
                 type="submit"
                 disabled={isSaving || (!editingId && !form.cita_id)}
                 className="bg-[#6B4FD8] text-[#002150] text-xs font-black uppercase px-5 py-2 rounded-xl flex items-center gap-2 disabled:opacity-50 transition-all"
               >
                  {isSaving ? <Loader2 size={14} className="animate-spin"/> : <><Save size={14}/> Guardar Nota</>}
               </button>
            </div>
         </form>
      )}

      {/* Empty state alert if no pending citas to note */}
      {!isAdding && !editingId && clientNotes.length === 0 && pendingCitas.length === 0 && (
         <div className="bg-[var(--color-surface-container-low)] border border-dashed border-[var(--color-outline-variant)] p-10 rounded-3xl text-center flex flex-col items-center opacity-60">
            <CalendarDays size={32} className="mb-2 text-[var(--color-on-surface-variant)]"/>
            <p className="text-sm font-bold text-[var(--color-on-surface)]">No hay sesiones realizadas disponibles para anotar.</p>
            <p className="text-xs text-[var(--color-on-surface-variant)]">Primero debes marcar una cita como "Realizada" en la agenda.</p>
         </div>
      )}

      {/* Chronological List */}
      <div className="space-y-4 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-[var(--color-outline-variant)] before:opacity-20">
         {clientNotes.map(note => {
            const date = note.created_at?.toDate ? note.created_at.toDate() : new Date();
            const locked = isLocked(note.created_at);
            
            return (
               <div key={note.id} className="relative pl-14">
                  {/* Timeline Dot */}
                  <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-[var(--color-surface-container)] border-2 border-[#6B4FD8] flex items-center justify-center z-10">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#6B4FD8]"></div>
                  </div>

                  <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl p-5 hover:border-[#6B4FD8]/30 transition-colors">
                     <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                        <div>
                           <p className="text-[10px] font-black text-[#6B4FD8] uppercase">
                              {date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                           </p>
                           <div className="flex items-center gap-2 mt-0.5">
                              {note.privada ? (
                                 <span className="flex items-center gap-1 text-[9px] font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20"><Lock size={10}/> Privada</span>
                              ) : (
                                 <span className="flex items-center gap-1 text-[9px] font-black uppercase text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20"><Unlock size={10}/> Pública</span>
                              )}
                           </div>
                        </div>

                        {locked ? (
                           <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-background)] border border-[var(--color-outline-variant)] rounded-xl text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase opacity-70" title="El registro médico queda sellado tras 24 horas">
                              <Lock size={12}/> Bloqueada
                           </div>
                        ) : (
                           editingId !== note.id && (
                              <button 
                                onClick={() => openEdit(note)}
                                className="text-[10px] font-black text-[#6B4FD8] hover:underline uppercase flex items-center gap-1"
                              >
                                 Editar Nota <AlertTriangle size={10} className="text-amber-500"/>
                              </button>
                           )
                        )}
                     </div>

                     <div className="text-sm text-[var(--color-on-surface)] font-medium leading-relaxed whitespace-pre-wrap opacity-90 bg-[var(--color-surface-container)] p-4 rounded-xl">
                        {note.contenido}
                     </div>
                  </div>
               </div>
            );
         })}
      </div>

    </div>
  );
}
