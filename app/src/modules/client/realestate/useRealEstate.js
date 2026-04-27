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

// Esquema de Validación para Terrenos
const TerrainSchema = z.object({
  city: z.string().min(1, "Ciudad requerida"),
  district: z.string().min(1, "Distrito requerido"),
  address: z.string().min(1, "Dirección requerida"),
  ownerId: z.string().min(1, "Propietario requerido"),
  brokers: z.array(z.string()).default([]),
  area: z.number().min(0, "El área debe ser mayor a 0"),
  pricePerM2: z.number().min(0, "El precio por m2 debe ser mayor a 0"),
  totalPrice: z.number().min(0, "El precio total debe ser mayor a 0"),
  notes: z.string().max(1000).optional(),
  status: z.enum(["presentacion", "negociacion", "aprobado", "descartado"]).default("presentacion"),
  buyerId: z.string().optional()
});

export const useRealEstate = (orgId = "default_org") => {
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orgId) return;

    const terrainsRef = collection(db, `organizations/${orgId}/realEstateTerrains`);
    const q = query(terrainsRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTerrains(data);
      setLoading(false);
    }, (err) => {
      console.error("[useRealEstate] Error en suscripción:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [orgId]);

  const addTerrain = async (terrainData) => {
    try {
      const validatedData = TerrainSchema.parse(terrainData);
      const terrainsRef = collection(db, `organizations/${orgId}/realEstateTerrains`);
      
      return await addDoc(terrainsRef, {
        ...validatedData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("[useRealEstate] Error al añadir terreno:", err);
      throw err;
    }
  };

  const updateTerrain = async (terrainId, terrainData) => {
    try {
      const validatedData = TerrainSchema.partial().parse(terrainData);
      const terrainRef = doc(db, `organizations/${orgId}/realEstateTerrains`, terrainId);
      
      return await updateDoc(terrainRef, {
        ...validatedData,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("[useRealEstate] Error al actualizar terreno:", err);
      throw err;
    }
  };

  const deleteTerrain = async (terrainId) => {
    try {
      const terrainRef = doc(db, `organizations/${orgId}/realEstateTerrains`, terrainId);
      return await deleteDoc(terrainRef);
    } catch (err) {
      console.error("[useRealEstate] Error al eliminar terreno:", err);
      throw err;
    }
  };

  return {
    terrains,
    loading,
    error,
    addTerrain,
    updateTerrain,
    deleteTerrain
  };
};
