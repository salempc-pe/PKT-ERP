import { useState } from 'react';
import { Plus, Wallet, History, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { usePayroll } from './usePayroll';
import { useEmployees } from './useEmployees';
import { useAuth } from '../../../context/AuthContext';

export default function LoansTab({ orgId }) {
  const { employees } = useEmployees(orgId);
  const { loans, addLoan, deleteLoan, updateLoan } = usePayroll(orgId);
  const { formatPrice } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    amount: '',
    installments: '1',
    type: 'prestamo'
  });

  const handleAddLoan = async (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.amount) return;

    const amount = Number(formData.amount);
    const installments = Number(formData.installments);
    const monthlyInstallment = amount / installments;

    try {
      await addLoan({
        ...formData,
        amount,
        installments,
        monthlyInstallment,
        remainingBalance: amount,
        status: 'active'
      });
      setIsModalOpen(false);
      setFormData({ employeeId: '', amount: '', installments: '1', type: 'prestamo' });
    } catch (error) {
      console.error("Error al crear préstamo:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-[var(--color-on-surface)]">Gestión de Préstamos y Adelantos</h3>
          <p className="text-xs text-[var(--color-on-surface-variant)]">Control de saldos pendientes y cuotas mensuales</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#6B4FD8] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:shadow-lg transition-all"
        >
          <Plus size={16} /> Nuevo Préstamo
        </button>
      </div>

      <div className="overflow-hidden bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] text-[10px] uppercase tracking-widest font-black">
              <th className="px-6 py-4">Colaborador</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Monto Total</th>
              <th className="px-6 py-4">Cuotas</th>
              <th className="px-6 py-4">Cuota Mensual</th>
              <th className="px-6 py-4">Saldo Pendiente</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-outline-variant)]">
            {loans.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-xs font-bold text-[var(--color-on-surface-variant)] opacity-50 uppercase tracking-widest">
                  Sin préstamos registrados
                </td>
              </tr>
            ) : (
              loans.map(loan => {
                const emp = employees.find(e => e.id === loan.employeeId);
                return (
                  <tr key={loan.id} className="hover:bg-[var(--color-surface-container)]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#6B4FD8]/10 text-[#6B4FD8] flex items-center justify-center font-black text-[10px]">
                          {emp?.firstName?.[0]}{emp?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-[var(--color-on-surface)]">{emp?.firstName} {emp?.lastName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${loan.type === 'adelanto' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {loan.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-xs text-[var(--color-on-surface)]">{formatPrice(loan.amount)}</td>
                    <td className="px-6 py-4 font-bold text-xs text-[var(--color-on-surface-variant)]">{loan.installments}</td>
                    <td className="px-6 py-4 font-bold text-xs text-[#2E8B57]">{formatPrice(loan.monthlyInstallment)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-xs text-[var(--color-on-surface)]">{formatPrice(loan.remainingBalance)}</span>
                        <div className="w-full bg-[var(--color-surface-container-high)] h-1 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#2E8B57] h-full" 
                            style={{ width: `${((loan.amount - loan.remainingBalance) / loan.amount) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => deleteLoan(loan.id)}
                        className="p-2 text-[var(--color-on-surface-variant)] hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-[var(--color-surface)] w-full max-w-md rounded-[2rem] border border-[var(--color-outline-variant)] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)]">
              <h2 className="text-xl font-black text-[var(--color-on-surface)] uppercase tracking-tight">Nuevo Préstamo / Adelanto</h2>
              <p className="text-xs text-[var(--color-on-surface-variant)] font-medium">Asignar financiamiento a un colaborador</p>
            </div>
            
            <form onSubmit={handleAddLoan} className="p-8 space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">Colaborador</label>
                <select 
                  className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#6B4FD8]"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                  required
                >
                  <option value="">Seleccionar...</option>
                  {employees.filter(e => e.status === 'active').map(e => (
                    <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">Monto Total</label>
                  <input 
                    type="number"
                    step="0.01"
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#6B4FD8]"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">Cuotas</label>
                  <input 
                    type="number"
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#6B4FD8]"
                    value={formData.installments}
                    onChange={(e) => setFormData({...formData, installments: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">Tipo</label>
                <div className="flex gap-2">
                  {['prestamo', 'adelanto'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormData({...formData, type: t})}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        formData.type === t 
                          ? 'bg-[#6B4FD8] border-[#6B4FD8] text-white' 
                          : 'bg-transparent border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#6B4FD8] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-lg transition-all"
                >
                  Crear Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
