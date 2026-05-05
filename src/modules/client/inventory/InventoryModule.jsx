import { useState, useEffect } from 'react';
import { Box, Search, Filter, AlertTriangle, Plus, ArrowDown, ArrowUp, Loader2, X, Edit2, Warehouse, ArrowRightLeft, Scan } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useInventory } from './useInventory';
import { useWarehouses } from './useWarehouses';
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
    { title: 'Total Productos', value: products.length, icon: <Box size={24} className="text-purple-600" /> },
    { title: 'Almacenes', value: warehouses.length, icon: <Warehouse size={24} className="text-blue-600" /> },
    { title: 'Bajo Stock', value: products.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold || 5)).length, icon: <AlertTriangle size={24} className="text-amber-500" /> },
    { title: 'Valor Total', value: formatPrice(products.reduce((acc, p) => acc + (p.stock * (p.averageCost || 0)), 0)), icon: <ArrowUp size={24} className="text-emerald-600" /> }
  ];

  if (productsLoading || warehousesLoading) {
    return <LoadingScreen fullScreen={false} message="CARGANDO GESTIÓN DE INVENTARIO..." />;
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-6 relative">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
          {[
            { id: 'products', label: 'Productos', icon: Box },
            { id: 'warehouses', label: 'Almacenes', icon: Warehouse },
            { id: 'transfers', label: 'Transferencias', icon: ArrowRightLeft }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-purple-600 text-white shadow-md shadow-purple-200' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <button 
          onClick={() => handleOpenModal(activeTab === 'warehouses' ? 'warehouse' : 'product')}
          className="bg-purple-600 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 transition-all active:scale-95"
        >
          <Plus size={18} /> {activeTab === 'warehouses' ? 'Nuevo Almacén' : 'Nuevo Producto'}
        </button>
      </div>

      {/* Stats Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {inventoryStats.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl flex items-center gap-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{stat.title}</p>
              <span className="text-xl font-black text-gray-900">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Barcode Scanner & Search Row */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-96">
          <BarcodeScanner onScan={onBarcodeScan} placeholder="Escanear o buscar SKU..." />
        </div>
        <div className="hidden md:block h-8 w-px bg-gray-200"></div>
        <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-gray-400 uppercase whitespace-nowrap">Filtros:</span>
          {['Ropa', 'Accesorios', 'Calzado'].map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                activeFilter === cat ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-gray-200 text-gray-500 hover:border-purple-300'
              }`}
            >
              {cat}
            </button>
          ))}
          {activeFilter && (
            <button onClick={() => setActiveFilter('')} className="text-xs text-red-500 font-bold hover:underline">Limpiar</button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {activeTab === 'products' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-black border-b border-gray-100">
                  <th className="px-6 py-4">Producto / SKU</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4 text-right">Costo Prom.</th>
                  <th className="px-6 py-4 text-right">Precio Venta</th>
                  <th className="px-6 py-4 text-center">Stock Total</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {products
                  .filter(p => !activeFilter || JSON.stringify(p).toLowerCase().includes(activeFilter.toLowerCase()))
                  .map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{prod.name}</p>
                        <p className="text-[10px] font-mono text-gray-400 uppercase">{prod.sku}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-tight">{prod.category}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-500">{formatPrice(prod.averageCost || 0)}</td>
                      <td className="px-6 py-4 text-right font-black text-gray-900">{formatPrice(prod.price)}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className={`text-base font-black ${prod.stock === 0 ? 'text-red-500' : prod.stock <= (prod.lowStockThreshold || 5) ? 'text-amber-500' : 'text-gray-900'}`}>
                            {prod.stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleOpenModal('product', prod)} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"><Edit2 size={16} /></button>
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
              <div key={w.id} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all relative group">
                {w.isDefault && (
                  <span className="absolute top-4 right-4 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase rounded-full">Principal</span>
                )}
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4">
                  <Warehouse className="text-purple-600" size={24} />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{w.name}</h4>
                <p className="text-xs text-gray-500 mb-4">{w.location}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{w.status}</span>
                  <button onClick={() => handleOpenModal('warehouse', w)} className="text-gray-400 hover:text-purple-600 transition-colors"><Edit2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'transfers' && (
          <div className="p-20 text-center flex flex-col items-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <ArrowRightLeft className="text-gray-300" size={40} />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Gestión de Movimientos</h3>
             <p className="text-gray-500 max-w-sm mx-auto mb-8 text-sm">
               Próximamente: Historial de transferencias en tránsito y confirmación de recepciones entre almacenes.
             </p>
             <button 
               onClick={() => handleOpenModal('transfer')}
               className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-600 transition-all"
             >
               Nueva Transferencia
             </button>
          </div>
        )}
      </div>

      {/* Shared Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                {editingId ? 'Editar' : 'Crear'} {modalType === 'warehouse' ? 'Almacén' : 'Producto'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              {modalType === 'product' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU</label>
                      <input required name="sku" value={formData.sku} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-bold" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Costo Inic.</label>
                      <input type="number" name="averageCost" value={formData.averageCost} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-bold" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nombre</label>
                    <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-bold" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoría</label>
                      <input name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Precio Venta</label>
                      <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-bold" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nombre del Almacén</label>
                    <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ubicación / Dirección</label>
                    <input required name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all" />
                  </div>
                </>
              )}

              <div className="pt-4">
                <button 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 shadow-xl shadow-purple-100 transition-all flex justify-center items-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : editingId ? 'GUARDAR CAMBIOS' : 'CREAR REGISTRO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

