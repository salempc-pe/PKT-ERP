import { useState } from 'react';
import { ShoppingCart, Package, Users, MoreVertical, Plus, Loader2, X, AlertCircle, FileText, CheckCircle2, Factory } from 'lucide-react';
import { usePurchases } from './usePurchases';
import { useSuppliers } from './useSuppliers';
import { useInventory } from '../inventory/useInventory';
import { useAuth } from '../../../context/AuthContext';

export default function PurchasesModule() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  const { purchases, loading, addPurchase, receivePurchase, updatePurchaseStatus } = usePurchases(orgId);
  const { suppliers } = useSuppliers(orgId);
  const { products } = useInventory(orgId);

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
      case 'Solicitada': return 'bg-[#85adff] text-[#002150]';
      case 'Recibida': return 'bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]';
      case 'Pagada': return 'bg-blue-500 text-white';
      case 'Anulada': return 'bg-red-500 text-white opacity-50';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
       <div className="flex h-64 items-center justify-center text-[#85adff]">
        <Loader2 className="animate-spin mr-2" /> Cargando Registro de Compras...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-[#dee5ff] tracking-tight">Órdenes de Compra</h2>
          <p className="text-[#a3aac4] text-sm">Gestiona el abastecimiento y recepción de mercadería.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#85adff] text-[#002150] font-black px-6 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(133,173,255,0.3)] transition-all"
        >
          <ShoppingCart size={18} /> Nueva Compra
        </button>
      </div>

      <div className="bg-[#091328] rounded-2xl border border-[#40485d]/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f1930] text-[#a3aac4] text-[10px] uppercase tracking-widest font-black">
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
                <tr key={purchase.id} className="hover:bg-[#141f38]/40 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-[#85adff] font-black">{purchase.orderNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-[#dee5ff]">{purchase.supplierName}</p>
                      <p className="text-[10px] text-[#a3aac4] uppercase">{new Date(purchase.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg ${getStatusColor(purchase.status)}`}>
                      {purchase.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs text-[#a3aac4] font-bold">
                      {purchase.items.length} sku(s)
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-black text-[#dee5ff] text-base">S/ {purchase.totalAmount?.toFixed(2)}</p>
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
                      <button className="p-2 text-[#40485d] hover:text-[#dee5ff] transition-colors"><MoreVertical size={16} /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-[#40485d] italic">No hay órdenes de compra registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nueva OC */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSaving && setShowModal(false)}></div>
          <form 
            onSubmit={handleAddSubmit}
            className="bg-[#0f1930] w-full max-w-2xl border border-[#40485d]/30 rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in duration-300 flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-[#40485d]/20 flex justify-between items-center bg-[#091328]/50">
              <h3 className="font-black text-[#dee5ff] uppercase tracking-wider text-sm flex items-center gap-2">
                <ShoppingCart size={18} className="text-[#85adff]" />
                Nueva Orden de Compra
              </h3>
              <button type="button" onClick={() => setShowModal(false)} disabled={isSaving} className="text-[#a3aac4] hover:text-white transition-colors">
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
                  <label className="text-[10px] font-black text-[#a3aac4] uppercase">Proveedor</label>
                  <select required disabled={isSaving} value={formData.supplierId}
                    onChange={(e) => setFormData({...formData, supplierId: e.target.value})}
                    className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-xl px-4 py-3 text-[#dee5ff] focus:border-[#85adff] outline-none disabled:opacity-50 font-bold"
                  >
                    <option value="">Seleccionar Proveedor...</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.taxId})</option>)}
                  </select>
                </div>

                <div className="space-y-4 md:col-span-2 p-4 bg-[#141f38]/50 rounded-2xl border border-[#40485d]/10">
                  <p className="text-[10px] font-black text-[#85adff] uppercase">Añadir Productos</p>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}
                      className="md:col-span-2 bg-[#0f1930] border border-[#40485d]/30 rounded-lg px-3 py-2 text-xs text-[#dee5ff] outline-none"
                    >
                      <option value="">Seleccionar Producto...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>)}
                    </select>
                    <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Cant." className="bg-[#0f1930] border border-[#40485d]/30 rounded-lg px-3 py-2 text-xs text-[#dee5ff]" />
                    <input type="number" min="0" step="0.01" value={cost} onChange={(e) => setCost(e.target.value)}
                      placeholder="Costo S/" className="bg-[#0f1930] border border-[#40485d]/30 rounded-lg px-3 py-2 text-xs text-[#dee5ff]" />
                    <button type="button" onClick={handleAddItem} className="md:col-span-4 bg-[#1d2b4a] hover:bg-[#85adff] text-[#dee5ff] hover:text-[#002150] font-bold py-2 rounded-lg transition-all text-xs flex items-center justify-center gap-2">
                       <Plus size={14} /> Añadir a la lista
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black text-[#a3aac4] uppercase">Items en la Orden</label>
                   <div className="border border-[#40485d]/20 rounded-xl overflow-hidden">
                      <table className="w-full text-[11px]">
                         <thead className="bg-[#141f38] text-[#a3aac4]">
                            <tr>
                               <th className="px-3 py-2 text-left">Producto</th>
                               <th className="px-3 py-2 text-center">Cant.</th>
                               <th className="px-3 py-2 text-right">Costo</th>
                               <th className="px-3 py-2 text-right">Subtotal</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-[#40485d]/10">
                            {formData.items.map((item, idx) => (
                              <tr key={idx} className="text-[#dee5ff]">
                                 <td className="px-3 py-2 font-bold">{item.name} <span className="text-[9px] text-[#a3aac4] block">{item.sku}</span></td>
                                 <td className="px-3 py-2 text-center">{item.quantity}</td>
                                 <td className="px-3 py-2 text-right">S/ {item.cost.toFixed(2)}</td>
                                 <td className="px-3 py-2 text-right font-black">S/ {(item.quantity * item.cost).toFixed(2)}</td>
                              </tr>
                            ))}
                            {formData.items.length === 0 && (
                              <tr><td colSpan="4" className="px-3 py-8 text-center text-[#40485d] italic">No hay productos en la lista.</td></tr>
                            )}
                         </tbody>
                         <tfoot className="bg-[#141f38]/50 border-t border-[#40485d]/30">
                            <tr>
                               <td colSpan="3" className="px-3 py-3 text-right text-[#a3aac4] font-black uppercase">Total estimado</td>
                               <td className="px-3 py-3 text-right text-[#85adff] font-black text-lg">S/ {formData.totalAmount.toFixed(2)}</td>
                            </tr>
                         </tfoot>
                      </table>
                   </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#141f38] flex gap-4 mt-auto">
              <button type="button" onClick={() => setShowModal(false)} disabled={isSaving}
                className="flex-1 px-4 py-3 rounded-xl font-bold text-[#a3aac4] hover:bg-[#0f1930] transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button type="submit" disabled={isSaving || formData.items.length === 0}
                className="flex-[2] bg-[#85adff] text-[#002150] font-black px-4 py-3 rounded-xl hover:shadow-[0_0_15px_rgba(133,173,255,0.4)] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
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
