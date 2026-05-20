import { Building2 } from 'lucide-react';
import DashboardCard from '../../../components/DashboardCard';
import { useRealEstate } from './useRealEstate';
import { MODULE_NAMES, MODULE_SLUGS } from '../../moduleNames';

export default function RealEstateDashboardCard({ orgId }) {
  const { terrains, loading } = useRealEstate(orgId);

  const pendingCount = terrains.filter(t => t.status === 'presentacion' || t.status === 'negociacion').length;
  const approvedCount = terrains.filter(t => t.status === 'aprobado').length;

  return (
    <DashboardCard
      title={MODULE_NAMES.realestate}
      description="Base de terrenos y pipeline comercial."
      icon={Building2}
      path={`/client/${MODULE_SLUGS.realestate}`}
      color="#6B4FD8"
      loading={loading}
      metrics={[
        { label: "Total Terrenos", value: terrains.length },
        { label: "En Negociación", value: pendingCount },
        { label: "Cierres / Aprobados", value: approvedCount }
      ]}
    />
  );
}
