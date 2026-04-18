import { ArrowRight, Users, Briefcase, Box, Calculator, CheckCircle2, DollarSign, AlertTriangle, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCrm } from '../crm/useCrm';
import { useInventory } from '../inventory/useInventory';
import { useSales } from '../sales/useSales';
import { useAppointments } from '../calendar/useAppointments';
import { useProjects } from '../projects/useProjects';

export default function ClientDashboard() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  const activeModules = user?.subscription?.activeModules || [];
  
  const { contacts, leads, loading: loadingCrm } = useCrm(orgId);
  const { products, loading: loadingInv } = useInventory(orgId);
  const { sales, loading: loadingSales } = useSales(orgId);
  const { appointments, loading: loadingAppts } = useAppointments(orgId);
  const { projects, tasks, loading: loadingProjects } = useProjects(orgId);

  // --- Módulos Config ---
  const modulesConfig = {
    crm: {
      title: "CRM y Ventas",
      description: "Gestión de clientes y prospectos.",
      icon: Users,
      path: "/client/crm",
      color: "#85adff",
      loading: loadingCrm,
      metrics: [
        { label: "Total Contactos", value: contacts.length + leads.length },
        { label: "Nuevos Leads", value: leads.length }
      ]
    },
    inventory: {
      title: "Inventario",
      description: "Control de existencias y alertas.",
      icon: Box,
      path: "/client/inventory",
      color: "#e28ce9",
      loading: loadingInv,
      metrics: [
        { 
          label: "Valor Total", 
          value: `$${products.reduce((acc, p) => acc + ((parseFloat(String(p.price).replace(/[^0-9.]/g, '')) || 0) * (p.stock || 0)), 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}` 
        },
        { label: "Bajo Stock", value: products.filter(p => ["Bajo Stock", "Agotado"].includes(p.status)).length }
      ]
    },
    sales: {
      title: "Facturación",
      description: "Cotizaciones y facturas.",
      icon: DollarSign,
      path: "/client/sales",
      color: "#50e3c2",
      loading: loadingSales,
      metrics: [
        { 
          label: "Ingresos", 
          value: `$${sales.filter(s => ['Pagada', 'Pagado'].includes(s.status)).reduce((acc, s) => acc + (parseFloat(s.totalAmount) || 0), 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}` 
        },
        { label: "Pendientes", value: sales.filter(s => s.status === 'Pendiente').length }
      ]
    },
    projects: {
      title: "Proyectos",
      description: "Planificación y tareas Kanban.",
      icon: Briefcase,
      path: "/client/projects",
      color: "#dee5ff",
      loading: loadingProjects,
      metrics: [
        { label: "Proyectos Activos", value: projects.filter(p => p.status === 'active').length },
        { label: "Tareas Pendientes", value: tasks.filter(t => t.status !== 'done').length }
      ]
    },
    calendar: {
      title: "Agenda y Citas",
      description: "Programación de equipo y clientes.",
      icon: Calendar,
      path: "/client/calendar",
      color: "#ffba08",
      loading: loadingAppts,
      metrics: [
        { 
          label: "Citas Hoy", 
          value: appointments.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status === 'PENDING').length 
        },
        { 
          label: "Próximas", 
          value: appointments.filter(a => a.date > new Date().toISOString().split('T')[0] && a.status === 'PENDING').length 
        }
      ]
    },
    finance: {
      title: "Contabilidad",
      description: "Flujo de caja y finanzas.",
      icon: Calculator,
      path: "/client/finance",
      color: "#85adff", // Using crm color for consistency if not defined
      loading: false,
      metrics: [
        { label: "Ver Balance", value: "Activo" }
      ]
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-10">
      {/* Welcome Header */}
      <section className="relative rounded-3xl overflow-hidden p-6 lg:p-10 bg-[#091328] border border-[#85adff]/10">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[#85adff] font-bold tracking-[0.2em] text-[10px] uppercase mb-4 block flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Estado: Sistema Operativo
          </span>
          <h2 className="text-3xl lg:text-5xl font-black tracking-tighter text-[#dee5ff] mb-4 leading-tight">
            Hola, <span className="text-[#85adff]">{user?.name?.split(' ')[0] || 'Usuario'}</span>.
          </h2>
          <p className="text-[#a3aac4] text-sm lg:text-base leading-relaxed max-w-md">
            Este es el resumen centralizado de tus módulos activos.
          </p>
        </div>
        
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-l from-[#85adff]/20 to-transparent"></div>
          <div className="absolute right-[-20%] top-1/2 -translate-y-1/2 w-64 h-64 border-[1px] border-[#85adff]/20 rounded-full"></div>
        </div>
      </section>

      {/* Main Modules Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeModules.map((modKey) => {
          const config = modulesConfig[modKey];
          if (!config) return null;
          const Icon = config.icon;

          return (
            <Link 
              key={modKey}
              to={config.path} 
              className="group relative bg-[#141f38] border border-white/5 rounded-[2rem] p-8 hover:bg-[#1a264a] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
              style={{ borderColor: `${config.color}15` }}
            >
              {/* Background Glow */}
              <div 
                className="absolute -right-4 -top-4 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ backgroundColor: config.color }}
              ></div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                  style={{ backgroundColor: `${config.color}20`, color: config.color }}
                >
                  <Icon size={28} strokeWidth={2.5} />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <ExternalLink size={14} className="text-[#dee5ff]/40" />
                </div>
              </div>

              <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-black text-[#dee5ff] mb-2">{config.title}</h3>
                <p className="text-sm text-[#a3aac4] font-medium leading-relaxed">{config.description}</p>
              </div>

              {/* Metrics Section */}
              <div className="mt-auto grid grid-cols-2 gap-4 pt-6 border-t border-white/5 relative z-10">
                {config.metrics.map((m, idx) => (
                  <div key={idx}>
                    <p className="text-[10px] uppercase font-bold text-[#a3aac4] tracking-widest mb-1.5">{m.label}</p>
                    {config.loading ? (
                      <div className="h-6 w-16 bg-white/5 animate-pulse rounded"></div>
                    ) : (
                      <p className="text-lg font-black text-[#dee5ff]">{m.value}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Hover Stroke */}
              <div 
                className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                style={{ backgroundColor: config.color }}
              ></div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
