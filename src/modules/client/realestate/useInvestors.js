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
  district: z.string().optional().nullable(),
  budget: z.number().optional().default(0),
  minInvestment: z.number().optional().default(0),
  maxInvestment: z.number().optional().default(0),
  minArea: z.number().optional().default(0),
  maxArea: z.number().optional().default(0),
  status: z.enum(["activo", "inactivo"]).default("activo")
});

export const useInvestors = (orgId = "default_org") => {
  const [investors, setInvestors] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Escuchar inversores
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

  // Escuchar distritos únicos del inquilino
  useEffect(() => {
    if (!orgId || orgId === "default_org") return;

    const ref = collection(db, `organizations/${orgId}/realEstateDistricts`);
    // Ordenar alfabéticamente por nombre
    const q = query(ref);

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      setDistricts(data);
    }, (err) => {
      console.error("[useInvestors districts] Error:", err);
    });

    return () => unsub();
  }, [orgId]);

  // Auxiliar para persistir un distrito si no existe
  const checkAndSaveDistrict = async (districtName) => {
    if (!districtName || typeof districtName !== "string") return;
    const cleanName = districtName.trim();
    if (!cleanName) return;

    const exists = districts.some(
      (d) => (d.name || "").toLowerCase() === cleanName.toLowerCase()
    );

    if (!exists) {
      try {
        const ref = collection(db, `organizations/${orgId}/realEstateDistricts`);
        await addDoc(ref, {
          name: cleanName,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.error("[useInvestors] Error guardando distrito único:", err);
      }
    }
  };

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
        email: data.email || '',
        district: data.district || null
      };

      const validated = InvestorSchema.parse(cleanData);
      
      // Guardar el distrito en la base compartida si se especificó uno nuevo
      if (validated.district) {
        await checkAndSaveDistrict(validated.district);
      }

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

      // Guardar el distrito en la base compartida si se especificó uno nuevo
      if (validated.district) {
        await checkAndSaveDistrict(validated.district);
      }

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
    districts,
    loading,
    error,
    addInvestor,
    updateInvestor,
    deleteInvestor
  };
};
