import { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowRight, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await login(email, password);
      if (!response?.success) {
        setError(response?.error || 'Credenciales inválidas');
      }
    } catch (err) {
      setError('Ocurrió un error. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060e20] flex items-center justify-center p-6 relative overflow-hidden font-body">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#85adff]/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#fbabff]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-md w-full z-10 relative">
        <header className="text-center mb-10 animate-fade-in">
          <div className="w-16 h-16 bg-[#85adff]/10 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-[#85adff]/20">
            <Activity className="text-[#85adff]" size={32} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-[#dee5ff] tracking-tighter mb-4">
            PKT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#85adff] to-[#fbabff]">ERP</span>
          </h1>
          <p className="text-[#a3aac4] text-sm font-medium mx-auto">
            Ingreso Seguro &bull; Control Centralizado
          </p>
        </header>

        <form 
          onSubmit={handleLogin}
          className="bg-[#091328]/60 border border-[#40485d]/30 backdrop-blur-xl p-8 rounded-3xl shadow-[0_0_40px_rgba(133,173,255,0.05)]"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#dee5ff] mb-2 tracking-tight">Iniciar Sesión</h2>
            <p className="text-[#a3aac4] text-sm">Ingrese sus credenciales de acceso para continuar.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-2">
              <ShieldCheck size={18} />
              {error}
            </div>
          )}

          <div className="space-y-6 mb-8">
            <div className="relative">
              <label className="block text-xs font-bold text-[#a3aac4] uppercase tracking-widest mb-2">Correo Electrónico</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 text-[#85adff]" size={18} />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#060e20] border border-[#40485d]/50 text-[#dee5ff] rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[#85adff]/50 focus:ring-1 focus:ring-[#85adff]/50 transition-all text-sm placeholder:text-[#a3aac4]/50"
                  placeholder="admin@pkterp.com"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-bold text-[#a3aac4] uppercase tracking-widest mb-2">Contraseña</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-[#fbabff]" size={18} />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#060e20] border border-[#40485d]/50 text-[#dee5ff] rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[#fbabff]/50 focus:ring-1 focus:ring-[#fbabff]/50 transition-all text-sm placeholder:text-[#a3aac4]/50"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#85adff] to-[#fbabff] hover:opacity-90 text-[#060e20] font-black py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {isSubmitting ? 'Verificando...' : (
              <>
                Acceder al Portal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-[#a3aac4]/50">
            <strong>Credenciales prueba:</strong><br/>
            Admin: test@admin.com / 1234<br/>
            Cliente: test@cliente.com / 1234
          </p>
        </div>
      </div>
    </div>
  );
}
