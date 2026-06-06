import { useState, forwardRef, useImperativeHandle } from 'react';
import { Users, Phone, Mail, MapPin, MoreVertical, Plus, Loader2, X, AlertCircle, Tag, Edit2, Trash2 } from 'lucide-react';
import { useSuppliers } from './useSuppliers';
import { useAuth } from '../../../context/AuthContext';
import LoadingScreen from '../../../components/LoadingScreen';

const SuppliersModule = forwardRef(({ embedded = false }, ref) => {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  const { suppliers, loading, addSupplier, updateSupplier, deleteSupplier } = useSuppliers(orgId);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({ name: '', taxId: '', email: '', phone: '', address: '', category: '', status: 'active' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useImperativeHandle(ref, () => ({
    handleOpenNew
  }));

  const handleOpenEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      taxId: supplier.taxId || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      category: supplier.category || '',
      status: supplier.status || 'active'
    });
    setSaveError(null);
    setShowModal(true);
  };

  const handleOpenNew = () => {
    setEditingSupplier(null);
    setFormData({ name: '', taxId: '', email: '', phone: '', address: '', category: '', status: 'active' });
    setSaveError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, formData);
      } else {
        await addSupplier(formData);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error al guardar proveedor:", err);
      setSaveError("Error al guardar los datos del proveedor.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSupplier = async (supplierId) => {
    if (!confirm("¿Está seguro de que desea eliminar este proveedor de forma permanente?")) return;
    try {
      await deleteSupplier(supplierId);
    } catch (err) {
      alert("Error al eliminar el proveedor: " + err.message);
    }
  };

  const handleViewSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setShowDetailModal(true);
  };

  if (loading) {
    return <LoadingScreen fullScreen={false} message="Cargando Proveedores..." />;
  }

  return (
    <div className={`animate-in fade-in duration-500 space-y-8 ${embedded ? '' : 'pb-10'}`}>
      {!embedded && (
        <div className="flex justify-between items-center">
          <div className="lg:hidden">
            <h2 className="text-2xl font-black text-[var(--color-on-surface)] tracking-tight">Proveedores</h2>
            <p className="text-[var(--color-on-surface-variant)] text-sm">Gestiona tus fuentes de abastecimiento y materia prima.</p>
          </div>
          <button 
            onClick={handleOpenNew}
            className="bg-[#6B4FD8] text-[#002150] font-black px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus size={18} /> Nuevo Proveedor
          </button>
        </div>
      )}

      <div className="overflow-x-auto md:overflow-x-hidden -mx-4 md:mx-0 border-y md:border border-[var(--color-outline-variant)] md:rounded-xl bg-transparent md:bg-[var(--color-surface-container-low)]">
          <table className="w-full min-w-[950px] text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] text-[10px] uppercase tracking-widest font-black">
                <th className="px-6 py-5 border-b border-[#6B4FD8]/25">Proveedor / RUC</th>
                <th className="px-6 py-5 border-b border-[#6B4FD8]/25">Contacto</th>
                <th className="px-6 py-5 border-b border-[#6B4FD8]/25">Ubicación</th>
                <th className="px-6 py-5 border-b border-[#6B4FD8]/25">Categoría</th>
                <th className="px-6 py-5 border-b border-[#6B4FD8]/25">Estado</th>
                <th className="px-6 py-5 text-right border-b border-[#6B4FD8]/25">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-transparent text-sm">
              {suppliers.length > 0 ? suppliers.map((supplier) => (
                <tr key={supplier.id} onClick={() => handleViewSupplier(supplier)} className="hover:bg-[var(--color-surface-container)] transition-all duration-200 group relative cursor-pointer">
                  <td className="px-6 py-4 border-b border-[#6B4FD8]/15">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-surface-container)] to-[var(--color-surface-container-low)] border border-[#6B4FD8]/10 flex items-center justify-center text-[var(--color-primary)] font-black text-xs uppercase">
                        {supplier.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[var(--color-on-surface)]">{supplier.name}</p>
                        <p className="text-[11px] text-[var(--color-on-surface-variant)] font-mono">{supplier.taxId || 'SIN RUC'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b border-[#6B4FD8]/15">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-[var(--color-on-surface)] font-medium text-xs flex items-center gap-1.5 line-clamp-1">
                        <Mail size={12} className="text-[var(--color-on-surface-variant)]"/> {supplier.email || 'N/A'}
                      </p>
                      <p className="text-[var(--color-on-surface-variant)] text-xs flex items-center gap-1.5">
                        <Phone size={12}/> {supplier.phone || 'N/A'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b border-[#6B4FD8]/15">
                    <p className="text-[var(--color-on-surface-variant)] text-xs flex items-start gap-1.5 max-w-[200px]">
                      <MapPin size={12} className="mt-0.5 shrink-0"/> {supplier.address || 'Sin dirección'}
                    </p>
                  </td>
                  <td className="px-6 py-4 border-b border-[#6B4FD8]/15">
                    <span className="text-[10px] font-black bg-[var(--color-surface-container)] text-[var(--color-primary)] px-2 py-1 rounded border border-[#6B4FD8]/10 uppercase">
                      {supplier.category || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-[#6B4FD8]/15">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${supplier.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {supplier.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right border-b border-[#6B4FD8]/15">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleOpenEdit(supplier); 
                        }}
                        title="Editar Proveedor"
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-[#002150] border border-amber-500/20 hover:border-transparent transition-all shadow-[0_2px_8px_rgba(245,158,11,0.15),_inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_20px_rgba(245,158,11,0.55),_inset_0_1.5px_1.5px_rgba(255,255,255,0.12)] hover:-translate-y-[2px] hover:scale-105 active:scale-95"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleDeleteSupplier(supplier.id); 
                        }}
                        title="Eliminar Proveedor"
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-transparent transition-all shadow-[0_2px_8px_rgba(239,68,68,0.15),_inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_20px_rgba(239,68,68,0.55),_inset_0_1.5px_1.5px_rgba(255,255,255,0.12)] hover:-translate-y-[2px] hover:scale-105 active:scale-95"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-[var(--color-on-surface-variant)] italic">No hay proveedores registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      {/* Modal for Supplier Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSaving && setShowModal(false)}></div>
          <form 
            onSubmit={handleSubmit}
            className="bg-[var(--color-surface-variant)] w-full max-w-lg border border-[var(--color-outline-variant)] rounded-3xl shadow-lg overflow-hidden relative animate-in zoom-in duration-300"
          >
            <div className="p-6 border-b border-[#40485d]/20 flex justify-between items-center bg-[var(--color-surface-container-low)]/50">
              <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm flex items-center gap-2">
                <Tag size={18} className="text-[var(--color-primary)]" />
                {editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </h3>
              <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSaving}
                  className="text-[var(--color-on-surface-variant)] hover:text-white transition-colors disabled:opacity-50"
                >
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-8 space-y-5">
              {saveError && (
                <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-xl flex items-center gap-3 text-red-300 text-xs">
                  <AlertCircle size={18} />
                  {saveError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Razón Social / Nombre</label>
                  <input required type="text" autoFocus disabled={isSaving} value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50 font-bold"
                    placeholder="Ej: Textiles del Sur SAC"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">RUC / DNI</label>
                  <input type="text" disabled={isSaving} value={formData.taxId}
                    onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50 font-mono text-xs"
                    placeholder="2060..."
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Categoría</label>
                  <select disabled={isSaving} value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50 text-xs font-bold"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Materia Prima">Materia Prima</option>
                    <option value="Mercadería">Mercadería</option>
                    <option value="Servicios">Servicios</option>
                    <option value="Logística">Logística</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Email</label>
                  <input type="email" disabled={isSaving} value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50 text-xs"
                    placeholder="proveedor@empresa.com"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Teléfono</label>
                  <input type="tel" disabled={isSaving} value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50 text-xs"
                    placeholder="+51..."
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Dirección Fiscal / Oficina</label>
                  <input type="text" disabled={isSaving} value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50 text-xs"
                    placeholder="Av. Las Magnolias 123..."
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-[var(--color-surface-container)] flex gap-4">
              <button type="button" onClick={() => setShowModal(false)} disabled={isSaving}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button type="submit" disabled={isSaving}
                className="flex-3 bg-[#6B4FD8] text-[#002150] font-black px-4 py-3 rounded-xl disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {isSaving ? <><Loader2 size={18} className="animate-spin" /> Procesando...</> : (editingSupplier ? 'Actualizar Proveedor' : 'Guardar Proveedor')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Visor de Proveedor */}
      {showDetailModal && selectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}></div>
          <div className="bg-[var(--color-surface-variant)] w-full max-w-lg border border-[var(--color-outline-variant)] rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden relative animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#40485d]/20 flex justify-between items-start bg-[var(--color-surface-container-low)]/50 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at top right, var(--color-primary), transparent 70%)' }}></div>
              <div className="relative z-10 flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="bg-[var(--color-surface-container)] p-3 rounded-2xl border border-[var(--color-outline-variant)] shadow-inner">
                    <Users size={24} className="text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[var(--color-on-surface)] flex items-center gap-2">
                      Ficha de Proveedor
                    </h2>
                    <p className="text-xs text-[var(--color-on-surface-variant)] font-mono font-medium mt-1">
                      RUC/DNI: {selectedSupplier.taxId || 'SIN RUC'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-sm border border-black/10 ${selectedSupplier.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {selectedSupplier.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
                <button type="button" onClick={() => setShowDetailModal(false)} className="text-[var(--color-on-surface-variant)] hover:text-white transition-colors bg-[var(--color-surface-container)] hover:bg-[#6B4FD8] p-2 rounded-full border border-[var(--color-outline-variant)] hover:border-transparent active:scale-95">
                  <X size={20}/>
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="p-4 bg-[var(--color-surface-container)]/30 border border-[var(--color-outline-variant)] rounded-2xl shadow-inner flex flex-col gap-2">
                <p className="text-[10px] font-black text-[var(--color-primary)] uppercase flex items-center gap-1"><Users size={12}/> Razón Social</p>
                <p className="font-bold text-[var(--color-on-surface)] text-sm">{selectedSupplier.name}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--color-surface-container)]/30 border border-[var(--color-outline-variant)] rounded-2xl shadow-inner flex flex-col gap-1.5">
                  <p className="text-[10px] font-black text-[var(--color-primary)] uppercase flex items-center gap-1"><Tag size={12}/> Categoría</p>
                  <span className="text-xs font-black bg-[var(--color-surface-container)] text-[var(--color-primary)] px-2.5 py-1 rounded border border-[#6B4FD8]/10 w-fit uppercase">
                    {selectedSupplier.category || 'General'}
                  </span>
                </div>
                <div className="p-4 bg-[var(--color-surface-container)]/30 border border-[var(--color-outline-variant)] rounded-2xl shadow-inner flex flex-col gap-1.5">
                  <p className="text-[10px] font-black text-[var(--color-primary)] uppercase flex items-center gap-1"><Phone size={12}/> Teléfono</p>
                  <p className="font-bold text-[var(--color-on-surface)] text-xs">{selectedSupplier.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="p-4 bg-[var(--color-surface-container)]/30 border border-[var(--color-outline-variant)] rounded-2xl shadow-inner flex flex-col gap-2">
                <p className="text-[10px] font-black text-[var(--color-primary)] uppercase flex items-center gap-1"><Mail size={12}/> Correo Electrónico</p>
                <p className="font-bold text-[var(--color-on-surface)] text-xs">{selectedSupplier.email || 'N/A'}</p>
              </div>

              <div className="p-4 bg-[var(--color-surface-container)]/30 border border-[var(--color-outline-variant)] rounded-2xl shadow-inner flex flex-col gap-2">
                <p className="text-[10px] font-black text-[var(--color-primary)] uppercase flex items-center gap-1"><MapPin size={12}/> Dirección Fiscal</p>
                <p className="font-bold text-[var(--color-on-surface)] text-xs">{selectedSupplier.address || 'Sin dirección'}</p>
              </div>
            </div>

            <div className="p-6 bg-[var(--color-surface-container)] border-t border-[var(--color-outline-variant)] flex gap-4">
              <button type="button" onClick={() => setShowDetailModal(false)}
                className="w-full px-4 py-3.5 rounded-xl font-bold bg-[var(--color-surface-variant)] text-[var(--color-on-surface)] hover:bg-[#6B4FD8] hover:text-[#002150] transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2"
              >
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default SuppliersModule;
