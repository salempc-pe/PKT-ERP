import { Wallet } from 'lucide-react';
import DashboardCard from '../../../components/DashboardCard';
import { useEmployees } from './useEmployees';
import { MODULE_NAMES, MODULE_SLUGS } from '../../moduleNames';

/**
 * Tarjeta de resumen para el Dashboard del módulo de nóminas.
 */
export default function PayrollDashboardCard({ orgId }) {
  const { employees, loading } = useEmployees(orgId);

  // Calcular métricas
  const totalPayroll = employees.reduce((sum, emp) => {
    return sum + (Number(emp.baseSalary) || 0) + (Number(emp.variableSalary) || 0);
  }, 0);

  return (
    <DashboardCard
      title={MODULE_NAMES.payroll}
      description="Control de planilla y colaboradores."
      icon={Wallet}
      path={`/client/${MODULE_SLUGS.payroll}`}
      color="#10b981" // Color esmeralda/verde para temas financieros
      loading={loading}
      metrics={[
        { label: "Colaboradores", value: employees.length },
        { label: "Planilla Est.", value: `S/ ${totalPayroll.toLocaleString()}` }
      ]}
    />
  );
}