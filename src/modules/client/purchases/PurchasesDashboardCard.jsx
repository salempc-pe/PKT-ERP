import { ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import DashboardCard from '../../../components/DashboardCard';

export default function PurchasesDashboardCard({ orgId }) {
  const [stats, setStats] = useState({ pending: 0, received: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) return;

    const fetchStats = async () => {
      try {
        const purchasesRef = collection(db, 'organizations', orgId, 'purchases');
        const querySnapshot = await getDocs(query(purchasesRef));
        
        const docs = querySnapshot.docs.map(d => d.data());
        const pending = docs.filter(d => d.status === 'Solicitada' || d.status === 'Borrador').length;
        const received = docs.filter(d => d.status === 'Recibida').length;
        
        setStats({ pending, received });
      } catch (error) {
        console.error("Error fetching purchase stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [orgId]);

  return (
    <DashboardCard
      title="Compras"
      description="Gestión de proveedores y órdenes de compra."
      icon={ShoppingCart}
      path="/client/purchases"
      color="#6B4FD8"
      loading={loading}
      metrics={[
        { 
          label: "Pendientes", 
          value: stats.pending 
        },
        { 
          label: "Recibidas", 
          value: stats.received 
        }
      ]}
    />
  );
}
