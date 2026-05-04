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
  deleteDoc
} from "firebase/firestore";
import { db } from "../../../services/firebase";
import { z } from "zod";

const InvestorSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  type: z.enum(["inversionista", "constructora"]),
  contactName: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  notes: z.string().optional(),
  budget: z.number().optional(),
  status: z.enum(["activo", "inactivo"]).default("activo")
});

export const useInvestors = (orgId = "default_org") => {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orgId) return;

    const ref = collection(db, `organizations/${orgId}/realEstateInvestors`);
    const q = query(ref, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInvestors(data);
      setLoading(false);
    }, (err) => {
      console.error("[useInvestors] Error:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [orgId]);

  const addInvestor = async (data) => {
    const validated = InvestorSchema.parse(data);
    const ref = collection(db, `organizations/${orgId}/realEstateInvestors`);
    return await addDoc(ref, {
      ...validated,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  };

  const updateInvestor = async (id, data) => {
    const validated = InvestorSchema.partial().parse(data);
    const ref = doc(db, `organizations/${orgId}/realEstateInvestors`, id);
    return await updateDoc(ref, {
      ...validated,
      updatedAt: serverTimestamp()
    });
  };

  const deleteInvestor = async (id) => {
    const ref = doc(db, `organizations/${orgId}/realEstateInvestors`, id);
    return await deleteDoc(ref);
  };

  return {
    investors,
    loading,
    error,
    addInvestor,
    updateInvestor,
    deleteInvestor
  };
};
