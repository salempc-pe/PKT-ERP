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

export const useAppointments = (orgId = "default_org") => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    const apptsRef = collection(db, `organizations/${orgId}/appointments`);
    return await addDoc(apptsRef, {
      ...apptData,
      status: apptData.status || "PENDING",
      createdAt: serverTimestamp()
    });
  };

  const updateAppointment = async (apptId, newData) => {
    const apptRef = doc(db, `organizations/${orgId}/appointments`, apptId);
    return await updateDoc(apptRef, {
      ...newData,
      updatedAt: serverTimestamp()
    });
  };

  const deleteAppointment = async (apptId) => {
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
