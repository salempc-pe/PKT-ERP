import { useState, useEffect } from 'react';
import { X, User, Briefcase, CreditCard, Banknote, ShieldCheck, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

/**
 * Modal para el registro y edición de colaboradores (Nóminas)
 */
export default function EmployeeModal({ isOpen, onClose, employee, onSave }) {
  const { currencySymbol } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    documentId: '',
    position: '',
    salaryType: 'fijo',
    baseSalary: 0,
    variableSalary: 0,
    paymentMethod: 'efectivo',
    bankInfo: {
      bankName: '',
      accountNumber: '',
      cci: ''
    },
    benefits: {
      asignacionFamiliar: false,
      gratificaciones: true,
      cts: true,
      utilidades: true
    },
    status: 'active'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        bankInfo: employee.bankInfo || { bankName: '', accountNumber: '', cci: '' },
        benefits: employee.benefits || { asignacionFamiliar: false, gratificaciones: true, cts: true, utilidades: true }
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        documentId: '',
        position: '',
        salaryType: 'fijo',
        baseSalary: 0,
        variableSalary: 0,
        paymentMethod: 'efectivo',
        bankInfo: { bankName: '', accountNumber: '', cci: '' },
        benefits: { asignacionFamiliar: false, gratificaciones: true, cts: true, utilidades: true },
        status: 'active'
      });
    }
    setError(null);
  }, [employee, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onSave(employee?.id, formData);
      onClose();
    } catch (err) {
      console.error("Error al guardar colaborador:", err);
      setError("Error al guardar los datos. Verifica los campos requeridos.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => !isSaving && onClose()}></div>
      
      <form 
        onSubmit={handleSubmit}
        className="bg-[var(--color-surface)] w-full max-w-2xl border border-[var(--color-outline-variant)] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden relative animate-in zoom-in duration-300 flex flex-col max-h-[95vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-surface-container-high)]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#6B4FD8] flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-[0.1em] text-xs">
                {employee ? 'Editar Colaborador' : 'Nuevo Colaborador'}
              </h3>
              <p className="text-[9px] text-[#6B4FD8] font-bold uppercase tracking-wider">Gestión de Talento Humano</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="w-8 h-8 rounded-full bg-[var(--color-surface-container-highest)] text-[var(--color-on-surface-variant)] flex items-center justify-center hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-container)] transition-all border border-[var(--color-outline-variant)]"
          >
            <X size={18}/>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-6 overflow-y-auto">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-xs">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {/* Sección 1: Datos Personales */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#6B4FD8]">
              <Briefcase size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface)]">Información Profesional</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1">Nombres</label>
                <input 
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none font-bold text-sm"
                  placeholder="Ej: Juan"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1">Apellidos</label>
                <input 
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none font-bold text-sm"
                  placeholder="Ej: Pérez"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1">DNI / CE</label>
                <input 
                  required
                  value={formData.documentId}
                  onChange={(e) => setFormData({...formData, documentId: e.target.value})}
                  className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none font-bold text-sm"
                  placeholder="Número de documento"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1">Cargo</label>
                <input 
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none font-bold text-sm"
                  placeholder="Ej: Analista de Ventas"
                />
              </div>
            </div>
          </div>

          <hr className="border-[var(--color-outline-variant)]" />

          {/* Sección 2: Remuneración */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#2E8B57]">
              <Banknote size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface)]">Esquema Salarial</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1">Tipo Sueldo</label>
                <select 
                  value={formData.salaryType}
                  onChange={(e) => setFormData({...formData, salaryType: e.target.value})}
                  className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none font-bold text-sm appearance-none cursor-pointer"
                >
                  <option value="fijo">Fijo</option>
                  <option value="variable">Variable</option>
                  <option value="mixto">Mixto</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1">Sueldo Base ({currencySymbol})</label>
                <input 
                  type="number"
                  required
                  value={formData.baseSalary}
                  onChange={(e) => setFormData({...formData, baseSalary: Number(e.target.value)})}
                  className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none font-bold text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase tracking-wider ml-1">Variable ({currencySymbol})</label>
                <input 
                  type="number"
                  value={formData.variableSalary}
                  onChange={(e) => setFormData({...formData, variableSalary: Number(e.target.value)})}
                  className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none font-bold text-sm"
                />
              </div>
            </div>
          </div>

          <hr className="border-[var(--color-outline-variant)]" />

          {/* Sección 3: Beneficios y Método de Pago */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Beneficios */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#6B4FD8]">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface)]">Beneficios Sociales</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(formData.benefits).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] hover:bg-[var(--color-surface-container)] transition-all cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setFormData({
                        ...formData, 
                        benefits: { ...formData.benefits, [key]: e.target.checked }
                      })}
                      className="w-4 h-4 accent-[#6B4FD8] rounded"
                    />
                    <span className="text-xs font-bold text-[var(--color-on-surface)] capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Método de Pago */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#6B4FD8]">
                <CreditCard size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface)]">Método de Pago</span>
              </div>
              <div className="space-y-4">
                <select 
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                  className="w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] focus:border-[#6B4FD8] outline-none font-bold text-sm appearance-none cursor-pointer"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="deposito">Depósito Bancario</option>
                </select>

                {formData.paymentMethod === 'deposito' && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <input 
                      placeholder="Banco"
                      value={formData.bankInfo.bankName}
                      onChange={(e) => setFormData({
                        ...formData, 
                        bankInfo: { ...formData.bankInfo, bankName: e.target.value }
                      })}
                      className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 text-xs font-bold text-[var(--color-on-surface)]"
                    />
                    <input 
                      placeholder="N° Cuenta"
                      value={formData.bankInfo.accountNumber}
                      onChange={(e) => setFormData({
                        ...formData, 
                        bankInfo: { ...formData.bankInfo, accountNumber: e.target.value }
                      })}
                      className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 text-xs font-bold text-[var(--color-on-surface)]"
                    />
                    <input 
                      placeholder="CCI"
                      value={formData.bankInfo.cci}
                      onChange={(e) => setFormData({
                        ...formData, 
                        bankInfo: { ...formData.bankInfo, cci: e.target.value }
                      })}
                      className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-lg px-3 py-2 text-xs font-bold text-[var(--color-on-surface)]"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-[var(--color-surface-container-low)] border-t border-[var(--color-outline-variant)] flex gap-4">
          <button 
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-variant)] transition-all disabled:opacity-50 text-xs uppercase tracking-widest"
          >
            Descartar
          </button>
          <button 
            type="submit"
            disabled={isSaving}
            className="flex-[2] bg-gradient-to-r from-[#6B4FD8] to-[#2E8B57] text-white font-black px-6 py-3 rounded-xl hover:shadow-[0_10px_20px_rgba(107,79,216,0.2)] disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-widest"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Guardando...
              </>
            ) : (employee ? 'Guardar Cambios' : 'Registrar Colaborador')}
          </button>
        </div>
      </form>
    </div>
  );
}
