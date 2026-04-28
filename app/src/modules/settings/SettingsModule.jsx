import BusinessProfileForm from './components/BusinessProfileForm';

export default function SettingsModule() {
  return (
    <div className="animate-in fade-in duration-500 space-y-10">
      <section className="relative rounded-3xl overflow-hidden p-6 lg:p-10 bg-[#0f0f0f]">
        <div className="relative z-10 max-w-2xl">
          <span className="text-[#6B4FD8] font-bold tracking-[0.2em] text-xs uppercase mb-4 block">Administración del Tenant</span>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-[#dee5ff] mb-6 leading-tight">
            Configuración de la <span className="text-[#6B4FD8]">Empresa</span>.
          </h2>
          <p className="text-[#a3aac4] text-sm lg:text-lg leading-relaxed">
            Actualiza los datos de tu negocio. Estos datos serán visibles en tus facturas y documentos generados.
          </p>
        </div>
        
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 pointer-events-none hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-l from-[#6B4FD8]/40 to-transparent"></div>
          <div className="absolute right-20 top-1/2 -translate-y-1/2 w-80 h-80 border border-[#6B4FD8]/20 rounded-full"></div>
        </div>
      </section>

      <section>
        <BusinessProfileForm />
      </section>
    </div>
  );
}
