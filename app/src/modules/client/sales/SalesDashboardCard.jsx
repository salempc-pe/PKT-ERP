import { DollarSign } from 'lucide-react';
import DashboardCard from '../../../components/DashboardCard';
import { useSales } from './useSales';

export default function SalesDashboardCard({ orgId }) {
  const { sales, loading } = useSales(orgId);

  const revenue = sales.filter(s => ['Pagada', 'Pagado'].includes(s.status))
                       .reduce((acc, s) => acc + (parseFloat(s.totalAmount) || 0), 0);
  const pendingCount = sales.filter(s => s.status === 'Pendiente').length;

  return (
    <DashboardCard
      title="Facturación"
      description="Cotizaciones y facturas."
      icon={DollarSign}
      path="/client/sales"
      color="#50e3c2"
      loading={loading}
      metrics={[
        { 
          label: "Ingresos", 
          value: `$${revenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}` 
        },
        { 
          label: "Pendientes", 
          value: pendingCount 
        }
      ]}
    />
  );
}
