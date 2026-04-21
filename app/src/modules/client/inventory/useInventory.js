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

// Esquema de Validación de Producto
const ProductSchema = z.object({
  sku: z.string().min(1, "SKU requerido").max(50),
  name: z.string().min(1, "Nombre del producto requerido").max(100),
  category: z.string().max(50).optional(),
  price: z.number().min(0, "Precio no puede ser negativo").optional(),
  stock: z.number().int().min(0, "Stock no puede ser negativo").default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  status: z.enum(["Normal", "Bajo Stock", "Agotado"]).optional()
});

// Constante para verificar si Firebase está configurado
const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

export const useInventory = (orgId = "default_org") => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -- Suscripción a PRODUCTOS --
  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Mock Data inicial
      setTimeout(() => {
        setProducts([
          { id: "mock_p1", sku: 'PROD-001', name: 'Zapatilla Urban X', category: 'Calzado', price: '$85.00', stock: 120, status: 'Normal', createdAt: new Date() },
          { id: "mock_p2", sku: 'PROD-002', name: 'Zapatilla Run Swift', category: 'Calzado Deportivo', price: '$120.00', stock: 8, status: 'Bajo Stock', createdAt: new Date() },
          { id: "mock_p3", sku: 'ACC-045', name: 'Mochila Explorer', category: 'Accesorios', price: '$45.00', stock: 35, status: 'Normal', createdAt: new Date() },
          { id: "mock_p4", sku: 'CLO-102', name: 'Polera Básica M', category: 'Ropa', price: '$15.00', stock: 0, status: 'Agotado', createdAt: new Date() },
          { id: "mock_p5", sku: 'CLO-103', name: 'Casaca Impermeable', category: 'Ropa Invierno', price: '$90.00', stock: 45, status: 'Normal', createdAt: new Date() }
        ]);
        setLoading(false);
      }, 800);
      return;
    }

    const productsRef = collection(db, `organizations/${orgId}/products`);
    const q = query(productsRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [orgId]);

  // -- Métodos MUTADORES --

  const addProduct = async (productData) => {
    try {
      const stock = Number(productData.stock) || 0;
      const lowStockThreshold = Number(productData.lowStockThreshold) || 5;
      const price = typeof productData.price === 'string' 
        ? Number(productData.price.replace(/[^0-9.-]+/g, "")) 
        : Number(productData.price);

      const status = stock === 0 ? "Agotado" : stock <= lowStockThreshold ? "Bajo Stock" : "Normal";
      
      const validatedData = ProductSchema.parse({ 
        ...productData, 
        price,
        stock,
        lowStockThreshold,
        status 
      });

      if (!isFirebaseConfigured) {
        return new Promise((resolve) => {
          setTimeout(() => {
            setProducts(prev => [{ id: "p_" + Date.now(), ...validatedData, createdAt: new Date() }, ...prev]);
            resolve({ id: "p_" + Date.now() });
          }, 600);
        });
      }

      const productsRef = collection(db, `organizations/${orgId}/products`);
      return await addDoc(productsRef, {
        ...validatedData,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Validation Error:", err);
      throw err;
    }
  };

  const updateProduct = async (productId, productData) => {
    try {
      const stock = Number(productData.stock);
      const lowStockThreshold = Number(productData.lowStockThreshold);
      const price = typeof productData.price === 'string' 
        ? Number(productData.price.replace(/[^0-9.-]+/g, "")) 
        : Number(productData.price);

      const status = stock === 0 ? "Agotado" : stock <= lowStockThreshold ? "Bajo Stock" : "Normal";

      const validatedData = ProductSchema.partial().parse({
        ...productData,
        price,
        stock,
        lowStockThreshold,
        status
      });

      if (!isFirebaseConfigured) {
        return new Promise((resolve) => {
          setTimeout(() => {
            setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...validatedData, updatedAt: new Date() } : p));
            resolve();
          }, 400);
        });
      }

      const productRef = doc(db, `organizations/${orgId}/products`, productId);
      return await updateDoc(productRef, {
        ...validatedData,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Validation Error:", err);
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct
  };
};
