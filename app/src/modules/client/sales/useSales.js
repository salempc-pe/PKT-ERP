import { useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../../../services/firebase";

// Constante para verificar si Firebase está configurado
const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

export const useSales = (orgId = "default_org") => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -- Suscripción a VENTAS / FACTURAS --
  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Mock Data inicial
      setTimeout(() => {
        setSales([
          { 
            id: "mock_s1", 
            invoiceNumber: 'INV-0003', 
            clientName: 'Agencia CreaTiva', 
            totalAmount: 900.00, 
            status: 'Borrador', 
            items: [{ name: 'Servicio Consultoría', quantity: 1, price: 900, subtotal: 900 }],
            createdAt: new Date() 
          },
          { 
            id: "mock_s2", 
            invoiceNumber: 'INV-0002', 
            clientName: 'David Paredes', 
            totalAmount: 120.00, 
            status: 'Pendiente', 
            items: [{ name: 'Casaca Impermeable', quantity: 1, price: 90, subtotal: 90 }],
            createdAt: new Date(Date.now() - 86400000 * 1) 
          },
          { 
            id: "mock_s3", 
            invoiceNumber: 'INV-0001', 
            clientName: 'Inversiones Globales SAC', 
            totalAmount: 450.00, 
            status: 'Pagada', 
            items: [{ name: 'Zapatilla Urban X', quantity: 2, price: 85, subtotal: 170 }],
            createdAt: new Date(Date.now() - 86400000 * 2) 
          }
        ]);
        setLoading(false);
      }, 800);
      return;
    }

    const salesRef = collection(db, `organizations/${orgId}/invoices`);
    const q = query(salesRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSales(data);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [orgId]);

  // -- Métodos MUTADORES --

  const addSale = async (saleData) => {
    const newSale = { 
      ...saleData, 
      status: saleData.status || "Pendiente" 
    };

    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          setSales(prev => [{ 
            id: "s_" + Date.now(), 
            invoiceNumber: `INV-000${prev.length + 1}`,
            ...newSale, 
            createdAt: new Date() 
          }, ...prev]);
          resolve({ id: "s_" + Date.now() });
        }, 600);
      });
    }

    const salesRef = collection(db, `organizations/${orgId}/invoices`);
    return await addDoc(salesRef, {
      ...newSale,
      createdAt: serverTimestamp()
    });
  };

  const updateSaleStatus = async (saleId, newStatus) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          setSales(prev => prev.map(s => s.id === saleId ? { ...s, status: newStatus } : s));
          resolve();
        }, 400);
      });
    }

    const saleRef = doc(db, `organizations/${orgId}/invoices`, saleId);
    return await updateDoc(saleRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
  };

  return {
    sales,
    loading,
    error,
    addSale,
    updateSaleStatus
  };
};
