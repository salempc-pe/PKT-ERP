import React, { useState } from 'react';
import { useHealth } from '../useHealth';
import { Upload, File, Trash2, Download, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function RecordFilesTab({ clientId, orgId }) {
  const { archivos, addArchivo, deleteArchivo } = useHealth(orgId);
  const [isUploading, setIsUploading] = useState(false);

  const clientFiles = archivos.filter(f => f.client_id === clientId);

  // Simular carga a Firebase Storage en lugar de fallar silenciosamente si falta bucket
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
       // --- SIMULACIÓN DE SUBIDA (Backend agnostic flow) ---
       await new Promise(res => setTimeout(res, 1500));
       
       // Crear objeto de metadatos
       await addArchivo({
          client_id: clientId,
          nombre: file.name,
          url: `https://firebasestorage.googleapis.com/v0/b/simulacion/${file.name}`, // URL dummy para el frontend
          tipo: file.type || 'application/octet-stream'
       });

    } catch(err) {
       alert("Error subiendo: " + err.message);
    } finally {
       setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
     if (window.confirm("¿Eliminar permanentemente este documento?")) {
        try { await deleteArchivo(id); } catch(e) { console.error(e); }
     }
  };

  const getFileIcon = (mime) => {
     if (mime.includes('image')) return <ImageIcon size={24} className="text-purple-400" />;
     if (mime.includes('pdf')) return <FileText size={24} className="text-red-400" />;
     return <File size={24} className="text-blue-400" />;
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
       
       {/* Header Area with Upload */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] rounded-2xl p-5">
          <div>
             <h3 className="text-sm font-black uppercase tracking-widest text-[var(--color-on-surface)]">Documentación Médica</h3>
             <p className="text-[10px] font-bold text-[var(--color-on-surface-variant)] opacity-60">Resultados, exámenes y consentimientos informados.</p>
          </div>
          
          <label className="relative flex items-center gap-2 bg-[#6B4FD8] text-[#002150] text-xs font-black uppercase px-5 py-2.5 rounded-xl hover:shadow-lg transition-all cursor-pointer active:scale-95 overflow-hidden">
             {isUploading ? (
                <>
                  <Loader2 size={16} className="animate-spin"/> Subiendo...
                  <div className="absolute bottom-0 left-0 h-1 bg-white/50 w-full animate-pulse"></div>
                </>
             ) : (
                <>
                  <Upload size={16}/> Subir Archivo
                  <input type="file" className="hidden" onChange={handleFileChange} disabled={isUploading}/>
                </>
             )}
          </label>
       </div>

       {/* Files Grid */}
       {clientFiles.length === 0 ? (
          <div className="border border-dashed border-[var(--color-outline-variant)] rounded-3xl p-12 text-center opacity-60 flex flex-col items-center">
             <Upload size={40} className="text-[var(--color-on-surface-variant)] mb-4" />
             <p className="text-sm font-bold text-[var(--color-on-surface)]">No hay archivos adjuntos todavía.</p>
             <p className="text-[11px] text-[var(--color-on-surface-variant)]">Sube PDFs o imágenes para conservarlos en la ficha.</p>
          </div>
       ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             {clientFiles.map(file => (
                <div key={file.id} className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)] p-4 rounded-2xl flex flex-col group hover:border-[#6B4FD8]/30 transition-all">
                   <div className="flex items-start justify-between mb-3">
                      <div className="p-3 bg-[var(--color-surface-variant)] rounded-xl border border-[var(--color-outline-variant)]">
                         {getFileIcon(file.tipo)}
                      </div>
                      <button onClick={() => handleDelete(file.id)} className="p-1.5 text-[var(--color-on-surface-variant)] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-500/10">
                         <Trash2 size={16} />
                      </button>
                   </div>

                   <h4 className="text-xs font-bold text-[var(--color-on-surface)] truncate" title={file.nombre}>
                      {file.nombre}
                   </h4>
                   <p className="text-[9px] font-black uppercase text-[var(--color-on-surface-variant)] opacity-60 mt-0.5">
                      {file.uploaded_at?.toDate ? file.uploaded_at.toDate().toLocaleDateString() : 'Reciente'}
                   </p>

                   <div className="mt-4 pt-3 border-t border-[var(--color-outline-variant)]/30">
                      <a 
                        href={file.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[var(--color-surface-variant)] text-[var(--color-on-surface)] text-[10px] font-black uppercase py-2 rounded-xl border border-[var(--color-outline-variant)] hover:bg-[var(--color-on-surface-variant)] hover:text-[var(--color-surface-container)] transition-all"
                      >
                         <Download size={12} /> Descargar / Ver
                      </a>
                   </div>
                </div>
             ))}
          </div>
       )}
    </div>
  );
}
