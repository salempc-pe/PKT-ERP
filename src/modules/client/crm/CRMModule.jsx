import { useState, useEffect } from 'react';
import { Users, Phone, Mail, MoreVertical, Plus, Kanban, List, Loader2, X, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useCrm } from './useCrm';
import { useAuth } from '../../../context/AuthContext';
import LoadingScreen from '../../../components/LoadingScreen';
import { InteractionHistory } from './InteractionHistory';

export default function CRMModule() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  const [searchParams, setSearchParams] = useSearchParams();
  const { contacts, leads, interactions, loading, addContact, updateContact, addLead, updateLeadStatus, updateLead, addInteraction } = useCrm(orgId);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'pipeline');
  const [showModal, setShowModal] = useState(false);

  // Sincronizar pestaña activa con query param de forma reactiva
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['pipeline', 'contacts'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  const [modalType, setModalType] = useState('lead');
  const [editingLead, setEditingLead] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({ name: '', company: '', email: '', phone: '', source: 'Manual', description: '', creditDays: 0, tags: '', score: 0 });
  const [historyEntity, setHistoryEntity] = useState(null);
  const [historyEntityType, setHistoryEntityType] = useState('lead');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const pipelineStages = [
    { id: 'prospect', title: 'Prospecto', color: 'bg-[#a3aac4]', next: 'negotiating', prev: null },
    { id: 'negotiating', title: 'Negociación', color: 'bg-[#6B4FD8]', next: 'won', prev: 'prospect' },
    { id: 'won', title: 'Ganado', color: 'bg-[#5391ff]', next: null, prev: 'negotiating' },
    { id: 'lost', title: 'Perdido', color: 'bg-[#ff6b6b]', next: null, prev: 'negotiating' }
  ];

  const handleOpenEditLead = (lead) => {
    setModalType('lead');
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      company: lead.company || '',
      email: lead.email || '',
      phone: lead.phone || '',
      source: lead.source || 'Manual',
      description: lead.description || '',
      creditDays: lead.creditDays || 0,
      tags: lead.tags ? lead.tags.join(', ') : '',
      score: lead.score || 0
    });
    setSaveError(null);
    setShowModal(true);
  };

  const handleOpenEditContact = (contact) => {
    setModalType('contact');
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      company: contact.company || '',
      email: contact.email || '',
      phone: contact.phone || '',
      source: contact.source || 'Manual',
      description: contact.description || '',
      creditDays: contact.creditDays || 0,
      tags: contact.tags ? contact.tags.join(', ') : '',
      score: contact.score || 0
    });
    setSaveError(null);
    setShowModal(true);
  };

  const handleSelectExistingContact = (e) => {
    const contactId = e.target.value;
    if (!contactId) {
      setFormData({ name: '', company: '', email: '', phone: '', source: 'Manual', description: '', creditDays: 0, tags: '', score: 0 });
      return;
    }
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      setFormData({
        ...formData,
        name: contact.name,
        company: contact.company || '',
        email: contact.email || '',
        phone: contact.phone || '',
        source: contact.source || 'Manual',
        tags: contact.tags ? contact.tags.join(', ') : '',
        score: contact.score || 0
      });
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      const parsedTags = formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      const payload = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        source: formData.source,
        description: formData.description,
        creditDays: formData.creditDays,
        tags: parsedTags,
        score: Number(formData.score) || 0
      };

      if (modalType === 'lead') {
        if (editingLead) {
          await updateLead(editingLead.id, payload);
        } else {
          await addLead(payload);
        }
      } else {
        if (editingContact) {
          await updateContact(editingContact.id, payload);
        } else {
          await addContact(payload);
        }
      }
      setShowModal(false);
      setEditingLead(null);
      setEditingContact(null);
      setFormData({ name: '', company: '', email: '', phone: '', source: 'Manual', description: '', creditDays: 0, tags: '', score: 0 });
    } catch (err) {
      console.error("Error al guardar en el CRM:", err);
      setSaveError("Falla crítica: No se pudo registrar. Verifica tu conexión o permisos de base de datos.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen fullScreen={false} message={`Cargando Datos de ${user?.organizationName || 'Organización'}...`} />;
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex p-1 bg-[var(--color-surface-container)]/50 rounded-xl w-fit border border-[var(--color-outline-variant)]">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'pipeline' ? 'bg-[#6B4FD8] text-[#002150]' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
          >
            <Kanban size={16} /> Pipeline
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'contacts' ? 'bg-[#6B4FD8] text-[#002150]' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
          >
            <List size={16} /> Base de Contactos
          </button>
        </div>

        {activeTab === 'pipeline' ? (
          <button
            onClick={() => { setModalType('lead'); setEditingLead(null); setShowModal(true); setSaveError(null); }}
            className="bg-[#6B4FD8] text-[#002150] font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(133,173,255,0.3)] transition-all"
          >
            <Kanban size={18} /> Iniciar Lead
          </button>
        ) : (
          <button
            onClick={() => { setModalType('contact'); setEditingContact(null); setFormData({ name: '', company: '', email: '', phone: '', source: 'Manual', description: '', creditDays: 0 }); setShowModal(true); setSaveError(null); }}
            className="bg-[#6B4FD8] text-[#002150] font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(133,173,255,0.3)] transition-all"
          >
            <Plus size={18} /> Nuevo Cliente
          </button>
        )}
      </div>

      {activeTab === 'pipeline' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[500px]">
          {pipelineStages.map(stage => (
            <div key={stage.id} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-tighter text-[var(--color-on-surface-variant)]">
                  <div className={`w-1.5 h-1.5 rounded-full ${stage.color}`}></div>
                  {stage.title}
                </div>
                <span className="text-[var(--color-on-surface-variant)] font-bold text-xs">
                  {leads.filter(l => l.status === stage.id).length}
                </span>
              </div>

              <div className="flex flex-col gap-3 p-3 bg-[var(--color-surface-variant)]/40 border border-[var(--color-outline-variant)] rounded-2xl h-full min-h-[300px]">
                {leads.filter(l => l.status === stage.id).map(lead => (
                  <div
                    key={lead.id}
                    onClick={() => { setHistoryEntity(lead); setHistoryEntityType('lead'); }}
                    className="bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] p-4 rounded-xl shadow-sm hover:border-[#6B4FD8]/50 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full opacity-20 ${stage.color}`}></div>

                    <div className="flex justify-between items-start mb-1">
                      <p className="font-extrabold text-[var(--color-on-surface)] text-sm group-hover:text-[var(--color-primary)] transition-colors line-clamp-1 flex items-center gap-2">
                        {lead.name}
                        {lead.score > 0 && (
                          <span className="bg-orange-500/10 text-orange-400 text-[10px] font-black px-1.5 py-0.5 rounded border border-orange-500/20 flex items-center gap-0.5" title="Lead Score">
                            🔥 {lead.score}
                          </span>
                        )}
                      </p>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenEditLead(lead); }}
                        className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
                      >
                        <MoreVertical size={14} />
                      </button>
                    </div>

                    <p className="text-[10px] text-[var(--color-primary)] font-black uppercase tracking-tight mb-1">{lead.company}</p>

                    {lead.tags && lead.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {lead.tags.map((tag, idx) => (
                          <span key={idx} className="bg-[var(--color-primary-container)]/30 text-[var(--color-primary)] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[var(--color-primary-container)]/40 select-none">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {lead.description && (
                      <p className="text-[11px] text-[var(--color-on-surface-variant)] line-clamp-2 leading-tight mb-4 opacity-70 italic">{lead.description}</p>
                    )}

                    <div className="flex justify-between items-center mt-2 pt-3 border-t border-[var(--color-outline-variant)]">
                      <div className="flex gap-1.5 w-full">
                        {stage.prev && (
                          <button
                            onClick={(e) => { e.stopPropagation(); updateLeadStatus(lead.id, stage.prev); }}
                            className="p-1.5 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] bg-[var(--color-primary-container)]/50 hover:bg-[var(--color-primary-container)] rounded-lg border border-[var(--color-outline-variant)] transition-all flex-1 flex justify-center"
                            title="Retroceder etapa"
                          >
                            <Kanban size={12} className="rotate-180" />
                          </button>
                        )}

                        {stage.id === 'negotiating' ? (
                          <div className="flex gap-1 flex-[3]">
                            <button
                              onClick={(e) => { e.stopPropagation(); updateLeadStatus(lead.id, 'won'); }}
                              className="text-[9px] font-black uppercase bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20 hover:bg-green-500 hover:text-white transition-all flex-1"
                            >
                              Ganado
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); updateLeadStatus(lead.id, 'lost'); }}
                              className="text-[9px] font-black uppercase bg-red-500/10 text-red-300 px-2 py-1 rounded border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex-1"
                            >
                              Perdido
                            </button>
                          </div>
                        ) : stage.next && (
                          <button
                            onClick={(e) => { e.stopPropagation(); updateLeadStatus(lead.id, stage.next); }}
                            className="p-1.5 text-green-400 hover:text-white bg-green-500/10 hover:bg-green-500 rounded-lg border border-green-500/20 transition-all flex-[2] flex items-center justify-center gap-2 text-[10px] font-bold uppercase"
                          >
                            Siguiente <Kanban size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 md:mx-0 border-y md:border border-[var(--color-outline-variant)] md:rounded-2xl bg-transparent md:bg-[var(--color-surface-container-low)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] text-[10px] uppercase tracking-widest font-black">
                <th className="px-6 py-5">Identidad</th>
                <th className="px-6 py-5">Contacto Directo</th>
                <th className="px-6 py-5">Etiquetas/Puntaje</th>
                <th className="px-6 py-5 text-center">Crédito</th>
                <th className="px-6 py-5">Origen / Fuente</th>
                <th className="px-6 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#40485d]/10 text-sm">
              {contacts.length > 0 ? contacts.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={() => { setHistoryEntity(contact); setHistoryEntityType('contact'); }}
                  className="hover:bg-[var(--color-surface-container)]/40 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-surface-container)] to-[var(--color-surface-container-low)] border border-[#6B4FD8]/10 flex items-center justify-center text-[var(--color-primary)] font-black text-xs">
                        {contact.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[var(--color-on-surface)]">{contact.name}</p>
                        <p className="text-[11px] text-[var(--color-on-surface-variant)]">{contact.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[var(--color-on-surface)] font-medium text-xs flex items-center gap-1.5">
                        <Mail size={12} className="text-[var(--color-on-surface-variant)]" /> {contact.email}
                      </p>
                      <p className="text-[var(--color-on-surface-variant)] text-xs flex items-center gap-1.5">
                        <Phone size={12} /> {contact.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {contact.tags && contact.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {contact.tags.map((tag, idx) => (
                            <span key={idx} className="bg-[var(--color-primary-container)]/30 text-[var(--color-primary)] text-[9px] font-bold px-1.5 py-0.5 rounded border border-[var(--color-primary-container)]/40 select-none">
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-[var(--color-on-surface-variant)] italic opacity-50">-</span>
                      )}
                      {contact.score > 0 && (
                        <span className="bg-orange-500/10 text-orange-400 text-[10px] font-black px-1.5 py-0.5 rounded border border-orange-500/20 w-fit flex items-center gap-0.5" title="Score">
                          🔥 {contact.score} pts
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${contact.creditDays > 0 ? 'bg-green-400/10 text-green-400' : 'bg-[#40485d]/20 text-[var(--color-on-surface-variant)]'}`}>
                      {contact.creditDays || 0} días
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black bg-[var(--color-surface-container)] text-[var(--color-primary)] px-2 py-1 rounded border border-[#6B4FD8]/10 uppercase">
                      {contact.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenEditContact(contact); }}
                      className="p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-[var(--color-on-surface-variant)] italic">No hay clientes registrados en la base de datos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSaving && setShowModal(false)}></div>
          <form
            onSubmit={handleAddSubmit}
            className="bg-[var(--color-surface-variant)] w-full max-w-md border border-[var(--color-outline-variant)] rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in duration-300"
          >
            <div className="p-6 border-b border-[#40485d]/20 flex justify-between items-center">
              <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm">
                {editingLead || editingContact ? 'Editar' : 'Añadir'} {modalType === 'lead' ? 'Lead' : 'Contacto'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={isSaving}
                className="text-[var(--color-on-surface-variant)] hover:text-white transition-colors disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {saveError && (
                <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-xl flex items-center gap-3 text-red-300 text-xs animate-pulse">
                  <AlertCircle size={18} />
                  {saveError}
                </div>
              )}

              {modalType === 'lead' && !editingLead && contacts.length > 0 && (
                <div className="space-y-1.5 p-3 bg-[var(--color-primary-container)]/20 border border-[var(--color-primary-container)]/30 rounded-xl">
                  <label className="text-[9px] font-black text-[var(--color-primary)] uppercase flex items-center gap-2">
                    <Users size={12} /> Vincular Contacto Existente
                  </label>
                  <select
                    onChange={handleSelectExistingContact}
                    className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 text-xs text-[var(--color-on-surface)] outline-none focus:border-[#6B4FD8]"
                  >
                    <option value="">-- Crear como nuevo --</option>
                    {contacts.map(c => (
                      <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Nombre Completo</label>
                <input
                  required
                  type="text"
                  autoFocus
                  disabled={isSaving}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Empresa</label>
                <input
                  type="text"
                  disabled={isSaving}
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50 text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Correo</label>
                  <input
                    type="email"
                    disabled={isSaving}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Teléfono</label>
                  <input
                    type="tel"
                    disabled={isSaving}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Etiquetas (Sep. por comas)</label>
                  <input
                    type="text"
                    placeholder="VIP, Proveedor"
                    disabled={isSaving}
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50 text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Puntaje (Lead Score)</label>
                  <input
                    type="number"
                    disabled={isSaving}
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-[var(--color-surface-container)] flex gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={isSaving}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-[#6B4FD8] text-[#002150] font-black px-4 py-3 rounded-xl hover:shadow-[0_0_15px_rgba(133,173,255,0.4)] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : (editingLead || editingContact ? 'Actualizar' : 'Registrar')}
              </button>
            </div>
          </form>
        </div>
      )}

      {historyEntity && (
        <InteractionHistory
          entity={historyEntity}
          entityType={historyEntityType}
          interactions={interactions}
          onClose={() => setHistoryEntity(null)}
          onAddInteraction={addInteraction}
        />
      )}
    </div>
  );
}
