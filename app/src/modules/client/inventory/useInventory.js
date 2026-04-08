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
    const status = productData.stock === 0 ? "Agotado" : productData.stock <= 10 ? "Bajo Stock" : "Normal";
    const newProduct = { ...productData, status };

    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          setProducts(prev => [{ id: "p_" + Date.now(), ...newProduct, createdAt: new Date() }, ...prev]);
          resolve({ id: "p_" + Date.now() });
        }, 600);
      });
    }

    const productsRef = collection(db, `organizations/${orgId}/products`);
    return await addDoc(productsRef, {
      ...newProduct,
      createdAt: serverTimestamp()
    });
  };

  const updateProductStock = async (productId, newStock) => {
    const status = newStock === 0 ? "Agotado" : newStock <= 10 ? "Bajo Stock" : "Normal";

    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock, status } : p));
          resolve();
        }, 400);
      });
    }

    const productRef = doc(db, `organizations/${orgId}/products`, productId);
    return await updateDoc(productRef, {
      stock: newStock,
      status: status,
      updatedAt: serverTimestamp()
    });
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProductStock
  };
};
