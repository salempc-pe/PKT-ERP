import { useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  getDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../../../services/firebase";
import { z } from "zod";

// Esquema de Validación de Compra
const PurchaseSchema = z.object({
  supplierId: z.string().min(1, "Proveedor requerido"),
  supplierName: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    sku: z.string(),
    name: z.string(),
    quantity: z.number().min(1),
    cost: z.number().min(0)
  })),
  totalAmount: z.number().min(0),
  status: z.enum(["Borrador", "Solicitada", "Recibida", "Pagada", "Anulada"]).default("Solicitada"),
});

export const usePurchases = (orgId = "default_org") => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orgId) return;

    const purchasesRef = collection(db, `organizations/${orgId}/purchases`);
    const q = query(purchasesRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPurchases(data);
      setLoading(false);
    }, (err) => {
      console.error("[usePurchases] Error en suscripción:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [orgId]);

  const addPurchase = async (purchaseData) => {
    try {
      const validatedData = PurchaseSchema.parse({
        ...purchaseData,
        status: purchaseData.status || "Solicitada"
      });

      const purchasesRef = collection(db, `organizations/${orgId}/purchases`);
      
      // Generar número de orden (OC-XXXX)
      const orderNumber = `OC-${Math.floor(1000 + Math.random() * 9000)}`;

      return await addDoc(purchasesRef, {
        ...validatedData,
        orderNumber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("[usePurchases] Error al añadir compra:", err);
      throw err;
    }
  };

  const updatePurchaseStatus = async (purchaseId, newStatus) => {
    try {
      const purchaseRef = doc(db, `organizations/${orgId}/purchases`, purchaseId);
      return await updateDoc(purchaseRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("[usePurchases] Error al actualizar estado:", err);
      throw err;
    }
  };

  const receivePurchase = async (purchaseId) => {
    try {
      const purchaseRef = doc(db, `organizations/${orgId}/purchases`, purchaseId);
      const purchaseSnap = await getDoc(purchaseRef);
      
      if (!purchaseSnap.exists()) throw new Error("La orden de compra no existe.");
      const purchaseData = purchaseSnap.data();
      
      if (purchaseData.status === "Recibida") throw new Error("Esta orden ya ha sido recibida.");

      // 1. Actualizar stock de cada item
      for (const item of purchaseData.items) {
        const productRef = doc(db, `organizations/${orgId}/products`, item.productId);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          const productData = productSnap.data();
          const newStock = (productData.stock || 0) + item.quantity;
          const lowStockThreshold = productData.lowStockThreshold || 5;
          const newStatus = newStock === 0 ? "Agotado" : newStock <= lowStockThreshold ? "Bajo Stock" : "Normal";

          await updateDoc(productRef, {
            stock: newStock,
            status: newStatus,
            updatedAt: serverTimestamp()
          });
        }
      }

      // 2. Marcar OC como recibida
      await updateDoc(purchaseRef, {
        status: "Recibida",
        receivedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // 3. Crear registro en Finanzas (Egreso automático)
      const txRef = collection(db, `organizations/${orgId}/transactions`);
      return await addDoc(txRef, {
        type: "expense",
        description: `Compra de mercadería - ${purchaseData.orderNumber} (${purchaseData.supplierName})`,
        amount: purchaseData.totalAmount,
        category: "Mercadería",
        date: new Date().toISOString(),
        referenceId: purchaseId,
        source: "purchases",
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("[usePurchases] Error en recepción:", err);
      throw err;
    }
  };

  return {
    purchases,
    loading,
    error,
    addPurchase,
    updatePurchaseStatus,
    receivePurchase
  };
};
