import { useState } from 'react';
import { FileText, Plus, Trash2, Download, ExternalLink, File, Image as ImageIcon, FileCode, Search, Grid, List as ListIcon, X } from 'lucide-react';

export default function ProjectDocuments({ documents, addDoc, deleteDoc }) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid, list
  const [searchQuery, setSearchQuery] = useState('');
  const [newDoc, setNewDoc] = useState({ name: '', url: '', type: 'pdf' });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newDoc.name || !newDoc.url) return;
    
    await addDoc({
        ...newDoc,
        createdAt: new Date().toISOString(),
        size: Math.floor(Math.random() * 5000) + 100 // Simulado
    });
    
    setNewDoc({ name: '', url: '', type: 'pdf' });
    setShowUploadModal(false);
  };

  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type) => {
    switch(type) {
        case 'pdf': return <FileText className="text-red-400" size={32} />;
        case 'image': return <ImageIcon className="text-blue-400" size={32} />;
        case 'code': return <FileCode className="text-emerald-400" size={32} />;
        default: return <File className="text-slate-400" size={32} />;
    }
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
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <a href={doc.url} target="_blank" rel="noreferrer" className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"><ExternalLink size={16}/></a>
                            <button onClick={() => deleteDoc(doc.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"><Trash2 size={16}/></button>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-[var(--color-on-surface)] font-black text-xs truncate leading-tight mb-1" title={doc.name}>{doc.name}</h4>
                        <div className="flex justify-between items-center text-[9px] font-bold text-[var(--color-on-surface-variant)] uppercase tracking-tighter">
                            <span>{(doc.size / 1024).toFixed(1)} MB</span>
                            <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
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
                            <td className="px-6 py-4 text-xs font-medium text-[var(--color-on-surface-variant)]">{new Date(doc.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a href={doc.url} target="_blank" rel="noreferrer" className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"><ExternalLink size={16}/></a>
                                    <button onClick={() => deleteDoc(doc.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"><Trash2 size={16}/></button>
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
            <form onSubmit={handleUpload} className="bg-[var(--color-surface-variant)] w-full max-w-sm border border-[var(--color-outline-variant)] rounded-3xl shadow-2xl relative animate-in zoom-in duration-300">
                <div className="p-6 border-b border-[#40485d]/20 flex justify-between items-center">
                    <h4 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-xs">Subir Documento</h4>
                    <button type="button" onClick={() => setShowUploadModal(false)} className="text-[var(--color-on-surface-variant)] hover:text-white">
                        <X size={18}/>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Nombre del Archivo</label>
                        <input required type="text" className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] text-sm outline-none" value={newDoc.name} onChange={(e) => setNewDoc({...newDoc, name: e.target.value})} placeholder="Ej: Contrato de Obra" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">URL del Archivo</label>
                        <input required type="url" className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-2.5 text-[var(--color-on-surface)] text-sm outline-none" value={newDoc.url} onChange={(e) => setNewDoc({...newDoc, url: e.target.value})} placeholder="https://..." />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase">Categoría</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['pdf', 'image', 'code'].map(t => (
                                <button key={t} type="button" onClick={() => setNewDoc({...newDoc, type: t})} className={`py-2 rounded-xl text-[9px] font-bold border transition-all uppercase ${newDoc.type === t ? 'bg-[#6B4FD8] text-[#002150] border-[#6B4FD8]' : 'bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] border-[var(--color-outline-variant)]'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-[var(--color-surface-container)] rounded-b-3xl">
                    <button type="submit" className="w-full bg-[#6B4FD8] text-[#002150] font-black py-3 rounded-xl text-sm shadow-lg shadow-[#6B4FD8]/20">
                        Guardar Documento
                    </button>
                </div>
            </form>
        </div>
      )}
    </div>
  );
}
