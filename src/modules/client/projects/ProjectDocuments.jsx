import { useState, useRef } from 'react';
import { FileText, Plus, Trash2, Download, ExternalLink, File, Image as ImageIcon, FileCode, Search, Grid, List as ListIcon, X, Archive, AlignLeft } from 'lucide-react';

export default function ProjectDocuments({ documents, addDoc, deleteDoc }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [searchQuery, setSearchQuery] = useState('');
  const [newDoc, setNewDoc] = useState({ name: '', url: '', type: 'pdf' });
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newDoc.name || !newDoc.url) return;
    
    await addDoc({
        ...newDoc,
        createdAt: new Date().toISOString(),
        size: newDoc.size || (Math.floor(Math.random() * 5000) + 100)
    });
    
    setNewDoc({ name: '', url: '', type: 'pdf' });
    setSelectedFileName('');
    setShowUploadModal(false);
  };

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper: convierte un string base64 data URL a un Blob
  const dataURLtoBlob = (dataURL) => {
    const parts = dataURL.split(',');
    const mime = parts[0].match(/:(.*?);/)[1];
    const bstr = atob(parts[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
    return new Blob([u8arr], { type: mime });
  };

  const handleDownload = async (doc) => {
    try {
      // Determinar extensión del archivo
      const extMap = { pdf: 'pdf', image: 'png', code: 'js', text: 'txt', zip: 'zip' };
      const ext = extMap[doc.type] || 'pdf';
      const fileName = doc.name.includes('.') ? doc.name : `${doc.name}.${ext}`;

      let blobToDownload;

      if (doc.url.startsWith('data:')) {
        // Archivo almacenado como base64 data URL → convertir a Blob
        blobToDownload = dataURLtoBlob(doc.url);
      } else if (doc.url.startsWith('blob:')) {
        // Blob temporal (misma sesión) → intentar fetch
        try {
          const res = await fetch(doc.url);
          blobToDownload = await res.blob();
        } catch {
          alert('Este archivo temporal ya no está disponible. Por favor, vuelve a subirlo.');
          return;
        }
      } else {
        // URL externa → descargar vía fetch
        const res = await fetch(doc.url);
        blobToDownload = await res.blob();
      }

      // Crear enlace de descarga con el blob
      const blobUrl = window.URL.createObjectURL(blobToDownload);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error al descargar:', error);
      // Fallback: abrir en nueva pestaña
      window.open(doc.url, '_blank');
    }
  };

  // Leer archivo local como base64 data URL (persiste aunque se refresque)
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      setNewDoc(prev => ({
        ...prev,
        name: prev.name || file.name.replace(/\.[^/.]+$/, ''),
        url: reader.result,  // data:...;base64,xxx
        size: Math.round(file.size / 1024),
        type: file.type.includes('image') ? 'image' :
              file.type.includes('pdf') ? 'pdf' :
              file.type.includes('javascript') || file.type.includes('json') ? 'code' :
              file.type.includes('zip') || file.name.endsWith('.zip') || file.name.endsWith('.rar') ? 'zip' :
              file.type.includes('text') || file.name.endsWith('.txt') ? 'text' : 'pdf'
      }));
    };
    reader.readAsDataURL(file);
  };

  const getFileIcon = (type) => {
    switch(type) {
        case 'pdf': return <FileText className="text-red-400" size={32} />;
        case 'image': return <ImageIcon className="text-blue-400" size={32} />;
        case 'code': return <FileCode className="text-emerald-400" size={32} />;
        case 'text': return <AlignLeft className="text-slate-400" size={32} />;
        case 'zip': return <Archive className="text-orange-400" size={32} />;
        default: return <File className="text-slate-400" size={32} />;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Sin fecha';
    
    // Manejar Firebase Timestamp
    if (date && typeof date === 'object' && 'seconds' in date) {
        return new Date(date.seconds * 1000).toLocaleDateString();
    }
    
    // Manejar Date object o ISO string
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'Sin fecha' : d.toLocaleDateString();
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Barra de Acciones */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[var(--color-surface-container)] p-4 rounded-3xl border border-[var(--color-outline-variant)] shadow-lg">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)] group-focus-within:text-[#6B4FD8] transition-colors" size={16} />
                <input 
                    type="text" 
                    placeholder="Buscar documentos..."
                    className="w-full bg-[var(--color-surface-variant)] border border-[var(--color-outline-variant)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--color-on-surface)] outline-none focus:border-[#6B4FD8] transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex gap-1 p-1 bg-[var(--color-surface-variant)] rounded-xl border border-[var(--color-outline-variant)]">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#6B4FD8] text-[#002150]' : 'text-[var(--color-on-surface-variant)] hover:bg-white/5'}`}><Grid size={16}/></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#6B4FD8] text-[#002150]' : 'text-[var(--color-on-surface-variant)] hover:bg-white/5'}`}><ListIcon size={16}/></button>
            </div>
        </div>

        <button 
            onClick={() => setShowUploadModal(true)}
            className="w-full md:w-auto bg-[#6B4FD8] text-[#002150] font-black px-8 py-3 rounded-2xl flex items-center justify-center gap-2 hover:shadow-xl transition-all"
        >
            <Plus size={20} /> Subir Documento
        </button>
      </div>

      {/* Grid de Documentos */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredDocs.map(doc => (
                <div key={doc.id} className="bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-3xl p-5 hover:border-[#6B4FD8]/50 transition-all group relative shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[var(--color-surface-variant)] rounded-2xl">
                            {getFileIcon(doc.type)}
                        </div>
                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleDownload(doc)} className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-all hover:scale-110" title="Descargar"><Download size={16}/></button>
                            <a href={doc.url} target="_blank" rel="noreferrer" className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all hover:scale-110" title="Ver archivo"><ExternalLink size={16}/></a>
                            <button onClick={() => deleteDoc(doc.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all hover:scale-110" title="Eliminar"><Trash2 size={16}/></button>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[var(--color-on-surface)] font-black text-xs truncate leading-tight mb-1" title={doc.name}>{doc.name}</h4>
                        <div className="flex justify-between items-center text-[9px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-tighter">
                            <span>{(doc.size / 1024).toFixed(1)} MB</span>
                            <span>{formatDate(doc.createdAt)}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      ) : (
        <div className="bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-3xl overflow-hidden shadow-lg">
            <table className="w-full text-left">
                <thead className="bg-[var(--color-surface-variant)]/50 border-b border-[var(--color-outline-variant)]">
                    <tr>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">Nombre</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] text-center">Tipo</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">Tamaño</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)]">Fecha</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-on-surface-variant)] text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-outline-variant)]/30">
                    {filteredDocs.map(doc => (
                        <tr key={doc.id} className="hover:bg-white/5 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <File size={16} className="text-[#6B4FD8]" />
                                    <span className="text-xs font-bold text-[var(--color-on-surface)]">{doc.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className="bg-[var(--color-surface-variant)] px-2 py-0.5 rounded text-[9px] font-black text-[var(--color-on-surface-variant)] uppercase">{doc.type}</span>
                            </td>
                            <td className="px-6 py-4 text-xs font-medium text-[var(--color-on-surface-variant)]">{(doc.size / 1024).toFixed(1)} MB</td>
                            <td className="px-6 py-4 text-xs font-medium text-[var(--color-on-surface-variant)]">{formatDate(doc.createdAt)}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDownload(doc)} className="p-2 text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-all hover:scale-110" title="Descargar"><Download size={16}/></button>
                                    <a href={doc.url} target="_blank" rel="noreferrer" className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all hover:scale-110" title="Ver archivo"><ExternalLink size={16}/></a>
                                    <button onClick={() => deleteDoc(doc.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all hover:scale-110" title="Eliminar"><Trash2 size={16}/></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}

      {filteredDocs.length === 0 && (
        <div className="p-20 text-center text-[var(--color-on-surface-variant)] opacity-40 italic text-sm">
            No se encontraron documentos
        </div>
      )}

      {/* Modal de Subida */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUploadModal(false)}></div>
            <form onSubmit={handleUpload} className="bg-[var(--color-surface-container)] w-full max-w-md border border-[var(--color-outline-variant)] rounded-[2rem] shadow-2xl relative animate-in zoom-in duration-300 overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-[#6B4FD8]/10 to-transparent border-b border-[var(--color-outline-variant)] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#6B4FD8] text-white rounded-xl shadow-lg shadow-[#6B4FD8]/30">
                            <Plus size={20} />
                        </div>
                        <h4 className="font-black text-[var(--color-on-surface)] uppercase tracking-widest text-sm">Añadir Documento</h4>
                    </div>
                    <button type="button" onClick={() => setShowUploadModal(false)} className="text-[var(--color-on-surface-variant)] hover:text-red-400 bg-[var(--color-surface-variant)] p-2 rounded-xl transition-colors">
                        <X size={16}/>
                    </button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#6B4FD8] uppercase tracking-wider ml-1">Nombre del Archivo</label>
                        <input required type="text" className="w-full bg-[var(--color-surface-variant)] border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] focus:ring-2 focus:ring-[#6B4FD8]/20 rounded-2xl px-5 py-3 text-[var(--color-on-surface)] text-sm outline-none transition-all" value={newDoc.name} onChange={(e) => setNewDoc({...newDoc, name: e.target.value})} placeholder="Ej: Contrato de Obra" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#6B4FD8] uppercase tracking-wider ml-1">Origen (URL o Archivo Local)</label>
                        <div className="flex gap-2 items-center bg-[var(--color-surface-variant)] border border-[var(--color-outline-variant)] focus-within:border-[#6B4FD8] focus-within:ring-2 focus-within:ring-[#6B4FD8]/20 rounded-2xl p-1 transition-all">
                            <input 
                                required 
                                type="text" 
                                className="flex-1 bg-transparent px-4 py-2.5 text-[var(--color-on-surface)] text-sm outline-none min-w-0" 
                                value={selectedFileName || newDoc.url} 
                                onChange={(e) => { setNewDoc({...newDoc, url: e.target.value}); setSelectedFileName(''); }} 
                                placeholder="Pega un enlace aquí..." 
                            />
                            <div className="w-px h-8 bg-[var(--color-outline-variant)] hidden sm:block"></div>
                            <label className="cursor-pointer bg-[#6B4FD8] hover:bg-[#5a42b8] text-white px-4 py-2.5 rounded-xl shadow-md shadow-[#6B4FD8]/20 transition-all flex items-center justify-center gap-2 group/file font-bold text-xs uppercase tracking-wider whitespace-nowrap">
                                <Plus size={16} className="group-hover/file:scale-110 transition-transform" /> PC
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                />
                            </label>
                        </div>
                        {selectedFileName && (
                            <p className="text-[10px] text-emerald-400 font-bold ml-1 flex items-center gap-1">
                                ✓ Archivo cargado: {selectedFileName}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#6B4FD8] uppercase tracking-wider ml-1">Clasificación</label>
                        <div className="flex flex-wrap gap-2">
                            {['pdf', 'image', 'code', 'text', 'zip'].map(t => (
                                <button key={t} type="button" onClick={() => setNewDoc({...newDoc, type: t})} className={`px-4 py-2.5 flex-1 min-w-[28%] rounded-xl text-[10px] font-bold border transition-all uppercase tracking-wider ${newDoc.type === t ? 'bg-[#6B4FD8] text-white border-[#6B4FD8] shadow-md shadow-[#6B4FD8]/30 scale-[1.02]' : 'bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] border-transparent hover:border-[#6B4FD8]/50'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-[var(--color-surface-variant)] border-t border-[var(--color-outline-variant)]">
                    <button type="submit" className="w-full bg-[#6B4FD8] hover:bg-[#5a42b8] text-white font-black py-4 rounded-2xl text-sm shadow-xl shadow-[#6B4FD8]/25 transition-all transform hover:-translate-y-1">
                        Confirmar y Guardar
                    </button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
}
