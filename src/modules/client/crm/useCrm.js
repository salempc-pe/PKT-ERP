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
  creditDays: z.number().int().min(0).default(0),
  tags: z.array(z.string()).default([]),
  score: z.number().int().min(0).default(0)
});

const LeadSchema = z.object({
  name: z.string().min(1, "Nombre del proyecto requerido").max(100),
  company: z.string().max(100).optional(),
  status: z.enum(["prospect", "negotiating", "won", "lost"]).default("prospect"),
  value: z.number().min(0).optional(),
  notes: z.string().max(500).optional(),
  tags: z.array(z.string()).default([]),
  score: z.number().int().min(0).default(0)
});

const InteractionSchema = z.object({
  type: z.enum(["Llamada", "Correo", "Reunión", "Nota"]),
  notes: z.string().min(1, "Notas requeridas").max(500),
  contactId: z.string().optional(),
  leadId: z.string().optional()
});

// Constante para verificar si Firebase está configurado
export const useCrm = (orgId = "default_org") => {
  const [contacts, setContacts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -- Suscripción a INTERACCIONES --
  useEffect(() => {
    if (!orgId || orgId === "default_org") return;

    const interactionsRef = collection(db, `organizations/${orgId}/interactions`);
    const q = query(interactionsRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInteractions(data);
    }, (err) => {
      console.error("[useCrm] Error en suscripción de interacciones:", err);
    });

    return () => unsub();
  }, [orgId]);

  // -- Suscripción a CONTACTOS --
  useEffect(() => {
    if (!orgId || orgId === "default_org") {
      setLoading(false);
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
    if (!orgId || orgId === "default_org") return;

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

  const updateContact = async (contactId, contactData) => {
    try {
      const validatedData = ContactSchema.partial().parse({
        ...contactData,
        creditDays: contactData.creditDays !== undefined ? parseInt(contactData.creditDays) : undefined
      });

      const contactRef = doc(db, `organizations/${orgId}/contacts`, contactId);
      return await updateDoc(contactRef, {
        ...validatedData,
        updatedAt: serverTimestamp()
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

  const addInteraction = async (interactionData) => {
    try {
      const validatedData = InteractionSchema.parse(interactionData);

      const interactionsRef = collection(db, `organizations/${orgId}/interactions`);
      await addDoc(interactionsRef, {
        ...validatedData,
        createdAt: serverTimestamp()
      });

      if (validatedData.contactId) {
        const contact = contacts.find(c => c.id === validatedData.contactId);
        if (contact) {
          const contactRef = doc(db, `organizations/${orgId}/contacts`, validatedData.contactId);
          await updateDoc(contactRef, {
            score: (contact.score || 0) + 10,
            updatedAt: serverTimestamp()
          });
        }
      }

      if (validatedData.leadId) {
        const lead = leads.find(l => l.id === validatedData.leadId);
        if (lead) {
          const leadRef = doc(db, `organizations/${orgId}/leads`, validatedData.leadId);
          await updateDoc(leadRef, {
            score: (lead.score || 0) + 10,
            updatedAt: serverTimestamp()
          });
        }
      }

    } catch (err) {
      console.error("Validation/Firestore Error in addInteraction:", err);
      throw err;
    }
  };

  return {
    contacts,
    leads,
    interactions,
    loading,
    error,
    addContact,
    updateContact,
    addLead,
    updateLeadStatus,
    updateLead,
    addInteraction
  };
};
