import React, { useState, useEffect } from 'react';
import { X, Globe, Save, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';

export default function IntegrationsModal({ 
  isOpen, 
  onClose, 
  orgId 
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    webhookUrlCreation: '',
    webhookUrlUpdate: ''
  });

  useEffect(() => {
    if (isOpen && orgId) {
      loadConfig();
    }
  }, [isOpen, orgId]);

  const loadConfig = async () => {
    setLoading(true);
    try {
      const orgDoc = await getDoc(doc(db, "organizations", orgId));
      const webhooks = orgDoc.data()?.settings?.calendarWebhooks || {};
      setConfig({
        webhookUrlCreation: webhooks.webhookUrlCreation || '',
        webhookUrlUpdate: webhooks.webhookUrlUpdate || ''
      });
    } catch (err) {
      console.error("Error loading webhook config:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const orgRef = doc(db, "organizations", orgId);
      await updateDoc(orgRef, {
        "settings.calendarWebhooks": config
      });
      onClose();
    } catch (err) {
      console.error("Error saving webhook config:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-[var(--color-surface-variant)] w-full max-w-md border border-[var(--color-outline-variant)] rounded-3xl shadow-lg relative animate-in zoom-in duration-300">
        
        <div className="p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-surface-container)] rounded-t-3xl">
           <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm flex items-center gap-2">
             <Globe size={16} className="text-[var(--color-primary)]" /> Webhooks e Integraciones
           </h3>
           <button onClick={onClose} className="text-[var(--color-on-surface-variant)] hover:text-white">
             <X size={16}/>
           </button>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="animate-spin text-[var(--color-primary)]" size={32} />
            <p className="text-xs font-bold text-[var(--color-on-surface-variant)]">Cargando configuración...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 space-y-6">
            <div className="bg-[var(--color-primary-container)]/30 border border-[var(--color-primary)]/20 p-4 rounded-2xl flex gap-3">
              <AlertCircle className="text-[var(--color-primary)] shrink-0" size={18} />
              <div className="space-y-1">
                <p className="text-xs font-bold text-[var(--color-on-surface)]">¿Cómo funciona?</p>
                <p className="text-[10px] text-[var(--color-on-surface-variant)] leading-relaxed">
                  Ingresa las URLs de tus webhooks (ej. Make, Zapier o Pipedream). PKT ERP enviará un POST con los datos de la cita cada vez que ocurra un evento.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Webhook: Nueva Cita</label>
                <div className="relative">
                  <input 
                    type="url" 
                    value={config.webhookUrlCreation}
                    onChange={e => setConfig({...config, webhookUrlCreation: e.target.value})}
                    placeholder="https://hook.make.com/..."
                    className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-xl px-4 py-3 pr-10 outline-none border border-[var(--color-outline-variant)] focus:border-[#6B4FD8]"
                  />
                  <ExternalLink size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] opacity-40" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Webhook: Actualización/Cambio</label>
                <div className="relative">
                  <input 
                    type="url" 
                    value={config.webhookUrlUpdate}
                    onChange={e => setConfig({...config, webhookUrlUpdate: e.target.value})}
                    placeholder="https://hook.make.com/..."
                    className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-xl px-4 py-3 pr-10 outline-none border border-[var(--color-outline-variant)] focus:border-[#6B4FD8]"
                  />
                  <ExternalLink size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] opacity-40" />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={saving}
              className="w-full bg-[#6B4FD8] text-[#001b5c] font-black px-4 py-3.5 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Guardar Configuración</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
