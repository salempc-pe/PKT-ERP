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

// Constante para verificar si Firebase está configurado
const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

export const useSales = (orgId = "default_org") => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -- Suscripción a VENTAS / FACTURAS --
  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Mock Data inicial
      setTimeout(() => {
        setSales([
          { 
            id: "mock_s1", 
            invoiceNumber: 'INV-0003', 
            clientName: 'Agencia CreaTiva', 
            totalAmount: 900.00, 
            status: 'Borrador', 
            documentType: 'Factura',
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 86400000 * 15), // Vence en 15 días
            items: [{ name: 'Servicio Consultoría', quantity: 1, price: 900, subtotal: 900 }],
            createdAt: new Date() 
          },
          { 
            id: "mock_s2", 
            invoiceNumber: 'INV-0002', 
            clientName: 'David Paredes', 
            totalAmount: 120.00, 
            status: 'Pendiente', 
            documentType: 'Boleta',
            issueDate: new Date(Date.now() - 86400000 * 5),
            dueDate: new Date(Date.now() - 86400000 * 1), // Vencida hace 1 día
            items: [{ name: 'Casaca Impermeable', quantity: 1, price: 90, subtotal: 90 }],
            createdAt: new Date(Date.now() - 86400000 * 5) 
          },
          { 
            id: "mock_s3", 
            invoiceNumber: 'INV-0001', 
            clientName: 'Inversiones Globales SAC', 
            totalAmount: 450.00, 
            status: 'Pagada', 
            documentType: 'Factura',
            issueDate: new Date(Date.now() - 86400000 * 10),
            dueDate: new Date(Date.now() + 86400000 * 20),
            items: [{ name: 'Zapatilla Urban X', quantity: 2, price: 85, subtotal: 170 }],
            createdAt: new Date(Date.now() - 86400000 * 10) 
          }
        ]);
        setLoading(false);
      }, 800);
      return;
    }

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

      if (!isFirebaseConfigured) {
        return new Promise((resolve) => {
          setTimeout(() => {
            setSales(prev => [{ id: "s_" + Date.now(), ...validatedData, createdAt: new Date() }, ...prev]);
            resolve({ id: "s_" + Date.now() });
          }, 600);
        });
      }

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

    if (!isFirebaseConfigured) {
      setSales(prev => prev.map(s => s.id === saleId ? { ...s, status: newStatus } : s));
      return;
    }

    const saleRef = doc(db, `organizations/${orgId}/invoices`, saleId);
    return await updateDoc(saleRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
  };

  const deleteSale = async (saleId) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          setSales(prev => prev.filter(s => s.id !== saleId));
          resolve();
        }, 400);
      });
    }

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
