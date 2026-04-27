import { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  User, 
  Users, 
  Plus, 
  Kanban, 
  List, 
  Loader2, 
  Search, 
  Filter, 
  MoreVertical,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { useRealEstate } from './useRealEstate';
import { useCrm } from '../crm/useCrm';
import { useAuth } from '../../../context/AuthContext';
import TerrainModal from './TerrainModal';

export default function RealEstateModule() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  const { terrains, loading, addTerrain, updateTerrain, deleteTerrain } = useRealEstate(orgId);
  const { contacts } = useCrm(orgId);
  
  const [activeTab, setActiveTab] = useState('database'); // database | pipeline
  const [showModal, setShowModal] = useState(false);
  const [editingTerrain, setEditingTerrain] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');

  const pipelineStages = [
    { id: 'presentacion', title: 'Presentación', color: 'bg-[#a3aac4]' },
    { id: 'negociacion', title: 'Negociación', color: 'bg-[#85adff]' },
    { id: 'aprobado', title: 'Aprobado', color: 'bg-green-500' },
    { id: 'descartado', title: 'Descartado', color: 'bg-red-500' }
  ];

  const filteredTerrains = terrains.filter(t => {
    const matchesSearch = t.address.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = filterCity === '' || t.city === filterCity;
    return matchesSearch && matchesCity;
  });

  const uniqueCities = [...new Set(terrains.map(t => t.city))];

  const handleOpenEdit = (terrain) => {
    setEditingTerrain(terrain);
    setShowModal(true);
  };

  const handleStatusChange = async (terrainId, newStatus) => {
    try {
      await updateTerrain(terrainId, { status: newStatus });
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-[#85adff]">
        <Loader2 className="animate-spin mr-2" /> Cargando Base de Terrenos...
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-10">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex p-1 bg-[#141f38]/50 rounded-xl w-fit border border-[#40485d]/10 shadow-inner">
          <button 
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'database' ? 'bg-[#85adff] text-[#002150] shadow-lg' : 'text-[#a3aac4] hover:text-[#dee5ff]'}`}
          >
            <List size={16} /> Base de Datos
          </button>
          <button 
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${activeTab === 'pipeline' ? 'bg-[#85adff] text-[#002150] shadow-lg' : 'text-[#a3aac4] hover:text-[#dee5ff]'}`}
          >
            <Kanban size={16} /> Pipeline
          </button>
        </div>

        <button 
          onClick={() => { setEditingTerrain(null); setShowModal(true); }}
          className="bg-[#85adff] text-[#002150] font-black px-6 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(133,173,255,0.3)] transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={18} /> Agregar Propiedad
        </button>
      </div>

      {/* Filters (Only for Database view) */}
      {activeTab === 'database' && (
        <div className="flex flex-wrap items-center gap-4 bg-[#0f1930]/40 p-4 rounded-2xl border border-[#40485d]/10">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#40485d]" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por dirección o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#141f38] border border-[#40485d]/30 rounded-xl pl-10 pr-4 py-2 text-[#dee5ff] outline-none focus:border-[#85adff] transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-[#a3aac4]" />
            <select 
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="bg-[#141f38] border border-[#40485d]/30 rounded-xl px-4 py-2 text-[#dee5ff] outline-none focus:border-[#85adff] text-sm font-bold"
            >
              <option value="">Todas las ciudades</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Content Rendering */}
      {activeTab === 'database' ? (
        <div className="bg-[#091328] rounded-2xl border border-[#40485d]/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0f1930] text-[#a3aac4] text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-5">Propiedad / Ubicación</th>
                  <th className="px-6 py-5">Propietario</th>
                  <th className="px-6 py-5">Área / Precio</th>
                  <th className="px-6 py-5">Estado</th>
                  <th className="px-6 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#40485d]/10 text-sm">
                {filteredTerrains.length > 0 ? filteredTerrains.map((t) => (
                  <tr key={t.id} className="hover:bg-[#141f38]/40 transition-colors group cursor-pointer" onClick={() => handleOpenEdit(t)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1d2b4a] to-[#091328] border border-[#85adff]/10 flex items-center justify-center text-[#85adff]">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-[#dee5ff] group-hover:text-[#85adff] transition-colors">{t.address}</p>
                          <p className="text-[11px] text-[#a3aac4] flex items-center gap-1">
                            <MapPin size={10} /> {t.district}, {t.city}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#1d2b4a] flex items-center justify-center text-[10px] font-black text-[#85adff]">
                          {contacts.find(c => c.id === t.ownerId)?.name.charAt(0) || <User size={12} />}
                        </div>
                        <span className="text-xs text-[#dee5ff] font-medium">
                          {contacts.find(c => c.id === t.ownerId)?.name || 'Desconocido'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <p className="text-[#dee5ff] font-bold text-xs">{t.area.toLocaleString()} m²</p>
                        <p className="text-[10px] text-[#85adff] font-black">
                          US$ {t.totalPrice.toLocaleString()} 
                          <span className="text-[#a3aac4] font-normal ml-1">(${(t.pricePerM2).toLocaleString()}/m²)</span>
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg border ${
                        t.status === 'aprobado' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        t.status === 'negociacion' ? 'bg-[#85adff]/10 text-[#85adff] border-[#85adff]/20' :
                        t.status === 'descartado' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-[#a3aac4]/10 text-[#a3aac4] border-[#a3aac4]/20'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-[#40485d] hover:text-[#dee5ff] transition-colors">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-[#a3aac4] italic">
                      No se encontraron propiedades que coincidan con los filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[500px]">
          {pipelineStages.map(stage => (
            <div key={stage.id} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-tighter text-[#a3aac4]">
                  <div className={`w-1.5 h-1.5 rounded-full ${stage.color}`}></div>
                  {stage.title}
                </div>
                <span className="text-[#40485d] font-bold text-xs">
                  {terrains.filter(t => t.status === stage.id).length}
                </span>
              </div>
              
              <div className="flex flex-col gap-3 p-3 bg-[#0f1930]/40 border border-[#40485d]/10 rounded-2xl h-full min-h-[300px]">
                {terrains.filter(t => t.status === stage.id).map(terrain => (
                  <div 
                    key={terrain.id} 
                    className="bg-[#141f38] border border-[#40485d]/30 p-4 rounded-xl shadow-sm hover:border-[#85adff]/50 transition-all cursor-pointer group relative overflow-hidden"
                    onClick={() => handleOpenEdit(terrain)}
                  >
                    <div className={`absolute top-0 left-0 w-1 h-full opacity-20 ${stage.color}`}></div>
                    
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-extrabold text-[#dee5ff] text-xs group-hover:text-[#85adff] transition-colors line-clamp-1">{terrain.address}</p>
                      <button className="text-[#40485d] hover:text-[#85adff]">
                        <Maximize2 size={12}/>
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-1.5 mb-3">
                      <MapPin size={10} className="text-[#85adff]" />
                      <p className="text-[10px] text-[#a3aac4] font-bold uppercase tracking-tight">{terrain.district}, {terrain.city}</p>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-[11px] font-black text-[#dee5ff]">US$ {terrain.totalPrice.toLocaleString()}</p>
                      <p className="text-[10px] text-[#a3aac4]">{terrain.area} m²</p>
                    </div>

                    {terrain.buyerId && (
                      <div className="flex items-center gap-2 p-2 bg-[#091328] rounded-lg mb-3 border border-[#85adff]/10">
                        <div className="w-5 h-5 rounded-full bg-[#85adff] flex items-center justify-center text-[8px] font-black text-[#002150]">
                          {contacts.find(c => c.id === terrain.buyerId)?.name.charAt(0)}
                        </div>
                        <p className="text-[9px] text-[#85adff] font-bold truncate">Comprador: {contacts.find(c => c.id === terrain.buyerId)?.name}</p>
                      </div>
                    )}

                    <div className="flex gap-1 pt-3 border-t border-[#40485d]/10">
                      {stage.id === 'presentacion' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleStatusChange(terrain.id, 'negociacion'); }}
                          className="w-full text-[9px] font-black uppercase bg-[#85adff]/10 text-[#85adff] px-2 py-1.5 rounded border border-[#85adff]/20 hover:bg-[#85adff] hover:text-[#002150] transition-all flex items-center justify-center gap-1"
                        >
                          Negociación <ArrowRight size={10} />
                        </button>
                      )}
                      {stage.id === 'negociacion' && (
                        <>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(terrain.id, 'aprobado'); }}
                            className="flex-1 text-[9px] font-black uppercase bg-green-500/10 text-green-400 px-2 py-1.5 rounded border border-green-500/20 hover:bg-green-500 hover:text-white transition-all"
                          >
                            Aprobar
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(terrain.id, 'descartado'); }}
                            className="flex-1 text-[9px] font-black uppercase bg-red-500/10 text-red-300 px-2 py-1.5 rounded border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                          >
                            Descartar
                          </button>
                        </>
                      )}
                      {(stage.id === 'aprobado' || stage.id === 'descartado') && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleStatusChange(terrain.id, 'negociacion'); }}
                          className="w-full text-[9px] font-black uppercase bg-[#40485d]/10 text-[#a3aac4] px-2 py-1.5 rounded border border-[#40485d]/20 hover:bg-[#40485d] hover:text-white transition-all flex items-center justify-center gap-1"
                        >
                          <ChevronLeft size={10} /> Volver a Negoc.
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {terrains.filter(t => t.status === stage.id).length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-[#40485d] opacity-20 text-[10px] italic py-10">
                    Vaciío
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TerrainModal 
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          terrain={editingTerrain}
          orgId={orgId}
          onSave={editingTerrain ? updateTerrain : addTerrain}
          contacts={contacts}
          terrains={terrains} // Para sacar las listas de ciudades/distritos existentes
        />
      )}
    </div>
  );
}
