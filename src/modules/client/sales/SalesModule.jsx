import { useState } from 'react';
import { useSales } from './useSales';
import { useCrm } from '../crm/useCrm';
import { useInventory } from '../inventory/useInventory';
import { useFinance } from '../finance/useFinance';
import { useAuth } from '../../../context/AuthContext';
import { 
  FileText, Plus, Search, Filter, 
  DollarSign, Loader2, X, AlertCircle, ShoppingCart, TrendingUp, PackageX, CheckCircle
} from 'lucide-react';
import LoadingScreen from '../../../components/LoadingScreen';

export default function SalesModule() {
  const { user, formatPrice } = useAuth();
  const orgId = user?.organizationId || "default_org";
  
  // -- Data Hooks --
  const { sales, loading: loadingSales, addSale, updateSaleStatus, deleteSale } = useSales(orgId);
  const { contacts, loading: loadingCrm } = useCrm(orgId);
  const { products, loading: loadingInv, updateProductStock } = useInventory(orgId);
  const { addTransaction } = useFinance(orgId);

  // -- Modal State --
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceToPrint, setInvoiceToPrint] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // -- Form State --
  const [selectedClient, setSelectedClient] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedDocType, setSelectedDocType] = useState('Factura');
  const [issueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');

  // Función para calcular estado de vencimiento
  const getDueStatus = (dueDateValue, status) => {
    if (status === 'Pagada') return { text: 'Al día', color: 'text-green-400 bg-green-400/10' };
    
    // Convertir de Firestore Timestamp si es necesario
    const dueDate = dueDateValue?.toDate ? dueDateValue.toDate() : new Date(dueDateValue);
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const due = new Date(dueDate);
    due.setHours(0,0,0,0);
    
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { 
        text: `Retraso (${Math.abs(diffDays)}d)`, 
        color: 'text-red-400 bg-red-400/10' 
      };
    } else if (diffDays === 0) {
      return { 
        text: 'Vence hoy', 
        color: 'text-orange-400 bg-orange-400/10' 
      };
    } else {
      return { 
        text: `${diffDays} restantes`, 
        color: 'text-[var(--color-primary)] bg-[#6B4FD8]/10' 
      };
    }
  };

  // Helper para formatear fechas de forma segura (Firestore o JS Date)
  const formatDate = (dateValue) => {
    if (!dateValue) return "---";
    const d = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
    return isNaN(d.getTime()) ? "---" : d.toLocaleDateString();
  };

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
        status: 'Pendiente',
        documentType: selectedDocType,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate)
      };
      
      await addSale(newSaleData);

      // [INTEGRACIONES] - Las envolvemos en un try/catch interno para que no bloqueen el cierre del modal 
      // si la venta principal ya se guardó correctamente.
      try {
        // 1. [INTEGRACIÓN → INVENTARIO] Descontar stock
        for (const item of cart) {
          const prod = products.find(p => p.id === item.productId);
          if (prod) {
            const nuevoStock = Math.max(0, (prod.stock || 0) - item.quantity);
            await updateProductStock(item.productId, nuevoStock);
          }
        }

        // 2. [INTEGRACIÓN → FINANZAS] Registrar ingreso automático si la venta se marca Pagada
        if (newSaleData.status === 'Pagada') {
          await addTransaction({
            type: 'income',
            amount: cartTotal,
            category: 'Ventas',
            description: `Venta ${selectedDocType} a ${clientRecord.name}${clientRecord.company ? ` (${clientRecord.company})` : ''}`,
            date: new Date().toISOString(),
            source: 'sales_module',
          });
        }
      } catch (integrationError) {
        console.error("Error en integraciones post-venta:", integrationError);
        // No relanzamos el error para permitir que el flujo de UI continúe
      }
      
      // Limpieza y cierre de modal
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
    return <LoadingScreen fullScreen={false} message="Cargando Módulos de Venta..." />;
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4">
        <div className="flex gap-3">
          <button 
            onClick={() => { setSelectedDocType('Boleta'); setCart([]); setIsModalOpen(true); }}
            className="bg-[var(--color-surface-container)] text-[var(--color-primary)] font-bold px-6 py-2.5 rounded-xl border border-[#6B4FD8]/20 hover:bg-[#6B4FD8]/10 transition-all text-sm"
          >
            Emitir Boleta
          </button>
          <button 
            onClick={() => { setSelectedDocType('Factura'); setCart([]); setIsModalOpen(true); }}
            className="bg-[#6B4FD8] text-[#0f0f0f] font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(133,173,255,0.3)] transition-all text-sm"
          >
            <Plus size={18} /> Emitir Factura
          </button>
        </div>
      </div>

      {/* KPI Stats - Ocultos en móvil */}
      <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-surface-container)] p-6 rounded-2xl border border-[#40485d]/20 flex items-center gap-5">
           <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-surface-container)] to-[var(--color-surface-container-low)] flex items-center justify-center text-[var(--color-primary)] shadow-inner">
             <TrendingUp size={24} />
           </div>
           <div>
             <p className="text-xs font-black text-[var(--color-on-surface-variant)] tracking-widest uppercase mb-1">Pagos Cobrados</p>
             <h3 className="text-2xl font-black text-[var(--color-on-surface)]">{formatPrice(totalSalesThisMonth)}</h3>
           </div>
        </div>
        <div className="bg-[var(--color-surface-container)] p-6 rounded-2xl border border-[#40485d]/20 flex items-center gap-5">
           <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2a1b1a] to-[#1a0a0a] flex items-center justify-center text-[#ff716c] shadow-inner">
             <AlertCircle size={24} />
           </div>
           <div>
             <p className="text-xs font-black text-[var(--color-on-surface-variant)] tracking-widest uppercase mb-1">Por Cobrar</p>
             <h3 className="text-2xl font-black text-[var(--color-on-surface)]">{formatPrice(pendingCollection)}</h3>
           </div>
        </div>
        <div className="bg-[var(--color-surface-container)] p-6 rounded-2xl border border-[#40485d]/20 flex items-center gap-5">
           <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-surface-container)] to-[var(--color-surface-container-low)] flex items-center justify-center text-[#85ffab] shadow-inner">
             <FileText size={24} />
           </div>
           <div>
             <p className="text-xs font-black text-[var(--color-on-surface-variant)] tracking-widest uppercase mb-1">Volumen Docs</p>
             <h3 className="text-2xl font-black text-[var(--color-on-surface)]">{sales.length}</h3>
           </div>
        </div>
      </div>

      {/* Main Sales List */}
      <div className="w-full">
         <div className="py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" size={16} />
            <input 
              type="text" 
              placeholder="Buscar factura o cliente..." 
              className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-[#6B4FD8] border border-transparent focus:border-[#6B4FD8] transition-all"
            />
          </div>
          <button className="bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] p-2 rounded-lg hover:text-[var(--color-primary)] transition-colors">
            <Filter size={20} />
          </button>
        </div>

        <div className="overflow-x-auto -mx-4 md:mx-0 border-y md:border border-[var(--color-outline-variant)] md:rounded-xl bg-transparent md:bg-[var(--color-surface-container-low)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] text-[10px] uppercase tracking-widest font-black">
                <th className="px-6 py-5">Documento</th>
                <th className="px-6 py-5">Detalle</th>
                <th className="px-6 py-5 text-center">Emisión</th>
                <th className="px-6 py-5 text-center">Vencimiento</th>
                <th className="px-6 py-5 text-center">Estado / Días</th>
                <th className="px-6 py-5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#40485d]/10 text-sm">
              {sales.length === 0 ? (
                 <tr><td colSpan="6" className="p-10 text-center text-[var(--color-on-surface-variant)]">No hay facturas registradas.</td></tr>
              ) : (
                 sales.map((sale) => {
                   const dueInfo = getDueStatus(sale.dueDate, sale.status);
                   return (
                    <tr key={sale.id} className="hover:bg-[var(--color-surface-container)]/40 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-[10px] block font-black text-[var(--color-on-surface-variant)] mb-1">{sale.documentType?.toUpperCase()}</span>
                        <p className="font-mono font-bold text-[var(--color-primary)] text-xs">{sale.invoiceNumber}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-[var(--color-on-surface)]">{sale.clientName}</p>
                        <p className="text-[10px] text-[var(--color-on-surface-variant)]">{sale.items?.length || 0} productos</p>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-[var(--color-on-surface)] text-xs">
                        {formatDate(sale.issueDate || sale.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-[var(--color-on-surface-variant)] text-xs">
                        {formatDate(sale.dueDate || sale.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          {sale.status === 'Pagada' && <span className="inline-flex items-center px-1.5 py-0.5 bg-green-500/10 text-green-400 text-[9px] font-black tracking-widest uppercase rounded">Pagada</span>}
                          {sale.status === 'Pendiente' && <span className="inline-flex items-center px-1.5 py-0.5 bg-yellow-500/10 text-yellow-400 text-[9px] font-black tracking-widest uppercase rounded">Pendiente</span>}
                          {sale.status === 'Borrador' && <span className="inline-flex items-center px-1.5 py-0.5 bg-[#40485d]/30 text-[var(--color-on-surface-variant)] text-[9px] font-black tracking-widest uppercase rounded">Borrador</span>}
                          {sale.status === 'Anulada' && <span className="inline-flex items-center px-1.5 py-0.5 bg-red-500/10 text-red-400 text-[9px] font-black tracking-widest uppercase rounded">Anulada</span>}
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${dueInfo.color}`}>{dueInfo.text}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-[var(--color-on-surface)] text-right">
                        <div className="flex flex-col items-end">
                          <span>{formatPrice(sale.totalAmount || 0)}</span>
                          <div className="flex gap-2 mt-2 transition-opacity">
                            {sale.status === 'Pendiente' && (
                              <button 
                                onClick={async () => {
                                  await updateSaleStatus(sale.id, 'Pagada');
                                  // Registrar transacción al cobrar
                                  await addTransaction({
                                    type: 'income',
                                    amount: sale.totalAmount,
                                    category: 'Ventas',
                                    description: `Cobro ${sale.documentType} ${sale.invoiceNumber}`,
                                    date: new Date().toISOString(),
                                    source: 'sales_module',
                                  });
                                  setInvoiceToPrint(sale);
                                }}
                                className="text-[9px] font-black uppercase tracking-tighter bg-green-500/20 text-green-400 px-2 py-0.5 border border-green-500/20 rounded hover:bg-green-500 hover:text-white transition-all shadow-sm"
                              >
                                Pagado
                              </button>
                            )}
                            {(sale.status === 'Pendiente' || sale.status === 'Borrador') && (
                              <button 
                                onClick={() => {
                                  if (window.confirm('¿Estás seguro de que deseas anular y ELIMINAR este registro definitivamente?')) {
                                    deleteSale(sale.id);
                                  }
                                }}
                                className="text-[9px] font-black uppercase tracking-tighter bg-red-500/20 text-red-400 px-2 py-0.5 border border-red-500/20 rounded hover:bg-red-500 hover:text-white transition-all shadow-sm"
                              >
                                Anular
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                   );
                 })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          <div className="bg-[var(--color-surface-variant)] w-full max-w-4xl border border-[var(--color-outline-variant)] rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in duration-300 flex flex-col md:flex-row h-[85vh] md:h-auto md:max-h-[85vh]">
            
            {/* Izquierda: Formulario y Selección */}
            <div className="p-6 md:w-1/2 flex flex-col h-full overflow-y-auto border-r border-[var(--color-outline-variant)]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm flex items-center gap-2">
                  <DollarSign size={16} className="text-[#85ffab]" /> Emitir {selectedDocType}
                </h3>
              </div>

               <div className="space-y-6">
                 {/* Selector de Cliente */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Buscar Cliente (CRM)</label>
                    <select 
                      value={selectedClient} 
                      onChange={(e) => {
                        const cid = e.target.value;
                        setSelectedClient(cid);
                        const client = contacts.find(c => c.id === cid);
                        const days = client?.creditDays || 0;
                        const computed = new Date();
                        computed.setDate(computed.getDate() + days);
                        setDueDate(computed.toISOString().split('T')[0]);
                      }}
                      className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] focus:border-[#85ffab] outline-none text-sm"
                    >
                      <option value="" disabled>Seleccione un cliente registrado...</option>
                      {contacts.map(c => <option key={c.id} value={c.id}>{c.name} {c.company ? `- ${c.company}` : ''}</option>)}
                    </select>
                    {selectedClient && (
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[9px] font-bold text-[var(--color-primary)]">Emisión: {issueDate}</span>
                        <span className="text-[9px] font-bold text-orange-400">Vence: {dueDate}</span>
                      </div>
                    )}
                  </div>

                 <hr className="border-[#40485d]/20" />

                 {/* Selector de Producto */}
                 <div className="bg-[var(--color-surface-container)] p-4 rounded-2xl border border-[#40485d]/20">
                    <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-3">Agregar Línea de Venta</label>
                    <div className="flex flex-col gap-3">
                      <select 
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full bg-[var(--color-surface-variant)] border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 text-[var(--color-on-surface)] text-sm"
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
                          className="w-20 bg-[var(--color-surface-variant)] border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 text-[var(--color-on-surface)] text-sm text-center"
                        />
                        <button 
                          type="button"
                          onClick={handleAddToCart}
                          disabled={!selectedProduct}
                          className="flex-1 bg-[#6B4FD8]/10 text-[var(--color-primary)] border border-[#6B4FD8]/20 rounded-lg font-bold hover:bg-[#6B4FD8] hover:text-[#0f1930] transition-colors disabled:opacity-50"
                        >
                          Añadir a Factura
                        </button>
                      </div>
                    </div>
                 </div>
               </div>
            </div>

            {/* Derecha: Resumen de Factura */}
            <div className="p-6 md:w-1/2 flex flex-col bg-[var(--color-surface-container-low)] relative">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-[var(--color-on-surface-variant)] hover:text-white bg-[var(--color-surface-container)] p-2 rounded-full"
              >
                <X size={16}/>
              </button>

              <h4 className="font-bold text-[var(--color-on-surface)] mb-4 flex items-center gap-2 text-sm mt-4 md:mt-0">
                <ShoppingCart size={16} /> Resumen de Compra
              </h4>

              <div className="flex-1 overflow-y-auto mb-6">
                {cart.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-[var(--color-on-surface-variant)] text-xs font-medium">
                    No hay productos agregados.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item, idx) => (
                      <div key={idx} className="bg-[var(--color-surface-container)] p-3 rounded-lg flex justify-between items-center text-sm border border-[var(--color-outline-variant)]">
                        <div>
                          <p className="font-bold text-[var(--color-on-surface)]">{item.name}</p>
                          <p className="text-[10px] text-[var(--color-on-surface-variant)]">{item.quantity} und. x {formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-black text-[var(--color-on-surface)]">{formatPrice(item.subtotal)}</span>
                          <button onClick={() => handleRemoveFromCart(idx)} className="text-red-400 hover:text-red-300"><X size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Totales */}
              <div className="border-t border-[var(--color-outline-variant)] pt-4 space-y-2 mb-6">
                 <div className="flex justify-between text-xs text-[var(--color-on-surface-variant)] font-bold">
                   <span>Subtotal</span><span>{formatPrice(cartSubtotal)}</span>
                 </div>
                 <div className="flex justify-between text-xs text-[var(--color-on-surface-variant)] font-bold">
                   <span>Impuestos (18%)</span><span>{formatPrice(igv)}</span>
                 </div>
                 <div className="flex justify-between text-lg text-[var(--color-on-surface)] font-black pt-2">
                   <span>TOTAL</span><span className="text-[#85ffab]">{formatPrice(cartTotal)}</span>
                 </div>
              </div>

              <div className="flex gap-3">
                 <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-bold text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container)] transition-colors"
                >
                  Desechar
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || cart.length === 0 || !selectedClient}
                  className="flex-[2] bg-[#85ffab] text-[#002b11] font-black px-4 py-3 rounded-xl hover:shadow-[0_0_15px_rgba(133,255,171,0.4)] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : `Emitir ${selectedDocType}`}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* PRINT MODAL: Post-Payment Confirmation */}
      {invoiceToPrint && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setInvoiceToPrint(null)}></div>
          <div className="bg-[var(--color-surface-variant)] w-full max-w-sm border border-[var(--color-outline-variant)] rounded-3xl shadow-[0_0_50px_rgba(133,255,171,0.15)] overflow-hidden relative animate-in zoom-in duration-300 flex flex-col p-8 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 mx-auto mb-6 shadow-glow-green">
              <CheckCircle size={40} />
            </div>
            
            <h3 className="text-2xl font-black text-[var(--color-on-surface)] mb-2">¡Venta Confirmada!</h3>
            <p className="text-[var(--color-on-surface-variant)] text-sm mb-8">El pago ha sido registrado con éxito. ¿Deseas imprimir el comprobante ahora?</p>
            
            <div className="bg-[var(--color-surface-container)] rounded-2xl p-4 border border-[#40485d]/20 mb-8 text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-black text-[#65739e] uppercase">{invoiceToPrint.documentType}</span>
                <span className="font-mono text-xs font-bold text-[var(--color-primary)]">{invoiceToPrint.invoiceNumber}</span>
              </div>
              <p className="font-bold text-[var(--color-on-surface)] text-base truncate">{invoiceToPrint.clientName}</p>
              <div className="mt-3 pt-3 border-t border-[#40485d]/20 flex justify-between items-end">
                <span className="text-[10px] font-black text-[#65739e] uppercase">Total Pagado</span>
                <span className="text-xl font-black text-[#85ffab]">{formatPrice(invoiceToPrint.totalAmount || 0)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.print()}
                className="w-full bg-[#85ffab] text-[#002b11] font-black py-4 rounded-2xl hover:shadow-[0_0_20px_rgba(133,255,171,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <FileText size={20} /> Imprimir Comprobante
              </button>
              <button 
                onClick={() => setInvoiceToPrint(null)}
                className="w-full py-3 rounded-2xl font-bold text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
              >
                Cerrar y continuar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
