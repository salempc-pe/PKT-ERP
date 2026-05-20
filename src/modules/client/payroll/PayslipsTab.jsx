import { useState, useMemo } from 'react';
import { ReceiptText, Download, Printer, ArrowRight, Wallet, AlertCircle } from 'lucide-react';
import { usePayroll } from './usePayroll';
import { useEmployees } from './useEmployees';
import { useAuth } from '../../../context/AuthContext';
import PayslipDocument from './PayslipDocument';

export default function PayslipsTab({ orgId }) {
  const { employees } = useEmployees(orgId);
  const { attendances, loans } = usePayroll(orgId);
  const { formatPrice } = useAuth();
  
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewingPayslip, setViewingPayslip] = useState(null);

  // Lógica de cálculo de planilla
  const payrollData = useMemo(() => {
    return employees.filter(e => e.status === 'active').map(emp => {
      // Filtrar asistencias del mes actual (simplificado)
      const empAttendances = attendances.filter(a => a.employeeId === emp.id);
      const lates = empAttendances.filter(a => a.status === 'tardanza').length;
      const absents = empAttendances.filter(a => a.status === 'falta').length;
      
      // Cálculo de deducciones por faltas/tardanzas (ejemplo: 20 por tardanza, 50 por falta)
      const lateDeduction = (lates * 20) + (absents * 50);

      // Préstamos activos
      const activeLoan = loans.find(l => l.employeeId === emp.id && l.status === 'active');
      const loanInstallment = activeLoan ? activeLoan.monthlyInstallment : 0;

      const totalEarnings = (Number(emp.baseSalary) || 0) + (Number(emp.variableSalary) || 0);
      const totalDeductions = lateDeduction + loanInstallment;
      const totalNet = totalEarnings - totalDeductions;

      return {
        ...emp,
        calculations: {
          lates,
          absents,
          lateDeduction,
          loanInstallment,
          totalEarnings,
          totalDeductions,
          totalNet
        }
      };
    });
  }, [employees, attendances, loans]);

  const handlePrint = () => {
    window.print();
  };

  if (viewingPayslip) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between print:hidden">
          <button 
            onClick={() => setViewingPayslip(null)}
            className="text-xs font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] hover:text-[#6B4FD8] flex items-center gap-2"
          >
            ← Volver a Planilla
          </button>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="bg-[#6B4FD8] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all"
            >
              <Printer size={16} /> Imprimir Boleta
            </button>
          </div>
        </div>
        
        <div className="print:block">
          <PayslipDocument 
            employee={viewingPayslip} 
            calculations={viewingPayslip.calculations} 
            orgData={{ name: 'Veló ERP System' }} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center md:hidden">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-[var(--color-on-surface)]">Planilla Mensual Consolida</h3>
          <p className="text-xs text-[var(--color-on-surface-variant)]">Resumen de pagos, bonos y descuentos</p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0 border-y md:border border-[var(--color-outline-variant)] md:rounded-3xl bg-transparent md:bg-[var(--color-surface-container-low)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] text-[10px] uppercase tracking-widest font-black">
              <th className="px-6 py-5">Colaborador</th>
              <th className="px-6 py-5">Ingresos Totales</th>
              <th className="px-6 py-5">Deducciones (Asist.)</th>
              <th className="px-6 py-5">Cuota Préstamo</th>
              <th className="px-6 py-5">Neto a Pagar</th>
              <th className="px-6 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-outline-variant)]">
            {payrollData.map(emp => (
              <tr key={emp.id} className="hover:bg-[var(--color-surface-container)] transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)] flex items-center justify-center text-[var(--color-primary)] font-black text-[10px]">
                      {emp.firstName?.[0]}{emp.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-black text-xs text-[var(--color-on-surface)]">{emp.firstName} {emp.lastName}</p>
                      <p className="text-[9px] font-bold text-[var(--color-on-surface-variant)] uppercase">{emp.position}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 font-bold text-xs">{formatPrice(emp.calculations.totalEarnings)}</td>
                <td className="px-6 py-5">
                  {emp.calculations.lateDeduction > 0 ? (
                    <div className="flex items-center gap-1.5 text-red-500 font-bold text-xs">
                      <AlertCircle size={12} />
                      {formatPrice(emp.calculations.lateDeduction)}
                    </div>
                  ) : (
                    <span className="text-[10px] text-[var(--color-on-surface-variant)]">Sin descuentos</span>
                  )}
                </td>
                <td className="px-6 py-5">
                  {emp.calculations.loanInstallment > 0 ? (
                    <div className="flex items-center gap-1.5 text-[#6B4FD8] font-bold text-xs">
                      <Wallet size={12} />
                      {formatPrice(emp.calculations.loanInstallment)}
                    </div>
                  ) : (
                    <span className="text-[10px] text-[var(--color-on-surface-variant)]">---</span>
                  )}
                </td>
                <td className="px-6 py-5">
                  <span className="bg-[#2E8B57]/10 text-[#2E8B57] px-3 py-1 rounded-lg font-black text-sm">
                    {formatPrice(emp.calculations.totalNet)}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button 
                    onClick={() => setViewingPayslip(emp)}
                    className="p-2.5 bg-[var(--color-surface-container-high)] text-[#6B4FD8] rounded-xl hover:bg-[#6B4FD8] hover:text-white transition-all group-hover:scale-110"
                    title="Ver Boleta"
                  >
                    <ReceiptText size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#6B4FD8]/5 border border-[#6B4FD8]/20 p-6 rounded-2xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#6B4FD8]/10 flex items-center justify-center text-[#6B4FD8]">
          <Download size={24} />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[#6B4FD8]">Exportación Masiva</p>
          <p className="text-[10px] text-[var(--color-on-surface-variant)] font-medium">Puedes imprimir todas las boletas del mes en un solo archivo para distribución física o digital.</p>
        </div>
        <button className="ml-auto px-6 py-2.5 bg-[#6B4FD8] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
          Generar Todo
        </button>
      </div>
    </div>
  );
}
