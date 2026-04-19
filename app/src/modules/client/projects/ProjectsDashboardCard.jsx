import { Briefcase } from 'lucide-react';
import DashboardCard from '../../../components/DashboardCard';
import { useProjects } from './useProjects';

export default function ProjectsDashboardCard({ orgId }) {
  const { projects, tasks, loading } = useProjects(orgId);

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const pendingTasks = tasks.filter(t => t.status !== 'done').length;

  return (
    <DashboardCard
      title="Proyectos"
      description="Planificación y tareas."
      icon={Briefcase}
      path="/client/projects"
      color="#dee5ff"
      loading={loading}
      metrics={[
        { label: "Proyectos Activos", value: activeProjects },
        { label: "Tareas Pendientes", value: pendingTasks }
      ]}
    />
  );
}
