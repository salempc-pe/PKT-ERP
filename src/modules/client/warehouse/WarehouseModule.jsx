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
  Box,
  MapPin,
  AlertTriangle,
  Settings,
  ChevronDown,
  Warehouse,
  Edit2,
  Trash2
} from 'lucide-react';
import { useWarehouse } from './useWarehouse';
import { useMaterialSettings } from './useMaterialSettings';
import { useWarehouses } from '../inventory/useWarehouses';
import { useAuth } from '../../../context/AuthContext';
import LoadingScreen from '../../../components/LoadingScreen';

export default function WarehouseModule() {
  const { user, formatPrice } = useAuth();
  const orgId = user?.organizationId || "default_org";
  
  // -- Multi-Warehouse State --
  const { warehouses, addWarehouse, updateWarehouse, deleteWarehouse } = useWarehouses(orgId);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');

  const { stock, history, loading, addMovement } = useWarehouse(orgId, selectedWarehouseId);
  const { settings, updateThreshold } = useMaterialSettings(orgId);

  // -- UI State --
  const [activeTab, setActiveTab] = useState('stock'); // 'stock', 'history' or 'warehouses'
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showWarehouseModal, setShowWarehouseModal] = useState(false);
  const [modalType, setModalType] = useState('IN'); // 'IN' or 'OUT'
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [newThreshold, setNewThreshold] = useState('');
  const [editingWarehouseId, setEditingWarehouseId] = useState(null);
  const [warehouseFormData, setWarehouseFormData] = useState({ name: '', location: '', isDefault: false });

  // -- Form State --
  const [formData, setFormData] = useState({
    materialName: '',
    quantity: '',
    unit: 'unidades',
    price: '',
    destination: 'Producción',
    loteId: '',
    warehouseId: ''
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

  const totalInvestment = useMemo(() => {
    return filteredStock.reduce((acc, curr) => acc + (curr.quantity * (curr.purchasePrice || 0)), 0);
  }, [filteredStock]);

  const filteredHistory = useMemo(() => {
    return history.filter(item => 
      item.materialName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [history, searchQuery]);

  const filteredWarehouses = useMemo(() => {
    return warehouses.filter(w => 
      (w.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.location || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [warehouses, searchQuery]);

  const getMaterialThreshold = (materialName, warehouseId) => {
    if (!warehouseId) return 0;
    const materialConfig = settings.find(s => s.materialName === materialName);
    return materialConfig?.thresholds?.[warehouseId] || 0;
  };

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    if (item) {
      setFormData({
        materialName: item.materialName,
        quantity: '',
        unit: item.unit || 'unidades',
        price: item.purchasePrice || '',
        destination: 'Producción',
        loteId: item.id,
        warehouseId: item.warehouseId || selectedWarehouseId || ''
      });
    } else {
      setFormData({
        materialName: '',
        quantity: '',
        unit: 'unidades',
        price: '',
        destination: 'Producción',
        loteId: '',
        warehouseId: selectedWarehouseId || ''
      });
    }
    setShowModal(true);
  };

  const handleOpenSettings = (materialName) => {
    setSelectedMaterial(materialName);
    const current = getMaterialThreshold(materialName, selectedWarehouseId);
    setNewThreshold(current);
    setShowSettingsModal(true);
  };

  const handleUpdateThreshold = async () => {
    if (!selectedWarehouseId) {
      alert("Por favor selecciona un almacén primero");
      return;
    }
    setIsSaving(true);
    try {
      await updateThreshold(selectedMaterial, selectedWarehouseId, newThreshold);
      setShowSettingsModal(false);
    } catch (err) {
      alert("Error al actualizar umbral");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.warehouseId) {
      alert("Por favor selecciona un almacén");
      return;
    }
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

  const handleOpenWarehouseModal = (w = null) => {
    if (w) {
      setEditingWarehouseId(w.id);
      setWarehouseFormData({
        name: w.name || '',
        location: w.location || '',
        isDefault: w.isDefault || false
      });
    } else {
      setEditingWarehouseId(null);
      setWarehouseFormData({
        name: '',
        location: '',
        isDefault: false
      });
    }
    setShowWarehouseModal(true);
  };

  const handleWarehouseSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingWarehouseId) {
        await updateWarehouse(editingWarehouseId, warehouseFormData);
      } else {
        await addWarehouse(warehouseFormData);
      }
      setShowWarehouseModal(false);
    } catch (err) {
      alert("Error al guardar el almacén");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteWarehouse = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este almacén? Esta acción no se puede deshacer.")) {
      setIsSaving(true);
      try {
        await deleteWarehouse(id);
      } catch (err) {
        alert("Error al eliminar el almacén");
      } finally {
        setIsSaving(false);
      }
    }
  };

  if (loading) return <LoadingScreen fullScreen={false} message="Cargando Bodega..." />;

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* Stats & Title */}
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4">

        <div className="hidden md:flex bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] px-6 py-3 rounded-2xl items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Inversión Actual</span>
            <span className="text-xl font-black text-[var(--color-primary)] font-mono">{formatPrice(totalInvestment)}</span>
          </div>
          <div className="w-px h-10 bg-[var(--color-outline-variant)]/50"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Items</span>
            <span className="text-xl font-black text-[var(--color-on-surface)]">{filteredStock.length}</span>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Tabs & Warehouse Filter */}
        <div className="lg:col-span-8 flex flex-col sm:flex-row gap-4">
          {/* Desktop Tabs */}
          <div className="hidden sm:flex bg-[var(--color-surface-container)] p-1 rounded-xl shadow-inner">
            <button 
              onClick={() => setActiveTab('stock')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'stock' ? 'bg-[var(--color-surface-variant)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
            >
              Stock Actual
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'history' ? 'bg-[var(--color-surface-variant)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
            >
              Historial
            </button>
            <button 
              onClick={() => setActiveTab('warehouses')}
              className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'warehouses' ? 'bg-[var(--color-surface-variant)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
            >
              Almacenes
            </button>
          </div>

          {/* Mobile Tabs Selector */}
          <div className="sm:hidden relative w-full">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm font-black uppercase tracking-widest rounded-xl border border-[var(--color-outline-variant)] px-4 py-3 outline-none appearance-none focus:border-[#6B4FD8]"
            >
              <option value="stock">Stock Actual</option>
              <option value="history">Historial</option>
              <option value="warehouses">Almacenes</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--color-on-surface-variant)]">
              <ChevronDown size={18} />
            </div>
          </div>

          {activeTab !== 'warehouses' && (
            <div className="relative flex-1 min-w-[200px]">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]" size={16} />
              <select 
                value={selectedWarehouseId}
                onChange={(e) => setSelectedWarehouseId(e.target.value)}
                className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-sm rounded-xl pl-10 pr-4 py-2.5 border border-[var(--color-outline-variant)] outline-none focus:border-[#6B4FD8] transition-all font-bold appearance-none"
              >
                <option value="">Todos los Almacenes</option>
                {warehouses.map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Search & Add */}
        <div className="lg:col-span-4 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" size={16} />
            <input 
              type="text" 
              placeholder={activeTab === 'warehouses' ? "Buscar almacén..." : "Buscar material..."} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--color-surface-container-low)] text-[var(--color-on-surface)] text-sm rounded-xl pl-10 pr-4 py-2.5 border border-[var(--color-outline-variant)] outline-none focus:border-[#6B4FD8] transition-all"
            />
          </div>
          <button 
            onClick={() => activeTab === 'warehouses' ? handleOpenWarehouseModal() : handleOpenModal('IN')}
            className="bg-[#6B4FD8] text-[#002150] font-black px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#6B4FD8]/20"
            title={activeTab === 'warehouses' ? 'Crear Almacén' : 'Registrar Ingreso'}
          >
            <Plus size={18} />
            {activeTab === 'warehouses' && <span className="hidden sm:inline ml-1 text-xs uppercase font-black tracking-wider">Nuevo</span>}
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto -mx-4 md:mx-0 border-y md:border border-[var(--color-outline-variant)] md:rounded-2xl bg-transparent md:bg-[var(--color-surface-container-low)] overflow-hidden">
          {activeTab === 'stock' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-5">Material</th>
                  <th className="px-6 py-5">Ubicación</th>
                  <th className="px-6 py-5">Unidad</th>
                  <th className="px-6 py-5 text-right">Cantidad</th>
                  <th className="px-6 py-5 text-right">Precio Compra</th>
                  <th className="px-6 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]/30 text-sm">
                {filteredStock.length > 0 ? filteredStock.map((item) => {
                  const threshold = getMaterialThreshold(item.materialName, item.warehouseId);
                  const isLow = item.quantity <= threshold;
                  const warehouseName = warehouses.find(w => w.id === item.warehouseId)?.name || 'Sin Almacén';

                  return (
                    <tr key={item.id} className="hover:bg-[var(--color-surface-container)]/40 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[var(--color-on-surface)] flex items-center gap-2">
                            {item.materialName}
                            {isLow && <AlertTriangle size={14} className="text-amber-500" title={`Bajo el mínimo (${threshold})`} />}
                          </span>
                          {isLow && <span className="text-[10px] text-amber-500 font-bold uppercase">Stock Bajo (Mín: {threshold})</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[var(--color-on-surface-variant)] text-xs flex items-center gap-1.5">
                        <MapPin size={12} className="text-[var(--color-primary)]" /> {warehouseName}
                      </td>
                      <td className="px-6 py-4 text-[var(--color-on-surface-variant)] uppercase text-xs">
                        {item.unit}
                      </td>
                      <td className={`px-6 py-4 text-right font-mono font-bold ${isLow ? 'text-amber-500' : 'text-[var(--color-primary)]'}`}>
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-right text-[var(--color-on-surface)] font-mono">
                        {formatPrice(item.purchasePrice)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleOpenSettings(item.materialName)}
                            className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] p-2 rounded-lg transition-all"
                            title="Configurar Alerta"
                          >
                            <Settings size={16} />
                          </button>
                          <button 
                            onClick={() => handleOpenModal('OUT', item)}
                            className="bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white p-2 rounded-lg transition-all"
                            title="Registrar Salida"
                          >
                            <Minus size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center text-[var(--color-on-surface-variant)] italic">
                      No hay materiales en stock que coincidan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'history' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-5">Fecha</th>
                  <th className="px-6 py-5">Tipo</th>
                  <th className="px-6 py-5">Material / Ubicación</th>
                  <th className="px-6 py-5 text-right">Cant.</th>
                  <th className="px-6 py-5 text-right">Valor</th>
                  <th className="px-6 py-5">Destino</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]/30 text-sm">
                {filteredHistory.length > 0 ? filteredHistory.map((log) => {
                   const warehouseName = warehouses.find(w => w.id === log.warehouseId)?.name || 'Sin Almacén';
                   return (
                    <tr key={log.id} className="hover:bg-[var(--color-surface-container)]/40 transition-colors">
                      <td className="px-6 py-4 text-[var(--color-on-surface-variant)] text-xs">
                        {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : 'Reciente'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${log.type === 'IN' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-500'}`}>
                          {log.type === 'IN' ? 'Ingreso' : 'Salida'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[var(--color-on-surface)]">{log.materialName}</span>
                          <span className="text-[10px] text-[var(--color-on-surface-variant)] uppercase flex items-center gap-1">
                            <MapPin size={10} /> {warehouseName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-mono">
                        {log.quantity} {log.unit}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-[var(--color-on-surface)]">
                        {formatPrice(log.movementValue || (log.quantity * (log.price || 0)))}
                      </td>
                      <td className="px-6 py-4 text-xs text-[var(--color-on-surface-variant)]">
                        {log.destination || (log.type === 'IN' ? 'Compra' : '-')}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center text-[var(--color-on-surface-variant)] italic">
                      No hay registros en el historial.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'warehouses' && (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWarehouses.length > 0 ? filteredWarehouses.map((w) => (
                <div key={w.id} className="p-6 rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-low)] hover:shadow-xl transition-all relative group animate-in fade-in duration-300">
                  {w.isDefault && (
                    <span className="absolute top-4 right-4 px-2 py-0.5 bg-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase rounded-full">Principal</span>
                  )}
                  <div className="w-12 h-12 bg-[var(--color-surface-container-low)] rounded-xl flex items-center justify-center shadow-sm mb-4 border border-[var(--color-outline-variant)]/30">
                    <Warehouse className="text-[var(--color-primary)]" size={24} />
                  </div>
                  <h4 className="font-bold text-[var(--color-on-surface)] mb-1">{w.name}</h4>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mb-4">{w.location || 'Sin dirección registrada'}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--color-outline-variant)]/30">
                    <span className="text-[10px] font-black uppercase text-[var(--color-on-surface-variant)] tracking-widest">{w.status || 'Activo'}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenWarehouseModal(w)} 
                        className="p-1.5 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors rounded-lg hover:bg-[var(--color-surface-variant)]"
                        title="Editar Almacén"
                      >
                        <Edit2 size={14} />
                      </button>
                      {!w.isDefault && (
                        <button 
                          onClick={() => handleDeleteWarehouse(w.id)} 
                          className="p-1.5 text-[var(--color-on-surface-variant)] hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
                          title="Eliminar Almacén"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center text-[var(--color-on-surface-variant)] italic">
                  No se encontraron almacenes registrados que coincidan con tu búsqueda.
                </div>
              )}
            </div>
          )}
        </div>

      {/* Movement Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSaving && setShowModal(false)}></div>
          <div className="bg-[var(--color-surface-variant)] w-full max-w-lg border border-[var(--color-outline-variant)] rounded-3xl shadow-lg overflow-hidden relative animate-in zoom-in duration-300">
            <div className="p-6 border-b border-[var(--color-outline-variant)]/30 flex justify-between items-center bg-[var(--color-surface-container-low)]">
              <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm flex items-center gap-2">
                {modalType === 'IN' ? <TrendingUp size={18} className="text-green-400" /> : <TrendingDown size={18} className="text-amber-400" />}
                {modalType === 'IN' ? 'Registrar Ingreso' : 'Registrar Salida'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-[var(--color-on-surface-variant)] hover:text-white transition-colors">
                <X size={20}/>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {/* Warehouse Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest flex items-center gap-1">
                  <MapPin size={10} /> Almacén Destino
                </label>
                <select 
                  required
                  disabled={isSaving || (modalType === 'OUT')}
                  value={formData.warehouseId}
                  onChange={(e) => setFormData({...formData, warehouseId: e.target.value})}
                  className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none font-bold"
                >
                  <option value="">Selecciona Almacén...</option>
                  {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>

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

      {/* Warehouse Form Modal */}
      {showWarehouseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSaving && setShowWarehouseModal(false)}></div>
          <div className="bg-[var(--color-surface-variant)] w-full max-w-md border border-[var(--color-outline-variant)] rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in duration-300">
            <div className="p-6 border-b border-[var(--color-outline-variant)]/30 flex justify-between items-center bg-[var(--color-surface-container-low)]">
              <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm flex items-center gap-2">
                <Warehouse size={18} className="text-[var(--color-primary)]" />
                {editingWarehouseId ? 'Editar Almacén' : 'Nuevo Almacén'}
              </h3>
              <button onClick={() => setShowWarehouseModal(false)} className="text-[var(--color-on-surface-variant)] hover:text-white transition-colors">
                <X size={20}/>
              </button>
            </div>

            <form onSubmit={handleWarehouseSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Nombre del Almacén</label>
                <input 
                  required
                  type="text"
                  disabled={isSaving}
                  value={warehouseFormData.name}
                  onChange={(e) => setWarehouseFormData({...warehouseFormData, name: e.target.value})}
                  placeholder="Ej: Bodega Central"
                  className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Ubicación / Dirección</label>
                <div className="relative">
                  <input 
                    required
                    type="text"
                    disabled={isSaving}
                    value={warehouseFormData.location}
                    onChange={(e) => setWarehouseFormData({...warehouseFormData, location: e.target.value})}
                    placeholder="Ej: Calle Principal #123"
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none"
                  />
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" size={16} />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox"
                  id="isDefaultCheckbox"
                  disabled={isSaving}
                  checked={warehouseFormData.isDefault}
                  onChange={(e) => setWarehouseFormData({...warehouseFormData, isDefault: e.target.checked})}
                  className="w-4 h-4 rounded bg-[var(--color-surface-container)] border-[var(--color-outline-variant)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <label htmlFor="isDefaultCheckbox" className="text-xs font-bold text-[var(--color-on-surface)] select-none cursor-pointer">
                  Establecer como almacén principal
                </label>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowWarehouseModal(false)} 
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)] transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-[2] bg-[#6B4FD8] text-[#002150] font-black px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-[#6B4FD8]/20"
                >
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : (editingWarehouseId ? 'Guardar Cambios' : 'Crear Almacén')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal (Thresholds) */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSaving && setShowSettingsModal(false)}></div>
          <div className="bg-[var(--color-surface-variant)] w-full max-w-sm border border-[var(--color-outline-variant)] rounded-3xl shadow-lg overflow-hidden relative animate-in zoom-in duration-300">
            <div className="p-6 border-b border-[var(--color-outline-variant)]/30 flex justify-between items-center bg-[var(--color-surface-container-low)]">
              <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm flex items-center gap-2">
                <Settings size={18} className="text-[var(--color-primary)]" /> Configurar Alerta
              </h3>
              <button onClick={() => setShowSettingsModal(false)} className="text-[var(--color-on-surface-variant)] hover:text-white transition-colors">
                <X size={20}/>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-1 text-center">
                <p className="text-sm font-bold text-[var(--color-on-surface)]">{selectedMaterial}</p>
                <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase tracking-widest">
                  En: {warehouses.find(w => w.id === selectedWarehouseId)?.name || 'Este almacén'}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Stock Mínimo (Umbral)</label>
                <input 
                  type="number"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(e.target.value)}
                  className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none font-mono text-center text-lg font-bold"
                  placeholder="0"
                />
                <p className="text-[9px] text-[var(--color-on-surface-variant)] text-center">Se mostrará un icono de advertencia si el stock baja de este valor.</p>
              </div>

              <button 
                onClick={handleUpdateThreshold}
                disabled={isSaving}
                className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] font-black py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : 'Guardar Configuración'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
