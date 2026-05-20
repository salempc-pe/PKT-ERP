import React, { useState } from 'react';
import { Users, Box, Calculator, FileText, Calendar, Briefcase, Plus, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import CheckoutModal from './CheckoutModal';
import { MODULE_IDS, MODULE_NAMES } from '../../moduleNames';

const MODULES_CONFIG = [
  {
    id: MODULE_IDS.CRM,
    name: MODULE_NAMES[MODULE_IDS.CRM],
    description: 'Gestión de contactos, pipeline de ventas e historial de clientes.',
    price: '$29',
    icon: <Users size={24} />,
    color: 'var(--color-primary)'
  },
  {
    id: MODULE_IDS.INVENTORY,
    name: MODULE_NAMES[MODULE_IDS.INVENTORY],
    description: 'Control de stock en tiempo real, alertas de reabastecimiento y categorías.',
    price: '$19',
    icon: <Box size={24} />,
    color: 'var(--color-tertiary)'
  },
  {
    id: MODULE_IDS.SALES,
    name: MODULE_NAMES[MODULE_IDS.SALES],
    description: 'Emisión de facturas, cotizaciones y seguimiento de cobros.',
    price: '$39',
    icon: <FileText size={24} />,
    color: 'var(--color-primary)'
  },
  {
    id: MODULE_IDS.FINANCE,
    name: MODULE_NAMES[MODULE_IDS.FINANCE],
    description: 'Registro de ingresos/gastos, reportes financieros y flujo de caja.',
    price: '$25',
    icon: <Calculator size={24} />,
    color: 'var(--color-tertiary)'
  },
  {
    id: MODULE_IDS.CALENDAR,
    name: MODULE_NAMES[MODULE_IDS.CALENDAR],
    description: 'Sistema de calendario para reservas y recordatorios automatizados.',
    price: '$15',
    icon: <Calendar size={24} />,
    color: 'var(--color-primary)'
  },
  {
    id: MODULE_IDS.PROJECTS,
    name: MODULE_NAMES[MODULE_IDS.PROJECTS],
    description: 'Tableros Kanban y seguimiento de tareas para equipos.',
    price: '$35',
    icon: <Briefcase size={24} />,
    color: 'var(--color-tertiary)'
  },
  {
    id: MODULE_IDS.HEALTH,
    name: MODULE_NAMES[MODULE_IDS.HEALTH],
    description: 'Expedientes clínicos, notas de evolución y control de pacientes.',
    price: '$45',
    icon: <Plus size={24} />,
    color: 'var(--color-primary)'
  }
];

export default function MarketplaceModule() {
  const { user, SUBSCRIPTION_PLANS } = useAuth();
  const currentPlanId = user?.subscription?.planId || 'startup';

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Grid of Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(SUBSCRIPTION_PLANS).map(([planId, plan]) => {
          const isCurrent = currentPlanId === planId;
          const isEnterprise = planId === 'enterprise';

          return (
            <div
              key={planId}
              className={`relative flex flex-col p-8 rounded-[2.5rem] transition-all duration-500 hover:scale-[1.03] border-2 ${isCurrent
                  ? 'bg-[var(--color-surface-container-high)] border-[#6B4FD8] shadow-[0_20px_50px_rgba(107,79,216,0.15)]'
                  : 'bg-[var(--color-surface-container)] border-[var(--color-outline-variant)]'
                }`}
            >
              {isCurrent && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full bg-[#6B4FD8] text-white text-[10px] font-black uppercase tracking-widest">
                  Tu Plan Actual
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-black text-[var(--color-on-surface)] mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[var(--color-primary)]">
                    {planId === 'startup' ? 'S/ 0' : planId === 'business' ? 'S/ 199' : 'Tarifa'}
                  </span>
                  <span className="text-xs text-[var(--color-on-surface-variant)] font-bold">
                    {planId === 'enterprise' ? 'Personalizada' : '/mes'}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                <p className="text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest border-b border-[var(--color-outline-variant)] pb-2">Incluye:</p>
                <div className="space-y-3">
                   {plan.modules.map(modId => (
                    <div key={modId} className="flex items-center gap-2 text-sm text-[var(--color-on-surface)]">
                      <CheckCircle2 size={16} className="text-[#4ADE80]" />
                      <span>{MODULE_NAMES[modId] || modId} (Acceso Completo)</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 text-sm text-[var(--color-primary)] font-bold">
                    <Users size={16} />
                    <span>Límite de {plan.limits.users} usuarios</span>
                  </div>
                </div>
              </div>

              <button
                disabled={isCurrent}
                className={`w-full py-4 rounded-2xl font-black text-xs transition-all ${isCurrent
                    ? 'bg-transparent border border-[#6B4FD8] text-[var(--color-primary)] cursor-default'
                    : isEnterprise
                      ? 'bg-[#2E8B57] text-white hover:shadow-[0_0_15px_rgba(46,139,87,0.4)]'
                      : 'bg-[#6B4FD8] text-[#002150] hover:shadow-[0_0_15px_rgba(133,173,255,0.4)] active:scale-95'
                  }`}
              >
                {isCurrent ? 'Plan Activo' : isEnterprise ? 'Contactar' : 'Mejorar Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-8 rounded-[2rem] bg-[var(--color-surface-container)] flex items-center justify-between gap-6 border border-[var(--color-outline-variant)]">
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-[#6B4FD8]/10 flex items-center justify-center text-[var(--color-primary)] shrink-0">
            <Plus size={24} />
          </div>
          <div>
            <p className="font-black text-[var(--color-on-surface)]">¿Necesitas un plan a medida?</p>
            <p className="text-xs text-[var(--color-on-surface-variant)]">Podemos ajustar los límites y módulos según la escala de tu empresa.</p>
          </div>
        </div>
        <button className="px-6 py-3 rounded-xl border border-[#6B4FD8] text-[var(--color-primary)] font-black text-xs hover:bg-[#6B4FD8] hover:text-white transition-all">
          Hablar con Consultor
        </button>
      </div>
    </div>
  );
}
