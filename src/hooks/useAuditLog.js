import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Hook to record actions in the audit log.
 */
export function useAuditLog() {
  const logAction = async (orgId, userId, userName, action, module, details) => {
    if (!orgId) return;
    
    try {
      await addDoc(collection(db, 'audit_logs'), {
        orgId,
        userId,
        userName,
        action, // e.g., 'CREATE', 'DELETE', 'UPDATE'
        module, // e.g., 'CRM', 'INVENTORY'
        details,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error recording audit log:", error);
    }
  };

  return { logAction };
}

/**
 * Hook to fetch audit logs for an organization.
 */
export function useGetAuditLogs(orgId) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orgId) return;

    const q = query(
      collection(db, 'audit_logs'),
      where('orgId', '==', orgId),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      setLogs(logsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orgId]);

  return { logs, loading };
}
