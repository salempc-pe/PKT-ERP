import { useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  query, 
  orderBy,
  serverTimestamp,
  getDocs,
  limit
} from "firebase/firestore";
import { db } from "../../../services/firebase";

export const useWarehouses = (orgId = "default_org") => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orgId || orgId === "default_org") {
      setLoading(false);
      return;
    }

    const warehousesRef = collection(db, `organizations/${orgId}/warehouses`);
    const q = query(warehousesRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWarehouses(data);
      setLoading(false);
    }, (err) => {
      console.error("Error loading warehouses:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [orgId]);

  const addWarehouse = async (warehouseData) => {
    try {
      const warehousesRef = collection(db, `organizations/${orgId}/warehouses`);
      
      // Check if it's the first warehouse to make it default
      const snapshot = await getDocs(query(warehousesRef, limit(1)));
      const isFirst = snapshot.empty;

      return await addDoc(warehousesRef, {
        ...warehouseData,
        isDefault: isFirst || warehouseData.isDefault || false,
        status: warehouseData.status || "active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error adding warehouse:", err);
      throw err;
    }
  };

  const updateWarehouse = async (warehouseId, warehouseData) => {
    try {
      const warehouseRef = doc(db, `organizations/${orgId}/warehouses`, warehouseId);
      
      // If we are setting this one as default, we might need logic to unset others
      // (Simplified for now: UI handles selecting one default)
      
      return await updateDoc(warehouseRef, {
        ...warehouseData,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error updating warehouse:", err);
      throw err;
    }
  };

  const deleteWarehouse = async (warehouseId) => {
    try {
      const warehouseRef = doc(db, `organizations/${orgId}/warehouses`, warehouseId);
      return await deleteDoc(warehouseRef);
    } catch (err) {
      console.error("Error deleting warehouse:", err);
      throw err;
    }
  };

  return {
    warehouses,
    loading,
    error,
    addWarehouse,
    updateWarehouse,
    deleteWarehouse
  };
};
