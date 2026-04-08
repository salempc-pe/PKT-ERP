import { useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  serverTimestamp,
  deleteDoc
} from "firebase/firestore";
import { db } from "../../../services/firebase";

const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

export const useAppointments = (orgId = "default_org") => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setTimeout(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        setAppointments([
          { 
            id: "mockA1", 
            title: "Reunión de Onboarding", 
            date: todayStr, 
            time: "10:00", 
            clientId: "mock1", 
            status: "PENDING", 
            notes: "Revisar specs del proyecto.",
            createdAt: new Date() 
          }
        ]);
        setLoading(false);
      }, 800);
      return;
    }

    const apptsRef = collection(db, `organizations/${orgId}/appointments`);
    const q = query(apptsRef, orderBy("date", "asc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [orgId]);

  const addAppointment = async (apptData) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          setAppointments(prev => [{ 
            id: "a_" + Date.now(), 
            ...apptData, 
            status: apptData.status || "PENDING", 
            createdAt: new Date() 
          }, ...prev]);
          resolve({ id: "a_" + Date.now() });
        }, 600);
      });
    }

    const apptsRef = collection(db, `organizations/${orgId}/appointments`);
    return await addDoc(apptsRef, {
      ...apptData,
      status: apptData.status || "PENDING",
      createdAt: serverTimestamp()
    });
  };

  const updateAppointment = async (apptId, newData) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          setAppointments(prev => prev.map(a => a.id === apptId ? { ...a, ...newData } : a));
          resolve();
        }, 400);
      });
    }

    const apptRef = doc(db, `organizations/${orgId}/appointments`, apptId);
    return await updateDoc(apptRef, {
      ...newData,
      updatedAt: serverTimestamp()
    });
  };

  const deleteAppointment = async (apptId) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          setAppointments(prev => prev.filter(a => a.id !== apptId));
          resolve();
        }, 400);
      });
    }
    const apptRef = doc(db, `organizations/${orgId}/appointments`, apptId);
    return await deleteDoc(apptRef);
  };

  return {
    appointments,
    loading,
    error,
    addAppointment,
    updateAppointment,
    deleteAppointment
  };
};
