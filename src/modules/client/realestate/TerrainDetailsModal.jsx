import React, { useState } from 'react';
import { 
  X, Building2, MapPin, Users, Calendar, 
  Plus, History, FileText, Send, Trash2, 
  ExternalLink, FileUp, Download, Eye,
  AlertCircle, CheckCircle2, Clock, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import MapViewer from './MapViewer';

export default function TerrainDetailsModal({ isOpen, onClose, terrain, onUpdate, contacts, investors }) {
  const { formatPrice } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // overview | presentations | documents
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for new presentation
  const [newPresentation, setNewPresentation] = useState({
    buyerId: '',
    status: 'presentacion',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  if (!isOpen || !terrain) return null;

  const handleAddPresentation = async () => {
    if (!newPresentation.buyerId) return;
    setIsSubmitting(true);
    try {
      const buyer = investors.find(i => i.id === newPresentation.buyerId);
      const presentation = {
        ...newPresentation,
        id: crypto.randomUUID(),
        buyerName: buyer?.name || 'Desconocido'
      };
      const updatedPresentations = [presentation, ...(terrain.presentations || [])];
      await onUpdate(terrain.id, { presentations: updatedPresentations });
      setNewPresentation({
        buyerId: '',
        status: 'presentacion',
        notes: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error("Error al añadir presentación:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemovePresentation = async (id) => {
    if (!confirm('¿Eliminar este registro de presentación?')) return;
    try {
      const updatedPresentations = terrain.presentations.filter(p => p.id !== id);
      await onUpdate(terrain.id, { presentations: updatedPresentations });
    } catch (err) {
      console.error("Error al eliminar presentación:", err);
    }
  };

  const handleUploadDocument = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Mock Base64 upload for small files
    setIsSubmitting(true);
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
        const updatedDocs = [newDoc, ...(terrain.documents || [])];
        await onUpdate(terrain.id, { documents: updatedDocs });
      } catch (err) {
        console.error("Error al subir documento:", err);
      } finally {
        setIsSubmitting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDocument = async (id) => {
    if (!confirm('¿Eliminar este documento?')) return;
    try {
      const updatedDocs = terrain.documents.filter(d => d.id !== id);
      await onUpdate(terrain.id, { documents: updatedDocs });
    } catch (err) {
      console.error("Error al eliminar documento:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="bg-[var(--color-surface)] w-full max-w-4xl border border-[var(--color-outline-variant)] rounded-[2rem] shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-surface-container-high)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#6B4FD8] flex items-center justify-center text-white shrink-0">
              <Building2 size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="font-black text-sm sm:text-lg text-[var(--color-on-surface)] leading-tight uppercase tracking-widest truncate">
                Detalles de Propiedad
              </h3>
              <p className="text-xs text-[var(--color-on-surface-variant)] font-bold flex items-center gap-1 truncate">
                <MapPin size={12} className="text-[#6B4FD8] shrink-0" /> <span className="truncate">{terrain.address}, {terrain.district}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] flex items-center justify-center hover:bg-[var(--color-primary-container)] transition-all border border-[var(--color-outline-variant)]"
          >
            <X size={20}/>
          </button>
        </div>

        {/* Tabs */}
        {/* Desktop Tabs */}
        <div className="hidden md:flex px-6 bg-[var(--color-surface-container)] border-b border-[var(--color-outline-variant)]">
          {[
            { id: 'overview', label: 'Resumen', icon: Building2 },
            { id: 'presentations', label: 'Presentaciones', icon: History },
            { id: 'documents', label: 'Documentos Legales', icon: FileText }
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
            <option value="presentations">Presentaciones</option>
            <option value="documents">Documentos Legales</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center px-4 text-[var(--color-on-surface-variant)]">
            <ChevronDown size={18} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-[var(--color-surface-container-low)] p-6 rounded-3xl border border-[var(--color-outline-variant)]">
                  <h4 className="text-[10px] font-black text-[#6B4FD8] uppercase tracking-widest mb-4">Información General</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] text-[var(--color-on-surface-variant)] font-bold uppercase">Área Total</p>
                      <p className="text-sm font-black text-[var(--color-on-surface)]">{terrain.area?.toLocaleString()} m²</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-[var(--color-on-surface-variant)] font-bold uppercase">Precio x m²</p>
                      <p className="text-sm font-black text-[#2E8B57]">{formatPrice(terrain.pricePerM2)}</p>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-[var(--color-outline-variant)]">
                      <p className="text-[9px] text-[var(--color-on-surface-variant)] font-bold uppercase">Valor Comercial</p>
                      <p className="text-2xl font-black text-[var(--color-on-surface)]">{formatPrice(terrain.totalPrice)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest ml-1">Ubicación</h4>
                  {terrain.coordinates ? (
                    <MapViewer terrains={[terrain]} readOnly={true} height="200px" />
                  ) : (
                    <div className="h-[200px] bg-[var(--color-surface-container-low)] rounded-3xl border border-dashed border-[var(--color-outline-variant)] flex items-center justify-center text-[var(--color-on-surface-variant)] text-xs italic">
                      Sin geolocalización registrada
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-[#6B4FD8]/5 to-transparent p-6 rounded-3xl border border-[#6B4FD8]/10">
                  <h4 className="text-[10px] font-black text-[#6B4FD8] uppercase tracking-widest mb-4">Notas y Observaciones</h4>
                  <p className="text-sm text-[var(--color-on-surface)] leading-relaxed italic">
                    {terrain.notes || "No hay notas adicionales para esta propiedad."}
                  </p>
                </div>

                <div className="bg-[var(--color-surface-container-low)] p-6 rounded-3xl border border-[var(--color-outline-variant)]">
                  <h4 className="text-[10px] font-black text-[#6B4FD8] uppercase tracking-widest mb-4">Personas de Contacto</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-primary-container)] flex items-center justify-center text-[var(--color-primary)] font-black">
                        {contacts.find(c => c.id === terrain.ownerId)?.name.charAt(0) || <User size={18}/>}
                      </div>
                      <div>
                        <p className="text-[9px] text-[var(--color-on-surface-variant)] font-bold uppercase">Propietario</p>
                        <p className="text-xs font-bold text-[var(--color-on-surface)]">
                          {contacts.find(c => c.id === terrain.ownerId)?.name || "Desconocido"}
                        </p>
                      </div>
                    </div>
                    {terrain.buyerId && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 font-black">
                          {investors.find(i => i.id === terrain.buyerId)?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[9px] text-[var(--color-on-surface-variant)] font-bold uppercase">Comprador Asignado</p>
                          <p className="text-xs font-bold text-[var(--color-on-surface)]">
                            {investors.find(i => i.id === terrain.buyerId)?.name}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'presentations' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
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
                      disabled={isSubmitting || !newPresentation.buyerId}
                      className="w-full bg-[#6B4FD8] text-white font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#5a42b9] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Send size={14} /> Registrar
                    </button>
                  </div>
                </div>
              </div>

              {/* Historial de Presentaciones */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest ml-1">Historial de Seguimiento</h4>
                <div className="space-y-3">
                  {terrain.presentations && terrain.presentations.length > 0 ? terrain.presentations.map((p) => (
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
                            <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-[var(--color-surface-variant)] border border-[var(--color-outline-variant)]">
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

          {activeTab === 'documents' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest ml-1">Documentos de la Propiedad</h4>
                <label className="bg-[#6B4FD8] text-white font-black px-6 py-2 rounded-xl text-[10px] uppercase tracking-widest hover:bg-[#5a42b9] transition-all cursor-pointer flex items-center gap-2">
                  <FileUp size={14} /> Subir Documento
                  <input type="file" className="hidden" onChange={handleUploadDocument} accept=".pdf,.png,.jpg,.jpeg" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {terrain.documents && terrain.documents.length > 0 ? terrain.documents.map((doc) => (
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
        <div className="p-6 bg-[var(--color-surface-container-low)] border-t border-[var(--color-outline-variant)] flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface)] font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-[var(--color-surface-variant)] transition-all"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
}
