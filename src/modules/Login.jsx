import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import VeloLogo from '../components/VeloLogo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Redirigir si ya hay una sesión activa (el rol ya fue determinado por AuthContext)
  useEffect(() => {
    if (user && user.role) {
      if (user.role === 'superadmin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/client/dashboard');
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (lockoutUntil && Date.now() < lockoutUntil) {
      const secsLeft = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setError(`Demasiados intentos. Espera ${secsLeft}s.`);
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await login(email, password);
      if (!response?.success) {
        setError(response?.error || 'Credenciales inválidas');
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        if (newAttempts >= 5) {
          setLockoutUntil(Date.now() + 60000);
          setLoginAttempts(0);
        }
      } else {
        setLoginAttempts(0);
        setLockoutUntil(null);
      }
    } catch (err) {
      setError('Ocurrió un error. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-background)' }} className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-body transition-colors duration-300">
      {/* Background Decorative Elements - Much slower animations */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-primary)] opacity-10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[var(--color-tertiary)] opacity-10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s', animationDuration: '12s' }}></div>

      <div className="max-w-md w-full z-10 relative">
        <header className="flex flex-col items-center justify-center mb-12 animate-fade-in">
          <VeloLogo variant="horizontal" mode={isDark ? 'dark' : 'light'} size="auto" className="w-[180px] md:w-[280px]" />
        </header>

        <form 
          onSubmit={handleLogin}
          style={{ 
            backgroundColor: 'var(--color-surface-container)', 
            borderColor: 'var(--color-outline-variant)' 
          }}
          className="border backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.05)]"
        >
          <div className="mb-8 text-center">
            <h2 style={{ color: 'var(--color-on-surface)' }} className="text-2xl font-bold mb-2 tracking-tight">Iniciar Sesión</h2>
            <p style={{ color: 'var(--color-on-surface-variant)' }} className="text-sm">Ingrese sus credenciales de acceso para continuar.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold flex items-center gap-2">
              <ShieldCheck size={18} />
              {error}
            </div>
          )}

          <div className="space-y-6 mb-8">
            <div className="relative">
              <label style={{ color: 'var(--color-on-surface-variant)' }} className="block text-xs font-bold uppercase tracking-widest mb-2">Correo Electrónico</label>
              <div className="relative flex items-center">
                <Mail style={{ color: 'var(--color-primary)' }} className="absolute left-4" size={18} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ 
                    backgroundColor: 'var(--color-background)', 
                    borderColor: 'var(--color-outline-variant)',
                    color: 'var(--color-on-surface)'
                  }}
                  className="w-full border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[var(--color-primary)] transition-all text-sm placeholder:opacity-50"
                  placeholder="admin@veloerp.com"
                />
              </div>
            </div>

            <div className="relative">
              <label style={{ color: 'var(--color-on-surface-variant)' }} className="block text-xs font-bold uppercase tracking-widest mb-2">Contraseña</label>
              <div className="relative flex items-center">
                <Lock style={{ color: 'var(--color-tertiary)' }} className="absolute left-4" size={18} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ 
                    backgroundColor: 'var(--color-background)', 
                    borderColor: 'var(--color-outline-variant)',
                    color: 'var(--color-on-surface)'
                  }}
                  className="w-full border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[var(--color-tertiary)] transition-all text-sm placeholder:opacity-50"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            style={{ 
              backgroundColor: 'var(--color-primary)', 
              color: 'var(--color-on-primary)' 
            }}
            className="w-full font-black py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 hover:opacity-90 shadow-md"
          >
            {isSubmitting ? 'Verificando...' : (
              <>
                Acceder al Portal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

