import { Package } from 'lucide-react';
import DashboardCard from '../../../components/DashboardCard';
import { useWarehouse } from './useWarehouse';

/**
 * Tarjeta de resumen para el Dashboard del módulo de bodega/lotes.
 */
export default function WarehouseDashboardCard({ orgId }) {
  const { stock, loading } = useWarehouse(orgId);

  // Calcular métricas
  const totalLotes = stock.length;
  // Podríamos agregar más métricas si useWarehouse las provee, 
  // por ahora usaremos lo que tenemos disponible.

  return (
    <DashboardCard
      title="Bodega"
      description="Gestión de stock por lotes y movimientos."
      icon={Package}
      path="/client/warehouse"
      color="#6366f1" // Color índigo/violeta para bodega
      loading={loading}
      metrics={[
        { label: "Lotes Activos", value: totalLotes },
        { label: "Estado", value: totalLotes > 0 ? "Operativo" : "Sin Stock", color: totalLotes > 0 ? "text-green-500" : "text-amber-500" }
      ]}
    />
  );
}

