import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useAuth } from '../../../context/AuthContext';
import { Smartphone, RefreshCw, CheckCircle, XCircle, AlertTriangle, KeyRound } from 'lucide-react';

export default function WhatsappBindingPanel() {
  const { user, updateUser } = useAuth();
  const userId = user?.uid;
  const orgId = user?.organizationId || 'default_org';

  const [whatsappNumber, setWhatsappNumber] = useState(user?.whatsappNumber || '');
  const [currentBinding, setCurrentBinding] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [unbinding, setUnbinding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar estado de vinculación inicial del usuario desde Firestore
  useEffect(() => {
    const fetchUserWhatsapp = async () => {
      if (!userId) return;
      try {
        const userDocRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.whatsappNumber) {
            setWhatsappNumber(userData.whatsappNumber);
            // Sincronizar en el contexto por si acaso
            updateUser({ whatsappNumber: userData.whatsappNumber });
          } else {
            setWhatsappNumber('');
          }
        }
      } catch (err) {
        console.error("Error cargando perfil del usuario:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserWhatsapp();
  }, [userId]);

  // Manejar el temporizador de cuenta regresiva
  useEffect(() => {
    if (timeLeft <= 0) {
      if (currentBinding) {
        setCurrentBinding(null);
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, currentBinding]);

  // Generar código OTP aleatorio de 6 dígitos
  const generateOTP = () => {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10).toString();
    }
    return code;
  };

  // Crear el documento de vinculación en Firestore
  const handleGenerateToken = async () => {
    if (!userId) return;
    setGenerating(true);
    try {
      const code = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos de expiración

      // Guardar en la colección /whatsapp_bindings usando el propio código como ID
      const bindingRef = doc(db, 'whatsapp_bindings', code);
      await setDoc(bindingRef, {
        code,
        userId,
        organizationId: orgId,
        expiresAt: expiresAt
      });

      setCurrentBinding({
        code,
        expiresAt
      });
      setTimeLeft(600); // 10 minutos en segundos
    } catch (err) {
      console.error("Error generando token de WhatsApp:", err);
    } finally {
      setGenerating(false);
    }
  };

  // Eliminar la vinculación (desvincular número)
  const handleUnbind = async () => {
    if (!userId) return;
    if (!window.confirm("¿Estás seguro de que deseas desvincular este número de WhatsApp? El asistente de IA ya no responderá a tus consultas por este canal.")) {
      return;
    }

    setUnbinding(true);
    try {
      // 1. Quitar el whatsappNumber del documento de usuario en Firestore
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        whatsappNumber: null
      });

      // 2. Actualizar el estado local y de contexto
      setWhatsappNumber('');
      updateUser({ whatsappNumber: null });

      // Opcional: Buscar y eliminar vinculaciones anteriores
      if (currentBinding) {
        const bindingRef = doc(db, 'whatsapp_bindings', currentBinding.code);
        await deleteDoc(bindingRef);
        setCurrentBinding(null);
        setTimeLeft(0);
      }
    } catch (err) {
      console.error("Error al desvincular WhatsApp:", err);
    } finally {
      setUnbinding(false);
    }
  };

  // Formatear el tiempo en MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="bg-[#141414] p-6 lg:p-8 rounded-3xl border border-[#40485d]/30 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#6B4FD8]/30 border-t-[#6B4FD8] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] p-6 lg:p-8 rounded-3xl border border-[#40485d]/30">
      <h3 className="text-xl font-bold text-[#dee5ff] mb-6 flex items-center gap-2">
        <Smartphone className="text-[#6B4FD8]" size={20} /> Asistente de IA & WhatsApp
      </h3>

      {whatsappNumber ? (
        // Estado: Vinculado
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#50e3c2]/5 border border-[#50e3c2]/20 flex flex-col md:flex-row items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-[#50e3c2]/10 flex items-center justify-center text-[#50e3c2]">
              <CheckCircle size={28} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-base font-bold text-[#dee5ff] mb-1">WhatsApp Vinculado con Éxito</h4>
              <p className="text-sm text-[#a3aac4]">
                Tu cuenta está conectada al número de teléfono:{' '}
                <span className="text-[#50e3c2] font-mono font-bold">
                  {whatsappNumber.substring(0, 3)} *** *** {whatsappNumber.substring(whatsappNumber.length - 2)}
                </span>
              </p>
              <p className="text-xs text-[#6e758a] mt-1">
                Ahora puedes chatear directamente con tu asistente de IA desde WhatsApp para consultar inventarios, registrar ventas y más.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleUnbind}
              disabled={unbinding}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-bold transition-all disabled:opacity-50"
            >
              <XCircle size={16} />
              {unbinding ? 'Desvinculando...' : 'Desvincular Cuenta'}
            </button>
          </div>
        </div>
      ) : (
        // Estado: No Vinculado
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#0f0f0f]/50 border border-[#6B4FD8]/10 text-[#a3aac4] text-sm leading-relaxed space-y-4">
            <p>
              Conecta tu cuenta de Veló ERP con WhatsApp para interactuar con tu Asistente de IA personal por chat móvil. 
              El asistente está aislado a los datos de tu organización y respetará tus permisos y roles empresariales de manera segura.
            </p>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#6B4FD8]/5 border border-[#6B4FD8]/10 text-xs text-[#dee5ff]">
              <AlertTriangle className="text-[#6B4FD8] shrink-0 mt-0.5" size={16} />
              <div>
                <span className="font-bold block mb-1">Instrucciones de Vinculación</span>
                <ol className="list-decimal pl-4 space-y-1 text-[#a3aac4]">
                  <li>Genera un token temporal OTP a continuación.</li>
                  <li>Envía ese código de 6 dígitos como un mensaje de WhatsApp a nuestro número oficial del Asistente de IA.</li>
                  <li>¡Listo! El asistente confirmará la vinculación en segundos.</li>
                </ol>
              </div>
            </div>
          </div>

          {currentBinding ? (
            // Token Generado y Activo
            <div className="p-6 rounded-2xl bg-[#6B4FD8]/5 border border-[#6B4FD8]/20 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B4FD8]/10 text-[#6B4FD8] text-xs font-bold uppercase tracking-wider">
                <KeyRound size={12} /> Token OTP Temporal
              </div>
              
              <div className="text-4xl lg:text-5xl font-black tracking-[0.25em] text-[#dee5ff] font-mono bg-[#0f0f0f] px-8 py-4 rounded-2xl border border-[#6B4FD8]/30 shadow-inner">
                {currentBinding.code}
              </div>

              <div className="flex items-center gap-2 text-sm text-[#a3aac4]">
                <RefreshCw className="animate-spin text-[#6B4FD8]" size={16} />
                <span>Válido por: <strong className="text-[#dee5ff] font-mono font-bold">{formatTime(timeLeft)}</strong></span>
              </div>

              <button
                onClick={handleGenerateToken}
                disabled={generating}
                className="text-xs text-[#6B4FD8] hover:text-[#C4B9F0] font-black underline transition-colors"
              >
                Generar nuevo código
              </button>
            </div>
          ) : (
            // Botón para Generar
            <div className="flex justify-center py-4">
              <button
                onClick={handleGenerateToken}
                disabled={generating}
                className="bg-[#6B4FD8] hover:bg-[#C4B9F0] text-[#002150] font-extrabold px-8 py-4 rounded-xl flex items-center gap-3 transition-colors shadow-lg shadow-[#6B4FD8]/15 disabled:opacity-50"
              >
                {generating ? (
                  <div className="w-5 h-5 border-2 border-[#002150]/30 border-t-[#002150] rounded-full animate-spin"></div>
                ) : (
                  <Smartphone size={20} />
                )}
                Generar Código de Vinculación
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
