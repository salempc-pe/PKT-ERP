import React, { useState } from 'react';
import { 
  Users, Plus, Search, Mail, Phone, 
  Trash2, Edit2, Building2, User,
  CheckCircle2, XCircle, Loader2, AlertCircle
} from 'lucide-react';

export default function InvestorsList({ investors, onAdd, onUpdate, onDelete, loading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'inversionista',
    contactName: '',
    email: '',
    phone: '',
    notes: '',
    budget: 0,
    status: 'activo'
  });

  const filtered = investors.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.contactName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await onUpdate(editingId, formData);
      } else {
        await onAdd(formData);
      }
      resetForm();
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'inversionista',
      contactName: '',
      email: '',
      phone: '',
      notes: '',
      budget: 0,
      status: 'activo'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (investor) => {
    setFormData({ ...investor });
    setEditingId(investor.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" size={16} />
          <input 
            type="text" 
            placeholder="Buscar constructoras o inversionistas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl pl-10 pr-4 py-2.5 text-[var(--color-on-surface)] outline-none focus:border-[#6B4FD8] transition-all text-sm"
          />
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="w-full md:w-auto bg-[#6B4FD8] text-white font-black px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        >
          <Plus size={18} /> Nuevo Comprador
        </button>
      </div>

      {showForm && (
        <div className="bg-[var(--color-surface-container-low)] border border-[#6B4FD8]/20 p-6 rounded-3xl animate-in fade-in zoom-in duration-300">
          <h4 className="text-xs font-black text-[#6B4FD8] uppercase tracking-widest mb-4 flex items-center gap-2">
            {editingId ? <Edit2 size={14}/> : <Plus size={14}/>} 
            {editingId ? 'Editar Perfil de Comprador' : 'Registrar Nuevo Inversionista / Constructora'}
          </h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase ml-1">Empresa / Nombre</label>
              <input 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#6B4FD8]"
                placeholder="Ej: Constructora Veló S.A.C."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase ml-1">Tipo</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#6B4FD8]"
              >
                <option value="inversionista">Inversionista Individual</option>
                <option value="constructora">Constructora / Desarrolladora</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase ml-1">Contacto Directo</label>
              <input 
                value={formData.contactName}
                onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#6B4FD8]"
                placeholder="Nombre del representante"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase ml-1">Email</label>
              <input 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#6B4FD8]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase ml-1">Teléfono</label>
              <input 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#6B4FD8]"
              />
            </div>
            <div className="flex gap-3 items-end">
              <button 
                type="button" 
                onClick={resetForm}
                className="flex-1 py-2.5 rounded-xl font-bold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-all text-[10px] uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-[2] bg-[#6B4FD8] text-white font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#5a42b9] transition-all"
              >
                {editingId ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-10 flex flex-col items-center gap-3 text-[#6B4FD8]">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-xs font-black uppercase tracking-widest">Cargando inversionistas...</p>
          </div>
        ) : filtered.length > 0 ? filtered.map(investor => (
          <div key={investor.id} className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-[2rem] p-6 hover:border-[#6B4FD8]/40 transition-all group relative overflow-hidden shadow-sm">
            <div className={`absolute top-0 left-0 w-full h-1.5 ${investor.type === 'constructora' ? 'bg-[#6B4FD8]' : 'bg-[#2E8B57]'}`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${investor.type === 'constructora' ? 'bg-[#6B4FD8]/10 text-[#6B4FD8]' : 'bg-[#2E8B57]/10 text-[#2E8B57]'}`}>
                  {investor.type === 'constructora' ? <Building2 size={20}/> : <User size={20}/>}
                </div>
                <div>
                  <h5 className="font-black text-sm text-[var(--color-on-surface)]">{investor.name}</h5>
                  <p className="text-[9px] font-black uppercase text-[var(--color-on-surface-variant)] opacity-60 tracking-tighter">
                    {investor.type}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => handleEdit(investor)} className="p-2 text-[#6B4FD8] hover:bg-[#6B4FD8]/10 rounded-lg transition-colors">
                  <Edit2 size={14}/>
                </button>
                <button onClick={() => onDelete(investor.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 size={14}/>
                </button>
              </div>
            </div>

            <div className="space-y-3 border-t border-[var(--color-outline-variant)] pt-4">
              <div className="flex items-center gap-2 text-[11px]">
                <Users size={14} className="text-[#6B4FD8]" />
                <span className="font-bold text-[var(--color-on-surface)]">{investor.contactName || 'Sin contacto'}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[var(--color-on-surface-variant)]">
                <Mail size={14} />
                <span className="truncate">{investor.email || 'No registra'}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[var(--color-on-surface-variant)]">
                <Phone size={14} />
                <span>{investor.phone || 'No registra'}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--color-outline-variant)] flex items-center justify-between">
              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${
                investor.status === 'activo' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {investor.status}
              </span>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center text-[var(--color-on-surface-variant)] italic bg-[var(--color-surface-container-low)] rounded-[3rem] border border-dashed border-[var(--color-outline-variant)]">
            No se encontraron compradores potenciales.
          </div>
        )}
      </div>
    </div>
  );
}
