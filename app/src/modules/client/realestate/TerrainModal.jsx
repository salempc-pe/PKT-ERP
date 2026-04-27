import { useState, useEffect } from 'react';
import { X, Building2, MapPin, User, Calculator, Plus, Loader2, AlertCircle } from 'lucide-react';

export default function TerrainModal({ isOpen, onClose, terrain, onSave, contacts, terrains }) {
  const [formData, setFormData] = useState({
    city: '',
    district: '',
    address: '',
    ownerId: '',
    brokers: [],
    area: 0,
    pricePerM2: 0,
    totalPrice: 0,
    notes: '',
    status: 'presentacion',
    buyerId: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [newBroker, setNewBroker] = useState('');

  // Listas para los dropdowns editables (únicos de los datos existentes)
  const cities = [...new Set(terrains.map(t => t.city))].filter(Boolean);
  const districts = [...new Set(terrains.map(t => t.district))].filter(Boolean);

  useEffect(() => {
    if (terrain) {
      setFormData({
        ...terrain,
        buyerId: terrain.buyerId || ''
      });
    } else {
      setFormData({
        city: '',
        district: '',
        address: '',
        ownerId: '',
        brokers: [],
        area: 0,
        pricePerM2: 0,
        totalPrice: 0,
        notes: '',
        status: 'presentacion',
        buyerId: ''
      });
    }
    setError(null);
  }, [terrain, isOpen]);

  // Lógica de Calculadora Reactiva
  const handlePriceChange = (field, value) => {
    const val = parseFloat(value) || 0;
    let newFormData = { ...formData, [field]: val };

    if (field === 'area' || field === 'pricePerM2') {
      // Si cambia área o precio x m2, actualizamos total
      newFormData.totalPrice = newFormData.area * newFormData.pricePerM2;
    } else if (field === 'totalPrice') {
      // Si cambia total, recalculamos precio x m2 basado en el área
      if (newFormData.area > 0) {
        newFormData.pricePerM2 = newFormData.totalPrice / newFormData.area;
      }
    }

    setFormData(newFormData);
  };

  const handleAddBroker = () => {
    if (newBroker.trim() && !formData.brokers.includes(newBroker.trim())) {
      setFormData({ ...formData, brokers: [...formData.brokers, newBroker.trim()] });
      setNewBroker('');
    }
  };

  const handleRemoveBroker = (broker) => {
    setFormData({ ...formData, brokers: formData.brokers.filter(b => b !== broker) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onSave(terrain?.id, formData);
      onClose();
    } catch (err) {
      console.error("Error al guardar terreno:", err);
      setError("Error al guardar la propiedad. Verifica los campos.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => !isSaving && onClose()}></div>
      
      <form 
        onSubmit={handleSubmit}
        className="bg-[#0f1930] w-full max-w-2xl border border-[#40485d]/30 rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in duration-300 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-[#40485d]/20 flex justify-between items-center bg-gradient-to-r from-[#141f38] to-[#0f1930]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#85adff]/10 flex items-center justify-center text-[#85adff] shadow-inner">
              <Building2 size={24} />
            </div>
            <div>
              <h3 className="font-black text-[#dee5ff] uppercase tracking-[0.2em] text-sm">
                {terrain ? 'Editar Propiedad' : 'Nueva Propiedad'}
              </h3>
              <p className="text-[10px] text-[#85adff] font-bold uppercase">Gestión de Terrenos Inmobiliarios</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-10 h-10 rounded-full bg-[#1d2b4a] text-[#a3aac4] flex items-center justify-center hover:text-white hover:bg-red-500/20 transition-all"
          >
            <X size={20}/>
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6 overflow-y-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-xs animate-pulse">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {/* Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#a3aac4] uppercase tracking-wider ml-1">Ciudad</label>
              <div className="relative">
                <input 
                  list="cities-list"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-2xl px-5 py-3 text-[#dee5ff] focus:border-[#85adff] outline-none transition-all font-bold text-sm"
                  placeholder="Ej: Lima"
                />
                <datalist id="cities-list">
                  {cities.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#a3aac4] uppercase tracking-wider ml-1">Distrito</label>
              <div className="relative">
                <input 
                  list="districts-list"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-2xl px-5 py-3 text-[#dee5ff] focus:border-[#85adff] outline-none transition-all font-bold text-sm"
                  placeholder="Ej: Miraflores"
                />
                <datalist id="districts-list">
                  {districts.map(d => <option key={d} value={d} />)}
                </datalist>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#a3aac4] uppercase tracking-wider ml-1">Dirección Exacta</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#40485d]" />
              <input 
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-2xl pl-12 pr-5 py-3 text-[#dee5ff] focus:border-[#85adff] outline-none transition-all text-sm"
                placeholder="Av. Principal 123..."
              />
            </div>
          </div>

          <hr className="border-[#40485d]/10" />

          {/* Personas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#a3aac4] uppercase tracking-wider ml-1">Propietario / Cliente</label>
              <select 
                required
                value={formData.ownerId}
                onChange={(e) => setFormData({...formData, ownerId: e.target.value})}
                className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-2xl px-5 py-3 text-[#dee5ff] focus:border-[#85adff] outline-none transition-all font-bold text-sm appearance-none"
              >
                <option value="">Seleccionar Contacto...</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#a3aac4] uppercase tracking-wider ml-1">Posible Comprador (Opcional)</label>
              <select 
                value={formData.buyerId}
                onChange={(e) => setFormData({...formData, buyerId: e.target.value})}
                className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-2xl px-5 py-3 text-[#dee5ff] focus:border-[#85adff] outline-none transition-all font-bold text-sm appearance-none"
              >
                <option value="">Ninguno asignado...</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-[#a3aac4] uppercase tracking-wider ml-1">Corredores Asociados</label>
            <div className="flex gap-2">
              <input 
                type="text"
                value={newBroker}
                onChange={(e) => setNewBroker(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBroker())}
                className="flex-1 bg-[#141f38] border border-[#40485d]/30 rounded-xl px-5 py-2.5 text-[#dee5ff] focus:border-[#85adff] outline-none text-sm"
                placeholder="Nombre del corredor..."
              />
              <button 
                type="button"
                onClick={handleAddBroker}
                className="p-2.5 bg-[#85adff] text-[#002150] rounded-xl hover:shadow-lg transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.brokers.map(broker => (
                <span key={broker} className="flex items-center gap-2 bg-[#1d2b4a] text-[#85adff] px-3 py-1.5 rounded-full text-[10px] font-black border border-[#85adff]/10">
                  {broker}
                  <button type="button" onClick={() => handleRemoveBroker(broker)} className="text-red-400 hover:text-red-500"><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          <hr className="border-[#40485d]/10" />

          {/* Calculadora de Precios */}
          <div className="bg-[#141f38]/50 p-6 rounded-[2rem] border border-[#85adff]/5 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Calculator size={16} className="text-[#85adff]" />
              <span className="text-[10px] font-black text-[#85adff] uppercase tracking-widest">Calculadora de Valor</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#a3aac4] uppercase ml-1">Área (m²)</label>
                <input 
                  type="number"
                  required
                  value={formData.area}
                  onChange={(e) => handlePriceChange('area', e.target.value)}
                  className="w-full bg-[#091328] border border-[#40485d]/30 rounded-xl px-4 py-2.5 text-[#dee5ff] focus:border-[#85adff] outline-none text-sm font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#a3aac4] uppercase ml-1">Precio x m² (US$)</label>
                <input 
                  type="number"
                  required
                  value={formData.pricePerM2}
                  onChange={(e) => handlePriceChange('pricePerM2', e.target.value)}
                  className="w-full bg-[#091328] border border-[#40485d]/30 rounded-xl px-4 py-2.5 text-[#dee5ff] focus:border-[#85adff] outline-none text-sm font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#85adff] uppercase ml-1">Precio Total (US$)</label>
                <input 
                  type="number"
                  required
                  value={formData.totalPrice}
                  onChange={(e) => handlePriceChange('totalPrice', e.target.value)}
                  className="w-full bg-[#0f1930] border border-[#85adff]/30 rounded-xl px-4 py-2.5 text-[#85adff] focus:border-[#85adff] outline-none text-sm font-black"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#a3aac4] uppercase tracking-wider ml-1">Notas / Observaciones</label>
            <textarea 
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-2xl px-5 py-4 text-[#dee5ff] focus:border-[#85adff] outline-none transition-all text-sm resize-none"
              placeholder="Detalles adicionales sobre el terreno, zonificación, etc."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-[#141f38] flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-6 py-4 rounded-2xl font-bold text-[#a3aac4] hover:bg-[#0f1930] transition-all disabled:opacity-50"
          >
            Descartar
          </button>
          <button 
            type="submit"
            disabled={isSaving}
            className="flex-[2] bg-[#85adff] text-[#002150] font-black px-6 py-4 rounded-2xl hover:shadow-[0_0_25px_rgba(133,173,255,0.4)] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Guardando...
              </>
            ) : (terrain ? 'Guardar Cambios' : 'Registrar Propiedad')}
          </button>
        </div>
      </form>
    </div>
  );
}
