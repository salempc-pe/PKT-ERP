import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, CheckCircle2, Activity, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SetupPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { setupUserPassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Token de invitación faltante.');
      return;
    }
    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await setupUserPassword(token, password);
      if (response && response.success) {
        setSuccess(true);
      } else {
        setError(response?.error || 'Error al configurar la contraseña.');
      }
    } catch (err) {
      setError('Error al configurar la contraseña.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#060e20] flex items-center justify-center p-6 relative overflow-hidden font-body text-center">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#85adff]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#fbabff]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="max-w-md w-full bg-[#091328]/60 border border-[#40485d]/30 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_40px_rgba(133,173,255,0.05)] z-10">
          <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-green-500/20">
            <CheckCircle2 className="text-green-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-[#dee5ff] mb-4">¡Contraseña Configurada!</h2>
          <p className="text-[#a3aac4] mb-8">Tu cuenta ha sido activada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-[#85adff] to-[#fbabff] text-[#060e20] font-black py-4 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20"
          >
            Ir al Inicio de Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060e20] flex items-center justify-center p-6 relative overflow-hidden font-body">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#85adff]/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#fbabff]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-md w-full z-10 relative">
        <header className="text-center mb-10">
          <div className="w-16 h-16 bg-[#85adff]/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-[#85adff]/20">
            <Activity className="text-[#85adff]" size={32} />
          </div>
          <h1 className="text-4xl font-black text-[#dee5ff] tracking-tighter mb-4">
            Activar <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#85adff] to-[#fbabff]">Cuenta</span>
          </h1>
          <p className="text-[#a3aac4] text-sm">Configura tu contraseña para acceder al portal.</p>
        </header>

        {!token ? (
          <div className="bg-[#091328]/60 border border-red-500/30 backdrop-blur-xl p-8 rounded-3xl text-center">
            <ShieldCheck className="text-red-400 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-bold text-[#dee5ff] mb-2">Enlace Inválido</h2>
            <p className="text-[#a3aac4] mb-6">El enlace de activación parece haber expirado o es incorrecto.</p>
            <button onClick={() => navigate('/')} className="text-[#85adff] font-bold hover:underline">Volver al inicio</button>
          </div>
        ) : (
          <form 
            onSubmit={handleSubmit}
            className="bg-[#091328]/60 border border-[#40485d]/30 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_40px_rgba(133,173,255,0.05)]"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#dee5ff] mb-2 tracking-tight">Nueva Contraseña</h2>
              <p className="text-[#a3aac4] text-sm">Por favor, establece una contraseña segura.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-2">
                <ShieldCheck size={18} />
                {error}
              </div>
            )}

            <div className="space-y-6 mb-8">
              <div className="relative">
                <label className="block text-xs font-bold text-[#a3aac4] uppercase tracking-widest mb-2">Nueva Contraseña</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-[#85adff]" size={18} />
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#060e20] border border-[#40485d]/50 text-[#dee5ff] rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[#85adff]/50 transition-all text-sm placeholder:text-[#a3aac4]/40"
                    placeholder="Mínimo 4 caracteres"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-xs font-bold text-[#a3aac4] uppercase tracking-widest mb-2">Confirmar Contraseña</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-[#fbabff]" size={18} />
                  <input 
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#060e20] border border-[#40485d]/50 text-[#dee5ff] rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[#fbabff]/50 transition-all text-sm placeholder:text-[#a3aac4]/40"
                    placeholder="Repite la contraseña"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#85adff] to-[#fbabff] text-[#060e20] font-black py-4 rounded-xl flex items-center justify-center gap-2 group disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Guardando...' : (
                <>
                  Activar Cuenta <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
