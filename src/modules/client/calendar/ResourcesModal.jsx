import React, { useState } from 'react';
import { X, Blocks, Plus, Trash2, Loader2, Edit2, Check, XCircle } from 'lucide-react';

export default function ResourcesModal({ 
  isOpen, 
  onClose, 
  resources, 
  onAdd, 
  onUpdate,
  onDelete 
}) {
  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen) return null;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setIsAdding(true);
    try {
      await onAdd({ name: newName.trim(), type: 'Físico' });
      setNewName('');
    } finally {
      setIsAdding(false);
    }
  };

  const startEdit = (res) => {
    setEditingId(res.id);
    setEditValue(res.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleSaveEdit = async (id) => {
    if (!editValue.trim()) return;
    setIsUpdating(true);
    try {
      await onUpdate(id, { name: editValue.trim() });
      setEditingId(null);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-[var(--color-surface-variant)] w-full max-w-md border border-[var(--color-outline-variant)] rounded-3xl shadow-2xl relative animate-in zoom-in duration-300">
        
        <div className="p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-surface-container)] rounded-t-3xl">
           <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm flex items-center gap-2">
             <Blocks size={16} className="text-[var(--color-primary)]" /> Gestionar Recursos
           </h3>
           <button onClick={onClose} className="text-[var(--color-on-surface-variant)] hover:text-white">
             <X size={16}/>
           </button>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input 
              type="text" 
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Nombre del recurso (ej. Sala A)"
              className="flex-1 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-xl px-4 py-2 outline-none border border-[var(--color-outline-variant)] focus:border-[#6B4FD8]"
            />
            <button 
              type="submit"
              disabled={isAdding || !newName.trim()}
              className="bg-[#6B4FD8] text-[#001b5c] p-2 rounded-xl disabled:opacity-50"
            >
              {isAdding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            </button>
          </form>

          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            {resources.length === 0 ? (
              <p className="text-center text-xs text-[var(--color-on-surface-variant)] py-4">No hay recursos configurados.</p>
            ) : (
              resources.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-[var(--color-surface-container)] rounded-xl border border-[var(--color-outline-variant)]">
                  {editingId === r.id ? (
                    <div className="flex-1 flex gap-2 items-center">
                      <input 
                        type="text"
                        autoFocus
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="flex-1 bg-[var(--color-surface-variant)] text-[var(--color-on-surface)] text-sm rounded-lg px-2 py-1 outline-none border border-[#6B4FD8]"
                      />
                      <button onClick={() => handleSaveEdit(r.id)} disabled={isUpdating} className="text-green-500 hover:text-green-400">
                        {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Check size={16} />}
                      </button>
                      <button onClick={cancelEdit} className="text-red-500 hover:text-red-400">
                        <XCircle size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-semibold text-[var(--color-on-surface)]">{r.name}</span>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => startEdit(r)}
                          className="p-1.5 text-[var(--color-on-surface-variant)] hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => onDelete(r.id)}
                          className="p-1.5 text-[var(--color-on-surface-variant)] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
