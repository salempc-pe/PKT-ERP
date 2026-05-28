import { useState } from 'react';
import { Check, X, ShoppingCart, Archive, AlertTriangle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSales } from '../modules/client/sales/useSales';
import { useInventory } from '../modules/client/inventory/useInventory';
import './AiActionCard.css';

/**
 * Componente que representa una Tarjeta de Confirmación de Acción generada por la IA (Veló AI).
 * Conecta las intenciones de la IA con la base de datos real de Firestore de forma aislada (multi-tenant).
 */
export default function AiActionCard({ action }) {
  const { user } = useAuth();
  const orgId = user?.organizationId || 'default_org';

  // Consumir hooks de negocio locales del ERP
  const { addSale } = useSales(orgId);
  const { products, updateProductStock } = useInventory(orgId);

  const [status, setStatus] = useState('pending'); // 'pending' | 'executing' | 'confirmed' | 'cancelled'
  const [error, setError] = useState(null);

  if (!action || !action.type || !action.payload) return null;

  const { type, payload } = action;

  /**
   * Ejecuta la transacción real en Firestore tras la confirmación física del usuario.
   */
  const handleConfirm = async () => {
    setStatus('executing');
    setError(null);

    try {
      if (type === 'CREATE_SALE') {
        const itemsToSave = [];

        // 1. Descontar stock real en el inventario para cada producto vendido
        for (const item of payload.items || []) {
          // Buscar producto en la base de datos por nombre
          const matchProduct = products.find(
            (p) => p.name.toLowerCase().trim() === item.name.toLowerCase().trim()
          );

          if (matchProduct) {
            const currentStock = Number(matchProduct.stock) || 0;
            const quantityToDeduct = Number(item.quantity) || 0;

            if (currentStock < quantityToDeduct) {
              throw new Error(`Stock insuficiente para '${item.name}'. Disponible: ${currentStock}.`);
            }

            const newStock = currentStock - quantityToDeduct;
            // Descontar del inventario
            await updateProductStock(matchProduct.id, newStock);
            
            itemsToSave.push({
              productId: matchProduct.id,
              name: matchProduct.name,
              quantity: quantityToDeduct,
              price: Number(matchProduct.price) || Number(item.price) || 45.00
            });
          } else {
            // Si el producto no existe en base de datos, registrar con ID provisional
            itemsToSave.push({
              productId: item.productId || 'provisional',
              name: item.name,
              quantity: Number(item.quantity) || 1,
              price: Number(item.price) || 45.00
            });
          }
        }

        // 2. Registrar la factura/boleta en Firestore
        const saleData = {
          clientName: payload.clientName,
          documentType: "Factura", // Por defecto factura
          status: "Pagada", // Marcar pagada para sincronizar con Finanzas
          items: itemsToSave,
          totalAmount: Number(payload.total) || itemsToSave.reduce((acc, i) => acc + (i.quantity * i.price), 0)
        };

        await addSale(saleData);

      } else if (type === 'DEDUCT_INVENTORY') {
        // Descontar material de bodega por merma/rotura
        const matchProduct = products.find(
          (p) => p.name.toLowerCase().trim() === payload.productName.toLowerCase().trim()
        );

        if (!matchProduct) {
          throw new Error(`El material '${payload.productName}' no se encuentra en el inventario.`);
        }

        const currentStock = Number(matchProduct.stock) || 0;
        const quantityToDeduct = Number(payload.quantity) || 0;

        if (currentStock < quantityToDeduct) {
          throw new Error(`Stock insuficiente en bodega para egresar '${payload.productName}'. Disponible: ${currentStock}.`);
        }

        const newStock = currentStock - quantityToDeduct;
        await updateProductStock(matchProduct.id, newStock);
      }

      setStatus('confirmed');
    } catch (err) {
      console.error("❌ Error de confirmación de IA:", err);
      setError(err.message || "Error interno al impactar la base de datos.");
      setStatus('pending');
    }
  };

  const handleCancel = () => {
    setStatus('cancelled');
  };

  return (
    <div className={`ai-action-card border shadow-sm rounded-2xl p-4 my-2 transition-all animate-in zoom-in duration-300 ${status}`}>
      
      {/* Cabecera */}
      <div className="ai-card-header">
        <div className="ai-card-title flex items-center gap-2">
          {type === 'CREATE_SALE' && <ShoppingCart size={15} className="text-[#6B4FD8]" />}
          {type === 'DEDUCT_INVENTORY' && <Archive size={15} className="text-amber-500" />}
          {type === 'QUERY_STOCK' && <Sparkles size={15} className="text-blue-500" />}
          <h4>
            {type === 'CREATE_SALE' && "Confirmar Emisión de Factura"}
            {type === 'DEDUCT_INVENTORY' && "Confirmar Salida de Bodega"}
            {type === 'QUERY_STOCK' && "Stock Disponible"}
          </h4>
        </div>
      </div>

      {/* Detalle visual */}
      <div className="ai-card-body my-3">
        {type === 'CREATE_SALE' && (
          <div className="ai-sale-details text-xs space-y-2">
            <p className="font-black text-[#002150]">Cliente: <span className="opacity-80 font-bold">{payload.clientName}</span></p>
            <div className="ai-table-container border rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[var(--color-surface-variant)] text-[9px] font-black uppercase tracking-wider">
                  <tr>
                    <th className="p-2">Ítem</th>
                    <th className="p-2 text-right">Cant.</th>
                    <th className="p-2 text-right">Precio</th>
                  </tr>
                </thead>
                <tbody className="opacity-90">
                  {payload.items?.map((item, idx) => (
                    <tr key={idx} className="border-t border-color-mix">
                      <td className="p-2 font-semibold">{item.name}</td>
                      <td className="p-2 text-right font-black">{item.quantity}</td>
                      <td className="p-2 text-right opacity-80">${Number(item.price || 45).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center pt-2 font-black border-t border-dashed">
              <span>Total a pagar:</span>
              <span className="text-[#6B4FD8] text-sm">${Number(payload.total).toFixed(2)}</span>
            </div>
          </div>
        )}

        {type === 'DEDUCT_INVENTORY' && (
          <div className="ai-deduct-details text-xs space-y-2 text-[#002150]">
            <div className="flex justify-between">
              <span className="font-bold">Material:</span>
              <span className="font-black opacity-80">{payload.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Cantidad a egresar:</span>
              <span className="font-black text-red-500">{payload.quantity} unidades</span>
            </div>
            <div className="flex justify-between border-t border-dashed pt-2">
              <span className="font-bold">Motivo del egreso:</span>
              <span className="opacity-85 font-semibold">{payload.reason}</span>
            </div>
          </div>
        )}

        {type === 'QUERY_STOCK' && (
          <div className="ai-stock-details text-xs space-y-2 text-[#002150]">
            <div className="flex justify-between">
              <span className="font-bold">Producto/Insumo:</span>
              <span className="font-black opacity-80">{payload.productName}</span>
            </div>
            <div className="flex justify-between items-center border-t border-dashed pt-2">
              <span className="font-bold">Existencia Física:</span>
              <span className="font-black text-xs text-[#6B4FD8] bg-[#6B4FD8]/10 px-2 py-0.5 rounded-full">
                {payload.stock} unidades
              </span>
            </div>
            <p className="text-[10px] opacity-50 font-semibold">{payload.warehouse || "Almacén Principal"}</p>
          </div>
        )}
      </div>

      {/* Footer / Botones */}
      <div className="ai-card-footer flex justify-end gap-2 border-t border-dashed pt-3 mt-2">
        {status === 'pending' && (
          <>
            {type !== 'QUERY_STOCK' ? (
              <>
                <button 
                  onClick={handleCancel} 
                  className="ai-btn-secondary px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold"
                >
                  <X size={13} />
                  Cancelar
                </button>
                <button 
                  onClick={handleConfirm} 
                  className="ai-btn-primary px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold"
                >
                  <Check size={13} />
                  Confirmar
                </button>
              </>
            ) : (
              <div className="text-[10px] font-bold text-[#6B4FD8] opacity-65 flex items-center gap-1">
                <Sparkles size={11} />
                Consulta informativa
              </div>
            )}
          </>
        )}

        {status === 'executing' && (
          <div className="flex items-center gap-2 text-xs opacity-50 font-bold p-1">
            <div className="ai-spinner"></div>
            Impactando Firestore...
          </div>
        )}

        {status === 'confirmed' && (
          <div className="ai-badge-confirmed px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 bg-purple-500/10 text-[#6B4FD8] border border-[#6B4FD8]/20">
            <Check size={13} />
            Transacción Registrada ✓
          </div>
        )}

        {status === 'cancelled' && (
          <div className="ai-badge-cancelled px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 bg-red-500/10 text-red-500 border border-red-500/20">
            <X size={13} />
            Operación Cancelada
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1 text-[10px] text-red-500 font-black mt-2 bg-red-500/5 p-2 rounded-lg border border-red-500/10">
          <AlertTriangle size={12} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

    </div>
  );
}
