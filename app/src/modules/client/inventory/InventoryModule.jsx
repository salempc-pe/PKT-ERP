import { useState } from 'react';
import { Box, Search, Filter, AlertTriangle, Plus, ArrowDown, ArrowUp, Loader2, X, Edit2 } from 'lucide-react';
import { useInventory } from './useInventory';
import { useAuth } from '../../../context/AuthContext';
import LoadingScreen from '../../../components/LoadingScreen';

export default function InventoryModule() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  const { products, loading, addProduct, updateProduct } = useInventory(orgId);
  
  // -- Modal State --
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: '',
    price: '',
    stock: 0,
    lowStockThreshold: 5
  });

  // -- Handlers --
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateProduct(editingId, {
          ...formData,
          stock: Number(formData.stock),
          lowStockThreshold: Number(formData.lowStockThreshold)
        });
      } else {
        await addProduct({
          ...formData,
          stock: Number(formData.stock),
          lowStockThreshold: Number(formData.lowStockThreshold)
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error al procesar producto", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      sku: product.sku || '',
      name: product.name || '',
      category: product.category || '',
      price: product.price || '',
      stock: product.stock || 0,
      lowStockThreshold: product.lowStockThreshold || 5
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ sku: '', name: '', category: '', price: '', stock: 0, lowStockThreshold: 5 });
  };

  // Calcular dinámicamente los "Stats Indicators"
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => {
    const threshold = p.lowStockThreshold || 5;
    return p.stock > 0 && p.stock <= threshold;
  }).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  
  // Stats simulados/calculados
  const inventoryStats = [
    { title: 'Total Productos', value: totalProducts, icon: <Box size={24} className="text-[var(--color-primary)]" /> },
    { title: 'Bajo Stock', value: lowStockCount, icon: <AlertTriangle size={24} className="text-[#ff716c]" /> },
    { title: 'Agotados', value: outOfStockCount, icon: <ArrowDown size={24} className="text-[#2E8B57]" /> },
    { title: 'Salidas (Mes)', value: '1,450', icon: <ArrowUp size={24} className="text-[#e28ce9]" /> }
  ];

  if (loading) {
    return <LoadingScreen fullScreen={false} message="CARGANDO INVENTARIO..." />;
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-end items-start md:items-end gap-4">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#6B4FD8] text-[#0f0f0f] font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(133,173,255,0.3)] transition-all"
        >
          <Plus size={18} /> Agregar Producto
        </button>
      </div>

      {/* Stats Indicators - Ocultos en móvil */}
      <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {inventoryStats.map((stat, idx) => (
          <div key={idx} className="bg-[var(--color-surface-container)] p-5 rounded-2xl flex items-center gap-4 group hover:bg-[var(--color-surface-container-high)] transition-colors border border-[var(--color-outline-variant)]">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-container-low)] flex items-center justify-center group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-1">{stat.title}</p>
              <span className="text-2xl font-black text-[var(--color-on-surface)]">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Inventory List */}
      <div className="w-full">
        <div className="py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por SKU o nombre..." 
                className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-[#6B4FD8] border border-transparent focus:border-[#6B4FD8] transition-all"
              />
            </div>
            <button className="bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] p-2 rounded-lg hover:text-[var(--color-primary)] transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-auto border border-[var(--color-outline-variant)] rounded-xl bg-[var(--color-surface-container-low)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] text-xs uppercase tracking-widest font-black">
                <th className="px-6 py-4">SKU / Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4 text-right">Precio Venta</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#40485d]/10 text-sm">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-[var(--color-on-surface-variant)]">
                    No hay productos registrados en el inventario.
                  </td>
                </tr>
              ) : (
                products.map((prod) => {
                  const isLowStock = prod.stock > 0 && prod.stock <= (prod.lowStockThreshold || 5);
                  const isOutOfStock = prod.stock === 0;

                  return (
                    <tr key={prod.id} className="hover:bg-[var(--color-surface-container)]/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-[var(--color-on-surface)]">{prod.name}</p>
                        <p className="text-xs font-mono text-[var(--color-primary)] mt-0.5">{prod.sku}</p>
                      </td>
                      <td className="px-6 py-4 text-[var(--color-on-surface-variant)]">
                        <span className="px-2.5 py-1 bg-[var(--color-surface-container-high)] rounded text-xs">{prod.category}</span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#2E8B57] text-right">{prod.price}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`font-bold ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-amber-500' : 'text-[var(--color-on-surface)]'}`}>
                            {prod.stock}
                          </span>
                          {isLowStock && (
                            <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                              <AlertTriangle size={10} /> Bajo
                            </span>
                          )}
                          {isOutOfStock && (
                            <span className="text-[10px] text-red-500 font-bold">Agotado</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleOpenEdit(prod)}
                          className="bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] p-2 rounded-xl transition-all"
                          title="Editar Producto"
                        >
                          <Edit2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <div className="w-full max-w-md bg-[var(--color-surface-container-low)] rounded-2xl border border-[var(--color-outline-variant)] shadow-[0_0_50px_rgba(226,140,233,0.1)] overflow-hidden flex flex-col relative animate-in zoom-in duration-300">
            <div className="flex justify-between items-center p-6 border-b border-[#40485d]/20 bg-[var(--color-surface-container)]/60">
              <h3 className="text-xl font-bold text-[var(--color-on-surface)]">
                {editingId ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-[var(--color-on-surface-variant)] hover:text-[#ff716c] transition-colors"
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold tracking-wider text-[var(--color-on-surface-variant)] uppercase">SKU</label>
                  <input 
                    required type="text" name="sku" 
                    value={formData.sku} onChange={handleInputChange}
                    placeholder="PROD-001"
                    className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] rounded-lg px-4 py-2.5 border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] focus:ring-1 focus:ring-[#6B4FD8] outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold tracking-wider text-[var(--color-on-surface-variant)] uppercase">Precio</label>
                  <input 
                    required type="text" name="price" 
                    value={formData.price} onChange={handleInputChange}
                    placeholder="$10.00"
                    className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] rounded-lg px-4 py-2.5 border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] focus:ring-1 focus:ring-[#6B4FD8] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold tracking-wider text-[var(--color-on-surface-variant)] uppercase">Nombre del Producto</label>
                <input 
                  required type="text" name="name" 
                  value={formData.name} onChange={handleInputChange}
                  placeholder="Ej. Polera Básica"
                  className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] rounded-lg px-4 py-2.5 border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] focus:ring-1 focus:ring-[#6B4FD8] outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold tracking-wider text-[var(--color-on-surface-variant)] uppercase">Categoría</label>
                <input 
                  required type="text" name="category" 
                  value={formData.category} onChange={handleInputChange}
                  placeholder="Ropa"
                  className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] rounded-lg px-4 py-2.5 border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] focus:ring-1 focus:ring-[#6B4FD8] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold tracking-wider text-[var(--color-on-surface-variant)] uppercase">Stock</label>
                  <input 
                    required type="number" min="0" name="stock" 
                    value={formData.stock} onChange={handleInputChange}
                    className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] rounded-lg px-4 py-2.5 border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] focus:ring-1 focus:ring-[#6B4FD8] outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold tracking-wider text-[var(--color-on-surface-variant)] uppercase">Umbral Alerta</label>
                  <input 
                    required type="number" min="0" name="lowStockThreshold" 
                    value={formData.lowStockThreshold} onChange={handleInputChange}
                    placeholder="5"
                    className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] rounded-lg px-4 py-2.5 border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] focus:ring-1 focus:ring-[#6B4FD8] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-lg border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] font-semibold hover:bg-[var(--color-surface-container)] transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-lg bg-[#6B4FD8] text-[#0f0f0f] font-bold hover:bg-[#a3c2ff] hover:shadow-[0_0_15px_rgba(133,173,255,0.4)] transition-all flex justify-center items-center"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : editingId ? 'Guardar Cambios' : 'Registrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
