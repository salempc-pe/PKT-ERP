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
import { z } from "zod";

// Esquema de Validación de Proveedor
const SupplierSchema = z.object({
  name: z.string().min(1, "Nombre requerido").max(100),
  taxId: z.string().max(20).optional(), // RUC / DNI
  email: z.string().email("Email inválido").or(z.literal("")),
  phone: z.string().max(20).optional(),
  address: z.string().max(200).optional(),
  category: z.string().max(50).optional(),
  status: z.enum(["active", "inactive"]).default("active")
});

const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

export const useSuppliers = (orgId = "default_org") => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setTimeout(() => {
        setSuppliers([
          { id: "s_mock1", name: "Textiles del Sur SAC", taxId: "20601234567", email: "ventas@textilessur.com", phone: "987654321", category: "Materia Prima", status: "active", createdAt: new Date() },
          { id: "s_mock2", name: "Importaciones Lima", taxId: "20509876543", email: "hola@importlima.pe", phone: "912345678", category: "Herramientas", status: "active", createdAt: new Date() }
        ]);
        setLoading(false);
      }, 800);
      return;
    }

    const suppliersRef = collection(db, `organizations/${orgId}/suppliers`);
    const q = query(suppliersRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSuppliers(data);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [orgId]);

  const addSupplier = async (supplierData) => {
    try {
      const validatedData = SupplierSchema.parse(supplierData);

      if (!isFirebaseConfigured) {
        return new Promise((resolve) => {
          setTimeout(() => {
            setSuppliers(prev => [{ id: "s_" + Date.now(), ...validatedData, createdAt: new Date() }, ...prev]);
            resolve({ id: "s_" + Date.now() });
          }, 600);
        });
      }

      const suppliersRef = collection(db, `organizations/${orgId}/suppliers`);
      return await addDoc(suppliersRef, {
        ...validatedData,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Validation Error:", err);
      throw err;
    }
  };

  const updateSupplier = async (supplierId, supplierData) => {
    try {
      const validatedData = SupplierSchema.partial().parse(supplierData);

      if (!isFirebaseConfigured) {
        setSuppliers(prev => prev.map(s => s.id === supplierId ? { ...s, ...validatedData } : s));
        return;
      }

      const supplierRef = doc(db, `organizations/${orgId}/suppliers`, supplierId);
      return await updateDoc(supplierRef, {
        ...validatedData,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Validation Error:", err);
      throw err;
    }
  };

  return {
    suppliers,
    loading,
    error,
    addSupplier,
    updateSupplier
  };
};
