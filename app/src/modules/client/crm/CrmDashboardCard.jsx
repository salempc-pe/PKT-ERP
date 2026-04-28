import { Users } from 'lucide-react';
import DashboardCard from '../../../components/DashboardCard';
import { useCrm } from './useCrm';

export default function CrmDashboardCard({ orgId }) {
  const { contacts, leads, loading } = useCrm(orgId);

  return (
    <DashboardCard
      title="CRM y Ventas"
      description="Gestión de clientes y prospectos."
      icon={Users}
      path="/client/crm"
      color="#6B4FD8"
      loading={loading}
      metrics={[
        { label: "Total Contactos", value: contacts.length + leads.length },
        { label: "Nuevos Leads", value: leads.length }
      ]}
    />
  );
}
