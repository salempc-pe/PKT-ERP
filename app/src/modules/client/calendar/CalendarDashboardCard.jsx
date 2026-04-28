import { Calendar } from 'lucide-react';
import DashboardCard from '../../../components/DashboardCard';
import { useAppointments } from './useAppointments';

export default function CalendarDashboardCard({ orgId }) {
  const { appointments, loading } = useAppointments(orgId);

  const todayStr = new Date().toISOString().split('T')[0];
  const appsToday = appointments.filter(a => a.date === todayStr && a.status === 'PENDING').length;
  const appsUpcoming = appointments.filter(a => a.date > todayStr && a.status === 'PENDING').length;
  const overdueApps = appointments.filter(a => a.status === 'PENDING' && new Date(`${a.date}T${a.time}`) < new Date()).length;

  return (
    <DashboardCard
      title="Agenda y Citas"
      description="Programación de equipo y clientes."
      icon={Calendar}
      path="/client/calendar"
      color="#ffba08"
      loading={loading}
      metrics={[
        { label: "Hoy", value: appsToday },
        { label: "Vencidas", value: overdueApps, color: overdueApps > 0 ? "text-red-400" : "" },
        { label: "Próximas", value: appsUpcoming }
      ]}
    />
  );
}
