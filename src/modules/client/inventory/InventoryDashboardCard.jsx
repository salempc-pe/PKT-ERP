import { Box } from 'lucide-react';
import DashboardCard from '../../../components/DashboardCard';
import { useInventory } from './useInventory';
import { useAuth } from '../../../context/AuthContext';

export default function InventoryDashboardCard({ orgId }) {
  const { products, loading } = useInventory(orgId);
  const { formatPrice } = useAuth();

  const totalValue = products.reduce((acc, p) => acc + ((Number(p.price) || 0) * (p.stock || 0)), 0);
  const lowStockCount = products.filter(p => ["Bajo Stock", "Agotado"].includes(p.status)).length;

  return (
    <DashboardCard
      title="Inventario"
      description="Control de existencias y alertas."
      icon={Box}
      path="/client/inventory"
      color="#e28ce9"
      loading={loading}
      metrics={[
        { 
          label: "Valor Total", 
          value: formatPrice(totalValue)
        },
        { 
          label: "Bajo Stock", 
          value: lowStockCount 
        }
      ]}
    />
  );
}
