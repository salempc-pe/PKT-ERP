import { useState, useEffect } from 'react';
import { Box, Search, Filter, AlertTriangle, Plus, ArrowDown, ArrowUp, Loader2, X, Edit2, Warehouse, ArrowRightLeft, Scan, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useInventory } from './useInventory';
import { useWarehouses } from './useWarehouses';
import { useWarehouse } from './useWarehouse';
import { useInventoryTransactions } from './useInventoryTransactions';
import { useInventoryTransfers } from './useInventoryTransfers';
import { useAuth } from '../../../context/AuthContext';
import LoadingScreen from '../../../components/LoadingScreen';
import BarcodeScanner from './BarcodeScanner';

export default function InventoryModule() {
  const { user, formatPrice, currencySymbol } = useAuth();
  const orgId = user?.organizationId || "default_org";
  
  const { products, loading: productsLoading, addProduct, updateProduct } = useInventory(orgId);
  const { warehouses, loading: warehousesLoading, addWarehouse, updateWarehouse } = useWarehouses(orgId);
  const { stock: bodegaStock, loading: bodegaLoading, addMovement } = useWarehouse(orgId);
  const { recordTransaction } = useInventoryTransactions(orgId);
  const { initiateTransfer, completeTransfer, cancelTransfer } = useInventoryTransfers(orgId);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'products');

  // -- Modal States --
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('product'); // 'product', 'warehouse', 'transfer', 'adjustment'
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    price: '',
    stock: 0,
    lowStockThreshold: 5,
    averageCost: 0,
    warehouseId: ''
  });

  // -- Search & Filter State --
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  // Sincronizar pestaña activa
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['products', 'warehouses', 'transfers'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // -- Handlers --
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalType === 'product') {
        if (editingId) {
          await updateProduct(editingId, {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            lowStockThreshold: Number(formData.lowStockThreshold),
            averageCost: Number(formData.averageCost)
          });
        } else {
          await addProduct({
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            lowStockThreshold: Number(formData.lowStockThreshold),
            averageCost: Number(formData.averageCost)
          });
        }
      } else if (modalType === 'warehouse') {
        if (editingId) {
          await updateWarehouse(editingId, formData);
        } else {
          await addWarehouse(formData);
        }
      } else if (modalType === 'transfer') {
        if (formData.isBodega) {
           await addMovement({
             type: 'OUT',
             materialName: formData.materialName,
             quantity: Number(formData.transferQuantity),
             unit: formData.unit,
             price: formData.purchasePrice,
             loteId: editingId,
             destination: warehouses.find(w => w.id === formData.destinationWarehouseId)?.name || 'Traslado'
           });
           await addMovement({
             type: 'IN',
             materialName: formData.materialName,
             quantity: Number(formData.transferQuantity),
             unit: formData.unit,
             price: formData.purchasePrice,
             warehouseId: formData.destinationWarehouseId
           });
        } else {
           await initiateTransfer({
             productId: editingId,
             productName: formData.name,
             sku: formData.sku,
             fromWarehouseId: formData.warehouseId || 'default',
             toWarehouseId: formData.destinationWarehouseId,
             quantity: Number(formData.transferQuantity)
           });
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error en operación de inventario", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (type, data = null) => {
    setModalType(type);
    if (data) {
      setEditingId(data.id);
      setFormData({ ...data });
    } else {
      setEditingId(null);
      setFormData({
        sku: '', name: '', category: '', price: '', stock: 0, lowStockThreshold: 5, averageCost: 0, warehouseId: warehouses[0]?.id || ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ sku: '', name: '', category: '', price: '', stock: 0, lowStockThreshold: 5, averageCost: 0, warehouseId: '' });
  };

  const onBarcodeScan = (code) => {
    setSearchQuery(code);
    setActiveFilter(code);
    // Si estamos en la pestaña de productos y encontramos uno, podríamos abrir edición automáticamente
    const found = products.find(p => p.sku === code);
    if (found) {
      handleOpenModal('product', found);
    }
  };

  const inventoryStats = [
    { title: 'Ítems de Inventario', value: products.length, icon: <Box size={24} className="text-purple-600" /> },
    { title: 'Alertas de Stock', value: products.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold || 5)).length, icon: <AlertTriangle size={24} className="text-amber-500" /> },
    { title: 'Monto en Inventario', value: formatPrice(products.reduce((acc, p) => acc + (p.stock * (p.averageCost || 0)), 0)), icon: <ArrowUp size={24} className="text-emerald-600" /> },
    { title: 'Monto en Materiales', value: formatPrice(bodegaStock.reduce((acc, b) => acc + ((b.quantity || 0) * (b.purchasePrice || 0)), 0)), icon: <Warehouse size={24} className="text-blue-600" /> }
  ];

  if (productsLoading || warehousesLoading || bodegaLoading) {
    return <LoadingScreen fullScreen={false} message="CARGANDO GESTIÓN DE INVENTARIO..." />;
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-6 relative">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Desktop Tabs */}
        <div className="hidden md:flex bg-[var(--color-surface-container)]/50 p-1 rounded-xl border border-[var(--color-outline-variant)]">
          {[
            { id: 'products', label: 'Stock de Inventario', icon: Box },
            { id: 'bodega', label: 'Stock de Bodega', icon: Box },
            { id: 'warehouses', label: 'Almacenes', icon: Warehouse }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-[#6B4FD8] text-[#002150]' 
                : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Tabs Selector */}
        <div className="md:hidden w-full relative">
          <select
            value={activeTab}
            onChange={(e) => handleTabChange(e.target.value)}
            className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] font-bold rounded-xl border border-[var(--color-outline-variant)] px-4 py-3 outline-none appearance-none focus:border-[#6B4FD8]"
          >
            <option value="products">Stock de Inventario</option>
            <option value="bodega">Stock de Bodega</option>
            <option value="warehouses">Almacenes</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--color-on-surface-variant)]">
            <ChevronDown size={18} />
          </div>
        </div>

        <button 
          onClick={() => handleOpenModal(activeTab === 'warehouses' ? 'warehouse' : 'product')}
          className="bg-[#6B4FD8] text-[#002150] font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-[0_0_20px_rgba(133,173,255,0.3)] transition-all active:scale-95 text-sm"
        >
          <Plus size={18} /> {activeTab === 'warehouses' ? 'Nuevo Almacén' : 'Nuevo Producto'}
        </button>
      </div>

      {/* Stats Indicators - Oculto en móvil */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
        {inventoryStats.map((stat, idx) => (
          <div key={idx} className="bg-[var(--color-surface-container-low)] p-5 rounded-2xl flex items-center gap-4 border border-[var(--color-outline-variant)] transition-all">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-container)] flex items-center justify-center border border-[var(--color-outline-variant)]/30">
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-1">{stat.title}</p>
              <span className="text-lg font-black text-[var(--color-on-surface)] font-mono leading-tight">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Barcode Scanner & Search Row */}
      <div className="flex flex-col md:flex-row gap-3 items-center mb-4">
        <div className="w-full md:w-80">
          <BarcodeScanner onScan={onBarcodeScan} placeholder="Escanear o buscar..." />
        </div>
        {activeFilter && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#6B4FD8]/10 rounded-xl border border-[#6B4FD8]/20 animate-in fade-in duration-200">
            <span className="text-xs font-bold text-[#6B4FD8]">Filtro: "{activeFilter}"</span>
            <button 
              onClick={() => { setActiveFilter(''); setSearchQuery(''); }}
              className="p-0.5 hover:bg-[#6B4FD8]/20 text-[#6B4FD8] rounded-full transition-colors"
              title="Limpiar filtro"
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="overflow-x-auto -mx-4 md:mx-0 border-y md:border border-[var(--color-outline-variant)] md:rounded-2xl bg-transparent md:bg-[var(--color-surface-container-low)] overflow-hidden">
        {activeTab === 'products' && (
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] text-[10px] uppercase tracking-widest font-black border-b border-[var(--color-outline-variant)]/30">
                  <th className="px-4 py-2.5">Producto / SKU</th>
                  <th className="px-4 py-2.5">Categoría</th>
                  <th className="px-4 py-2.5 text-right">Costo Prom.</th>
                  <th className="px-4 py-2.5 text-right">Precio Venta</th>
                  <th className="px-4 py-2.5 text-center">Stock Total</th>
                  <th className="px-4 py-2.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]/30 text-sm">
                {products
                  .filter(p => !activeFilter || JSON.stringify(p).toLowerCase().includes(activeFilter.toLowerCase()))
                  .map((prod) => (
                    <tr key={prod.id} className="hover:bg-[var(--color-surface-container)]/50 transition-colors group">
                      <td className="px-4 py-2">
                        <p className="font-bold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">{prod.name}</p>
                        <p className="text-[10px] font-mono text-[var(--color-on-surface-variant)] uppercase">{prod.sku}</p>
                        {prod.description && <p className="text-[10px] text-[var(--color-on-surface-variant)] line-clamp-1 mt-1">{prod.description}</p>}
                      </td>
                      <td className="px-4 py-2">
                        <span className="px-2 py-1 bg-[var(--color-surface-variant)] text-[var(--color-primary)] font-black rounded text-[10px] uppercase tracking-tight">{prod.category}</span>
                      </td>
                      <td className="px-4 py-2 text-right font-medium text-[var(--color-on-surface-variant)]">{formatPrice(prod.averageCost || 0)}</td>
                      <td className="px-4 py-2 text-right font-black text-[var(--color-on-surface)]">{formatPrice(prod.price)}</td>
                      <td className="px-4 py-2 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`text-base font-black ${prod.stock === 0 ? 'text-red-500' : prod.stock <= (prod.lowStockThreshold || 5) ? 'text-amber-500' : 'text-[var(--color-on-surface)]'}`}>
                            {prod.stock} <span className="text-xs font-normal text-[var(--color-on-surface-variant)]">{prod.unit || 'und'}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenModal('transfer', { ...prod, isBodega: false })} className="p-2 text-[var(--color-on-surface-variant)] hover:text-[#6B4FD8] hover:bg-[#6B4FD8]/10 rounded-lg transition-all" title="Transferir"><ArrowRightLeft size={16} /></button>
                          <button onClick={() => handleOpenModal('product', prod)} className="p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-all"><Edit2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'warehouses' && (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warehouses.map(w => (
              <div key={w.id} className="p-6 rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-low)] transition-all relative group">
                {w.isDefault && (
                  <span className="absolute top-4 right-4 px-2 py-0.5 bg-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase rounded-full">Principal</span>
                )}
                <div className="w-12 h-12 bg-[var(--color-surface-container-low)] rounded-xl flex items-center justify-center mb-4 border border-[var(--color-outline-variant)]/30">
                  <Warehouse className="text-[var(--color-primary)]" size={24} />
                </div>
                <h4 className="font-bold text-[var(--color-on-surface)] mb-1">{w.name}</h4>
                <p className="text-xs text-[var(--color-on-surface-variant)] mb-4">{w.location}</p>
                <div className="flex items-center justify-between pt-4 border-t border-[var(--color-outline-variant)]/30">
                  <span className="text-[10px] font-black uppercase text-[var(--color-on-surface-variant)] tracking-widest">{w.status}</span>
                  <button onClick={() => handleOpenModal('warehouse', w)} className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] transition-colors"><Edit2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'bodega' && (
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] text-[10px] uppercase tracking-widest font-black border-b border-[var(--color-outline-variant)]/30">
                  <th className="px-4 py-2.5">Material</th>
                  <th className="px-4 py-2.5">Unidad</th>
                  <th className="px-4 py-2.5 text-right">Precio Compra</th>
                  <th className="px-4 py-2.5 text-center">Cantidad</th>
                  <th className="px-4 py-2.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-outline-variant)]/30 text-sm">
                {bodegaStock
                  .filter(b => !activeFilter || JSON.stringify(b).toLowerCase().includes(activeFilter.toLowerCase()))
                  .map((b) => (
                    <tr key={b.id} className="hover:bg-[var(--color-surface-container)]/50 transition-colors group">
                      <td className="px-4 py-2">
                        <p className="font-bold text-[var(--color-on-surface)] group-hover:text-[var(--color-primary)] transition-colors">{b.materialName}</p>
                      </td>
                      <td className="px-4 py-2 text-[var(--color-on-surface-variant)]">{b.unit}</td>
                      <td className="px-4 py-2 text-right font-medium text-[var(--color-on-surface-variant)]">{formatPrice(b.purchasePrice || 0)}</td>
                      <td className="px-4 py-2 text-center">
                        <span className="text-base font-black text-[var(--color-on-surface)]">
                          {b.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenModal('transfer', { ...b, isBodega: true })} className="p-2 text-[var(--color-on-surface-variant)] hover:text-[#6B4FD8] hover:bg-[#6B4FD8]/10 rounded-lg transition-all" title="Transferir"><ArrowRightLeft size={16} /></button>
                        </div>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Shared Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="w-full max-w-md bg-[var(--color-surface-variant)] rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in duration-300 border border-[var(--color-outline-variant)] flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-[var(--color-outline-variant)]/30 flex justify-between items-center bg-[var(--color-surface-container)]">
              <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm">
                {modalType === 'transfer' ? 'Transferir Stock' : `${editingId ? 'Editar' : 'Crear'} ${modalType === 'warehouse' ? 'Almacén' : 'Producto'}`}
              </h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
              {modalType === 'product' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">SKU</label>
                      <input required name="sku" value={formData.sku || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:border-[#6B4FD8] outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Nombre</label>
                      <input required name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:border-[#6B4FD8] outline-none transition-all font-bold" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Descripción</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:border-[#6B4FD8] outline-none transition-all resize-none h-20" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Categoría</label>
                      <input name="category" value={formData.category || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:border-[#6B4FD8] outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Unidad</label>
                      <input name="unit" value={formData.unit || ''} placeholder="und" onChange={handleInputChange} className="w-full px-4 py-3 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:border-[#6B4FD8] outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Precio Venta</label>
                      <input required type="number" name="price" value={formData.price || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:border-[#6B4FD8] outline-none transition-all font-bold" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Stock Actual</label>
                      <input required type="number" name="stock" value={formData.stock || 0} onChange={handleInputChange} className="w-full px-4 py-3 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:border-[#6B4FD8] outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Alerta Mín.</label>
                      <input required type="number" name="lowStockThreshold" value={formData.lowStockThreshold || 5} onChange={handleInputChange} className="w-full px-4 py-3 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:border-[#6B4FD8] outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Costo Inic.</label>
                      <input type="number" name="averageCost" value={formData.averageCost || 0} onChange={handleInputChange} className="w-full px-4 py-3 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:border-[#6B4FD8] outline-none transition-all font-bold" />
                    </div>
                  </div>
                </>
              ) : modalType === 'warehouse' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Nombre del Almacén</label>
                    <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:border-[#6B4FD8] outline-none transition-all font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Ubicación / Dirección</label>
                    <input required name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-3 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:border-[#6B4FD8] outline-none transition-all" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Almacén de Destino</label>
                    <select required name="destinationWarehouseId" value={formData.destinationWarehouseId || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:border-[#6B4FD8] outline-none transition-all font-bold">
                      <option value="" disabled>Seleccione un almacén</option>
                      {warehouses.map(w => (
                        <option key={w.id} value={w.id}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-widest">Cantidad a transferir</label>
                    <input required type="number" name="transferQuantity" min="1" max={formData.quantity || formData.stock} value={formData.transferQuantity || ''} onChange={handleInputChange} className="w-full px-4 py-3 bg-[var(--color-surface-container)] text-[var(--color-on-surface)] border border-[var(--color-outline-variant)] rounded-xl focus:border-[#6B4FD8] outline-none transition-all font-bold" />
                  </div>
                </>
              )}

              <div className="pt-4">
                <button 
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-[#6B4FD8] text-[#002150] font-bold rounded-xl hover:shadow-[0_0_15px_rgba(133,173,255,0.4)] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : (modalType === 'transfer' ? 'TRANSFERIR STOCK' : editingId ? 'GUARDAR CAMBIOS' : 'CREAR REGISTRO')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

