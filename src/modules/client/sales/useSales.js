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
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../../../services/firebase";
import { z } from "zod";

const SaleSchema = z.object({
  invoiceNumber: z.string().optional(),
  clientName: z.string().min(1, "Cliente requerido"),
  totalAmount: z.number().min(0),
  status: z.enum(["Borrador", "Pendiente", "Pagada", "Anulada"]).default("Pendiente"),
  documentType: z.enum(["Factura", "Boleta", "Nota de Venta"]).default("Factura"),
  items: z.array(z.any()).min(1, "Debe incluir al menos un ítem")
});

export const useSales = (orgId = "default_org") => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -- Suscripción a VENTAS / FACTURAS --
  useEffect(() => {
    const salesRef = collection(db, `organizations/${orgId}/invoices`);
    const q = query(salesRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSales(data);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [orgId]);

  // -- Métodos MUTADORES --

  const addSale = async (saleData) => {
    try {
      const docType = saleData.documentType || "Factura";
      const prefix = docType === 'Factura' ? 'F001' : 'B001';
      const count = sales.filter(s => s.documentType === docType).length + 1;
      const invoiceNumber = `${prefix}-${String(count).padStart(4, '0')}`;

      const validatedData = SaleSchema.parse({ 
        ...saleData, 
        invoiceNumber,
        status: saleData.status || "Pendiente",
        documentType: docType
      });

      const salesRef = collection(db, `organizations/${orgId}/invoices`);
      return await addDoc(salesRef, {
        ...validatedData,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Sale Validation Error:", err);
      throw err;
    }
  };

  const updateSaleStatus = async (saleId, newStatus) => {
    const currentSale = sales.find(s => s.id === saleId);
    
    // GUARDIA: No permitir cambios si la factura está Anulada
    if (currentSale?.status === 'Anulada') {
      throw new Error("No se puede modificar una factura anulada");
    }

    // GUARDIA: No permitir volver a Pendiente si ya está Pagada (Seguridad financiera básica)
    if (currentSale?.status === 'Pagada' && newStatus === 'Pendiente') {
      throw new Error("No se puede revertir una factura pagada a pendiente");
    }

    const saleRef = doc(db, `organizations/${orgId}/invoices`, saleId);
    return await updateDoc(saleRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
  };

  const deleteSale = async (saleId) => {
    const saleRef = doc(db, `organizations/${orgId}/invoices`, saleId);
    return await deleteDoc(saleRef);
  };

  return {
    sales,
    loading,
    error,
    addSale,
    updateSaleStatus,
    deleteSale
  };
};
