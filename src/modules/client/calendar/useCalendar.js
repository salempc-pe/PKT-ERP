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

export const useCalendar = (orgId = "default_org", currentUserId = null) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orgId || orgId === "default_org") {
      setLoading(false);
      return;
    }

    const apptsRef = collection(db, `organizations/${orgId}/appointments`);
    const qAppts = query(apptsRef, orderBy("date", "asc"));

    const unsubAppts = onSnapshot(qAppts, (snapshot) => {
      const allData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Filtrado en cliente: Mostrar eventos de empresa (company) O personales (personal) creados por el usuario actual
      const filtered = allData.filter(appt => {
        if (appt.type === "company") return true;
        if (appt.type === "personal" && appt.userId === currentUserId) return true;
        // Fallback para datos heredados sin campo 'type': se tratan como corporativos por compatibilidad
        if (!appt.type) return true;
        return false;
      });

      setAppointments(filtered);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching appointments:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => {
      unsubAppts();
    };
  }, [orgId, currentUserId]);

  const addAppointment = async (apptData) => {
    const apptsRef = collection(db, `organizations/${orgId}/appointments`);
    const docRef = await addDoc(apptsRef, {
      ...apptData,
      status: apptData.status || "PENDING",
      createdAt: serverTimestamp()
    });
    return docRef;
  };

  const updateAppointment = async (apptId, newData) => {
    const apptRef = doc(db, `organizations/${orgId}/appointments`, apptId);
    await updateDoc(apptRef, {
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
