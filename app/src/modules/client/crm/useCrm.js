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

export const useCrm = (orgId = "default_org") => {
  const [contacts, setContacts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -- Suscripción a CONTACTOS --
  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Mock Data inicial
      setTimeout(() => {
        setContacts([
          { id: "mock1", name: "Empresa Local Demo", company: "Demo Corp", email: "demo@corp.com", phone: "+123456789", source: "Demo", createdAt: new Date() }
        ]);
        setLoading(false);
      }, 800);
      return;
    }

    const contactsRef = collection(db, `organizations/${orgId}/contacts`);
    const q = query(contactsRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContacts(data);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [orgId]);

  // -- Suscripción a LEADS (Prospectos) --
  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Mock Data inicial para leads
      setLeads([
        { id: "mlead1", name: "Proyecto X", company: "Tech Solutions", status: "prospect", createdAt: new Date() },
        { id: "mlead2", name: "Website V2", company: "Retail Co", status: "negotiating", createdAt: new Date() }
      ]);
      return;
    }

    const leadsRef = collection(db, `organizations/${orgId}/leads`);
    const q = query(leadsRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLeads(data);
    });

    return () => unsub();
  }, [orgId]);

  // -- Métodos MUTADORES --

  const addContact = async (contactData) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          setContacts(prev => [{ id: "c_" + Date.now(), ...contactData, createdAt: new Date() }, ...prev]);
          resolve({ id: "c_" + Date.now() });
        }, 600);
      });
    }

    const contactsRef = collection(db, `organizations/${orgId}/contacts`);
    return await addDoc(contactsRef, {
      ...contactData,
      createdAt: serverTimestamp()
    });
  };

  const addLead = async (leadData) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          setLeads(prev => [{ id: "l_" + Date.now(), ...leadData, status: leadData.status || "prospect", createdAt: new Date() }, ...prev]);
          resolve({ id: "l_" + Date.now() });
        }, 600);
      });
    }

    const leadsRef = collection(db, `organizations/${orgId}/leads`);
    return await addDoc(leadsRef, {
      ...leadData,
      status: leadData.status || "prospect", // prospect | negotiating | won | lost
      createdAt: serverTimestamp()
    });
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
          resolve();
        }, 400);
      });
    }

    const leadRef = doc(db, `organizations/${orgId}/leads`, leadId);
    return await updateDoc(leadRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
  };

  return {
    contacts,
    leads,
    loading,
    error,
    addContact,
    addLead,
    updateLeadStatus
  };
};
