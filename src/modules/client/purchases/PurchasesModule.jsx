import { useState, useRef } from 'react';
import { ShoppingCart, Package, Users, MoreVertical, Plus, Loader2, X, AlertCircle, FileText, CheckCircle2, Factory, Edit2, Trash2, Calendar, Hash, Tag, DollarSign } from 'lucide-react';
import { usePurchases } from './usePurchases';
import { useSuppliers } from './useSuppliers';
import { useInventory } from '../inventory/useInventory';
import { useAuth } from '../../../context/AuthContext';
import LoadingScreen from '../../../components/LoadingScreen';
import SuppliersModule from './SuppliersModule';

export default function PurchasesModule() {
  const suppliersRef = useRef();
  const { user, formatPrice, currencySymbol } = useAuth();
  const orgId = user?.organizationId || "default_org";
  const { purchases, loading, addPurchase, updatePurchase, receivePurchase, updatePurchaseStatus, deletePurchase } = usePurchases(orgId);
  const { suppliers } = useSuppliers(orgId);
  const { products } = useInventory(orgId);

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'suppliers'

  const [showModal, setShowModal] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
  const [formData, setFormData] = useState({ supplierId: '', supplierName: '', items: [], totalAmount: 0, status: 'Borrador' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cost, setCost] = useState(0);

  const handleViewPurchase = (purchase) => {
    setSelectedPurchase(purchase);
    setShowDetailModal(true);
  };

  const handleAddItem = () => {
    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const newItem = {
      productId: product.id,
      sku: product.sku,
      name: product.name,
      quantity: Number(quantity),
      cost: Number(cost)
    };

    const newItems = [...formData.items, newItem];
    const newTotal = newItems.reduce((acc, item) => acc + (item.quantity * item.cost), 0);

    setFormData({ ...formData, items: newItems, totalAmount: newTotal });
    setSelectedProduct('');
    setQuantity(1);
    setCost(0);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) {
      setSaveError("Debe añadir al menos un producto a la compra");
      return;
    }
    
    setIsSaving(true);
    setSaveError(null);
    try {
      const supplier = suppliers.find(s => s.id === formData.supplierId);
      const dataToSave = { 
        ...formData, 
        supplierName: supplier?.name || "Proveedor Desconocido" 
      };
      
      if (selectedPurchaseId) {
        await updatePurchase(selectedPurchaseId, dataToSave);
      } else {
        await addPurchase(dataToSave);
      }
      
      setShowModal(false);
      setSelectedPurchaseId(null);
      setFormData({ supplierId: '', supplierName: '', items: [], totalAmount: 0, status: 'Borrador' });
    } catch (err) {
      console.error("Error al registrar/actualizar compra:", err);
      setSaveError("No se pudo registrar la compra. Verifique los campos.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditClick = (purchase) => {
    setSelectedPurchaseId(purchase.id);
    setFormData({
      supplierId: purchase.supplierId || '',
      supplierName: purchase.supplierName || '',
      items: purchase.items || [],
      totalAmount: purchase.totalAmount || 0,
      status: purchase.status || 'Borrador'
    });
    setShowModal(true);
  };

  const handleReceive = async (purchaseId) => {
    if (!confirm("¿Confirmar recepción de mercadería? Esto actualizará el stock inmediatamente.")) return;
    try {
      await receivePurchase(purchaseId);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeletePurchase = async (purchaseId) => {
    if (!confirm("¿Está seguro de que desea eliminar esta orden de compra de forma permanente?")) return;
    try {
      await deletePurchase(purchaseId);
    } catch (err) {
      alert("Error al eliminar la orden de compra: " + err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Borrador': return 'bg-[#a3aac4] text-[#002150]';
      case 'Solicitada': return 'bg-[#6B4FD8] text-[#002150]';
      case 'Recibida': return 'bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]';
      case 'Pagada': return 'bg-blue-500 text-white';
      case 'Anulada': return 'bg-red-500 text-white opacity-50';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return <LoadingScreen fullScreen={false} message="Cargando Registro de Compras..." />;
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex p-1 bg-[var(--color-surface-container)]/50 rounded-xl border border-[var(--color-outline-variant)] w-fit">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-[#6B4FD8] text-[#002150]' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
          >
            <ShoppingCart size={16} /> Órdenes
          </button>
          <button 
            onClick={() => setActiveTab('suppliers')}
            className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${activeTab === 'suppliers' ? 'bg-[#6B4FD8] text-[#002150]' : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'}`}
          >
            <Users size={16} /> Proveedores
          </button>
        </div>

        {activeTab === 'orders' ? (
          <button 
            onClick={() => {
              setSelectedPurchaseId(null);
              setFormData({ supplierId: '', supplierName: '', items: [], totalAmount: 0, status: 'Borrador' });
              setShowModal(true);
            }}
            className="bg-[#6B4FD8] text-[#002150] font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all text-sm active:scale-95"
          >
            <Plus size={18} /> Nueva Compra
          </button>
        ) : (
          <button 
            onClick={() => suppliersRef.current?.handleOpenNew()}
            className="bg-[#6B4FD8] text-[#002150] font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all text-sm active:scale-95"
          >
            <Plus size={18} /> Nuevo Proveedor
          </button>
        )}
      </div>

      {activeTab === 'orders' ? (
        <div className="overflow-x-auto md:overflow-x-hidden -mx-4 md:mx-0 border-y md:border border-[var(--color-outline-variant)] md:rounded-xl bg-transparent md:bg-[var(--color-surface-container-low)]">
          <table className="w-full min-w-[850px] text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] text-[10px] uppercase tracking-widest font-black">
                <th className="px-6 py-5 border-b border-[#6B4FD8]/25">N° Orden</th>
                <th className="px-6 py-5 border-b border-[#6B4FD8]/25">Proveedor</th>
                <th className="px-6 py-5 text-center border-b border-[#6B4FD8]/25">Estado</th>
                <th className="px-6 py-5 text-center border-b border-[#6B4FD8]/25">Productos</th>
                <th className="px-6 py-5 text-right border-b border-[#6B4FD8]/25">Total</th>
                <th className="px-6 py-5 text-right border-b border-[#6B4FD8]/25">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-transparent text-sm">
              {purchases.length > 0 ? purchases.map((purchase) => (
                <tr 
                  key={purchase.id} 
                  onClick={() => handleViewPurchase(purchase)}
                  className="hover:bg-[var(--color-surface-container)] transition-all duration-200 group cursor-pointer relative"
                >
                  <td className="px-6 py-4 border-b border-[#6B4FD8]/15">
                    <span className="font-mono text-[var(--color-primary)] font-black">{purchase.orderNumber}</span>
                  </td>
                  <td className="px-6 py-4 border-b border-[#6B4FD8]/15">
                    <div>
                      <p className="font-bold text-[var(--color-on-surface)]">{purchase.supplierName}</p>
                      <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase">{new Date(purchase.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center border-b border-[#6B4FD8]/15">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg ${getStatusColor(purchase.status)}`}>
                      {purchase.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center border-b border-[#6B4FD8]/15">
                    <span className="text-xs text-[var(--color-on-surface-variant)] font-bold">
                      {purchase.items.length} sku(s)
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-[var(--color-on-surface)] text-right border-b border-[#6B4FD8]/15">
                    {formatPrice(purchase.totalAmount)}
                  </td>
                  <td className="px-6 py-4 text-right border-b border-[#6B4FD8]/15">
                    <div className="flex justify-end gap-2">
                       {purchase.status !== 'Recibida' && purchase.status !== 'Anulada' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleReceive(purchase.id); }}
                          className="bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white px-3 py-1.5 rounded-xl border border-green-500/20 hover:border-transparent transition-all text-xs font-black uppercase shadow-[0_2px_6px_rgba(34,197,94,0.1),_inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_6px_12px_rgba(34,197,94,0.3)] hover:-translate-y-[2px] active:scale-95"
                        >
                          Recibir
                        </button>
                      )}
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleEditClick(purchase); 
                        }}
                        title="Editar Orden"
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-[#002150] border border-amber-500/20 hover:border-transparent transition-all shadow-[0_2px_8px_rgba(245,158,11,0.15),_inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_20px_rgba(245,158,11,0.55),_inset_0_1.5px_1.5px_rgba(255,255,255,0.12)] hover:-translate-y-[2px] hover:scale-105 active:scale-95"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleDeletePurchase(purchase.id); 
                        }}
                        title="Eliminar Orden"
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-transparent transition-all shadow-[0_2px_8px_rgba(239,68,68,0.15),_inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_8px_20px_rgba(239,68,68,0.55),_inset_0_1.5px_1.5px_rgba(255,255,255,0.12)] hover:-translate-y-[2px] hover:scale-105 active:scale-95"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-[var(--color-on-surface-variant)] italic">No hay órdenes de compra registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <SuppliersModule embedded={true} ref={suppliersRef} />
      )}

      {/* Modal Nueva OC */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSaving && setShowModal(false)}></div>
          <form 
            onSubmit={handleAddSubmit}
            className="bg-[var(--color-surface-variant)] w-full max-w-2xl border border-[var(--color-outline-variant)] rounded-3xl shadow-lg overflow-hidden relative animate-in zoom-in duration-300 flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-[#40485d]/20 flex justify-between items-center bg-[var(--color-surface-container-low)]/50">
              <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm flex items-center gap-2">
                <ShoppingCart size={18} className="text-[var(--color-primary)]" />
                {selectedPurchaseId ? 'Editar Orden de Compra' : 'Nueva Orden de Compra'}
              </h3>
              <button type="button" onClick={() => setShowModal(false)} disabled={isSaving} className="text-[var(--color-on-surface-variant)] hover:text-white transition-colors">
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-8 space-y-6 overflow-y-auto">
              {saveError && (
                <div className="bg-red-500/20 border border-red-500/50 p-3 rounded-xl flex items-center gap-3 text-red-300 text-xs">
                  <AlertCircle size={18} />
                  {saveError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Proveedor</label>
                  <select required disabled={isSaving} value={formData.supplierId}
                    onChange={(e) => setFormData({...formData, supplierId: e.target.value})}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none disabled:opacity-50 font-bold"
                  >
                    <option value="">Seleccionar Proveedor...</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.taxId})</option>)}
                  </select>
                </div>

                <div className="space-y-4 md:col-span-2 p-4 bg-[var(--color-surface-container)]/50 rounded-2xl border border-[var(--color-outline-variant)]">
                  <p className="text-[10px] font-black text-[var(--color-primary)] uppercase">Añadir Productos</p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}
                      className="md:col-span-2 bg-[var(--color-surface-variant)] border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 text-xs text-[var(--color-on-surface)] outline-none"
                    >
                      <option value="">Seleccionar Producto...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>)}
                    </select>
                    <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Cant." className="bg-[var(--color-surface-variant)] border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 text-xs text-[var(--color-on-surface)]" />
                    <input type="number" min="0" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)}
                      placeholder={`Costo ${currencySymbol}`} className="bg-[var(--color-surface-variant)] border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 text-xs text-[var(--color-on-surface)]" />
                    <button type="button" onClick={handleAddItem} className="md:col-span-4 bg-[var(--color-primary-container)] hover:bg-[#6B4FD8] text-[var(--color-on-surface)] hover:text-[#002150] font-bold py-2 rounded-lg transition-all text-xs flex items-center justify-center gap-2">
                       <Plus size={14} /> Añadir a la lista
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Items en la Orden</label>
                   <div className="border border-[#40485d]/20 rounded-xl overflow-hidden">
                      <table className="w-full text-[11px]">
                         <thead className="bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]">
                            <tr>
                               <th className="px-3 py-2 text-left">Producto</th>
                               <th className="px-3 py-2 text-center">Cant.</th>
                               <th className="px-3 py-2 text-right">Costo</th>
                               <th className="px-3 py-2 text-right">Subtotal</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-[#40485d]/10">
                            {formData.items.map((item, idx) => (
                              <tr key={idx} className="text-[var(--color-on-surface)]">
                                 <td className="px-3 py-2 font-bold">{item.name} <span className="text-[9px] text-[var(--color-on-surface-variant)] block">{item.sku}</span></td>
                                 <td className="px-3 py-2 text-center">{item.quantity}</td>
                                 <td className="px-3 py-2 text-right">
                                    <div className="text-right">
                                      <p className="text-[10px] text-[var(--color-on-surface-variant)]">{item.quantity} und. x {formatPrice(item.cost)}</p>
                                      <span className="font-black text-[var(--color-on-surface)]">{formatPrice(item.quantity * item.cost)}</span>
                                    </div>
                                 </td>
                              </tr>
                            ))}
                            {formData.items.length === 0 && (
                              <tr><td colSpan="4" className="px-3 py-8 text-center text-[var(--color-on-surface-variant)] italic">No hay productos en la lista.</td></tr>
                            )}
                         </tbody>
                         <tfoot className="bg-[var(--color-surface-container)]/50 border-t border-[var(--color-outline-variant)]">
                            <tr>
                               <td colSpan="4" className="px-3 py-3 text-right">
                                 <div className="flex justify-between items-center text-lg text-[var(--color-on-surface)] font-black">
                                   <span>TOTAL ESTIMADO</span><span className="text-[#6B4FD8]">{formatPrice(formData.totalAmount)}</span>
                                 </div>
                               </td>
                            </tr>
                         </tfoot>
                      </table>
                   </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[var(--color-surface-container)] flex gap-4 mt-auto">
              <button type="button" onClick={() => setShowModal(false)} disabled={isSaving}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button type="submit" disabled={isSaving || formData.items.length === 0}
                className="flex-[2] bg-[#6B4FD8] text-[#002150] font-black px-4 py-3 rounded-xl disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {isSaving ? <><Loader2 size={18} className="animate-spin" /> Procesando...</> : (selectedPurchaseId ? 'Guardar Cambios' : 'Registrar Orden de Compra')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Visor de Orden de Compra */}
      {showDetailModal && selectedPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}></div>
          <div className="bg-[var(--color-surface-variant)] w-full max-w-2xl border border-[var(--color-outline-variant)] rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden relative animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#40485d]/20 flex justify-between items-start bg-[var(--color-surface-container-low)]/50 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at top right, var(--color-primary), transparent 70%)' }}></div>
              <div className="relative z-10 flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <div className="bg-[var(--color-surface-container)] p-3 rounded-2xl border border-[var(--color-outline-variant)] shadow-inner">
                    <ShoppingCart size={24} className="text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[var(--color-on-surface)] flex items-center gap-2">
                      Orden de Compra 
                      <span className="font-mono text-[var(--color-primary)] bg-[var(--color-primary-container)] px-2 py-0.5 rounded-md text-sm">{selectedPurchase.orderNumber}</span>
                    </h2>
                    <p className="text-xs text-[var(--color-on-surface-variant)] flex items-center gap-1 font-medium mt-1">
                      <Calendar size={12} /> Emitida el {new Date(selectedPurchase.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg shadow-sm border border-black/10 ${getStatusColor(selectedPurchase.status)}`}>
                  {selectedPurchase.status}
                </span>
                <button type="button" onClick={() => setShowDetailModal(false)} className="text-[var(--color-on-surface-variant)] hover:text-white transition-colors bg-[var(--color-surface-container)] hover:bg-[#6B4FD8] p-2 rounded-full border border-[var(--color-outline-variant)] hover:border-transparent active:scale-95">
                  <X size={20}/>
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--color-surface-container)]/30 border border-[var(--color-outline-variant)] rounded-2xl shadow-inner flex flex-col gap-2">
                  <p className="text-[10px] font-black text-[var(--color-primary)] uppercase flex items-center gap-1"><Users size={12}/> Proveedor</p>
                  <p className="font-bold text-[var(--color-on-surface)] text-sm">{selectedPurchase.supplierName}</p>
                </div>
                <div className="p-4 bg-[var(--color-surface-container)]/30 border border-[var(--color-outline-variant)] rounded-2xl shadow-inner flex flex-col gap-2 justify-center items-end">
                  <p className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Monto Total</p>
                  <p className="font-black text-2xl text-[var(--color-primary)]">{formatPrice(selectedPurchase.totalAmount)}</p>
                </div>
              </div>

              <div className="space-y-2">
                 <h3 className="text-xs font-black text-[var(--color-on-surface-variant)] uppercase flex items-center gap-2 mb-3">
                   <Package size={14}/> Detalles de los Items
                 </h3>
                 <div className="border border-[#40485d]/30 rounded-2xl overflow-hidden bg-[var(--color-surface-container)]/20 shadow-inner">
                    <table className="w-full text-[11px]">
                       <thead className="bg-[var(--color-surface-container)]/80 text-[var(--color-on-surface-variant)] border-b border-[#40485d]/30">
                          <tr>
                             <th className="px-4 py-3 text-left">Producto</th>
                             <th className="px-4 py-3 text-center">Cant.</th>
                             <th className="px-4 py-3 text-right">Costo Unit.</th>
                             <th className="px-4 py-3 text-right">Subtotal</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-[#40485d]/10">
                          {selectedPurchase.items && selectedPurchase.items.map((item, idx) => (
                            <tr key={idx} className="text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]/40 transition-colors">
                               <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="bg-[var(--color-surface-variant)] p-1.5 rounded-lg border border-[var(--color-outline-variant)]">
                                    <Tag size={12} className="text-[var(--color-on-surface-variant)]" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm">{item.name}</p>
                                    <p className="text-[9px] text-[var(--color-on-surface-variant)] uppercase font-mono">{item.sku}</p>
                                  </div>
                                </div>
                               </td>
                               <td className="px-4 py-3 text-center font-bold text-[var(--color-primary)] bg-[var(--color-primary-container)]/10">{item.quantity}</td>
                               <td className="px-4 py-3 text-right text-[var(--color-on-surface-variant)]">{formatPrice(item.cost)}</td>
                               <td className="px-4 py-3 text-right font-black">{formatPrice(item.quantity * item.cost)}</td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
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
}
