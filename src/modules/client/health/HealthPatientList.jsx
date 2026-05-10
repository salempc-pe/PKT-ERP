import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useHealth } from './useHealth';
import { useCrm } from '../crm/useCrm';
import LoadingScreen from '../../../components/LoadingScreen';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  UserPlus,
  ExternalLink,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HealthPatientList() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";

  const { expedientes, createExpediente, loading: loadingHealth } = useHealth(orgId);
  const { contacts, loading: loadingCrm } = useCrm(orgId);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, activo, en_pausa, alta, archivado

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  
  // Add patient state
  const [selectedContactId, setSelectedContactId] = useState('');
  const [formData, setFormData] = useState({
    motivo_consulta: '',
    antecedentes: '',
    diagnostico: '',
    estado: 'activo'
  });

  // Data Join & Filter
  const patientsWithData = useMemo(() => {
    return expedientes.map(exp => {
      const contact = contacts.find(c => c.id === exp.client_id);
      return {
        ...exp,
        contactName: contact?.name || 'Cargando...',
        contactEmail: contact?.email || 'No asignado',
        contactPhone: contact?.phone || '-'
      };
    });
  }, [expedientes, contacts]);

  const filteredPatients = useMemo(() => {
    return patientsWithData.filter(p => {
      const matchesSearch = p.contactName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.estado === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [patientsWithData, searchTerm, statusFilter]);

  // Candidates from CRM NOT having an active patient profile already
  const crmCandidates = useMemo(() => {
    return contacts.filter(c => {
      // Filtrar solo los que NO tienen expediente activo
      const hasActive = expedientes.some(e => e.client_id === c.id && e.estado === 'activo');
      return !hasActive;
    });
  }, [contacts, expedientes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedContactId) return;
    
    setIsSaving(true);
    setSaveError(null);

    try {
      await createExpediente({
        client_id: selectedContactId,
        ...formData
      });
      setIsModalOpen(false);
      setSelectedContactId('');
      setFormData({ motivo_consulta: '', antecedentes: '', diagnostico: '', estado: 'activo' });
    } catch (err) {
      setSaveError(err.message || "Ocurrió un error al crear el expediente.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingHealth || loadingCrm) {
    return <LoadingScreen fullScreen={false} message="Buscando expedientes..." />;
  }

  const statusBadge = (st) => {
    const styles = {
      activo: "bg-green-500/10 text-green-400 border-green-500/20",
      en_pausa: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      alta: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      archivado: "bg-[#40485d]/30 text-[var(--color-on-surface-variant)] border-[var(--color-outline-variant)]"
    };
    return <span className={`text-[10px] font-black uppercase tracking-tight px-2 py-0.5 rounded-full border ${styles[st] || ''}`}>{st?.replace('_', ' ')}</span>;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      
      {/* Search Bar & Actions */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" size={18} />
          <input 
            type="text"
            placeholder="Buscar por nombre del paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl pl-10 pr-4 py-3 text-[var(--color-on-surface)] outline-none focus:border-[#6B4FD8] shadow-sm text-sm font-medium placeholder:opacity-50"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-3 py-2.5">
            <Filter size={16} className="text-[var(--color-on-surface-variant)]" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-[var(--color-on-surface)] outline-none"
            >
              <option value="all">Todos los Estados</option>
              <option value="activo">Activos</option>
              <option value="en_pausa">En Pausa</option>
              <option value="alta">Alta</option>
              <option value="archivado">Archivados</option>
            </select>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#6B4FD8] text-[#002150] font-black px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-[#6B4FD8]/20 hover:shadow-[#6B4FD8]/40 hover:scale-[1.02] transition-all whitespace-nowrap ml-auto md:ml-0"
          >
            <UserPlus size={18} />
            <span>Alta Paciente</span>
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[var(--color-surface-variant)] text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">
                <th className="px-6 py-5">Paciente</th>
                <th className="px-6 py-5">Motivo Consulta</th>
                <th className="px-6 py-5">Estado</th>
                <th className="px-6 py-5">Última Actividad</th>
                <th className="px-6 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-outline-variant)]/30 text-sm">
              {filteredPatients.length > 0 ? filteredPatients.map(pat => (
                <tr key={pat.id} className="hover:bg-[var(--color-surface-container)]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary-container)] to-[var(--color-surface-container)] border border-[#6B4FD8]/20 flex items-center justify-center text-[var(--color-primary)] font-black text-sm">
                        {pat.contactName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-extrabold text-[var(--color-on-surface)]">{pat.contactName}</p>
                        <p className="text-[11px] text-[var(--color-on-surface-variant)]">{pat.contactPhone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-[250px]">
                    <p className="text-xs text-[var(--color-on-surface)] line-clamp-2 italic">
                      "{pat.motivo_consulta || 'Sin registrar'}"
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {statusBadge(pat.estado)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-medium text-[var(--color-on-surface-variant)]">
                      {pat.updated_at ? pat.updated_at.toDate().toLocaleDateString() : 'N/A'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      to={`/client/salud/pacientes/${pat.client_id}`}
                      className="inline-flex items-center gap-1.5 bg-[#6B4FD8]/10 text-[#6B4FD8] hover:bg-[#6B4FD8] hover:text-[#002150] px-3 py-1.5 rounded-lg text-xs font-black transition-all shadow-sm"
                    >
                      Ver Ficha <ExternalLink size={12} />
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center opacity-50">
                      <Users size={48} className="mb-3 text-[var(--color-on-surface-variant)]" strokeWidth={1} />
                      <p className="text-sm font-bold">No se encontraron expedientes</p>
                      <p className="text-xs mt-1">Usa el buscador o crea un nuevo alta.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Expediente Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => !isSaving && setIsModalOpen(false)}></div>
          
          <form 
            onSubmit={handleSubmit}
            className="bg-[var(--color-surface-variant)] border border-[var(--color-outline-variant)] w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-surface-container)]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#6B4FD8]/20 text-[#6B4FD8] rounded-xl">
                  <UserPlus size={18} />
                </div>
                <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm">Crear Nuevo Expediente</h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                className="p-2 text-[var(--color-on-surface-variant)] hover:text-red-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
              
              {saveError && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl flex items-center gap-3 text-red-300 text-xs font-bold animate-in shake-500">
                  <AlertCircle size={16} />
                  {saveError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#6B4FD8] uppercase flex items-center gap-1.5">
                  <Users size={12} /> Seleccionar Cliente del ERP
                </label>
                <select
                  required
                  value={selectedContactId}
                  onChange={(e) => setSelectedContactId(e.target.value)}
                  className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-sm text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none transition-colors font-bold"
                >
                  <option value="">-- Seleccionar de la Base de Datos --</option>
                  {crmCandidates.map(candidate => (
                    <option key={candidate.id} value={candidate.id}>{candidate.name} {candidate.company ? `(${candidate.company})` : ''}</option>
                  ))}
                </select>
                <p className="text-[9px] text-[var(--color-on-surface-variant)] opacity-70 font-medium mt-1 italic">
                  Solo se listan clientes del ERP sin expediente de salud activo.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Motivo de Consulta</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Ej: Dolor lumbar crónico..."
                  value={formData.motivo_consulta}
                  onChange={(e) => setFormData({...formData, motivo_consulta: e.target.value})}
                  className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-sm text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none transition-colors resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Antecedentes (Opcional)</label>
                <textarea
                  rows={3}
                  value={formData.antecedentes}
                  onChange={(e) => setFormData({...formData, antecedentes: e.target.value})}
                  className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-sm text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none transition-colors resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Impresión Diagnóstica (Opcional)</label>
                <input
                  type="text"
                  value={formData.diagnostico}
                  onChange={(e) => setFormData({...formData, diagnostico: e.target.value})}
                  className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-sm text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[var(--color-surface-container)] border-t border-[var(--color-outline-variant)] flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                className="flex-1 py-3 text-xs font-bold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving || !selectedContactId}
                className="flex-[2] bg-[#6B4FD8] text-[#002150] py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(107,79,216,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale"
              >
                {isSaving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={16} /> Abrir Expediente
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
