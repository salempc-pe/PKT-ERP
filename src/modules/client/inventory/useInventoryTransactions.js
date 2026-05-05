import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc,
  serverTimestamp,
  runTransaction
} from "firebase/firestore";
import { db } from "../../../services/firebase";

export const useInventoryTransactions = (orgId = "default_org") => {
  
  /**
   * Registra una transacción de inventario y actualiza el stock y costo promedio del producto de forma atómica.
   */
  const recordTransaction = async ({ type, productId, quantity, unitCost = 0, warehouseId, notes = "" }) => {
    const productRef = doc(db, `organizations/${orgId}/products`, productId);
    const transactionsRef = collection(db, `organizations/${orgId}/inventory_transactions`);

    try {
      await runTransaction(db, async (transaction) => {
        const productDoc = await transaction.get(productRef);
        if (!productDoc.exists()) {
          throw new Error("El producto no existe.");
        }

        const productData = productDoc.data();
        const currentTotalStock = productData.stock || 0;
        const currentAverageCost = productData.averageCost || 0;
        const currentStockByWarehouse = productData.stockByWarehouse || {};
        const warehouseStock = currentStockByWarehouse[warehouseId] || 0;

        let newTotalStock = currentTotalStock;
        let newAverageCost = currentAverageCost;
        let newWarehouseStock = warehouseStock;

        if (type === "inbound") {
          // Lógica de Promedio Ponderado
          // Nuevo Costo Promedio = ((Stock Anterior * Costo Anterior) + (Nueva Cantidad * Nuevo Costo)) / (Stock Anterior + Nueva Cantidad)
          const totalValueBefore = currentTotalStock * currentAverageCost;
          const valueAdded = quantity * unitCost;
          newTotalStock = currentTotalStock + quantity;
          newAverageCost = newTotalStock > 0 ? (totalValueBefore + valueAdded) / newTotalStock : 0;
          newWarehouseStock = warehouseStock + quantity;
        } else if (type === "outbound") {
          if (currentTotalStock < quantity) {
            throw new Error("Stock insuficiente para realizar la salida.");
          }
          newTotalStock = currentTotalStock - quantity;
          newWarehouseStock = warehouseStock - quantity;
          // El costo promedio no cambia en las salidas, se usa el costo actual para valorizar la salida
        }

        // Actualizar el mapa de stock por almacén
        const updatedStockByWarehouse = {
          ...currentStockByWarehouse,
          [warehouseId]: newWarehouseStock
        };

        // 1. Registrar la transacción
        const transDoc = {
          type,
          productId,
          warehouseId,
          quantity,
          unitCost: type === "inbound" ? unitCost : currentAverageCost,
          totalCost: type === "inbound" ? (quantity * unitCost) : (quantity * currentAverageCost),
          notes,
          date: serverTimestamp()
        };

        // 2. Actualizar el producto
        transaction.update(productRef, {
          stock: newTotalStock,
          averageCost: newAverageCost,
          stockByWarehouse: updatedStockByWarehouse,
          updatedAt: serverTimestamp()
        });

        // 3. Crear el documento de transacción
        const newTransRef = doc(transactionsRef);
        transaction.set(newTransRef, transDoc);
      });

      return true;
    } catch (err) {
      console.error("Transaction Error:", err);
      throw err;
    }
  };

  return {
    recordTransaction
  };
};
