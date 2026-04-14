import React from 'react';
import { ShoppingCart, CheckCircle2, X } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, module, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        style={{ backgroundColor: 'var(--color-surface-container-high)', border: '1px solid var(--color-outline-variant)' }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-[var(--color-on-surface)] flex items-center gap-2">
              <ShoppingCart size={24} className="text-[var(--color-primary)]" />
              Solicitar Módulo
            </h3>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[var(--color-surface-variant)] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-2xl bg-[var(--color-surface-container)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--color-primary-container)] text-[var(--color-primary)]">
                {module.icon}
              </div>
              <div className="flex-1">
                <p className="font-bold text-[var(--color-on-surface)]">{module.name}</p>
                <p className="text-xs text-[var(--color-on-surface-variant)] opacity-70">Sujeto a aprobación por el administrador</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest pl-1">Información de Solicitud</p>
              <div className="flex justify-between text-sm">
                <span>Estado</span>
                <span className="font-black text-[var(--color-primary)]">Pendiente de Revisión</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={onConfirm}
              className="w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
            >
              <CheckCircle2 size={18} />
              Enviar Solicitud
            </button>
            <p className="text-[10px] text-center text-[var(--color-on-surface-variant)] opacity-50 px-4">
              Al confirmar, el administrador de la plataforma recibirá tu solicitud de activación. No se generarán cargos hasta su aprobación.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
