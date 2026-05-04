import React from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function PayslipDocument({ employee, calculations, orgData }) {
  const { formatPrice } = useAuth();
  const today = new Date().toLocaleDateString();

  return (
    <div className="bg-white text-black p-12 w-[21cm] min-h-[29.7cm] mx-auto shadow-sm print:shadow-none print:m-0 print:p-8" id="payslip-printable">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-8">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tighter">{orgData?.name || 'PKT ERP'}</h1>
          <p className="text-xs font-bold text-gray-600">RUC: {orgData?.taxId || '---'}</p>
          <p className="text-[10px] text-gray-500">{orgData?.address || '---'}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-black bg-black text-white px-4 py-2 uppercase tracking-widest">Boleta de Pago</h2>
          <p className="text-[10px] font-bold mt-2">MES: {new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase()}</p>
        </div>
      </div>

      {/* Employee Data */}
      <div className="grid grid-cols-2 gap-8 mb-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase">Colaborador</p>
          <p className="font-bold text-sm uppercase">{employee.firstName} {employee.lastName}</p>
          <p className="text-xs text-gray-600">{employee.documentId}</p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase">Cargo y Área</p>
          <p className="font-bold text-sm uppercase">{employee.position}</p>
          <p className="text-xs text-gray-600">Periodo Mensual</p>
        </div>
      </div>

      {/* Details Table */}
      <div className="border border-black rounded-lg overflow-hidden mb-12">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 border-b border-black font-bold uppercase text-[10px]">
              <th className="px-4 py-3 text-left">Conceptos</th>
              <th className="px-4 py-3 text-right">Ingresos</th>
              <th className="px-4 py-3 text-right">Deducciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="px-4 py-3 font-medium">Sueldo Base Mensual</td>
              <td className="px-4 py-3 text-right font-bold">{formatPrice(employee.baseSalary)}</td>
              <td className="px-4 py-3 text-right">---</td>
            </tr>
            {employee.variableSalary > 0 && (
              <tr>
                <td className="px-4 py-3 font-medium">Bonificaciones / Variable</td>
                <td className="px-4 py-3 text-right font-bold">{formatPrice(employee.variableSalary)}</td>
                <td className="px-4 py-3 text-right">---</td>
              </tr>
            )}
            {calculations.lateDeduction > 0 && (
              <tr>
                <td className="px-4 py-3 font-medium">Tardanzas / Faltas</td>
                <td className="px-4 py-3 text-right">---</td>
                <td className="px-4 py-3 text-right font-bold text-red-600">({formatPrice(calculations.lateDeduction)})</td>
              </tr>
            )}
            {calculations.loanInstallment > 0 && (
              <tr>
                <td className="px-4 py-3 font-medium">Amortización de Préstamo</td>
                <td className="px-4 py-3 text-right">---</td>
                <td className="px-4 py-3 text-right font-bold text-red-600">({formatPrice(calculations.loanInstallment)})</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-black text-white font-black text-base uppercase">
              <th className="px-4 py-4 text-left">Neto a Recibir</th>
              <th colSpan="2" className="px-4 py-4 text-right tracking-widest">{formatPrice(calculations.totalNet)}</th>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-20 mt-32">
        <div className="border-t border-black pt-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest">Firma del Empleador</p>
          <div className="mt-4 opacity-10 flex flex-col items-center">
            <div className="w-16 h-16 border-2 border-black rotate-12 flex items-center justify-center text-[8px] font-black uppercase">
              SELLO DIGITAL
            </div>
            <p className="text-[6px] mt-1 font-mono tracking-tighter">VERIFIED BY PKT ERP - {today}</p>
          </div>
        </div>
        <div className="border-t border-black pt-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest">Firma del Colaborador</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-12 text-center">
        <p className="text-[8px] text-gray-400 font-bold uppercase tracking-[0.3em]">Documento Generado por PKT ERP - Advanced Business Solutions</p>
      </div>
    </div>
  );
}
