import { useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp,
  increment
} from "firebase/firestore";
import { db } from "../../../services/firebase";

export const useWarehouse = (orgId = "default_org") => {
  const [stock, setStock] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -- Suscripción a STOCK (Lotes) --
  useEffect(() => {
    const stockRef = collection(db, `organizations/${orgId}/warehouse_stock`);
    const q = query(stockRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStock(data);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [orgId]);

  // -- Suscripción a HISTORIAL --
  useEffect(() => {
    const historyRef = collection(db, `organizations/${orgId}/warehouse_history`);
    const q = query(historyRef, orderBy("timestamp", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(data);
    }, (err) => {
      console.error("Error history stream:", err);
    });

    return () => unsub();
  }, [orgId]);

  // -- Métodos MUTADORES --

  const addMovement = async (movementData) => {
    const { type, materialName, quantity, unit, price, destination, loteId } = movementData;
    
    try {
      const historyRef = collection(db, `organizations/${orgId}/warehouse_history`);
      const stockRef = collection(db, `organizations/${orgId}/warehouse_stock`);

      // 1. Registrar en Historial
      await addDoc(historyRef, {
        type,
        materialName,
        quantity: Number(quantity),
        unit,
        price: price ? Number(price) : null,
        destination: destination || null,
        timestamp: serverTimestamp()
      });

      // 2. Actualizar Stock
      if (type === 'IN') {
        // Ingreso: Crear nuevo lote
        await addDoc(stockRef, {
          materialName,
          unit,
          quantity: Number(quantity),
          purchasePrice: Number(price),
          createdAt: serverTimestamp()
        });
      } else if (type === 'OUT' && loteId) {
        // Egreso: Descontar de lote específico
        const loteRef = doc(db, `organizations/${orgId}/warehouse_stock`, loteId);
        await updateDoc(loteRef, {
          quantity: increment(-Number(quantity)),
          updatedAt: serverTimestamp()
        });
      }

      return true;
    } catch (err) {
      console.error("Error recording movement:", err);
      throw err;
    }
  };

  return {
    stock,
    history,
    loading,
    error,
    addMovement
  };
};
