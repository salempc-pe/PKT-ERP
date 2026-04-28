import { useState } from 'react';
import { useFinance } from './useFinance';
import { useAuth } from '../../../context/AuthContext';
import { 
  Calculator, Plus, Search, DollarSign, 
  TrendingUp, TrendingDown, Wallet, X, Loader2, Trash2
} from 'lucide-react';
import LoadingScreen from '../../../components/LoadingScreen';

export default function FinanceModule() {
  const { user } = useAuth();
  const orgId = user?.organizationId || "default_org";
  
  const { transactions, loading, addTransaction, deleteTransaction } = useFinance(orgId);
  const { formatPrice, currencySymbol } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // -- Form State --
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Ventas');
  const [description, setDescription] = useState('');
  
  // -- Search & Filter State (Sync with Inventory Pattern) --
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  // -- KPIs --
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) return;
    
    setIsSubmitting(true);
    try {
      await addTransaction({
        type,
        amount: parseFloat(amount),
        category,
        description
      });
      
      // Reset form
      setAmount('');
      setDescription('');
      setCategory(type === 'income' ? 'Ventas' : 'Operativos');
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error added tx", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'income' ? 'Ventas' : 'Operativos');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleApplyFilter = () => {
    setActiveFilter(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilter();
    }
  };

  if (loading) {
    return <LoadingScreen fullScreen={false} message="Cargando Contabilidad..." />;
  }

  return (
    <div className="animate-in fade-in duration-500 space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-end items-start md:items-center gap-4">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#6B4FD8] text-[#001b5c] font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(133,173,255,0.3)] transition-all"
        >
          <Plus size={18} /> Nueva Transacción
        </button>
      </div>

      {/* KPI Stats - Ocultos en móvil */}
      <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--color-surface-container)] p-6 rounded-2xl border border-[#40485d]/20 flex items-center gap-5">
           <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-surface-container)] to-[var(--color-surface-container-low)] flex items-center justify-center text-[var(--color-primary)] shadow-inner">
             <Wallet size={24} />
           </div>
           <div>
             <p className="text-xs font-black text-[var(--color-on-surface-variant)] tracking-widest uppercase mb-1">Balance Actual</p>
             <h3 className={`text-2xl font-black ${balance >= 0 ? "text-[#85ffab]" : "text-[#ff716c]"}`}>
               {formatPrice(balance)}
             </h3>
           </div>
        </div>
        <div className="bg-[var(--color-surface-container)] p-6 rounded-2xl border border-[#40485d]/20 flex items-center gap-5">
           <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-surface-container)] to-[var(--color-surface-container-low)] flex items-center justify-center text-[#85ffab] shadow-inner">
             <TrendingUp size={24} />
           </div>
           <div>
             <p className="text-xs font-black text-[var(--color-on-surface-variant)] tracking-widest uppercase mb-1">Total Ingresos</p>
             <h3 className="text-2xl font-black text-[var(--color-on-surface)]">{formatPrice(totalIncome)}</h3>
           </div>
        </div>
        <div className="bg-[var(--color-surface-container)] p-6 rounded-2xl border border-[#40485d]/20 flex items-center gap-5">
           <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2a1b1a] to-[#1a0a0a] flex items-center justify-center text-[#ff716c] shadow-inner">
             <TrendingDown size={24} />
           </div>
           <div>
             <p className="text-xs font-black text-[var(--color-on-surface-variant)] tracking-widest uppercase mb-1">Total Egresos</p>
             <h3 className="text-2xl font-black text-[var(--color-on-surface)]">{formatPrice(totalExpense)}</h3>
           </div>
        </div>
      </div>

      {/* Main Finance List */}
      <div className="w-full">
          <div className="flex items-center gap-4 w-full sm:w-auto mb-6">
            <div className="relative w-full sm:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-on-surface-variant)]" size={16} />
               <input 
                 type="text" 
                 placeholder="Filtrar por descripción o monto..." 
                 value={searchQuery}
                 onChange={handleSearchChange}
                 onKeyPress={handleKeyPress}
                 className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-[#6B4FD8] border border-transparent focus:border-[#6B4FD8] transition-all"
               />
            </div>
            <button 
              onClick={handleApplyFilter}
              className="bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] p-2 rounded-lg hover:text-[var(--color-primary)] transition-colors"
            >
              <Search size={20} />
            </button>
          </div>

        <div className="overflow-auto border border-[var(--color-outline-variant)] rounded-xl bg-[var(--color-surface-container-low)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface-variant)] text-[var(--color-on-surface-variant)] text-[10px] uppercase tracking-widest font-black">
                <th className="px-6 py-5">Tipo</th>
                <th className="px-6 py-5">Descripción & Categoría</th>
                <th className="px-6 py-5">Fecha</th>
                <th className="px-6 py-5 text-right">Monto</th>
                <th className="px-6 py-5 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#40485d]/10 text-sm">
              {(() => {
                const filteredTransactions = transactions.filter(tx => {
                  if (!activeFilter) return true;
                  const searchLower = activeFilter.toLowerCase();
                  return (
                    tx.description?.toLowerCase().includes(searchLower) ||
                    tx.category?.toLowerCase().includes(searchLower) ||
                    tx.amount?.toString().includes(searchLower) ||
                    tx.type?.toLowerCase().includes(searchLower)
                  );
                });

                if (filteredTransactions.length === 0) {
                  return (
                    <tr>
                      <td colSpan="5" className="p-10 text-center text-[var(--color-on-surface-variant)]">
                        {activeFilter ? 'No se encontraron resultados para tu búsqueda.' : 'No hay transacciones registradas.'}
                      </td>
                    </tr>
                  );
                }

                return filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[var(--color-surface-container)]/40 transition-colors">
                    <td className="px-6 py-4">
                      {tx.type === 'income' 
                        ? <span className="inline-flex items-center px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-black tracking-widest uppercase rounded">Ingreso</span>
                        : <span className="inline-flex items-center px-2 py-1 bg-red-500/10 text-red-400 text-[10px] font-black tracking-widest uppercase rounded">Egreso</span>
                      }
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-[var(--color-on-surface)]">{tx.description}</p>
                      <p className="text-[10px] text-[var(--color-on-surface-variant)]">{tx.category}</p>
                    </td>
                    <td className="px-6 py-4 text-[var(--color-on-surface-variant)]">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatPrice(tx.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                       <button onClick={() => deleteTransaction(tx.id)} className="text-[var(--color-on-surface-variant)] hover:text-red-400 transition-colors">
                         <Trash2 size={16} />
                       </button>
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

       {/* CREATE MODAL */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)}></div>
          <div className="bg-[var(--color-surface-variant)] w-full max-w-md border border-[var(--color-outline-variant)] rounded-3xl shadow-2xl relative animate-in zoom-in duration-300">
            
            <div className="p-6 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[var(--color-surface-container)] rounded-t-3xl">
               <h3 className="font-black text-[var(--color-on-surface)] uppercase tracking-wider text-sm flex items-center gap-2">
                 <Calculator size={16} className="text-[var(--color-primary)]" /> Registro Financiero
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="text-[var(--color-on-surface-variant)] hover:text-white">
                 <X size={16}/>
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              
              <div className="flex bg-[var(--color-surface-container-low)] rounded-xl p-1 border border-[var(--color-outline-variant)]">
                <button type="button" onClick={() => handleTypeChange('income')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${type === 'income' ? 'bg-[#85ffab]/10 text-[#85ffab] shadow-sm' : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]'}`}>Ingreso (+)</button>
                <button type="button" onClick={() => handleTypeChange('expense')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${type === 'expense' ? 'bg-[#ff716c]/10 text-[#ff716c] shadow-sm' : 'text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container)]'}`}>Egreso (-)</button>
              </div>

              <div>
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Monto ($)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)] font-bold text-lg">{currencySymbol}</span>
                  <input 
                    type="number" step="0.01" min="0.01"
                    value={amount} onChange={e => setAmount(e.target.value)}
                    required
                    className="w-full bg-[var(--color-surface-container)] text-2xl font-black text-[var(--color-on-surface)] rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-1 focus:ring-[#6B4FD8] border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Categoría</label>
                <select 
                  value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)] rounded-xl px-4 py-3 text-[var(--color-on-surface)] outline-none text-sm focus:border-[#6B4FD8]"
                >
                  {type === 'income' ? (
                    <>
                      <option value="Ventas">Ventas Directas</option>
                      <option value="Servicios">Servicios</option>
                      <option value="Intereses">Intereses</option>
                      <option value="Otros Ingresos">Otros Ingresos</option>
                    </>
                  ) : (
                    <>
                      <option value="Operativos">Gastos Operativos</option>
                      <option value="Salarios">Salarios / Nómina</option>
                      <option value="Inventario">Compras de Inventario</option>
                      <option value="Impuestos">Impuestos</option>
                      <option value="Servicios Basicos">Servicios Básicos</option>
                      <option value="Marketing">Marketing / Publicidad</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-[var(--color-on-surface-variant)] uppercase block mb-1">Descripción</label>
                <input 
                  type="text" required
                  value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full bg-[var(--color-surface-container)] text-[var(--color-on-surface)] text-sm rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#6B4FD8] border border-[var(--color-outline-variant)] focus:border-[#6B4FD8] transition-all"
                  placeholder="Ej. Pago de luz mensual"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !amount}
                  className="w-full bg-[#6B4FD8] text-[#001b5c] font-black px-4 py-3.5 rounded-xl hover:shadow-[0_0_15px_rgba(133,173,255,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Registrar Transacción'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
