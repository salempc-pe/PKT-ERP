import { useState, useEffect } from 'react';
import { X, Building2, MapPin, User, Calculator, Plus, Loader2, AlertCircle, Search, Map as MapIcon } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import MapViewer from './MapViewer';

export default function TerrainModal({ isOpen, onClose, terrain, onSave, contacts, investors, terrains }) {
  const { currencySymbol } = useAuth();
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
    presentations: [],
    documents: [],
    coordinates: null
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [newBroker, setNewBroker] = useState('');

  // Listas para los dropdowns editables
  const cities = [...new Set(terrains.map(t => t.city))].filter(Boolean);
  const districts = [...new Set(terrains.map(t => t.district))].filter(Boolean);
  const existingBrokers = [...new Set(terrains.flatMap(t => t.brokers || []))].filter(Boolean);

  const handleSearchAddress = async () => {
    if (!formData.address) return;
    setIsSearching(true);
    setError(null);
    try {
      const query = `${formData.address}, ${formData.district}, ${formData.city}`;
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setFormData(prev => ({
          ...prev,
          coordinates: { lat: parseFloat(lat), lng: parseFloat(lon) }
        }));
      } else {
        setError("No se pudo encontrar la ubicación exacta. Por favor, marca el mapa manualmente.");
      }
    } catch (err) {
      console.error("Error geocoding:", err);
      setError("Error al buscar la dirección.");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (terrain) {
      setFormData({
        ...terrain,
        presentations: terrain.presentations || [],
        documents: terrain.documents || []
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
        presentations: [],
        documents: [],
        coordinates: null
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
      if (err.name === 'ZodError') {
        const issues = err.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
        setError(`Error de validación: ${issues}`);
      } else {
        setError(err.message || "Error al guardar la propiedad. Verifica los campos.");
      }
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
        className="bg-[var(--color-surface)] w-full max-w-2xl border border-[var(--color-outline-variant)] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden relative animate-in zoom-in duration-300 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-surface-container-high)] relative">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#6B4FD8] flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-[0.1em] text-xs">
                {terrain ? 'Editar Propiedad' : 'Nueva Propiedad'}
              </h3>
              <p className="text-[9px] text-[#6B4FD8] font-bold uppercase tracking-wider">Gestión Inmobiliaria</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-8 h-8 rounded-full bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] flex items-center justify-center hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-container)] transition-all border border-[var(--color-outline-variant)]"
          >
            <X size={18}/>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-xs animate-pulse">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {/* Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1">Ciudad *</label>
              <div className="relative">
                <input 
                  list="cities-list"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-5 py-3 text-[var(--color-on-surface)] focus:border-[#6B4FD8] focus:ring-4 focus:ring-[#6B4FD8]/10 outline-none transition-all font-bold text-sm"
                  placeholder="Ej: Lima"
                />
                <datalist id="cities-list">
                  {cities.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1">Distrito *</label>
              <div className="relative">
                <input 
                  list="districts-list"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-5 py-3 text-[var(--color-on-surface)] focus:border-[#6B4FD8] focus:ring-4 focus:ring-[#6B4FD8]/10 outline-none transition-all font-bold text-sm"
                  placeholder="Ej: Miraflores"
                />
                <datalist id="districts-list">
                  {districts.map(d => <option key={d} value={d} />)}
                </datalist>
              </div>
            </div>
          </div>

          {/* Ubicación Geográfica */}
          <div className="space-y-3 bg-[var(--color-surface-container-low)] p-4 rounded-2xl border border-[var(--color-outline-variant)]">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1 flex items-center gap-2">
                <MapIcon size={12} className="text-[#6B4FD8]" /> Ubicación en el Mapa
              </label>
              <span className="text-[9px] font-bold text-[#6B4FD8]">Haz clic en el mapa para marcar</span>
            </div>
            
            <MapViewer 
              height="200px" 
              selectedLocation={formData.coordinates} 
              onLocationSelect={(latlng) => setFormData({...formData, coordinates: { lat: latlng.lat, lng: latlng.lng }})}
            />

            {formData.coordinates && (
              <div className="flex gap-4 text-[10px] font-bold text-[var(--color-on-surface-variant)] bg-[var(--color-surface)]/50 p-2 rounded-lg border border-[var(--color-outline-variant)]">
                <span>Lat: {formData.coordinates.lat.toFixed(6)}</span>
                <span>Lng: {formData.coordinates.lng.toFixed(6)}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1 flex justify-between">
              <span>Dirección Exacta *</span>
              <span className="text-[9px] lowercase font-medium opacity-50 italic">Presiona la lupa para ubicar en mapa</span>
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" />
              <input 
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl pl-12 pr-14 py-3 text-[var(--color-on-surface)] focus:border-[#6B4FD8] focus:ring-4 focus:ring-[#6B4FD8]/10 outline-none transition-all text-sm font-bold"
                placeholder="Av. Principal 123..."
              />
              <button 
                type="button"
                onClick={handleSearchAddress}
                disabled={isSearching || !formData.address}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#6B4FD8]/10 text-[#6B4FD8] rounded-lg hover:bg-[#6B4FD8] hover:text-white transition-all disabled:opacity-50"
                title="Buscar en mapa"
              >
                {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
              </button>
            </div>
          </div>

          <hr className="border-[var(--color-outline-variant)]" />

          {/* Personas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1">Propietario / Cliente *</label>
              <select 
                required
                value={formData.ownerId}
                onChange={(e) => setFormData({...formData, ownerId: e.target.value})}
                className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-5 py-3 text-[var(--color-on-surface)] focus:border-[#6B4FD8] focus:ring-4 focus:ring-[#6B4FD8]/10 outline-none transition-all font-bold text-sm appearance-none"
              >
                <option value="">Seleccionar Contacto...</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.company})</option>
                ))}
              </select>
            </div>
            {/* Campo de Comprador eliminado por solicitud del usuario */}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/50 uppercase tracking-wider ml-1">Corredores Asociados</label>
            <div className="flex gap-2">
              <input 
                type="text"
                list="brokers-list"
                value={newBroker}
                onChange={(e) => setNewBroker(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBroker())}
                className="flex-1 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-5 py-3 text-[var(--color-on-surface)] focus:border-[#6B4FD8] focus:ring-4 focus:ring-[#6B4FD8]/10 outline-none transition-all text-sm"
                placeholder="Nombre del corredor..."
              />
              <datalist id="brokers-list">
                {existingBrokers.map(b => <option key={b} value={b} />)}
              </datalist>
              <button 
                type="button"
                onClick={handleAddBroker}
                className="p-3 bg-[#6B4FD8] text-white rounded-xl hover:bg-[#5a42b9] transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.brokers.map(broker => (
                <span key={broker} className="flex items-center gap-2 bg-[#6B4FD8]/10 text-[#6B4FD8] px-3 py-1.5 rounded-xl text-[10px] font-black border border-[#6B4FD8]/20">
                  {broker}
                  <button type="button" onClick={() => handleRemoveBroker(broker)} className="text-red-400 hover:text-red-500 transition-colors"><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>

          <hr className="border-[var(--color-outline-variant)]" />

          {/* Calculadora de Precios */}
          <div className="bg-gradient-to-br from-[var(--color-surface-container-low)] to-[var(--color-surface-container)] p-5 rounded-2xl border border-[var(--color-outline-variant)] shadow-sm space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-[#6B4FD8]/10 flex items-center justify-center text-[#6B4FD8]">
                <Calculator size={14} />
              </div>
              <span className="text-[10px] font-black text-[var(--color-on-surface)] uppercase tracking-widest">Calculadora de Valor</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase ml-1">Área (m²) *</label>
                <input 
                  type="number"
                  required
                  value={formData.area}
                  onChange={(e) => handlePriceChange('area', e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none text-xs font-black"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase ml-1">Precio x m² ({currencySymbol})</label>
                <input 
                  type="number"
                  value={formData.pricePerM2}
                  onChange={(e) => handlePriceChange('pricePerM2', e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none text-xs font-black text-purple-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-[#2E8B57] uppercase ml-1">Precio Total ({currencySymbol})</label>
                <input 
                  type="number"
                  value={formData.totalPrice}
                  onChange={(e) => handlePriceChange('totalPrice', e.target.value)}
                  className="w-full bg-[#2E8B57]/5 border border-[#2E8B57]/30 rounded-lg px-3 py-2 text-[#2E8B57] focus:border-[#2E8B57] outline-none text-xs font-black shadow-[0_0_10px_rgba(46,139,87,0.05)]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1">Notas / Observaciones</label>
            <textarea 
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-2xl px-5 py-4 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none transition-all text-sm resize-none"
              placeholder="Detalles adicionales sobre el terreno, zonificación, etc."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-[var(--color-surface-container-low)] border-t border-[var(--color-outline-variant)] flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-all disabled:opacity-50 text-xs uppercase tracking-widest"
          >
            Descartar
          </button>
          <button 
            type="submit"
            disabled={isSaving}
            className="flex-[2] bg-gradient-to-r from-[#6B4FD8] to-[#2E8B57] text-white font-black px-6 py-3 rounded-xl hover:shadow-[0_10px_20px_rgba(107,79,216,0.2)] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
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
