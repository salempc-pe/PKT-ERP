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
import { z } from "zod";

// Esquemas de Validación
const ContactSchema = z.object({
  name: z.string().min(1, "Nombre requerido").max(100),
  company: z.string().max(100).optional(),
  email: z.string().email("Email inválido").or(z.literal("")),
  phone: z.string().max(20).optional(),
  source: z.string().max(50).optional(),
  creditDays: z.number().int().min(0).default(0)
});

const LeadSchema = z.object({
  name: z.string().min(1, "Nombre del proyecto requerido").max(100),
  company: z.string().max(100).optional(),
  status: z.enum(["prospect", "negotiating", "won", "lost"]).default("prospect"),
  value: z.number().min(0).optional(),
  notes: z.string().max(500).optional()
});

// Constante para verificar si Firebase está configurado
export const useCrm = (orgId = "default_org") => {
  const [contacts, setContacts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -- Suscripción a CONTACTOS --
  useEffect(() => {
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
    const leadsRef = collection(db, `organizations/${orgId}/leads`);
    // Usamos una query simple para evitar problemas de índices y manejamos el ordenamiento localmente
    const q = query(leadsRef);

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Ordenamiento manual descendente por fecha de creación
      const sortedData = data.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
      
      setLeads(sortedData);
    }, (err) => {
      console.error("[useCrm] Error en suscripción de leads:", err);
      setError(err.message);
    });

    return () => unsub();
  }, [orgId]);

  // -- Métodos MUTADORES --

  const addContact = async (contactData) => {
    try {
      const validatedData = ContactSchema.parse({
        ...contactData,
        creditDays: parseInt(contactData.creditDays) || 0
      });

      const contactsRef = collection(db, `organizations/${orgId}/contacts`);
      return await addDoc(contactsRef, {
        ...validatedData,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Validation Error:", err);
      throw err;
    }
  };

  const addLead = async (leadData) => {
    try {
      const validatedData = LeadSchema.parse(leadData);

      const leadsRef = collection(db, `organizations/${orgId}/leads`);
      return await addDoc(leadsRef, {
        ...validatedData,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Validation Error:", err);
      throw err;
    }
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    const leadRef = doc(db, `organizations/${orgId}/leads`, leadId);
    return await updateDoc(leadRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
  };

  const updateLead = async (leadId, leadData) => {
    try {
      // Para actualizaciones, permitimos validación parcial (solo los campos enviados)
      const validatedData = LeadSchema.partial().parse(leadData);

      const leadRef = doc(db, `organizations/${orgId}/leads`, leadId);
      return await updateDoc(leadRef, {
        ...validatedData,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Validation Error:", err);
      throw err;
    }
  };

  return {
    contacts,
    leads,
    loading,
    error,
    addContact,
    addLead,
    updateLeadStatus,
    updateLead
  };
};
