import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  getDocs,
  limit,
  startAfter,
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
        timestamp: serverTimestamp(),
        expireAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // Expira en 90 días
      });
    } catch (error) {
      console.error("Error recording audit log:", error);
    }
  };

  return { logAction };
}

/**
 * Hook to fetch audit logs with pagination.
 */
export function useGetAuditLogs(orgId, limitCount = 50) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Si no hay orgId, no hacemos nada (a menos que seamos SuperAdmin, pero este hook es para clientes)
    if (!orgId) return;

    // Calculamos la fecha de hace 90 días
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const q = query(
      collection(db, 'audit_logs'),
      where('orgId', '==', orgId),
      where('timestamp', '>=', ninetyDaysAgo),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      
      setLogs(logsData);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === limitCount);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orgId, limitCount]);

  const loadMore = async () => {
    if (!lastVisible || !hasMore) return;

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const nextQ = query(
      collection(db, 'audit_logs'),
      where('orgId', '==', orgId),
      where('timestamp', '>=', ninetyDaysAgo),
      orderBy('timestamp', 'desc'),
      startAfter(lastVisible),
      limit(limitCount)
    );

    const snapshot = await getDocs(nextQ);
    const newLogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));

    setLogs(prev => [...prev, ...newLogs]);
    setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    setHasMore(snapshot.docs.length === limitCount);
  };

  return { logs, loading, hasMore, loadMore };
}

/**
 * Hook to fetch ALL audit logs with pagination (SuperAdmin).
 */
export function useGetAllAuditLogs(limitCount = 50) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const q = query(
      collection(db, 'audit_logs'),
      where('timestamp', '>=', ninetyDaysAgo),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      
      setLogs(logsData);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === limitCount);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [limitCount]);

  const loadMore = async () => {
    if (!lastVisible || !hasMore) return;

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const nextQ = query(
      collection(db, 'audit_logs'),
      where('timestamp', '>=', ninetyDaysAgo),
      orderBy('timestamp', 'desc'),
      startAfter(lastVisible),
      limit(limitCount)
    );

    const snapshot = await getDocs(nextQ);
    const newLogs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));

    setLogs(prev => [...prev, ...newLogs]);
    setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
    setHasMore(snapshot.docs.length === limitCount);
  };

  return { logs, loading, hasMore, loadMore };
}


