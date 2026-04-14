import { useState } from 'react';
import { useSales } from './useSales';
import { useCrm } from '../crm/useCrm';
import { useInventory } from '../inventory/useInventory';
import { useFinance } from '../finance/useFinance';
import { useAuth } from '../../../context/AuthContext';
import { 
  FileText, Plus, Search, Filter, 
  DollarSign, Loader2, X, AlertCircle, ShoppingCart, TrendingUp, PackageX
} from 'lucide-react';

export default function SalesModule() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  
  // -- Data Hooks --
  const { sales, loading: loadingSales, addSale } = useSales(orgId);
  const { contacts, loading: loadingCrm } = useCrm(orgId);
  const { products, loading: loadingInv, updateProductStock } = useInventory(orgId);
  const { addTransaction } = useFinance(orgId);

  // -- Modal State --
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // -- Form State --
  const [selectedClient, setSelectedClient] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Calcula totales del cart local
  const cartSubtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const igv = cartSubtotal * 0.18; // Asumiendo IGV 18% para ejemplo
  const cartTotal = cartSubtotal + igv;

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    const prod = products.find(p => p.id === selectedProduct);
    if (prod) {
      // Calcular cuántas unidades ya están en el carrito para este producto
      const alreadyInCart = cart
        .filter(i => i.productId === prod.id)
        .reduce((acc, i) => acc + i.quantity, 0);
      const stockDisponible = (prod.stock || 0) - alreadyInCart;
      const qty = parseInt(quantity);

      if (qty > stockDisponible) {
        alert(`Stock insuficiente. Solo hay ${stockDisponible} unidad(es) disponibles de "${prod.name}".`);
        return;
      }

      const price = parseFloat(prod.price.toString().replace(/[^0-9.-]+/g,"")); // Limpiar precio tipo $85.00
      setCart([
        ...cart, 
        { 
          productId: prod.id, 
          name: prod.name, 
          quantity: qty, 
          price: price,
          subtotal: price * qty
        }
      ]);
      setSelectedProduct('');
      setQuantity(1);
    }
  };

  const handleRemoveFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClient || cart.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const clientRecord = contacts.find(c => c.id === selectedClient) || { name: 'Cliente Desconocido', company: '' };
      
      const newSaleData = {
        clientId: selectedClient,
        clientName: clientRecord.name,
        company: clientRecord.company,
        items: cart,
        subtotal: cartSubtotal,
        tax: igv,
        totalAmount: cartTotal,
        status: 'Pendiente'
      };
      
      await addSale(newSaleData);

      // [INTEGRACIÓN → INVENTARIO] Descontar stock de cada producto vendido
      for (const item of cart) {
        const prod = products.find(p => p.id === item.productId);
        if (prod) {
          const nuevoStock = Math.max(0, (prod.stock || 0) - item.quantity);
          await updateProductStock(item.productId, nuevoStock);
        }
      }

      // [INTEGRACIÓN → FINANZAS] Registrar ingreso automático por la venta
      await addTransaction({
        type: 'income',
        amount: cartTotal,
        category: 'Ventas',
        description: `Venta a ${clientRecord.name}${clientRecord.company ? ` (${clientRecord.company})` : ''}`,
        date: new Date().toISOString(),
        source: 'sales_module',
      });
      
      setCart([]);
      setSelectedClient('');
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error al emitir factura", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // KPIs
  const totalSalesThisMonth = sales.filter(s => s.status === 'Pagada').reduce((acc, curr) => acc + curr.totalAmount, 0);
  const pendingCollection = sales.filter(s => s.status === 'Pendiente').reduce((acc, curr) => acc + curr.totalAmount, 0);
  
  const loading = loadingSales || loadingCrm || loadingInv;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-[#85adff]">
        <Loader2 className="animate-spin mr-2" /> Cargando Módulos de Venta...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-[#dee5ff] mb-2 tracking-tight">Facturación y Ventas</h2>
          <p className="text-[#a3aac4]">Emisión de recibos y control de pagos recibidos.</p>
        </div>
        <button 
          onClick={() => { setCart([]); setIsModalOpen(true); }}
          className="bg-gradient-to-br from-[#85ffab] to-[#3dbd5d] text-[#002b11] font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(133,255,171,0.3)] transition-all"
        >
          <Plus size={18} /> Nueva Factura
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#141f38] p-6 rounded-2xl border border-[#40485d]/20 flex items-center gap-5">
           <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1d2b4a] to-[#091328] flex items-center justify-center text-[#85adff] shadow-inner">
             <TrendingUp size={24} />
           </div>
           <div>
             <p className="text-xs font-black text-[#a3aac4] tracking-widest uppercase mb-1">Pagos Cobrados</p>
             <h3 className="text-2xl font-black text-[#dee5ff]">${totalSalesThisMonth.toFixed(2)}</h3>
           </div>
        </div>
        <div className="bg-[#141f38] p-6 rounded-2xl border border-[#40485d]/20 flex items-center gap-5">
           <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2a1b1a] to-[#1a0a0a] flex items-center justify-center text-[#ff716c] shadow-inner">
             <AlertCircle size={24} />
           </div>
           <div>
             <p className="text-xs font-black text-[#a3aac4] tracking-widest uppercase mb-1">Por Cobrar</p>
             <h3 className="text-2xl font-black text-[#dee5ff]">${pendingCollection.toFixed(2)}</h3>
           </div>
        </div>
        <div className="bg-[#141f38] p-6 rounded-2xl border border-[#40485d]/20 flex items-center gap-5">
           <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1d2b4a] to-[#091328] flex items-center justify-center text-[#85ffab] shadow-inner">
             <FileText size={24} />
           </div>
           <div>
             <p className="text-xs font-black text-[#a3aac4] tracking-widest uppercase mb-1">Volumen Docs</p>
             <h3 className="text-2xl font-black text-[#dee5ff]">{sales.length}</h3>
           </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#091328] rounded-2xl border border-[#40485d]/10 overflow-hidden shadow-2xl">
         <div className="p-4 lg:p-6 border-b border-[#40485d]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3aac4]" size={16} />
            <input 
              type="text" 
              placeholder="Buscar factura o cliente..." 
              className="w-full bg-[#141f38] text-[#dee5ff] text-sm rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-[#85adff] border border-transparent focus:border-[#85adff] transition-all"
            />
          </div>
          <button className="bg-[#141f38] text-[#a3aac4] p-2 rounded-lg hover:text-[#85adff] transition-colors">
            <Filter size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0f1930] text-[#a3aac4] text-[10px] uppercase tracking-widest font-black">
                <th className="px-6 py-5">Nro. Documento</th>
                <th className="px-6 py-5">Cliente</th>
                <th className="px-6 py-5">Items</th>
                <th className="px-6 py-5 text-right">Monto (Total)</th>
                <th className="px-6 py-5 text-center">Rendimiento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#40485d]/10 text-sm">
              {sales.length === 0 ? (
                 <tr><td colSpan="5" className="p-10 text-center text-[#a3aac4]">No hay facturas registradas.</td></tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-[#141f38]/40 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[#85adff] text-xs">
                      {sale.invoiceNumber}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#dee5ff]">{sale.clientName}</p>
                      <p className="text-[10px] text-[#a3aac4]">{new Date(sale.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 text-[#a3aac4]">
                      {sale.items?.length || 0} prod.
                    </td>
                    <td className="px-6 py-4 font-black text-[#dee5ff] text-right">
                      ${sale.totalAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                       {sale.status === 'Pagada' && <span className="inline-flex items-center px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-black tracking-widest uppercase rounded">Pagada</span>}
                       {sale.status === 'Pendiente' && <span className="inline-flex items-center px-2 py-1 bg-yellow-500/10 text-yellow-400 text-[10px] font-black tracking-widest uppercase rounded">Pendiente</span>}
                       {sale.status === 'Borrador' && <span className="inline-flex items-center px-2 py-1 bg-[#40485d]/30 text-[#a3aac4] text-[10px] font-black tracking-widest uppercase rounded">Borrador</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          <div className="bg-[#0f1930] w-full max-w-4xl border border-[#40485d]/30 rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in duration-300 flex flex-col md:flex-row h-[85vh] md:h-auto md:max-h-[85vh]">
            
            {/* Izquierda: Formulario y Selección */}
            <div className="p-6 md:w-1/2 flex flex-col h-full overflow-y-auto border-r border-[#40485d]/30">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-[#dee5ff] uppercase tracking-wider text-sm flex items-center gap-2">
                  <DollarSign size={16} className="text-[#85ffab]" /> Nuevo Documento
                </h3>
              </div>

               <div className="space-y-6">
                 {/* Selector de Cliente */}
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-[#a3aac4] uppercase">Buscar Cliente (CRM)</label>
                   <select 
                     value={selectedClient} 
                     onChange={(e) => setSelectedClient(e.target.value)}
                     className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-xl px-4 py-3 text-[#dee5ff] focus:border-[#85ffab] outline-none text-sm"
                   >
                     <option value="" disabled>Seleccione un cliente registrado...</option>
                     {contacts.map(c => <option key={c.id} value={c.id}>{c.name} {c.company ? `- ${c.company}` : ''}</option>)}
                   </select>
                 </div>

                 <hr className="border-[#40485d]/20" />

                 {/* Selector de Producto */}
                 <div className="bg-[#141f38] p-4 rounded-2xl border border-[#40485d]/20">
                    <label className="text-[10px] font-black text-[#a3aac4] uppercase block mb-3">Agregar Línea de Venta</label>
                    <div className="flex flex-col gap-3">
                      <select 
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full bg-[#0f1930] border border-[#40485d]/30 rounded-lg px-3 py-2 text-[#dee5ff] text-sm"
                      >
                         <option value="" disabled>Seleccionar producto...</option>
                         {products.map(p => {
                           const enCarrito = cart.filter(i => i.productId === p.id).reduce((a, i) => a + i.quantity, 0);
                           const stockReal = (p.stock || 0) - enCarrito;
                           const agotado = stockReal <= 0;
                           return (
                             <option key={p.id} value={p.id} disabled={agotado}>
                               {p.sku} | {p.name} ({p.price}) — Stock: {stockReal}{agotado ? ' ⚠ AGOTADO' : ''}
                             </option>
                           );
                         })}
                      </select>
                      <div className="flex gap-2">
                        <input 
                          type="number" min="1" 
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="w-20 bg-[#0f1930] border border-[#40485d]/30 rounded-lg px-3 py-2 text-[#dee5ff] text-sm text-center"
                        />
                        <button 
                          type="button"
                          onClick={handleAddToCart}
                          disabled={!selectedProduct}
                          className="flex-1 bg-[#85adff]/10 text-[#85adff] border border-[#85adff]/20 rounded-lg font-bold hover:bg-[#85adff] hover:text-[#0f1930] transition-colors disabled:opacity-50"
                        >
                          Añadir a Factura
                        </button>
                      </div>
                    </div>
                 </div>
               </div>
            </div>

            {/* Derecha: Resumen de Factura */}
            <div className="p-6 md:w-1/2 flex flex-col bg-[#091328] relative">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-[#a3aac4] hover:text-white bg-[#141f38] p-2 rounded-full"
              >
                <X size={16}/>
              </button>

              <h4 className="font-bold text-[#dee5ff] mb-4 flex items-center gap-2 text-sm mt-4 md:mt-0">
                <ShoppingCart size={16} /> Resumen de Compra
              </h4>

              <div className="flex-1 overflow-y-auto mb-6">
                {cart.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[#a3aac4] text-xs font-medium">
                    No hay productos agregados.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item, idx) => (
                      <div key={idx} className="bg-[#141f38] p-3 rounded-lg flex justify-between items-center text-sm border border-[#40485d]/10">
                        <div>
                          <p className="font-bold text-[#dee5ff]">{item.name}</p>
                          <p className="text-[10px] text-[#a3aac4]">{item.quantity} und. x ${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-black text-[#dee5ff]">${item.subtotal.toFixed(2)}</span>
                          <button onClick={() => handleRemoveFromCart(idx)} className="text-red-400 hover:text-red-300"><X size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totales */}
              <div className="border-t border-[#40485d]/30 pt-4 space-y-2 mb-6">
                 <div className="flex justify-between text-xs text-[#a3aac4] font-bold">
                   <span>Subtotal</span><span>${cartSubtotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-xs text-[#a3aac4] font-bold">
                   <span>Impuestos (18%)</span><span>${igv.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-lg text-[#dee5ff] font-black pt-2">
                   <span>TOTAL</span><span className="text-[#85ffab]">${cartTotal.toFixed(2)}</span>
                 </div>
              </div>

              <div className="flex gap-3">
                 <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-[#a3aac4] border border-[#40485d]/30 hover:bg-[#141f38] transition-colors"
                >
                  Desechar
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || cart.length === 0 || !selectedClient}
                  className="flex-[2] bg-[#85ffab] text-[#002b11] font-black px-4 py-3 rounded-xl hover:shadow-[0_0_15px_rgba(133,255,171,0.4)] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Emitir Factura'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
