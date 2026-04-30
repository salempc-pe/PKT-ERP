import { useState } from 'react';
import { 
  Users, Search, Filter, Plus, Edit2, 
  Trash2, CreditCard, Banknote, 
  Calendar, TrendingUp, Wallet
} from 'lucide-react';
import { useEmployees } from './useEmployees';
import { useAuth } from '../../../context/AuthContext';
import LoadingScreen from '../../../components/LoadingScreen';
import EmployeeModal from './EmployeeModal';

/**
 * Módulo de Nóminas y Recursos Humanos
 * Permite gestionar colaboradores, sueldos y beneficios.
 */
export default function PayrollModule() {
  const { user, formatPrice, currencySymbol } = useAuth();
  const orgId = user?.organizationId || "default_org";
  const { employees, loading, addEmployee, updateEmployee, deleteEmployee } = useEmployees(orgId);

  // -- Modal State --
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // -- Handlers --
  const handleOpenEdit = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSaveEmployee = async (id, data) => {
    try {
      if (id) {
        await updateEmployee(id, data);
      } else {
        await addEmployee(data);
      }
    } catch (error) {
      console.error("Error al guardar empleado:", error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este colaborador?')) {
      await deleteEmployee(id);
    }
  };

  // Cálculos dinámicos para Stats
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const totalPayroll = employees.reduce((acc, e) => acc + (Number(e.baseSalary) || 0) + (Number(e.variableSalary) || 0), 0);
  const bankPaymentCount = employees.filter(e => e.paymentMethod === 'deposito').length;

  const payrollStats = [
    { title: 'Colaboradores', value: activeEmployees, icon: <Users size={24} className="text-[#6B4FD8]" /> },
    { title: 'Planilla Mensual', value: formatPrice(totalPayroll), icon: <TrendingUp size={24} className="text-[#2E8B57]" /> },
    { title: 'Pagos Bancarios', value: bankPaymentCount, icon: <Wallet size={24} className="text-[#6B4FD8]" /> },
    { title: 'Próxima Gratificación', value: 'Julio 2026', icon: <Calendar size={24} className="text-[#6B4FD8]" /> }
  ];

  if (loading) {
    return <LoadingScreen fullScreen={false} message="CARGANDO NÓMINAS..." />;
  }

  const filteredEmployees = employees.filter(e => {
    const searchLower = searchQuery.toLowerCase();
    return (
      e.firstName?.toLowerCase().includes(searchLower) ||
      e.lastName?.toLowerCase().includes(searchLower) ||
      e.documentId?.toLowerCase().includes(searchLower) ||
      e.position?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="animate-in fade-in duration-500 space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--color-on-surface)] uppercase tracking-tight">Gestión de Nóminas</h2>
          <p className="text-sm text-[var(--color-on-surface-variant)] font-medium">Control de personal, sueldos y beneficios de ley</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-[#6B4FD8] text-white font-black px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_10px_20px_rgba(107,79,216,0.3)] transition-all uppercase text-xs tracking-widest"
        >
          <Plus size={18} /> Agregar Colaborador
        </button>
      </div>

      {/* Stats Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {payrollStats.map((stat, idx) => (
          <div key={idx} className="bg-[var(--color-surface-container)] p-5 rounded-2xl flex items-center gap-4 border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-high)] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-container-low)] flex items-center justify-center shadow-sm">
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-0.5">{stat.title}</p>
              <span className="text-xl font-black text-[var(--color-on-surface)]">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-[var(--color-surface-container-low)] p-2 rounded-2xl border border-[var(--color-outline-variant)]">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" size={16} />
            <input 
              type="text" 
              placeholder="Buscar colaborador..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[var(--color-on-surface)] text-sm rounded-xl pl-12 pr-4 py-2.5 outline-none font-medium"
            />
          </div>
          <div className="flex items-center gap-2 px-2">
            <button className="p-2 text-[var(--color-on-surface-variant)] hover:text-[#6B4FD8] transition-colors"><Filter size={20}/></button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 md:mx-0 border-y md:border border-[var(--color-outline-variant)] md:rounded-[2rem] bg-[var(--color-surface-container-low)] shadow-sm">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] text-[10px] uppercase tracking-[0.2em] font-black">
                <th className="px-6 py-5 first:rounded-tl-[2rem]">Colaborador</th>
                <th className="px-6 py-5">Cargo</th>
                <th className="px-6 py-5">Sueldo Bruto</th>
                <th className="px-6 py-5">Método Pago</th>
                <th className="px-6 py-5 text-right last:rounded-tr-[2rem]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-outline-variant)]">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-50">
                      <Users size={48} className="text-[var(--color-on-surface-variant)]" />
                      <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)]">Sin registros disponibles</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="group hover:bg-[var(--color-surface-container)] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6B4FD8] to-[#2E8B57] flex items-center justify-center text-white font-black text-[10px]">
                          {emp.firstName?.[0]}{emp.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-black text-sm text-[var(--color-on-surface)]">{emp.firstName} {emp.lastName}</p>
                          <p className="text-[10px] font-mono text-[#6B4FD8] uppercase font-bold">{emp.documentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wide bg-[var(--color-surface-container-high)] px-2 py-1 rounded-md">{emp.position}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-black text-sm text-[var(--color-on-surface)]">{formatPrice(emp.baseSalary)}</p>
                      {emp.variableSalary > 0 && <p className="text-[10px] text-[#2E8B57] font-bold">+{formatPrice(emp.variableSalary)} Var.</p>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {emp.paymentMethod === 'deposito' ? (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#6B4FD8]/10 text-[#6B4FD8] rounded-lg border border-[#6B4FD8]/20" title={emp.bankInfo?.bankName}>
                            <Banknote size={12} />
                            <span className="text-[10px] font-black uppercase">Banco</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20">
                            <CreditCard size={12} />
                            <span className="text-[10px] font-black uppercase">Efectivo</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEdit(emp)}
                          className="p-2 text-[var(--color-on-surface-variant)] hover:text-[#6B4FD8] hover:bg-[#6B4FD8]/10 rounded-xl transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(emp.id)}
                          className="p-2 text-[var(--color-on-surface-variant)] hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EmployeeModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        employee={editingEmployee}
        onSave={handleSaveEmployee}
      />
    </div>
  );
}
