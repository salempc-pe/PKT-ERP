import { useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  where,
  serverTimestamp,
  increment
} from "firebase/firestore";
import { db } from "../../../services/firebase";

export const useWarehouse = (orgId = "default_org", selectedWarehouseId = null) => {
  const [stock, setStock] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -- Suscripción a STOCK (Lotes) --
  useEffect(() => {
    if (!orgId || orgId === "default_org") {
      setLoading(false);
      return;
    }

    const stockRef = collection(db, `organizations/${orgId}/warehouse_stock`);
    let q = query(stockRef, orderBy("createdAt", "desc"));
    
    if (selectedWarehouseId) {
      q = query(stockRef, where("warehouseId", "==", selectedWarehouseId), orderBy("createdAt", "desc"));
    }

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStock(data);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [orgId, selectedWarehouseId]);

  // -- Suscripción a HISTORIAL --
  useEffect(() => {
    if (!orgId || orgId === "default_org") return;

    const historyRef = collection(db, `organizations/${orgId}/warehouse_history`);
    let q = query(historyRef, orderBy("timestamp", "desc"));

    if (selectedWarehouseId) {
      q = query(historyRef, where("warehouseId", "==", selectedWarehouseId), orderBy("timestamp", "desc"));
    }

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(data);
    }, (err) => {
      console.error("Error history stream:", err);
    });

    return () => unsub();
  }, [orgId, selectedWarehouseId]);

  // -- Métodos MUTADORES --

  const addMovement = async (movementData) => {
    const { type, materialName, quantity, unit, price, destination, loteId, warehouseId } = movementData;
    
    try {
      const historyRef = collection(db, `organizations/${orgId}/warehouse_history`);
      const stockRef = collection(db, `organizations/${orgId}/warehouse_stock`);

      const qty = Number(quantity);
      const prc = price ? Number(price) : 0;

      // 1. Registrar en Historial
      await addDoc(historyRef, {
        type,
        materialName,
        quantity: qty,
        unit,
        price: prc,
        movementValue: qty * prc,
        destination: destination || null,
        warehouseId: warehouseId || null,
        timestamp: serverTimestamp()
      });

      // 2. Actualizar Stock
      if (type === 'IN') {
        // Ingreso: Crear nuevo lote
        await addDoc(stockRef, {
          materialName,
          unit,
          quantity: qty,
          purchasePrice: prc,
          warehouseId: warehouseId || null,
          createdAt: serverTimestamp()
        });
      } else if (type === 'OUT' && loteId) {
        // Egreso: Descontar de lote específico
        const loteRef = doc(db, `organizations/${orgId}/warehouse_stock`, loteId);
        await updateDoc(loteRef, {
          quantity: increment(-qty),
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
