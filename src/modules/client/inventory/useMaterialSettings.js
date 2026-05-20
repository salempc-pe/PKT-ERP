import { useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  setDoc, 
  doc, 
  query,
  where
} from "firebase/firestore";
import { db } from "../../../services/firebase";

export const useMaterialSettings = (orgId = "default_org") => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId || orgId === "default_org") {
      setLoading(false);
      return;
    }

    const settingsRef = collection(db, `organizations/${orgId}/material_settings`);
    
    const unsub = onSnapshot(settingsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSettings(data);
      setLoading(false);
    }, (err) => {
      console.error("Error settings stream:", err);
      setLoading(false);
    });

    return () => unsub();
  }, [orgId]);

  const updateThreshold = async (materialName, warehouseId, threshold) => {
    try {
      // Usamos el materialName como ID de documento (normalizado) para facilitar la búsqueda
      const docId = materialName.toLowerCase().replace(/\s+/g, '_');
      const docRef = doc(db, `organizations/${orgId}/material_settings`, docId);
      
      // Buscamos si ya existe para no sobreescribir otros almacenes
      const existing = settings.find(s => s.id === docId);
      const thresholds = existing?.thresholds || {};
      
      await setDoc(docRef, {
        materialName,
        thresholds: {
          ...thresholds,
          [warehouseId]: Number(threshold)
        }
      }, { merge: true });

      return true;
    } catch (err) {
      console.error("Error updating threshold:", err);
      throw err;
    }
  };

  return {
    settings,
    loading,
    updateThreshold
  };
};
