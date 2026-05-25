import { useState, useEffect } from 'react';
import { 
  X, Building2, MapPin, User, Users, Calculator, Plus, Loader2, AlertCircle, 
  Search, Map as MapIcon, Calendar, History, FileText, Send, Trash2, 
  ExternalLink, FileUp, CheckCircle2, Clock, ChevronDown 
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import MapViewer from './MapViewer';

export default function TerrainModal({ isOpen, onClose, terrain, onSave, contacts, investors, terrains }) {
  const { currencySymbol, formatPrice } = useAuth();
  
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

  const [activeTab, setActiveTab] = useState(terrain ? 'overview' : 'edit');
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [newBroker, setNewBroker] = useState('');
  
  // State for new presentation
  const [newPresentation, setNewPresentation] = useState({
    buyerId: '',
    status: 'presentacion',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

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
      setActiveTab('overview');
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
      setActiveTab('edit');
    }
    setError(null);
  }, [terrain, isOpen]);

  // Lógica de Calculadora Reactiva
  const handlePriceChange = (field, value) => {
    const val = parseFloat(value) || 0;
    let newFormData = { ...formData, [field]: val };

    if (field === 'area' || field === 'pricePerM2') {
      newFormData.totalPrice = newFormData.area * newFormData.pricePerM2;
    } else if (field === 'totalPrice') {
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

  // Lógica de Presentaciones
  const handleAddPresentation = async () => {
    if (!newPresentation.buyerId) return;
    setIsSaving(true);
    try {
      const buyer = investors.find(i => i.id === newPresentation.buyerId);
      const presentation = {
        ...newPresentation,
        id: crypto.randomUUID(),
        buyerName: buyer?.name || 'Desconocido'
      };
      const updatedPresentations = [presentation, ...(formData.presentations || [])];
      
      setFormData(prev => ({
        ...prev,
        presentations: updatedPresentations
      }));

      if (terrain?.id) {
        await onSave(terrain.id, {
          ...formData,
          presentations: updatedPresentations
        });
      }

      setNewPresentation({
        buyerId: '',
        status: 'presentacion',
        notes: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error("Error al añadir presentación:", err);
      setError("Error al guardar la presentación.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePresentation = async (presId) => {
    if (!confirm('¿Eliminar este registro de presentación?')) return;
    setIsSaving(true);
    try {
      const updatedPresentations = (formData.presentations || []).filter(p => p.id !== presId);
      
      setFormData(prev => ({
        ...prev,
        presentations: updatedPresentations
      }));

      if (terrain?.id) {
        await onSave(terrain.id, {
          ...formData,
          presentations: updatedPresentations
        });
      }
    } catch (err) {
      console.error("Error al eliminar presentación:", err);
      setError("Error al eliminar la presentación.");
    } finally {
      setIsSaving(false);
    }
  };

  // Lógica de Documentos
  const handleUploadDocument = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsSaving(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64 = event.target.result;
        const newDoc = {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type,
          url: base64,
          uploadedAt: new Date().toISOString()
        };
        const updatedDocs = [newDoc, ...(formData.documents || [])];
        
        setFormData(prev => ({
          ...prev,
          documents: updatedDocs
        }));

        if (terrain?.id) {
          await onSave(terrain.id, {
            ...formData,
            documents: updatedDocs
          });
        }
      } catch (err) {
        console.error("Error al subir documento:", err);
        setError("Error al subir el documento.");
      } finally {
        setIsSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDocument = async (docId) => {
    if (!confirm('¿Eliminar este documento?')) return;
    setIsSaving(true);
    try {
      const updatedDocs = (formData.documents || []).filter(d => d.id !== docId);
      
      setFormData(prev => ({
        ...prev,
        documents: updatedDocs
      }));

      if (terrain?.id) {
        await onSave(terrain.id, {
          ...formData,
          documents: updatedDocs
        });
      }
    } catch (err) {
      console.error("Error al eliminar documento:", err);
      setError("Error al eliminar el documento.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => !isSaving && onClose()}></div>
      
      <div className="bg-[var(--color-surface)] w-full max-w-4xl border border-[var(--color-outline-variant)] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden relative animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-surface-container-high)] relative">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-[#6B4FD8] flex items-center justify-center text-[#002150]">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-[0.1em] text-xs">
                {terrain ? (activeTab === 'overview' ? 'Detalles de la Propiedad' : activeTab === 'edit' ? 'Editar Propiedad' : activeTab === 'presentations' ? 'Presentaciones' : 'Documentos Legales') : 'Nueva Propiedad'}
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

        {/* Tab Headers (Only if editing an existing terrain) */}
        {terrain && (
          <>
            {/* Desktop Tabs */}
            <div className="hidden md:flex px-6 bg-[var(--color-surface-container)] border-b border-[var(--color-outline-variant)]">
              {[
                { id: 'overview', label: 'Resumen', icon: Building2 },
                { id: 'edit', label: 'Editar propiedad', icon: Calculator },
                { id: 'presentations', label: 'Presentaciones', icon: History },
                { id: 'documents', label: 'Documentos legales', icon: FileText }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-black text-[10px] uppercase tracking-widest transition-all relative ${
                    activeTab === tab.id ? 'text-[#6B4FD8]' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#6B4FD8] rounded-t-full"></div>}
                </button>
              ))}
            </div>

            {/* Mobile Tabs */}
            <div className="md:hidden p-4 bg-[var(--color-surface-container)] border-b border-[var(--color-outline-variant)] relative">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full bg-[var(--color-surface)] text-[var(--color-on-surface)] text-xs font-black uppercase tracking-widest rounded-xl border border-[var(--color-outline-variant)] px-4 py-3 outline-none appearance-none focus:border-[#6B4FD8]"
              >
                <option value="overview">Resumen</option>
                <option value="edit">Editar propiedad</option>
                <option value="presentations">Presentaciones</option>
                <option value="documents">Documentos legales</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center px-4 text-[var(--color-on-surface-variant)]">
                <ChevronDown size={18} />
              </div>
            </div>
          </>
        )}

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-xs animate-pulse">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
              <div className="space-y-4">
                <div className="bg-[var(--color-surface-container-low)] p-6 rounded-3xl border border-[var(--color-outline-variant)]">
                  <h4 className="text-[10px] font-black text-[#6B4FD8] uppercase tracking-widest mb-4">Información General</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] text-[var(--color-on-surface-variant)] font-bold uppercase">Área Total</p>
                      <p className="text-sm font-black text-[var(--color-on-surface)]">{formData.area?.toLocaleString()} m²</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-[var(--color-on-surface-variant)] font-bold uppercase">Precio x m²</p>
                      <p className="text-sm font-black text-[#6B4FD8]">{formatPrice(formData.pricePerM2)}</p>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-[var(--color-outline-variant)]">
                      <p className="text-[9px] text-[var(--color-on-surface-variant)] font-bold uppercase">Valor Comercial</p>
                      <p className="text-2xl font-black text-[var(--color-on-surface)]">{formatPrice(formData.totalPrice)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest ml-1">Ubicación</h4>
                  {formData.coordinates ? (
                    <MapViewer terrains={[{ ...formData, id: terrain?.id || 'temp' }]} readOnly={true} height="200px" />
                  ) : (
                    <div className="h-[200px] bg-[var(--color-surface-container-low)] rounded-3xl border border-dashed border-[var(--color-outline-variant)] flex items-center justify-center text-[var(--color-on-surface-variant)] text-xs italic">
                      Sin geolocalización registrada
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-[#6B4FD8]/5 to-transparent p-6 rounded-3xl border border-[#6B4FD8]/10">
                  <h4 className="text-[10px] font-black text-[#6B4FD8] uppercase tracking-widest mb-4">Notas y Observaciones</h4>
                  <p className="text-xs text-[var(--color-on-surface)] leading-relaxed italic whitespace-pre-line">
                    {formData.notes || "No hay notas adicionales para esta propiedad."}
                  </p>
                </div>

                <div className="bg-[var(--color-surface-container-low)] p-6 rounded-3xl border border-[var(--color-outline-variant)]">
                  <h4 className="text-[10px] font-black text-[#6B4FD8] uppercase tracking-widest mb-4">Personas de Contacto</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-primary-container)] flex items-center justify-center text-[var(--color-primary)] font-black text-xs border border-[var(--color-outline-variant)]">
                        {contacts.find(c => c.id === formData.ownerId)?.name.charAt(0) || <User size={18}/>}
                      </div>
                      <div>
                        <p className="text-[9px] text-[var(--color-on-surface-variant)] font-bold uppercase">Propietario</p>
                        <p className="text-xs font-bold text-[var(--color-on-surface)]">
                          {contacts.find(c => c.id === formData.ownerId)?.name || "Desconocido"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EDIT (FORM) */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSubmit} id="terrain-edit-form" className="space-y-4 animate-in fade-in duration-300">
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
                  <div className="flex gap-4 text-[10px] font-bold text-[var(--color-on-surface-variant)] bg-[var(--color-surface)]/50 p-2 rounded-lg border border-[var(--color-outline-variant)] w-fit">
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
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1">Corredores Asociados</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    list="brokers-list"
                    value={newBroker}
                    onChange={(e) => setNewBroker(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBroker())}
                    className="flex-1 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-5 py-3 text-[var(--color-on-surface)] focus:border-[#6B4FD8] focus:ring-4 focus:ring-[#6B4FD8]/10 outline-none transition-all text-sm font-bold"
                    placeholder="Nombre del corredor..."
                  />
                  <datalist id="brokers-list">
                    {existingBrokers.map(b => <option key={b} value={b} />)}
                  </datalist>
                  <button 
                    type="button"
                    onClick={handleAddBroker}
                    className="p-3 bg-[#6B4FD8] text-[#002150] rounded-xl hover:bg-[#5a42b9] transition-all"
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
              <div className="bg-gradient-to-br from-[var(--color-surface-container-low)] to-[var(--color-surface-container)] p-5 rounded-2xl border border-[var(--color-outline-variant)] space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-[#6B4FD8]/10 flex items-center justify-center text-[#6B4FD8]">
                    <Calculator size={14} />
                  </div>
                  <span className="text-[10px] font-black text-[var(--color-on-surface)] uppercase tracking-widest">Calculadora de Valor</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase ml-1">Área (m²) *</label>
                    <input 
                      type="number"
                      inputMode="decimal"
                      required
                      value={formData.area}
                      onChange={(e) => handlePriceChange('area', e.target.value)}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg px-3 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none text-xs font-black"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase ml-1">Precio x m² ({currencySymbol})</label>
                    <input 
                      type="number"
                      inputMode="decimal"
                      value={formData.pricePerM2}
                      onChange={(e) => handlePriceChange('pricePerM2', e.target.value)}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-lg px-3 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none text-xs font-black text-[#6B4FD8]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[#6B4FD8] uppercase ml-1">Precio Total ({currencySymbol})</label>
                    <input 
                      type="number"
                      inputMode="decimal"
                      value={formData.totalPrice}
                      onChange={(e) => handlePriceChange('totalPrice', e.target.value)}
                      className="w-full bg-[#6B4FD8]/5 border border-[#6B4FD8]/30 rounded-lg px-3 py-2.5 text-[#6B4FD8] focus:border-[#6B4FD8] outline-none text-xs font-black"
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
                  className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-2xl px-5 py-4 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none transition-all text-sm resize-none font-bold"
                  placeholder="Detalles adicionales sobre el terreno, zonificación, etc."
                />
              </div>
            </form>
          )}

          {/* TAB 3: PRESENTATIONS */}
          {activeTab === 'presentations' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Formulario Nueva Presentación */}
              <div className="bg-[var(--color-surface-container-low)] p-6 rounded-3xl border border-[var(--color-outline-variant)]">
                <h4 className="text-[10px] font-black text-[#6B4FD8] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Plus size={14} /> Registrar Nueva Presentación
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase ml-1">Comprador (Inv/Cons)</label>
                    <select 
                      value={newPresentation.buyerId}
                      onChange={(e) => setNewPresentation({...newPresentation, buyerId: e.target.value})}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#6B4FD8]"
                    >
                      <option value="">Seleccionar...</option>
                      {investors.map(inv => <option key={inv.id} value={inv.id}>{inv.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase ml-1">Estado</label>
                    <select 
                      value={newPresentation.status}
                      onChange={(e) => setNewPresentation({...newPresentation, status: e.target.value})}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#6B4FD8]"
                    >
                      <option value="presentacion">Presentación</option>
                      <option value="negociacion">Negociación</option>
                      <option value="aprobado">Aprobado</option>
                      <option value="descartado">Descartado</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase ml-1">Fecha</label>
                    <input 
                      type="date"
                      value={newPresentation.date}
                      onChange={(e) => setNewPresentation({...newPresentation, date: e.target.value})}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-[#6B4FD8]"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase ml-1">Notas de la Presentación</label>
                    <input 
                      type="text"
                      placeholder="Ej: Se mostró interesado por la ubicación..."
                      value={newPresentation.notes}
                      onChange={(e) => setNewPresentation({...newPresentation, notes: e.target.value})}
                      className="w-full bg-[var(--color-surface)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-[#6B4FD8]"
                    />
                  </div>
                  <div className="flex items-end">
                    <button 
                      onClick={handleAddPresentation}
                      disabled={isSaving || !newPresentation.buyerId}
                      className="w-full bg-[#6B4FD8] text-[#002150] font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:shadow-[0_0_15px_rgba(107,79,216,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 h-[42px]"
                    >
                      <Send size={14} /> Registrar
                    </button>
                  </div>
                </div>
              </div>

              {/* Historial de Presentaciones */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest ml-1">Historial de Seguimiento</h4>
                <div className="space-y-2">
                  {formData.presentations && formData.presentations.length > 0 ? formData.presentations.map((p) => (
                    <div key={p.id} className="bg-[var(--color-surface-container-low)] p-4 rounded-2xl border border-[var(--color-outline-variant)] flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          p.status === 'aprobado' ? 'bg-green-500/10 text-green-500' :
                          p.status === 'descartado' ? 'bg-red-500/10 text-red-500' :
                          p.status === 'negociacion' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {p.status === 'aprobado' ? <CheckCircle2 size={20} /> :
                           p.status === 'descartado' ? <X size={20} /> :
                           p.status === 'negociacion' ? <Clock size={20} /> :
                           <Send size={20} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-black text-[var(--color-on-surface)]">{p.buyerName}</p>
                            <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-[var(--color-surface-variant)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]">
                              {p.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-[var(--color-on-surface-variant)] font-medium mt-0.5">{p.notes}</p>
                          <p className="text-[9px] text-[var(--color-on-surface-variant)] opacity-50 flex items-center gap-1 mt-1 uppercase">
                            <Calendar size={10} /> {p.date}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemovePresentation(p.id)}
                        className="p-2 min-w-[44px] min-h-[44px] text-red-400 opacity-50 hover:opacity-100 hover:bg-red-500/10 rounded-lg transition-all flex items-center justify-center"
                        title="Eliminar presentación"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )) : (
                    <div className="py-10 text-center text-[var(--color-on-surface-variant)] italic text-xs bg-[var(--color-surface-container-low)] rounded-3xl border border-dashed border-[var(--color-outline-variant)]">
                      No se han registrado presentaciones aún.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest ml-1">Documentos de la Propiedad</h4>
                <label className="bg-[#6B4FD8] text-[#002150] font-black px-6 py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:shadow-[0_0_15px_rgba(107,79,216,0.3)] transition-all cursor-pointer flex items-center gap-2">
                  <FileUp size={14} /> Subir Documento
                  <input type="file" className="hidden" onChange={handleUploadDocument} accept=".pdf,.png,.jpg,.jpeg" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.documents && formData.documents.length > 0 ? formData.documents.map((doc) => (
                  <div key={doc.id} className="bg-[var(--color-surface-container-low)] p-4 rounded-3xl border border-[var(--color-outline-variant)] flex justify-between items-center group hover:border-[#6B4FD8]/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#6B4FD8]/10 flex items-center justify-center text-[#6B4FD8]">
                        <FileText size={24} />
                      </div>
                      <div className="max-w-[200px]">
                        <p className="text-xs font-black text-[var(--color-on-surface)] truncate">{doc.name}</p>
                        <p className="text-[9px] text-[var(--color-on-surface-variant)] uppercase font-bold opacity-60">
                          {doc.type.split('/')[1] || 'DOC'} • {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 bg-[var(--color-surface)] text-[var(--color-on-surface-variant)] hover:text-[#6B4FD8] rounded-xl border border-[var(--color-outline-variant)] hover:border-[#6B4FD8]/50 transition-all"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <button 
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="p-2 bg-[var(--color-surface)] text-red-400 hover:text-red-600 rounded-xl border border-[var(--color-outline-variant)] hover:border-red-500/50 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-16 text-center text-[var(--color-on-surface-variant)] italic text-xs bg-[var(--color-surface-container-low)] rounded-[2.5rem] border border-dashed border-[var(--color-outline-variant)]">
                    <FileText size={40} className="mx-auto mb-4 opacity-10" />
                    No hay documentos legales cargados.
                  </div>
                )}
              </div>
              
              <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl flex gap-3 items-start">
                <AlertCircle size={18} className="text-amber-500 shrink-0" />
                <p className="text-[10px] text-amber-600 font-medium leading-relaxed uppercase">
                  Nota: El almacenamiento actual usa Base64 para demostración. En producción real, estos archivos se guardarán en Firebase Storage para optimizar el rendimiento de la base de datos.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-[var(--color-surface-container-low)] border-t border-[var(--color-outline-variant)] flex flex-col-reverse sm:flex-row gap-3 justify-end">
          {activeTab === 'edit' ? (
            <>
              <button 
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="px-6 py-3 rounded-xl font-bold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-all disabled:opacity-50 text-xs uppercase tracking-widest"
              >
                Descartar
              </button>
              <button 
                type="submit"
                form="terrain-edit-form"
                disabled={isSaving}
                className="bg-[#6B4FD8] text-[#002150] font-black px-6 py-3 rounded-xl hover:shadow-[0_10px_20px_rgba(107,79,216,0.2)] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Guardando...
                  </>
                ) : (terrain ? 'Guardar Cambios' : 'Registrar Propiedad')}
              </button>
            </>
          ) : (
            <button 
              type="button"
              onClick={onClose}
              className="px-8 py-3 bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-[var(--color-surface-variant)] transition-all"
            >
              Cerrar Detalle
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
