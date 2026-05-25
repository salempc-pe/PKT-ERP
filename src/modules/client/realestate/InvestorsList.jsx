import React, { useState } from 'react';
import { 
  Users, Plus, Search, Mail, Phone, 
  Trash2, Edit2, Building2, User,
  CheckCircle2, XCircle, Loader2, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function InvestorsList({ investors, districts = [], onAdd, onUpdate, onDelete, loading, error }) {
  const { currencySymbol, formatPrice } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'inversionista',
    contactName: '',
    email: '',
    phone: '',
    notes: '',
    district: '',
    budget: 0,
    minInvestment: 0,
    maxInvestment: 0,
    minArea: 0,
    maxArea: 0,
    status: 'activo'
  });

  const [filterMinInv, setFilterMinInv] = useState(0);
  const [filterMinArea, setFilterMinArea] = useState(0);

  const filtered = investors.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        i.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        i.district?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Lógica de rangos: 0 significa no configurado (infinito/cualquiera)
    const matchesInvestment = filterMinInv === 0 || 
                             (i.maxInvestment >= filterMinInv) || 
                             (i.maxInvestment === 0);
    
    const matchesArea = filterMinArea === 0 || 
                       (i.maxArea >= filterMinArea) || 
                       (i.maxArea === 0);
    
    return matchesSearch && matchesInvestment && matchesArea;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError(null);
    try {
      if (editingId) {
        await onUpdate(editingId, formData);
      } else {
        await onAdd(formData);
      }
      resetForm();
    } catch (err) {
      console.error("Error al guardar:", err);
      setSaveError(err.message || "Error al conectar con la base de datos");
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
      district: '',
      budget: 0,
      minInvestment: 0,
      maxInvestment: 0,
      minArea: 0,
      maxArea: 0,
      status: 'activo'
    });
    setEditingId(null);
    setSaveError(null);
    setShowForm(false);
  };

  const handleEdit = (investor) => {
    setFormData({
      ...investor,
      district: investor.district || ''
    });
    setEditingId(investor.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Búsqueda Compacta */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" size={14} />
          <input 
            type="text" 
            placeholder="Buscar comprador por nombre, contacto o distrito..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl pl-9 pr-4 py-2 text-xs font-medium outline-none focus:border-[#6B4FD8] transition-all"
          />
        </div>

        {/* Filtros de Rango Integrados */}
        <div className="flex items-center gap-3 border-l border-[var(--color-outline-variant)] pl-3">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase text-[var(--color-on-surface-variant)] opacity-60">Inversión {'>'}</span>
            <input 
              type="number"
              value={filterMinInv || ''}
              onChange={(e) => setFilterMinInv(Number(e.target.value))}
              placeholder="0"
              className="bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-lg px-2 py-1 text-[10px] font-black outline-none focus:border-[#6B4FD8] w-20 text-center"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase text-[var(--color-on-surface-variant)] opacity-60">Área {'>'}</span>
            <input 
              type="number"
              value={filterMinArea || ''}
              onChange={(e) => setFilterMinArea(Number(e.target.value))}
              placeholder="0"
              className="bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-lg px-2 py-1 text-[10px] font-black outline-none focus:border-[#6B4FD8] w-20 text-center"
            />
          </div>
          {(filterMinInv > 0 || filterMinArea > 0) && (
            <button 
              onClick={() => { setFilterMinInv(0); setFilterMinArea(0); }}
              className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
              title="Limpiar filtros"
            >
              <XCircle size={14} />
            </button>
          )}
        </div>

        {/* Botón de Acción */}
        <div className="border-l border-[var(--color-outline-variant)] pl-3">
          <button 
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-[#6B4FD8] text-[#002150] font-black px-4 py-2 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(133,173,255,0.3)] transition-all text-[10px] uppercase tracking-widest"
          >
            <Plus size={14} /> Nuevo Comprador
          </button>
        </div>
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
            
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase ml-1">Distrito</label>
              <input 
                value={formData.district}
                onChange={(e) => setFormData({...formData, district: e.target.value})}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#6B4FD8]"
                placeholder="Escribe o selecciona un distrito"
                list="districts-datalist"
              />
              <datalist id="districts-datalist">
                {districts.map(d => (
                  <option key={d.id} value={d.name} />
                ))}
              </datalist>
            </div>
            
            {/* Rangos */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase ml-1">Rango Inversión (Min - Max)</label>
              <div className="flex gap-2">
                <input 
                  type="number"
                  value={formData.minInvestment || ''}
                  onChange={(e) => setFormData({...formData, minInvestment: Number(e.target.value)})}
                  className="w-1/2 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#6B4FD8]"
                  placeholder="Min"
                />
                <input 
                  type="number"
                  value={formData.maxInvestment || ''}
                  onChange={(e) => setFormData({...formData, maxInvestment: Number(e.target.value)})}
                  className="w-1/2 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#6B4FD8]"
                  placeholder="Max"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase ml-1">Rango Área m² (Min - Max)</label>
              <div className="flex gap-2">
                <input 
                  type="number"
                  value={formData.minArea || ''}
                  onChange={(e) => setFormData({...formData, minArea: Number(e.target.value)})}
                  className="w-1/2 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#6B4FD8]"
                  placeholder="Min"
                />
                <input 
                  type="number"
                  value={formData.maxArea || ''}
                  onChange={(e) => setFormData({...formData, maxArea: Number(e.target.value)})}
                  className="w-1/2 bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#6B4FD8]"
                  placeholder="Max"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase ml-1">Notas / Preferencias</label>
              <textarea 
                value={formData.notes || ''}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#6B4FD8] h-20 resize-none"
                placeholder="Ej: Interesado solo en zonas comerciales, requiere documentación saneada..."
              />
            </div>

            {saveError && (
              <div className="col-span-full flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black uppercase">
                <AlertCircle size={14} /> {saveError}
              </div>
            )}

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
                className="flex-[2] bg-[#6B4FD8] text-[#002150] font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:shadow-[0_0_15px_rgba(133,173,255,0.4)] transition-all"
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
        ) : error ? (
          <div className="col-span-full py-10 flex flex-col items-center gap-3 text-red-500 bg-red-500/5 border border-red-500/20 rounded-3xl">
            <AlertCircle size={32} />
            <p className="text-xs font-black uppercase tracking-widest text-center px-6">
              Error al cargar inversionistas: {error}
            </p>
          </div>
        ) : filtered.length > 0 ? filtered.map(investor => (
          <div key={investor.id} className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl p-5 hover:border-[#6B4FD8]/40 transition-all group relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md">
            <div className={`absolute top-0 left-0 w-full h-1 ${investor.type === 'constructora' ? 'bg-[#6B4FD8]' : 'bg-[#2E8B57]'}`}></div>
            
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${investor.type === 'constructora' ? 'bg-[#6B4FD8]/10 text-[#6B4FD8] border-[#6B4FD8]/20' : 'bg-[#2E8B57]/10 text-[#2E8B57] border-[#2E8B57]/20'}`}>
                    {investor.type === 'constructora' ? <Building2 size={16}/> : <User size={16}/>}
                  </div>
                  <div>
                    <h5 className="font-black text-xs text-[var(--color-on-surface)]">{investor.name}</h5>
                    <p className="text-[8px] font-black uppercase text-[var(--color-on-surface-variant)] opacity-60 tracking-wider">
                      {investor.type}
                    </p>
                  </div>
                </div>
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => handleEdit(investor)} className="p-1.5 text-[#6B4FD8] hover:bg-[#6B4FD8]/10 rounded-lg transition-colors">
                    <Edit2 size={12}/>
                  </button>
                  <button onClick={() => onDelete(investor.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={12}/>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 border-t border-[var(--color-outline-variant)] pt-3 text-[10px]">
                <div className="flex items-center gap-1.5 text-[11px] mb-1">
                  <Users size={12} className="text-[#6B4FD8]" />
                  <span className="font-bold text-[var(--color-on-surface)]">{investor.contactName || 'Sin contacto'}</span>
                </div>
                
                {investor.district && (
                  <div className="text-[10px] text-[var(--color-on-surface-variant)]">
                    <span className="font-bold text-[#6B4FD8]">Distrito:</span> {investor.district}
                  </div>
                )}

                <div className="text-[10px] text-[var(--color-on-surface-variant)]">
                  <span className="font-bold text-[var(--color-on-surface)]">Inversión:</span>{' '}
                  {investor.minInvestment === 0 && investor.maxInvestment === 0 ? 'Cualquiera' :
                   investor.minInvestment > 0 && investor.maxInvestment === 0 ? `> ${formatPrice(investor.minInvestment)}` :
                   investor.minInvestment === 0 && investor.maxInvestment > 0 ? `< ${formatPrice(investor.maxInvestment)}` :
                   `${formatPrice(investor.minInvestment)} - ${formatPrice(investor.maxInvestment)}`}
                </div>

                <div className="text-[10px] text-[var(--color-on-surface-variant)]">
                  <span className="font-bold text-[var(--color-on-surface)]">Área requerida:</span>{' '}
                  {investor.minArea === 0 && investor.maxArea === 0 ? 'Cualquiera' :
                   investor.minArea > 0 && investor.maxArea === 0 ? `> ${investor.minArea.toLocaleString()} m²` :
                   investor.minArea === 0 && investor.maxArea > 0 ? `< ${investor.maxArea.toLocaleString()} m²` :
                   `${investor.minArea.toLocaleString()} - ${investor.maxArea.toLocaleString()} m²`}
                </div>

                {investor.notes && (
                  <div className="text-[10px] text-[var(--color-on-surface-variant)] italic leading-relaxed mt-2 opacity-80 border-l-2 border-[#6B4FD8]/20 pl-2 py-0.5">
                    "{investor.notes}"
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-[var(--color-on-surface-variant)] opacity-70 mt-3 border-t border-[var(--color-outline-variant)] pt-2">
              {investor.email && (
                <div className="flex items-center gap-1">
                  <Mail size={10} />
                  <span className="truncate max-w-[120px]">{investor.email}</span>
                </div>
              )}
              {investor.phone && (
                <div className="flex items-center gap-1">
                  <Phone size={10} />
                  <span>{investor.phone}</span>
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center text-[var(--color-on-surface-variant)] italic bg-[var(--color-surface-container-low)] rounded-2xl border border-dashed border-[var(--color-outline-variant)]">
            No se encontraron compradores potenciales.
          </div>
        )}
      </div>
    </div>
  );
}
