import { useState } from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, Calendar as CalendarIcon, UserCheck, UserMinus } from 'lucide-react';
import { usePayroll } from './usePayroll';
import { useEmployees } from './useEmployees';
import { useAuth } from '../../../context/AuthContext';

export default function AttendanceTab({ orgId }) {
  const { employees } = useEmployees(orgId);
  const { attendances, addAttendance, updateAttendance } = usePayroll(orgId);
  const { user } = useAuth();
  
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const getAttendanceForEmployee = (employeeId) => {
    return attendances.find(a => a.employeeId === employeeId && a.date === selectedDate);
  };

  const handleToggleAttendance = async (employee, status) => {
    const existing = getAttendanceForEmployee(employee.id);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      if (existing) {
        await updateAttendance(existing.id, { 
          status,
          checkOut: status === 'presente' ? now : existing.checkOut 
        });
      } else {
        await addAttendance({
          employeeId: employee.id,
          date: selectedDate,
          checkIn: now,
          status: status || 'presente'
        });
      }
    } catch (error) {
      console.error("Error al registrar asistencia:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--color-surface-container-low)] p-4 rounded-2xl border border-[var(--color-outline-variant)]">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-[var(--color-on-surface)]">Control de Asistencia</h3>
          <p className="text-xs text-[var(--color-on-surface-variant)]">Registro diario de ingresos, salidas y faltas</p>
        </div>
        <div className="flex items-center gap-2 bg-[var(--color-surface-container)] px-3 py-2 rounded-xl border border-[var(--color-outline-variant)]">
          <CalendarIcon size={16} className="text-[#6B4FD8]" />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-xs font-bold outline-none text-[var(--color-on-surface)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.filter(e => e.status === 'active').map(emp => {
          const attendance = getAttendanceForEmployee(emp.id);
          return (
            <div key={emp.id} className="bg-[var(--color-surface-container)] p-4 rounded-2xl border border-[var(--color-outline-variant)] hover:border-[#6B4FD8]/30 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6B4FD8] to-[#2E8B57] flex items-center justify-center text-white font-black text-xs shadow-sm">
                    {emp.firstName?.[0]}{emp.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-black text-sm text-[var(--color-on-surface)]">{emp.firstName} {emp.lastName}</p>
                    <p className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-wide">{emp.position}</p>
                  </div>
                </div>
                {attendance && (
                  <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter ${
                    attendance.status === 'presente' ? 'bg-green-500/10 text-green-500' :
                    attendance.status === 'tardanza' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {attendance.status}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-[var(--color-outline-variant)] pt-4 mt-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-on-surface-variant)]">
                    <Clock size={12} className="text-[#6B4FD8]" />
                    <span>In: {attendance?.checkIn || '--:--'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-on-surface-variant)]">
                    <Clock size={12} className="text-[#2E8B57]" />
                    <span>Out: {attendance?.checkOut || '--:--'}</span>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button 
                    onClick={() => handleToggleAttendance(emp, 'presente')}
                    className={`p-2 rounded-lg transition-all ${attendance?.status === 'presente' ? 'bg-green-500 text-white' : 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:bg-green-500/20 hover:text-green-500'}`}
                    title="Presente"
                  >
                    <UserCheck size={16} />
                  </button>
                  <button 
                    onClick={() => handleToggleAttendance(emp, 'tardanza')}
                    className={`p-2 rounded-lg transition-all ${attendance?.status === 'tardanza' ? 'bg-amber-500 text-white' : 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:bg-amber-500/20 hover:text-amber-500'}`}
                    title="Tardanza"
                  >
                    <AlertCircle size={16} />
                  </button>
                  <button 
                    onClick={() => handleToggleAttendance(emp, 'falta')}
                    className={`p-2 rounded-lg transition-all ${attendance?.status === 'falta' ? 'bg-red-500 text-white' : 'bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] hover:bg-red-500/20 hover:text-red-500'}`}
                    title="Falta"
                  >
                    <UserMinus size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
