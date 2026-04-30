import { useState, useRef } from 'react';
import { ShoppingCart, Package, Users, MoreVertical, Plus, Loader2, X, AlertCircle, FileText, CheckCircle2, Factory } from 'lucide-react';
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
  const { purchases, loading, addPurchase, receivePurchase, updatePurchaseStatus } = usePurchases(orgId);
  const { suppliers } = useSuppliers(orgId);
  const { products } = useInventory(orgId);

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'suppliers'

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ supplierId: '', supplierName: '', items: [], totalAmount: 0, status: 'Borrador' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cost, setCost] = useState(0);

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
      await addPurchase({ 
        ...formData, 
        supplierName: supplier?.name || "Proveedor Desconocido" 
      });
      setShowModal(false);
      setFormData({ supplierId: '', supplierName: '', items: [], totalAmount: 0, status: 'Borrador' });
    } catch (err) {
      console.error("Error al registrar compra:", err);
      setSaveError("No se pudo registrar la compra. Verifique los campos.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReceive = async (purchaseId) => {
    if (!confirm("¿Confirmar recepción de mercadería? Esto actualizará el stock inmediatamente.")) return;
    try {
      await receivePurchase(purchaseId);
    } catch (err) {
      alert(err.message);
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
            onClick={() => setShowModal(true)}
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
        <div className="overflow-x-auto -mx-4 md:mx-0 border-y md:border border-[var(--color-outline-variant)] md:rounded-xl bg-transparent md:bg-[var(--color-surface-container-low)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] text-[10px] uppercase tracking-widest font-black">
                <th className="px-6 py-5">N° Orden</th>
                <th className="px-6 py-5">Proveedor</th>
                <th className="px-6 py-5">Estado</th>
                <th className="px-6 py-5 text-center">Productos</th>
                <th className="px-6 py-5">Total</th>
                <th className="px-6 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#40485d]/10 text-sm">
              {purchases.length > 0 ? purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-[var(--color-surface-container)]/40 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-[var(--color-primary)] font-black">{purchase.orderNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-[var(--color-on-surface)]">{purchase.supplierName}</p>
                      <p className="text-[10px] text-[var(--color-on-surface-variant)] uppercase">{new Date(purchase.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg ${getStatusColor(purchase.status)}`}>
                      {purchase.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs text-[var(--color-on-surface-variant)] font-bold">
                      {purchase.items.length} sku(s)
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-[var(--color-on-surface)] text-right">
                    {formatPrice(purchase.totalAmount)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       {purchase.status !== 'Recibida' && purchase.status !== 'Anulada' && (
                        <button 
                          onClick={() => handleReceive(purchase.id)}
                          className="bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white px-3 py-1 rounded-lg border border-green-500/20 transition-all text-xs font-black uppercase"
                        >
                          Recibir
                        </button>
                      )}
                      <button className="p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"><MoreVertical size={16} /></button>
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
                Nueva Orden de Compra
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
                {isSaving ? <><Loader2 size={18} className="animate-spin" /> Procesando...</> : 'Registrar Orden de Compra'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
