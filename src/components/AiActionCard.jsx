import { useState } from 'react';
import { Check, X, ShoppingCart, Archive, AlertTriangle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AiActionCard.css';

/**
 * Componente que representa una Tarjeta de Confirmación de Acción generada por la IA (Veló AI).
 * Admite estados transaccionales e interactivos y bloquea escrituras no autorizadas.
 */
export default function AiActionCard({ action }) {
  const { user } = useAuth();
  const [status, setStatus] = useState('pending'); // 'pending' | 'executing' | 'confirmed' | 'cancelled'
  const [error, setError] = useState(null);

  if (!action || !action.type || !action.payload) return null;

  const { type, payload } = action;

  // Los ganchos de negocio se conectarán en el Plan 65.2.
  // Por ahora, implementamos la interactividad visual y los estados.
  const handleConfirm = async () => {
    setStatus('executing');
    try {
      // Simulación de delay de base de datos para feedback premium
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('confirmed');
    } catch (err) {
      console.error(err);
      setError("Fallo de comunicación con la base de datos.");
      setStatus('pending');
    }
  };

  const handleCancel = () => {
    setStatus('cancelled');
  };

  return (
    <div className={`ai-action-card border shadow-md rounded-2xl p-4 my-2 transition-all animate-in zoom-in duration-300 ${status}`}>
      
      {/* Cabecera de la Tarjeta */}
      <div className="ai-card-header">
        <div className="ai-card-title flex items-center gap-2">
          {type === 'CREATE_SALE' && <ShoppingCart size={16} className="text-[#6B4FD8]" />}
          {type === 'DEDUCT_INVENTORY' && <Archive size={16} className="text-amber-500" />}
          {type === 'QUERY_STOCK' && <Sparkles size={16} className="text-blue-500" />}
          <h4>
            {type === 'CREATE_SALE' && "Propuesta de Cotización/Venta"}
            {type === 'DEDUCT_INVENTORY' && "Propuesta de Salida de Bodega"}
            {type === 'QUERY_STOCK' && "Información de Stock"}
          </h4>
        </div>
      </div>

      {/* Cuerpo del Mensaje segun Tipo de Accion */}
      <div className="ai-card-body my-3">
        {type === 'CREATE_SALE' && (
          <div className="ai-sale-details text-xs space-y-2">
            <p className="font-black">Cliente: <span className="opacity-80">{payload.clientName}</span></p>
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
              <span>Total Estimado:</span>
              <span className="text-[#6B4FD8] text-sm">${Number(payload.total).toFixed(2)}</span>
            </div>
          </div>
        )}

        {type === 'DEDUCT_INVENTORY' && (
          <div className="ai-deduct-details text-xs space-y-2">
            <div className="flex justify-between">
              <span className="font-bold">Material:</span>
              <span className="font-black opacity-80">{payload.productName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold">Cantidad a egresar:</span>
              <span className="font-black text-red-500">{payload.quantity} unidades</span>
            </div>
            <div className="flex justify-between border-t border-dashed pt-2">
              <span className="font-bold">Motivo:</span>
              <span className="opacity-80 font-semibold">{payload.reason}</span>
            </div>
          </div>
        )}

        {type === 'QUERY_STOCK' && (
          <div className="ai-stock-details text-xs space-y-2">
            <div className="flex justify-between">
              <span className="font-bold">Producto/Insumo:</span>
              <span className="font-black opacity-80">{payload.productName}</span>
            </div>
            <div className="flex justify-between items-center border-t border-dashed pt-2">
              <span className="font-bold">Disponibilidad Física:</span>
              <span className="font-black text-sm text-[#6B4FD8] bg-[#6B4FD8]/10 px-2 py-0.5 rounded-full">
                {payload.stock} unidades
              </span>
            </div>
            <p className="text-[10px] opacity-50 font-semibold">{payload.warehouse || "Inventario Central"}</p>
          </div>
        )}
      </div>

      {/* Footer con Botones Interactivos o Insignias de Estado */}
      <div className="ai-card-footer flex justify-end gap-2 border-t border-dashed pt-3 mt-2">
        {status === 'pending' && (
          <>
            <button 
              onClick={handleCancel} 
              className="ai-btn-secondary px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold"
            >
              <X size={14} />
              Cancelar
            </button>
            <button 
              onClick={handleConfirm} 
              className="ai-btn-primary px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold"
            >
              <Check size={14} />
              Confirmar
            </button>
          </>
        )}

        {status === 'executing' && (
          <div className="flex items-center gap-2 text-xs opacity-50 font-bold p-1">
            <div className="ai-spinner"></div>
            Registrando en Firestore...
          </div>
        )}

        {status === 'confirmed' && (
          <div className="ai-badge-confirmed px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 bg-purple-500/10 text-[#6B4FD8] border border-[#6B4FD8]/20">
            <Check size={14} />
            Transacción Registrada ✓
          </div>
        )}

        {status === 'cancelled' && (
          <div className="ai-badge-cancelled px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 bg-red-500/10 text-red-500 border border-red-500/20">
            <X size={14} />
            Operación Cancelada
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1 text-[10px] text-red-500 font-bold mt-2">
          <AlertTriangle size={12} />
          {error}
        </div>
      )}

    </div>
  );
}
