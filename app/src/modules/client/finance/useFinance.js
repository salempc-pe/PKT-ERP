import { useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../../../services/firebase";

// Constante para verificar si Firebase está configurado
const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

export const useFinance = (orgId = "default_org") => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -- Suscripción a TRANSACCIONES --
  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Mock Data inicial
      setTimeout(() => {
        setTransactions([
          { 
            id: "tx_mock_1", 
            type: "income", 
            amount: 1500.00, 
            category: "Ventas", 
            description: "Pago anticipado de cliente", 
            date: new Date().toISOString(),
            createdAt: new Date() 
          },
          { 
            id: "tx_mock_2", 
            type: "expense", 
            amount: 300.00, 
            category: "Servicios", 
            description: "Pago de luz e internet", 
            date: new Date(Date.now() - 86400000 * 1).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 1) 
          },
          { 
            id: "tx_mock_3", 
            type: "expense", 
            amount: 850.00, 
            category: "Salarios", 
            description: "Adelanto de nómina", 
            date: new Date(Date.now() - 86400000 * 2).toISOString(),
            createdAt: new Date(Date.now() - 86400000 * 2) 
          }
        ]);
        setLoading(false);
      }, 800);
      return;
    }

    const txRef = collection(db, `organizations/${orgId}/transactions`);
    const q = query(txRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
      setLoading(false);
    }, (err) => {
      console.error("Firebase fetch error", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [orgId]);

  // -- Métodos MUTADORES --

  const addTransaction = async (txData) => {
    const newTx = { 
      ...txData,
      date: txData.date || new Date().toISOString()
    };

    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          setTransactions(prev => [{ 
            id: "tx_" + Date.now(), 
            ...newTx, 
            createdAt: new Date() 
          }, ...prev]);
          resolve({ id: "tx_" + Date.now() });
        }, 600);
      });
    }

    const txRef = collection(db, `organizations/${orgId}/transactions`);
    return await addDoc(txRef, {
      ...newTx,
      createdAt: serverTimestamp()
    });
  };

  const deleteTransaction = async (txId) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          setTransactions(prev => prev.filter(tx => tx.id !== txId));
          resolve();
        }, 400);
      });
    }

    const txRef = doc(db, `organizations/${orgId}/transactions`, txId);
    return await deleteDoc(txRef);
  };

  return {
    transactions,
    loading,
    error,
    addTransaction,
    deleteTransaction
  };
};
