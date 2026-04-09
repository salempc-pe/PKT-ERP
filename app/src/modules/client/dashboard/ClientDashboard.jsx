import { ArrowRight, Users, Briefcase, Box, Calculator, CheckCircle2, DollarSign, AlertTriangle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCrm } from '../crm/useCrm';
import { useInventory } from '../inventory/useInventory';
import { useSales } from '../sales/useSales';
import { useAppointments } from '../calendar/useAppointments';
import { useProjects } from '../projects/useProjects';
import KpiCard from './components/KpiCard';

export default function ClientDashboard() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  
  const { contacts, leads, loading: loadingCrm } = useCrm(orgId);
  const { products, loading: loadingInv } = useInventory(orgId);
  const { sales, loading: loadingSales } = useSales(orgId);
  const { appointments, loading: loadingAppts } = useAppointments(orgId);
  const { projects, tasks, loading: loadingProjects } = useProjects(orgId);

  // Calcula totales
  const totalContacts = contacts.length + leads.length;
  
  // Total Inventory Value
  const totalInventoryValue = products.reduce((acc, product) => {
    const priceStr = String(product.price).replace(/[^0-9.]/g, '');
    const price = parseFloat(priceStr) || 0;
    return acc + (price * (product.stock || 0));
  }, 0);

  // Low Stock Items
  const lowStockCount = products.filter(p => ["Bajo Stock", "Agotado"].includes(p.status)).length;
  
  // Sales YTD / Total
  const totalSalesRevenue = sales
    .filter(s => s.status === 'Pagada' || s.status === 'Pagado')
    .reduce((acc, s) => acc + (parseFloat(s.totalAmount) || 0), 0);

  const pendingInvoices = sales.filter(s => s.status === 'Pendiente').length;

  // Appointments
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingAppointments = appointments.filter(a => a.date >= todayStr && a.status === 'PENDING').length;

  // Projects
  const activeProjectsCount = projects.filter(p => p.status === 'active').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'done').length;

  return (
    <div className="animate-in fade-in duration-500 space-y-10">
      {/* Welcome Header */}
      <section className="relative rounded-3xl overflow-hidden p-6 lg:p-10 bg-[#091328]">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[#85adff] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Estado del sistema: Operativo</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-[#dee5ff] mb-6 leading-tight">
            Bienvenido al <span className="text-[#85adff]">Panel de Control</span>.
          </h2>
          <p className="text-[#a3aac4] text-sm lg:text-lg leading-relaxed mb-8">
            Resumen visual en tiempo real de todos tus módulos.
          </p>
        </div>
        
        {/* Abstract Architectural Background Elements */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-l from-[#85adff]/40 to-transparent"></div>
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 border-2 border-[#85adff]/30 rounded-full"></div>
          <div className="absolute right-20 top-1/3 -translate-y-1/2 w-48 h-48 border border-[#85adff]/20 rotate-45"></div>
        </div>
      </section>

      {/* Unified KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <KpiCard 
          title="Clientes & Leads" 
          value={totalContacts} 
          icon={Users}
          loading={loadingCrm}
          colorClass={{
            border: "border-[#85adff]/20",
            iconBg: "bg-[#85adff]/20",
            iconText: "text-[#85adff]",
          }}
        />
        <KpiCard 
          title="Valor Inventario" 
          value={`$${totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} 
          icon={Box}
          loading={loadingInv}
          colorClass={{
            border: "border-[#e28ce9]/20",
            iconBg: "bg-[#e28ce9]/20",
            iconText: "text-[#e28ce9]",
          }}
        />
        <KpiCard 
          title="Ingresos" 
          value={`$${totalSalesRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} 
          icon={DollarSign}
          loading={loadingSales}
          colorClass={{
            border: "border-[#50e3c2]/20",
            iconBg: "bg-[#50e3c2]/20",
            iconText: "text-[#50e3c2]",
          }}
        />
        <KpiCard 
          title="Proyectos & Tareas" 
          value={`${activeProjectsCount} Proj / ${tasks.length} Task`}
          icon={Briefcase}
          loading={loadingProjects}
          colorClass={{
            border: "border-[#dee5ff]/20",
            iconBg: "bg-[#dee5ff]/20",
            iconText: "text-[#dee5ff]",
          }}
        />
        <KpiCard 
          title="Citas Hoy" 
          value={upcomingAppointments} 
          icon={Calendar}
          loading={loadingAppts}
          colorClass={{
            border: "border-[#ffba08]/20",
            iconBg: "bg-[#ffba08]/20",
            iconText: "text-[#ffba08]",
          }}
        />
      </section>

      {/* Modular Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <Link to="/client/calendar" className="border border-[#ffba08]/20 bg-[#141f38] p-6 rounded-2xl group hover:bg-[#1f2b49] transition-all duration-300 block">
          <div className="w-12 h-12 rounded-xl bg-[#ffba08]/20 flex items-center justify-center mb-6 text-[#ffba08] group-hover:scale-110 transition-transform">
            <Calendar size={24} />
          </div>
          <h3 className="text-xl font-bold text-[#dee5ff] mb-2">Agendas y Citas</h3>
          <p className="text-sm text-[#a3aac4] mb-6 line-clamp-2">Programación de tus clientes y equipo.</p>
          <div className="bg-[#ffba08]/10 text-center py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-[#ffba08] flex items-center justify-center gap-2">
            <CheckCircle2 size={14} /> Entrar
          </div>
        </Link>

        <Link to="/client/crm" className="border border-[#85adff]/20 bg-[#141f38] p-6 rounded-2xl group hover:bg-[#1f2b49] transition-all duration-300 block">
          <div className="w-12 h-12 rounded-xl bg-[#85adff]/20 flex items-center justify-center mb-6 text-[#85adff] group-hover:scale-110 transition-transform">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-[#dee5ff] mb-2">CRM</h3>
          <p className="text-sm text-[#a3aac4] mb-6 line-clamp-2">Gestiona clientes y prospectos de manera visual.</p>
          <div className="bg-[#85adff]/10 text-center py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-[#85adff] flex items-center justify-center gap-2">
            <CheckCircle2 size={14} /> Entrar
          </div>
        </Link>

        <Link to="/client/inventory" className="border border-[#e28ce9]/20 bg-[#141f38] p-6 rounded-2xl group hover:bg-[#1f2b49] transition-all duration-300 block">
          <div className="w-12 h-12 rounded-xl bg-[#e28ce9]/20 flex items-center justify-center mb-6 text-[#e28ce9] group-hover:scale-110 transition-transform">
            <Box size={24} />
          </div>
          <h3 className="text-xl font-bold text-[#dee5ff] mb-2">Inventario</h3>
          <p className="text-sm text-[#a3aac4] mb-6 line-clamp-2">Control de existencias y alertas de stock.</p>
          <div className="bg-[#e28ce9]/10 text-center py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-[#e28ce9] flex items-center justify-center gap-2">
            <CheckCircle2 size={14} /> Entrar
          </div>
        </Link>
        
        <Link to="/client/projects" className="border border-[#dee5ff]/20 bg-[#141f38] p-6 rounded-2xl group hover:bg-[#1f2b49] transition-all duration-300 block">
          <div className="w-12 h-12 rounded-xl bg-[#dee5ff]/20 flex items-center justify-center mb-6 text-[#dee5ff] group-hover:scale-110 transition-transform">
            <Briefcase size={24} />
          </div>
          <h3 className="text-xl font-bold text-[#dee5ff] mb-2">Proyectos</h3>
          <p className="text-sm text-[#a3aac4] mb-6 line-clamp-2">Tableros Kanban para organizar el trabajo.</p>
          <div className="bg-[#dee5ff]/10 text-center py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-[#dee5ff] flex items-center justify-center gap-2">
            <CheckCircle2 size={14} /> Entrar
          </div>
        </Link>

        <Link to="/client/sales" className="border border-[#50e3c2]/20 bg-[#141f38] p-6 rounded-2xl group hover:bg-[#1f2b49] transition-all duration-300 block">
          <div className="w-12 h-12 rounded-xl bg-[#50e3c2]/20 flex items-center justify-center mb-6 text-[#50e3c2] group-hover:scale-110 transition-transform">
            <DollarSign size={24} />
          </div>
          <h3 className="text-xl font-bold text-[#dee5ff] mb-2">Facturación</h3>
          <p className="text-sm text-[#a3aac4] mb-6 line-clamp-2">Cotizaciones y facturación integrada.</p>
          <div className="bg-[#50e3c2]/10 text-center py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-[#50e3c2] flex items-center justify-center gap-2">
            <CheckCircle2 size={14} /> Entrar
          </div>
        </Link>
      </section>
    </div>
  );
}
