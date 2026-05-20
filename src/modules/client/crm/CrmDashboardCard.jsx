import { Users } from 'lucide-react';
import DashboardCard from '../../../components/DashboardCard';
import { useCrm } from './useCrm';
import { MODULE_NAMES, MODULE_SLUGS } from '../../moduleNames';

export default function CrmDashboardCard({ orgId }) {
  const { contacts, leads, loading } = useCrm(orgId);

  return (
    <DashboardCard
      title={MODULE_NAMES.crm}
      description="Gestión de clientes y prospectos."
      icon={Users}
      path={`/client/${MODULE_SLUGS.crm}`}
      color="#6B4FD8"
      loading={loading}
      metrics={[
        { label: "Total Contactos", value: contacts.length + leads.length, path: "/client/crm?tab=clients" },
        { label: "Nuevos Leads", value: leads.length, path: "/client/crm?tab=leads" }
      ]}
    />
  );
}
