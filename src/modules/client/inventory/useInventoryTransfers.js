import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  runTransaction
} from "firebase/firestore";
import { db } from "../../../services/firebase";

export const useInventoryTransfers = (orgId = "default_org") => {

  const initiateTransfer = async ({ productId, fromWarehouseId, toWarehouseId, quantity, notes = "" }) => {
    const productRef = doc(db, `organizations/${orgId}/products`, productId);
    const transfersRef = collection(db, `organizations/${orgId}/inventory_transfers`);

    try {
      return await runTransaction(db, async (transaction) => {
        const productDoc = await transaction.get(productRef);
        if (!productDoc.exists()) throw new Error("Producto no encontrado");

        const productData = productDoc.data();
        const stockByWarehouse = productData.stockByWarehouse || {};
        const fromStock = stockByWarehouse[fromWarehouseId] || 0;

        if (fromStock < quantity) throw new Error("Stock insuficiente en el almacén de origen");

        // 1. Descontar del almacén de origen
        const updatedStockByWarehouse = {
          ...stockByWarehouse,
          [fromWarehouseId]: fromStock - quantity
        };

        transaction.update(productRef, {
          stockByWarehouse: updatedStockByWarehouse,
          updatedAt: serverTimestamp()
        });

        // 2. Crear documento de transferencia
        const transferDoc = {
          productId,
          fromWarehouseId,
          toWarehouseId,
          quantity,
          notes,
          status: "in_transit",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        const newTransferRef = doc(transfersRef);
        transaction.set(newTransferRef, transferDoc);
        
        return newTransferRef.id;
      });
    } catch (err) {
      console.error("Initiate Transfer Error:", err);
      throw err;
    }
  };

  const completeTransfer = async (transferId) => {
    const transferRef = doc(db, `organizations/${orgId}/inventory_transfers`, transferId);

    try {
      await runTransaction(db, async (transaction) => {
        const transferSnap = await transaction.get(transferRef);
        if (!transferSnap.exists()) throw new Error("Transferencia no encontrada");

        const transferData = transferSnap.data();
        if (transferData.status !== "in_transit") throw new Error("Solo se pueden completar transferencias en tránsito");

        const productRef = doc(db, `organizations/${orgId}/products`, transferData.productId);
        const productDoc = await transaction.get(productRef);
        if (!productDoc.exists()) throw new Error("Producto no encontrado");

        const productData = productDoc.data();
        const stockByWarehouse = productData.stockByWarehouse || {};
        const toStock = stockByWarehouse[transferData.toWarehouseId] || 0;

        // 1. Sumar al almacén de destino
        const updatedStockByWarehouse = {
          ...stockByWarehouse,
          [transferData.toWarehouseId]: toStock + transferData.quantity
        };

        transaction.update(productRef, {
          stockByWarehouse: updatedStockByWarehouse,
          updatedAt: serverTimestamp()
        });

        // 2. Actualizar estado de transferencia
        transaction.update(transferRef, {
          status: "completed",
          completedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });
      return true;
    } catch (err) {
      console.error("Complete Transfer Error:", err);
      throw err;
    }
  };

  const cancelTransfer = async (transferId) => {
    const transferRef = doc(db, `organizations/${orgId}/inventory_transfers`, transferId);

    try {
      await runTransaction(db, async (transaction) => {
        const transferSnap = await transaction.get(transferRef);
        if (!transferSnap.exists()) throw new Error("Transferencia no encontrada");

        const transferData = transferSnap.data();
        if (transferData.status !== "in_transit") throw new Error("Solo se pueden cancelar transferencias en tránsito");

        const productRef = doc(db, `organizations/${orgId}/products`, transferData.productId);
        const productDoc = await transaction.get(productRef);
        
        // Devolver stock al origen
        if (productDoc.exists()) {
          const productData = productDoc.data();
          const stockByWarehouse = productData.stockByWarehouse || {};
          const fromStock = stockByWarehouse[transferData.fromWarehouseId] || 0;

          const updatedStockByWarehouse = {
            ...stockByWarehouse,
            [transferData.fromWarehouseId]: fromStock + transferData.quantity
          };

          transaction.update(productRef, {
            stockByWarehouse: updatedStockByWarehouse,
            updatedAt: serverTimestamp()
          });
        }

        // Marcar como cancelada
        transaction.update(transferRef, {
          status: "cancelled",
          updatedAt: serverTimestamp()
        });
      });
      return true;
    } catch (err) {
      console.error("Cancel Transfer Error:", err);
      throw err;
    }
  };

  return {
    initiateTransfer,
    completeTransfer,
    cancelTransfer
  };
};
