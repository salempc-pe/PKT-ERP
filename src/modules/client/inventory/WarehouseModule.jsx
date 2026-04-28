import { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Minus, 
  History, 
  TrendingUp, 
  TrendingDown, 
  Loader2, 
  X, 
  ArrowRightLeft,
  Filter,
  Tag,
  DollarSign,
  Box
} from 'lucide-react';
import { useWarehouse } from './useWarehouse';
import { useAuth } from '../../../context/AuthContext';
import LoadingScreen from '../../../components/LoadingScreen';

export default function WarehouseModule() {
  const { user, formatPrice } = useAuth();
  const orgId = user?.organizationId || "default_org";
  const { stock, history, loading, addMovement } = useWarehouse(orgId);

  // -- UI State --
  const [activeTab, setActiveTab] = useState('stock'); // 'stock' or 'history'
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('IN'); // 'IN' or 'OUT'
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // -- Form State --
  const [formData, setFormData] = useState({
    materialName: '',
    quantity: '',
    unit: 'unidades',
    price: '',
    destination: 'Producción',
    loteId: ''
  });

  // -- Logic --
  const uniqueMaterials = useMemo(() => {
    const names = stock.map(s => s.materialName);
    return [...new Set(names)];
  }, [stock]);

  const filteredStock = useMemo(() => {
    return stock.filter(item => 
      item.materialName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      item.quantity > 0
    );
  }, [stock, searchQuery]);

  const filteredHistory = useMemo(() => {
    return history.filter(item => 
      item.materialName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [history, searchQuery]);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    if (item) {
      setFormData({
        materialName: item.materialName,
        quantity: '',
        unit: item.unit || 'unidades',
        price: item.purchasePrice || '',
        destination: 'Producción',
        loteId: item.id
      });
    } else {
      setFormData({
        materialName: '',
        quantity: '',
        unit: 'unidades',
        price: '',
        destination: 'Producción',
        loteId: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addMovement({
        ...formData,
        type: modalType
      });
      setShowModal(false);
    } catch (err) {
      alert("Error al registrar movimiento");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <LoadingScreen fullScreen={false} message="Cargando Bodega..." />;

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--color-on-surface)] tracking-tight flex items-center gap-2">
            <Package className="text-[var(--color-primary)]" /> Inventario de Bodega
          </h2>
          <p className="text-[var(--color-on-surface-variant)] text-sm">Control de materias primas por lotes y costos.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => handleOpenModal('IN')}
            className="flex-1 md:flex-none bg-[#6B4FD8] text-[#002150] font-bold px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Plus size={18} /> Ingreso
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex bg-[var(--color-surface-container)] p-1 rounded-xl w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('stock')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'stock' ? 'bg-[var(--color-surface-variant)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
          >
            Stock Actual
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'history' ? 'bg-[var(--color-surface-variant)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
          >
            Historial
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" size={16} />
          <input 
            type="text" 
            placeholder="Buscar material..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-sm rounded-xl pl-10 pr-4 py-2.5 border border-[var(--color-outline-variant)] outline-none focus:border-[#6B4FD8] transition-all"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-[var(--color-surface-container-low)] rounded-2xl border border-[var(--color-outline-variant)] overflow-hidden">
        <div className="overflow-x-auto">
          {activeTab === 'stock' ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-5">Material</th>
                  <th className="px-6 py-5">Unidad</th>
                  <th className="px-6 py-5 text-right">Cantidad</th>
                  <th className="px-6 py-5 text-right">Precio Compra</th>
                  <th className="px-6 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]/30 text-sm">
                {filteredStock.length > 0 ? filteredStock.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--color-surface-container)]/40 transition-colors group">
                    <td className="px-6 py-4 font-bold text-[var(--color-on-surface)]">
                      {item.materialName}
                    </td>
                    <td className="px-6 py-4 text-[var(--color-on-surface-variant)] uppercase text-xs">
                      {item.unit}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-[var(--color-primary)]">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-right text-[var(--color-on-surface)]">
                      {formatPrice(item.purchasePrice)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOpenModal('OUT', item)}
                        className="bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white p-2 rounded-lg transition-all"
                        title="Registrar Salida"
                      >
                        <Minus size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-[var(--color-on-surface-variant)] italic">
                      No hay materiales en stock que coincidan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-5">Fecha</th>
                  <th className="px-6 py-5">Tipo</th>
                  <th className="px-6 py-5">Material</th>
                  <th className="px-6 py-5 text-right">Cant.</th>
                  <th className="px-6 py-5">Destino / Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]/30 text-sm">
                {filteredHistory.length > 0 ? filteredHistory.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--color-surface-container)]/40 transition-colors">
                    <td className="px-6 py-4 text-[var(--color-on-surface-variant)] text-xs">
                      {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : 'Reciente'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${log.type === 'IN' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-500'}`}>
                        {log.type === 'IN' ? 'Ingreso' : 'Salida'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-[var(--color-on-surface)]">
                      {log.materialName}
                    </td>
                    <td className="px-6 py-4 text-right font-mono">
                      {log.quantity} {log.unit}
                    </td>
                    <td className="px-6 py-4 text-xs text-[var(--color-on-surface-variant)]">
                      {log.destination || (log.type === 'IN' ? 'Compra' : '-')}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-[var(--color-on-surface-variant)] italic">
                      No hay registros en el historial.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Movement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSaving && setShowModal(false)}></div>
          <div className="bg-[var(--color-surface-variant)] w-full max-w-lg border border-[var(--color-outline-variant)] rounded-3xl shadow-lg overflow-hidden relative animate-in zoom-in duration-300">
            <div className="p-6 border-b border-[var(--color-outline-variant)]/30 flex justify-between items-center bg-[var(--color-surface-container-low)]">
              <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm flex items-center gap-2">
                {modalType === 'IN' ? <TrendingUp size={18} className="text-green-400" /> : <TrendingDown size={18} className="text-amber-400" />}
                {modalType === 'IN' ? 'Registrar Ingreso de Material' : 'Registrar Salida de Material'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[var(--color-on-surface-variant)] hover:text-white transition-colors">
                <X size={20}/>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Material</label>
                <div className="relative">
                  <input 
                    list="material-suggestions"
                    required
                    type="text"
                    disabled={isSaving || (modalType === 'OUT')}
                    value={formData.materialName}
                    onChange={(e) => setFormData({...formData, materialName: e.target.value})}
                    placeholder="Ej: Madera de Cedro 10mm"
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none font-bold"
                  />
                  <datalist id="material-suggestions">
                    {uniqueMaterials.map(m => <option key={m} value={m} />)}
                  </datalist>
                  <Tag className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" size={16} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Cantidad</label>
                  <div className="relative">
                    <input 
                      required
                      type="number"
                      step="0.01"
                      min="0.01"
                      disabled={isSaving}
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      placeholder="0.00"
                      className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none font-mono"
                    />
                    <Box className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" size={16} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Unidad</label>
                  <select 
                    disabled={isSaving || (modalType === 'OUT')}
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none font-bold text-sm"
                  >
                    <option value="unidades">Unidades</option>
                    <option value="kilos">Kilos</option>
                    <option value="metros">Metros</option>
                    <option value="litros">Litros</option>
                    <option value="planchas">Planchas</option>
                  </select>
                </div>
              </div>

              {modalType === 'IN' ? (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Precio Unitario de Compra</label>
                  <div className="relative">
                    <input 
                      required
                      type="number"
                      step="0.01"
                      disabled={isSaving}
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="0.00"
                      className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none font-mono"
                    />
                    <DollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" size={16} />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Destino</label>
                  <div className="relative">
                    <select 
                      disabled={isSaving}
                      value={formData.destination}
                      onChange={(e) => setFormData({...formData, destination: e.target.value})}
                      className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none font-bold text-sm appearance-none"
                    >
                      <option value="Producción">Producción</option>
                      <option value="Venta">Venta</option>
                      <option value="Merma">Merma</option>
                    </select>
                    <ArrowRightLeft className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] pointer-events-none" size={16} />
                  </div>
                </div>
              )}

              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className={`flex-[2] text-[#002150] font-black px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 ${modalType === 'IN' ? 'bg-[#6B4FD8]' : 'bg-amber-500'}`}
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : (modalType === 'IN' ? 'Registrar Ingreso' : 'Registrar Salida')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
