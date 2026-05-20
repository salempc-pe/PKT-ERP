import { Activity } from 'lucide-react';
import DashboardCard from '../../../components/DashboardCard';
import { useHealth } from './useHealth';
import { MODULE_NAMES, MODULE_SLUGS } from '../../moduleNames';

export default function HealthDashboardCard({ orgId }) {
  const { expedientes, citas, loading } = useHealth(orgId);

  // Calcular citas de hoy si es necesario, o solo total
  const today = new Date();
  today.setHours(0,0,0,0);
  const upcomingAppointments = citas.filter(c => {
    if(!c.fecha_hora?.toDate) return false;
    return c.fecha_hora.toDate() >= today && c.estado === 'confirmada';
  }).length;

  return (
    <DashboardCard
      title={MODULE_NAMES.health}
      description="Gestión clínica y expedientes médicos."
      icon={Activity}
      path={`/client/${MODULE_SLUGS.health}`}
      color="#EF4444"
      loading={loading}
      metrics={[
        { label: "Pacientes Activos", value: expedientes.filter(e => e.estado === 'activo').length, path: `/client/${MODULE_SLUGS.health}/pacientes` },
        { label: "Citas Pendientes", value: upcomingAppointments, path: `/client/${MODULE_SLUGS.health}/agenda` }
      ]}
    />
  );
}
