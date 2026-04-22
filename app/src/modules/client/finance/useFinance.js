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

export const useFinance = (orgId = "default_org") => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -- Suscripción a TRANSACCIONES --
  useEffect(() => {
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

    const txRef = collection(db, `organizations/${orgId}/transactions`);
    return await addDoc(txRef, {
      ...newTx,
      createdAt: serverTimestamp()
    });
  };

  const deleteTransaction = async (txId) => {
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
