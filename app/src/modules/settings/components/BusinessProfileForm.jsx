import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { useAuth } from '../../../context/AuthContext';
import { Save, CheckCircle2, User, Building, Mail, MapPin, Upload, Image as ImageIcon } from 'lucide-react';


export default function BusinessProfileForm() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: user?.organizationName || '',
    email: '',
    sector: '',
    address: '',
    logoUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'organizations', orgId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFormData(prev => ({ ...prev, ...docSnap.data() }));
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [orgId, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Determinar el lado más corto para el recorte cuadrado
        const size = Math.min(img.width, img.height);
        const offsetX = (img.width - size) / 2;
        const offsetY = (img.height - size) / 2;

        // Tamaño objetivo para ligereza (icono de 200x200)
        const targetSize = 200;
        canvas.width = targetSize;
        canvas.height = targetSize;

        // Dibujar y recortar
        ctx.drawImage(
          img,
          offsetX, offsetY, size, size, // Recorte de origen
          0, 0, targetSize, targetSize  // Destino
        );

        const base64Logo = canvas.toDataURL('image/webp', 0.8);
        setFormData(prev => ({ ...prev, logoUrl: base64Logo }));
        setSuccess(false);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    

    try {
      const docRef = doc(db, 'organizations', orgId);
      await setDoc(docRef, {
        ...formData,
        updatedAt: new Date()
      }, { merge: true });
      
      setSuccess(true);
    } catch (err) {
      console.error("Error saving profile", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4 max-w-2xl">
      <div className="h-10 bg-[#141f38] rounded-xl w-full"></div>
      <div className="h-10 bg-[#141f38] rounded-xl w-full"></div>
      <div className="h-10 bg-[#141f38] rounded-xl w-full"></div>
    </div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-[#141f38] p-6 lg:p-8 rounded-3xl border border-[#40485d]/30">
        <h3 className="text-xl font-bold text-[#dee5ff] mb-6 flex items-center gap-2">
          <Building className="text-[#85adff]" size={20} /> Información de la Empresa
        </h3>
        
        {/* Logo Upload Section */}
        <div className="mb-8 flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-[#091328]/50 border border-[#85adff]/10">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#141f38] border-2 border-dashed border-[#85adff]/30 flex items-center justify-center transition-all group-hover:border-[#85adff]/60">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt="Logo preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="text-[#40485d]" size={32} />
              )}
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-sm font-bold text-[#dee5ff] mb-1">Logo de la Empresa</h4>
            <p className="text-xs text-[#a3aac4] mb-4">Formato cuadrado optimizado (máx. 200x200).</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleLogoUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#85adff]/10 text-[#85adff] text-xs font-black hover:bg-[#85adff]/20 transition-all"
            >
              <Upload size={14} />
              {formData.logoUrl ? 'Cambiar Logo' : 'Subir Logo'}
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#a3aac4] mb-2">Nombre Comercial</label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-[#40485d]" size={18} />
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#091328] border border-[#40485d]/50 rounded-xl py-3 pl-12 pr-4 text-[#dee5ff] focus:outline-none focus:border-[#85adff] transition-colors"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#a3aac4] mb-2">Sector / Industria</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#40485d]" size={18} />
              <input 
                type="text" 
                name="sector"
                value={formData.sector}
                onChange={handleChange}
                className="w-full bg-[#091328] border border-[#40485d]/50 rounded-xl py-3 pl-12 pr-4 text-[#dee5ff] focus:outline-none focus:border-[#85adff] transition-colors"
                placeholder="Ej. Retail, Tecnología, Servicios"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#a3aac4] mb-2">Correo Electrónico Principal</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#40485d]" size={18} />
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#091328] border border-[#40485d]/50 rounded-xl py-3 pl-12 pr-4 text-[#dee5ff] focus:outline-none focus:border-[#85adff] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#a3aac4] mb-2">Dirección Fiscal / Sede Central</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#40485d]" size={18} />
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-[#091328] border border-[#40485d]/50 rounded-xl py-3 pl-12 pr-4 text-[#dee5ff] focus:outline-none focus:border-[#85adff] transition-colors"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex items-center gap-4">
          <button 
            type="submit" 
            disabled={saving}
            className="bg-[#85adff] hover:bg-[#6e9fff] text-[#002150] font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-[#002150]/30 border-t-[#002150] rounded-full animate-spin"></div>
            ) : (
              <Save size={18} />
            )}
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          
          {success && (
            <div className="flex items-center gap-2 text-[#50e3c2] animate-in fade-in slide-in-from-left-4">
              <CheckCircle2 size={18} />
              <span className="text-sm font-bold">Perfil actualizado exitosamente.</span>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
