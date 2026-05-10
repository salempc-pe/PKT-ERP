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

export const useCalendar = (orgId = "default_org") => {
  const [appointments, setAppointments] = useState([]);
  const [resources, setResources] = useState([]);
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
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(data);
    }, (err) => {
      setError(err.message);
    });

    const resourcesRef = collection(db, `organizations/${orgId}/resources`);
    const qRes = query(resourcesRef, orderBy("name", "asc"));

    const unsubRes = onSnapshot(qRes, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResources(data);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => {
      unsubAppts();
      unsubRes();
    };
  }, [orgId]);

  // --- Appointments Logic ---

  const checkConflict = (apptData, apptId = null) => {
    if (!apptData.resourceId) return false;

    const start = new Date(`${apptData.date}T${apptData.time}`);
    const duration = parseInt(apptData.duration || 60);
    const end = new Date(start.getTime() + duration * 60000);

    return appointments.some(existing => {
      if (existing.id === apptId) return false; // Ignorar el mismo evento en caso de edición
      if (existing.resourceId !== apptData.resourceId) return false;
      if (existing.status === 'CANCELLED' || existing.status === 'DONE') return false;

      const eStart = new Date(`${existing.date}T${existing.time}`);
      const eDuration = parseInt(existing.duration || 60);
      const eEnd = new Date(eStart.getTime() + eDuration * 60000);

      return start < eEnd && end > eStart;
    });
  };



  const addAppointment = async (apptData) => {
    if (checkConflict(apptData)) {
      throw new Error("El recurso seleccionado ya está ocupado en ese horario.");
    }

    const apptsRef = collection(db, `organizations/${orgId}/appointments`);
    const docRef = await addDoc(apptsRef, {
      ...apptData,
      status: apptData.status || "PENDING",
      duration: apptData.duration || 60,
      createdAt: serverTimestamp()
    });

    return docRef;
  };

  const updateAppointment = async (apptId, newData) => {
    // Si se cambia fecha, hora, duración o recurso, verificar conflictos
    const current = appointments.find(a => a.id === apptId);
    const merged = { ...current, ...newData };
    
    if (checkConflict(merged, apptId)) {
      throw new Error("El recurso seleccionado ya está ocupado en ese horario.");
    }

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

  // --- Resources Logic ---

  const addResource = async (resData) => {
    const resRef = collection(db, `organizations/${orgId}/resources`);
    return await addDoc(resRef, {
      ...resData,
      createdAt: serverTimestamp()
    });
  };

  const updateResource = async (resId, newData) => {
    const resRef = doc(db, `organizations/${orgId}/resources`, resId);
    return await updateDoc(resRef, {
      ...newData,
      updatedAt: serverTimestamp()
    });
  };

  const deleteResource = async (resId) => {
    const resRef = doc(db, `organizations/${orgId}/resources`, resId);
    return await deleteDoc(resRef);
  };

  return {
    appointments,
    resources,
    loading,
    error,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addResource,
    updateResource,
    deleteResource
  };
};
