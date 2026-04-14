import React, { useState } from 'react';
import { Users, Box, Calculator, FileText, Calendar, Briefcase, Plus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import CheckoutModal from './CheckoutModal';

const MODULES_CONFIG = [
  {
    id: 'crm',
    name: 'CRM y Ventas',
    description: 'Gestión de contactos, pipeline de ventas e historial de clientes.',
    price: '$29',
    icon: <Users size={24} />,
    color: 'var(--color-primary)'
  },
  {
    id: 'inventory',
    name: 'Inventario',
    description: 'Control de stock en tiempo real, alertas de reabastecimiento y categorías.',
    price: '$19',
    icon: <Box size={24} />,
    color: 'var(--color-tertiary)'
  },
  {
    id: 'sales',
    name: 'Ventas y Facturación',
    description: 'Emisión de facturas, cotizaciones y seguimiento de cobros.',
    price: '$39',
    icon: <FileText size={24} />,
    color: 'var(--color-primary)'
  },
  {
    id: 'finance',
    name: 'Contabilidad',
    description: 'Registro de ingresos/gastos, reportes financieros y flujo de caja.',
    price: '$25',
    icon: <Calculator size={24} />,
    color: 'var(--color-tertiary)'
  },
  {
    id: 'calendar',
    name: 'Agenda y Citas',
    description: 'Sistema de calendario para reservas y recordatorios automatizados.',
    price: '$15',
    icon: <Calendar size={24} />,
    color: 'var(--color-primary)'
  },
  {
    id: 'projects',
    name: 'Gestión de Proyectos',
    description: 'Tableros Kanban y seguimiento de tareas para equipos.',
    price: '$35',
    icon: <Briefcase size={24} />,
    color: 'var(--color-tertiary)'
  }
];

export default function MarketplaceModule() {
  const { user, SUBSCRIPTION_PLANS } = useAuth();
  const currentPlanId = user?.subscription?.planId || 'startup';

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-800 z-0"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl z-10"></div>
        
        <div className="relative z-20 max-w-2xl">
          <h1 className="text-5xl font-black tracking-tighter mb-4">Planes y Membresías</h1>
          <p className="text-lg opacity-80 font-medium leading-relaxed">
            Escala tu negocio con el plan que mejor se adapte a tus necesidades. Gestiona tus módulos y límites de forma centralizada.
          </p>
        </div>
      </div>

      {/* Grid of Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(SUBSCRIPTION_PLANS).map(([planId, plan]) => {
          const isCurrent = currentPlanId === planId;
          const isEnterprise = planId === 'enterprise';

          return (
            <div 
              key={planId}
              className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-500 hover:scale-[1.03] border-2 ${
                isCurrent 
                ? 'bg-[#192540] border-[#85adff] shadow-[0_20px_50px_rgba(133,173,255,0.15)]' 
                : 'bg-[#141f38] border-[#40485d]/30'
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-[#85adff] text-[#060e20] text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Tu Plan Actual
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#85adff]">
                    {planId === 'startup' ? 'S/ 0' : planId === 'business' ? 'S/ 199' : 'Tarifa'}
                  </span>
                  <span className="text-xs text-[#a3aac4] font-bold">
                    {planId === 'enterprise' ? 'Personalizada' : '/mes'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                <p className="text-[10px] font-bold text-[#a3aac4] uppercase tracking-widest border-b border-[#40485d]/30 pb-2">Incluye:</p>
                <div className="space-y-3">
                  {plan.modules.map(modId => (
                    <div key={modId} className="flex items-center gap-2 text-sm text-[#dee5ff]">
                      <CheckCircle2 size={16} className="text-[#4ADE80]" />
                      <span className="capitalize">{modId} Full Access</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-sm text-[#85adff] font-bold">
                    <Users size={16} />
                    <span>Límite de {plan.limits.users} usuarios</span>
                  </div>
                </div>
              </div>

              <button
                disabled={isCurrent}
                className={`w-full py-4 rounded-2xl font-black text-xs transition-all ${
                  isCurrent 
                  ? 'bg-transparent border border-[#85adff] text-[#85adff] cursor-default' 
                  : isEnterprise
                  ? 'bg-[#fbabff] text-[#060e20] hover:shadow-lg'
                  : 'bg-[#85adff] text-[#060e20] hover:shadow-lg active:scale-95'
                }`}
              >
                {isCurrent ? 'Plan Activo' : isEnterprise ? 'Contactar' : 'Mejorar Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-8 rounded-[2rem] bg-[#141f38] flex items-center justify-between gap-6 border border-[#40485d]/30">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-[#85adff]/10 flex items-center justify-center text-[#85adff] shrink-0">
            <Plus size={24} />
          </div>
          <div>
            <p className="font-black text-white">¿Necesitas un plan a medida?</p>
            <p className="text-xs text-[#a3aac4]">Podemos ajustar los límites y módulos según la escala de tu empresa.</p>
          </div>
        </div>
        <button className="px-6 py-3 rounded-xl border border-[#85adff] text-[#85adff] font-black text-xs hover:bg-[#85adff] hover:text-[#060e20] transition-all">
          Hablar con Consultor
        </button>
      </div>
    </div>
  );
}
