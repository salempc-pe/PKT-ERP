import { Briefcase } from 'lucide-react';
import DashboardCard from '../../../components/DashboardCard';
import { useProjects } from './useProjects';

export default function ProjectsDashboardCard({ orgId }) {
  const { projects, tasks, loading } = useProjects(orgId);

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const pendingTasks = tasks.filter(t => t.status !== 'done').length;
  const overdueProjects = projects.filter(p => p.dueDate && new Date(p.dueDate + 'T23:59:59') < new Date()).length;

  return (
    <DashboardCard
      title="Proyectos"
      description="Planificación y tareas."
      icon={Briefcase}
      path="/client/projects"
      color="#dee5ff"
      loading={loading}
      metrics={[
        { label: "Activos", value: activeProjects },
        { label: "Vencidos", value: overdueProjects, color: overdueProjects > 0 ? "text-red-400" : "" },
        { label: "Pendientes", value: pendingTasks }
      ]}
    />
  );
}
