import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, CheckCircle2, Activity, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VeloLogo from '../components/VeloLogo';

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
  const [attempts, setAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Token de invitación faltante.');
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    if (lockoutUntil && Date.now() < lockoutUntil) {
      const secsLeft = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setError(`Demasiados intentos. Espera ${secsLeft}s.`);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await setupUserPassword(token, password);
      if (response && response.success) {
        setSuccess(true);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 3) {
          setLockoutUntil(Date.now() + 120000); // 2 minutos
          setAttempts(0);
        }
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
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6 relative overflow-hidden font-body text-center">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)]/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-secondary)]/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-md w-full bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] backdrop-blur-xl p-8 rounded-3xl shadow-xl z-10">
          <div className="w-16 h-16 bg-[#2E8B57]/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-[#2E8B57]/20">
            <CheckCircle2 className="text-[#2E8B57]" size={32} />
          </div>
          <h2 className="text-2xl font-black text-[var(--color-on-surface)] mb-4">¡Contraseña Configurada!</h2>
          <p className="text-[var(--color-on-surface-variant)] mb-8">Tu cuenta ha sido activada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[var(--color-primary)] text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-95"
          >
            Ir al Inicio de Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-6 relative overflow-hidden font-body">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)]/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-secondary)]/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-md w-full z-10 relative">
        <header className="text-center mb-10">
          <div className="w-16 h-16 bg-[var(--color-surface-container)] rounded-2xl flex items-center justify-center mb-6 mx-auto border border-[var(--color-outline-variant)]">
            <VeloLogo variant="symbol" mode="light" size="40" />
          </div>
          <h1 className="text-4xl font-black text-[var(--color-on-surface)] tracking-tighter mb-4">
            Activar <span className="text-[var(--color-primary)]">Veló</span>
          </h1>
          <p className="text-[var(--color-on-surface-variant)] text-sm font-bold">Configura tu contraseña para acceder al portal.</p>
        </header>

        {!token ? (
          <div className="bg-[var(--color-surface-container-low)] border border-red-500/30 backdrop-blur-xl p-8 rounded-3xl text-center shadow-xl">
            <ShieldCheck className="text-red-500 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-bold text-[var(--color-on-surface)] mb-2">Enlace Inválido</h2>
            <p className="text-[var(--color-on-surface-variant)] mb-6">El enlace de activación parece haber expirado o es incorrecto.</p>
            <button onClick={() => navigate('/')} className="text-[var(--color-primary)] font-black hover:underline">Volver al inicio</button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] backdrop-blur-xl p-8 rounded-3xl shadow-2xl"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-black text-[var(--color-on-surface)] mb-2 tracking-tight">Nueva Contraseña</h2>
              <p className="text-[var(--color-on-surface-variant)] text-sm font-bold">Por favor, establece una contraseña segura.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-2">
                <ShieldCheck size={18} />
                {error}
              </div>
            )}

            <div className="space-y-6 mb-8">
              <div className="relative">
                <label className="block text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-2 ml-1">Nueva Contraseña</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-[var(--color-primary)]" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[var(--color-primary)]/50 transition-all text-sm placeholder:text-[var(--color-on-surface-variant)]/40"
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-[10px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-widest mb-2 ml-1">Confirmar Contraseña</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-[var(--color-secondary)]" size={18} />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] text-[var(--color-on-surface)] rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[var(--color-secondary)]/50 transition-all text-sm placeholder:text-[var(--color-on-surface-variant)]/40"
                    placeholder="Repite la contraseña"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[var(--color-primary)] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 group disabled:opacity-50 transition-all shadow-lg shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-95"
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
