import { Calculator } from 'lucide-react';
import DashboardCard from '../../../components/DashboardCard';
import { useFinance } from './useFinance';
import { useAuth } from '../../../context/AuthContext';

export default function FinanceDashboardCard({ orgId }) {
  const { transactions, loading } = useFinance(orgId);
  const { formatPrice } = useAuth();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const balance = totalIncome - totalExpense;

  return (
    <DashboardCard
      title="Contabilidad"
      description="Flujo de caja y finanzas."
      icon={Calculator}
      path="/client/finance"
      color="#6B4FD8"
      loading={loading}
      metrics={[
        { label: "Balance Total", value: formatPrice(balance), color: balance >= 0 ? "text-emerald-400" : "text-red-400" },
        { label: "Ingresos", value: formatPrice(totalIncome) },
        { label: "Gastos", value: formatPrice(totalExpense) }
      ]}
    />
  );
}
