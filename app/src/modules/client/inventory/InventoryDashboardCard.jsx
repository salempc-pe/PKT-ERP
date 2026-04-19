import { Box } from 'lucide-react';
import DashboardCard from '../../../components/DashboardCard';
import { useInventory } from './useInventory';

export default function InventoryDashboardCard({ orgId }) {
  const { products, loading } = useInventory(orgId);

  const totalValue = products.reduce((acc, p) => acc + ((parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0) * (p.stock || 0)), 0);
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
          value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}` 
        },
        { 
          label: "Bajo Stock", 
          value: lowStockCount 
        }
      ]}
    />
  );
}
