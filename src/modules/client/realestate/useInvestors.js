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
  contactName: z.string().optional().nullable(),
  email: z.string().email().optional().or(z.literal('')).nullable(),
  phone: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  budget: z.number().optional().default(0),
  minInvestment: z.number().optional().default(0),
  maxInvestment: z.number().optional().default(0),
  minArea: z.number().optional().default(0),
  maxArea: z.number().optional().default(0),
  status: z.enum(["activo", "inactivo"]).default("activo")
});

export const useInvestors = (orgId = "default_org") => {
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orgId || orgId === "default_org") {
      setLoading(false);
      return;
    }

    const ref = collection(db, `organizations/${orgId}/realEstateInvestors`);
    const q = query(ref); // Eliminamos orderBy temporalmente para evitar error de índices

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
    try {
      // Pre-procesar: Convertir campos vacíos a valores seguros
      const cleanData = {
        ...data,
        budget: Number(data.budget) || 0,
        minInvestment: Number(data.minInvestment) || 0,
        maxInvestment: Number(data.maxInvestment) || 0,
        minArea: Number(data.minArea) || 0,
        maxArea: Number(data.maxArea) || 0,
        email: data.email || ''
      };

      const validated = InvestorSchema.parse(cleanData);
      const ref = collection(db, `organizations/${orgId}/realEstateInvestors`);
      return await addDoc(ref, {
        ...validated,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("[useInvestors] addInvestor error:", err);
      throw err;
    }
  };

  const updateInvestor = async (id, data) => {
    try {
      const cleanData = { ...data };
      ['budget', 'minInvestment', 'maxInvestment', 'minArea', 'maxArea'].forEach(key => {
        if (key in cleanData) cleanData[key] = Number(cleanData[key]) || 0;
      });

      const validated = InvestorSchema.partial().parse(cleanData);
      const ref = doc(db, `organizations/${orgId}/realEstateInvestors`, id);
      return await updateDoc(ref, {
        ...validated,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("[useInvestors] updateInvestor error:", err);
      throw err;
    }
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
