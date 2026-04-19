import { useState } from 'react';
import { Users, Phone, Mail, MoreVertical, Plus, Kanban, List, Loader2, X, AlertCircle } from 'lucide-react';
import { useCrm } from './useCrm';
import { useAuth } from '../../../context/AuthContext';

export default function CRMModule() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  const { contacts, leads, loading, addContact, addLead, updateLeadStatus } = useCrm(orgId);
  const [activeTab, setActiveTab] = useState('pipeline'); // pipeline | contacts
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('lead'); // lead | contact
  const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', source: 'Manual', creditDays: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const pipelineStages = [
    { id: 'prospect', title: 'Prospecto', color: 'bg-[#a3aac4]' },
    { id: 'negotiating', title: 'Negociación', color: 'bg-[#85adff]' },
    { id: 'won', title: 'Ganado', color: 'bg-[#5391ff]' },
    { id: 'lost', title: 'Perdido', color: 'bg-[#ff6b6b]' }
  ];

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      if (modalType === 'lead') {
        await addLead(formData);
      } else {
        await addContact(formData);
      }
      setShowModal(false);
      setFormData({ name: '', company: '', email: '', phone: '', source: 'Manual', creditDays: 0 });
    } catch (err) {
      console.error("Error al guardar en el CRM:", err);
      setSaveError("Falla crítica: No se pudo registrar. Verifica tu conexión o permisos de base de datos.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-[#85adff]">
        <Loader2 className="animate-spin mr-2" /> Cargando Datos de {user?.organizationName || 'Organización'}...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-3">
          <button 
            onClick={() => { setModalType('contact'); setShowModal(true); setSaveError(null); }}
            className="border border-[#40485d]/30 text-[#dee5ff] font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#141f38] transition-all"
          >
            <Plus size={18} /> Nuevo Cliente
          </button>
          <button 
            onClick={() => { setModalType('lead'); setShowModal(true); setSaveError(null); }}
            className="bg-gradient-to-br from-[#85adff] to-[#5391ff] text-[#002150] font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(133,173,255,0.3)] transition-all"
          >
            <Kanban size={18} /> Iniciar Lead
          </button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex p-1 bg-[#141f38]/50 rounded-xl w-fit border border-[#40485d]/10">
        <button 
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'pipeline' ? 'bg-[#85adff] text-[#002150]' : 'text-[#a3aac4] hover:text-[#dee5ff]'}`}
        >
          <Kanban size={16} /> Pipeline
        </button>
        <button 
          onClick={() => setActiveTab('contacts')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'contacts' ? 'bg-[#85adff] text-[#002150]' : 'text-[#a3aac4] hover:text-[#dee5ff]'}`}
        >
          <List size={16} /> Base de Contactos
        </button>
      </div>

      {/* Conditional Rendering based on Tab */}
      {activeTab === 'pipeline' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[500px]">
          {pipelineStages.map(stage => (
            <div key={stage.id} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 font-black text-xs uppercase tracking-tighter text-[#a3aac4]">
                  <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                  {stage.title}
                </div>
                <span className="text-[#40485d] font-bold text-xs">
                  {leads.filter(l => l.status === stage.id).length}
                </span>
              </div>
              
              <div className="flex flex-col gap-3 p-3 bg-[#0f1930]/40 border border-[#40485d]/10 rounded-2xl h-full min-h-[200px]">
                {leads.filter(l => l.status === stage.id).map(lead => (
                  <div key={lead.id} className="bg-[#141f38] border border-[#40485d]/30 p-4 rounded-xl shadow-sm hover:border-[#85adff]/50 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-extrabold text-[#dee5ff] text-sm">{lead.name}</p>
                      <button className="text-[#40485d] hover:text-[#85adff]"><MoreVertical size={14}/></button>
                    </div>
                    <p className="text-[11px] text-[#a3aac4] font-medium leading-tight mb-3">{lead.company}</p>
                    <div className="flex gap-1.5">
                      {stage.id === 'prospect' && (
                        <button 
                          onClick={() => updateLeadStatus(lead.id, 'negotiating')}
                          className="text-[10px] bg-[#1d2b4a] text-[#85adff] px-2 py-0.5 rounded border border-[#85adff]/20 hover:bg-[#85adff] hover:text-[#141f38] transition-colors"
                        >
                          Mover a Negociación
                        </button>
                      )}
                      {stage.id === 'negotiating' && (
                        <div className="flex gap-1 w-full">
                           <button 
                            onClick={() => updateLeadStatus(lead.id, 'won')}
                            className="text-[10px] bg-green-900/20 text-green-400 px-2 py-0.5 rounded border border-green-500/20 hover:bg-green-500 hover:text-white flex-1"
                          >
                            Ganado
                          </button>
                          <button 
                            onClick={() => updateLeadStatus(lead.id, 'lost')}
                            className="text-[10px] bg-red-900/20 text-red-300 px-2 py-0.5 rounded border border-red-500/20 hover:bg-red-500 hover:text-white flex-1"
                          >
                            Perdido
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#091328] rounded-2xl border border-[#40485d]/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f1930] text-[#a3aac4] text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-5">Identidad</th>
                  <th className="px-6 py-5">Contacto Directo</th>
                  <th className="px-6 py-5 text-center">Crédito</th>
                  <th className="px-6 py-5">Origen / Fuente</th>
                  <th className="px-6 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#40485d]/10 text-sm">
                {contacts.length > 0 ? contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-[#141f38]/40 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1d2b4a] to-[#091328] border border-[#85adff]/10 flex items-center justify-center text-[#85adff] font-black text-xs">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[#dee5ff]">{contact.name}</p>
                          <p className="text-[11px] text-[#a3aac4]">{contact.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[#dee5ff] font-medium text-xs flex items-center gap-1.5">
                          <Mail size={12} className="text-[#a3aac4]"/> {contact.email}
                        </p>
                        <p className="text-[#a3aac4] text-xs flex items-center gap-1.5">
                          <Phone size={12}/> {contact.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${contact.creditDays > 0 ? 'bg-green-400/10 text-green-400' : 'bg-[#40485d]/20 text-[#a3aac4]'}`}>
                        {contact.creditDays || 0} días
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black bg-[#141f38] text-[#85adff] px-2 py-1 rounded border border-[#85adff]/10 uppercase">
                        {contact.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-[#40485d] hover:text-[#dee5ff] transition-colors"><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-[#a3aac4] italic">No hay clientes registrados en la base de datos.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Generic Modal for CRM Forms */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSaving && setShowModal(false)}></div>
          <form 
            onSubmit={handleAddSubmit}
            className="bg-[#0f1930] w-full max-w-md border border-[#40485d]/30 rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in duration-300"
          >
            <div className="p-6 border-b border-[#40485d]/20 flex justify-between items-center">
              <h3 className="font-black text-[#dee5ff] uppercase tracking-wider text-sm">
                Añadir {modalType === 'lead' ? 'Nuevo Lead' : 'Nuevo Contacto'}
              </h3>
              <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSaving}
                  className="text-[#a3aac4] hover:text-white transition-colors disabled:opacity-50"
                >
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {saveError && (
                <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-xl flex items-center gap-3 text-red-300 text-xs animate-pulse">
                  <AlertCircle size={18} />
                  {saveError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#a3aac4] uppercase">Nombre Completo</label>
                <input 
                  required
                  type="text" 
                  autoFocus
                  disabled={isSaving}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-xl px-4 py-2.5 text-[#dee5ff] focus:border-[#85adff] outline-none disabled:opacity-50"
                  placeholder="Ej: David Salazar"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#a3aac4] uppercase">Empresa / Negocio</label>
                <input 
                  type="text" 
                  disabled={isSaving}
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-xl px-4 py-2.5 text-[#dee5ff] focus:border-[#85adff] outline-none disabled:opacity-50"
                  placeholder="Ej: Inversiones X"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#a3aac4] uppercase">Correo</label>
                  <input 
                    type="email" 
                    disabled={isSaving}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-xl px-4 py-2.5 text-[#dee5ff] focus:border-[#85adff] outline-none disabled:opacity-50"
                    placeholder="mail@ejemplo.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#a3aac4] uppercase">Teléfono</label>
                  <input 
                    type="tel" 
                    disabled={isSaving}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-xl px-4 py-2.5 text-[#dee5ff] focus:border-[#85adff] outline-none disabled:opacity-50"
                    placeholder="+51..."
                  />
                </div>
              </div>
              
              {modalType === 'contact' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#a3aac4] uppercase">Plazo de Crédito (Días)</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      min="0"
                      disabled={isSaving}
                      value={formData.creditDays}
                      onChange={(e) => setFormData({...formData, creditDays: parseInt(e.target.value) || 0})}
                      className="flex-1 bg-[#141f38] border border-[#40485d]/30 rounded-xl px-4 py-2.5 text-[#dee5ff] focus:border-[#85adff] outline-none disabled:opacity-50"
                      placeholder="0"
                    />
                    <span className="text-xs text-[#a3aac4] font-bold">días</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-[#141f38] flex gap-3">
              <button 
                type="button"
                onClick={() => setShowModal(false)}
                disabled={isSaving}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-[#a3aac4] hover:bg-[#0f1930] transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-[#85adff] text-[#002150] font-black px-4 py-3 rounded-xl hover:shadow-[0_0_15px_rgba(133,173,255,0.4)] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Registrando...
                  </>
                ) : 'Registrar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
