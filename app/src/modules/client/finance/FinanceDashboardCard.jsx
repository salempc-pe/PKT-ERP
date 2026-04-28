import { Calculator } from 'lucide-react';
import DashboardCard from '../../../components/DashboardCard';

export default function FinanceDashboardCard() {
  // Aquí puedes importar tu useFinance cuando aplique. 
  // Ahora pondremos loading falso como en el ClientDashboard original.

  return (
    <DashboardCard
      title="Contabilidad"
      description="Flujo de caja y finanzas."
      icon={Calculator}
      path="/client/finance"
      color="#6B4FD8"
      loading={false}
      metrics={[
        { label: "Ver Balance", value: "Activo" }
      ]}
    />
  );
}
