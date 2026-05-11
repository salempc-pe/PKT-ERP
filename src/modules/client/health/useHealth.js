import { useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc, 
  query, 
  orderBy,
  where,
  serverTimestamp,
  getDocs,
  limit
} from "firebase/firestore";
import { db } from "../../../services/firebase";
import { z } from "zod";

// --- ESQUEMAS DE VALIDACIÓN ---

export const ExpedienteSchema = z.object({
  client_id: z.string().min(1, "Cliente requerido"),
  motivo_consulta: z.string().min(1, "Motivo requerido"),
  antecedentes: z.string().optional().default(""),
  diagnostico: z.string().optional().default(""),
  estado: z.enum(["activo", "en_pausa", "alta", "archivado"]).default("activo"),
  fecha_inicio: z.any() // timestamp
});

export const CitaSchema = z.object({
  client_id: z.string().min(1, "Cliente requerido"),
  expediente_id: z.string().min(1, "Expediente requerido"),
  fecha_hora: z.any(), // timestamp
  duracion_min: z.number().default(60),
  tipo_sesion: z.enum(["primera_consulta", "seguimiento", "evaluacion", "cierre"]),
  estado: z.enum(["programada", "confirmada", "realizada", "cancelada", "no_presento"]).default("programada"),
  modalidad: z.enum(["presencial", "videollamada", "telefono"]),
  monto: z.number().optional().nullable(),
  pagada: z.boolean().default(false)
});

export const NotaSesionSchema = z.object({
  cita_id: z.string().min(1),
  client_id: z.string().min(1),
  contenido: z.string().min(1, "Contenido requerido"),
  privada: z.boolean().default(true),
  etiquetas: z.array(z.string()).default([])
});

export const NotaGeneralSchema = z.object({
  client_id: z.string().min(1),
  expediente_id: z.string().min(1),
  titulo: z.string().optional().default(""),
  contenido: z.string().min(1, "Contenido requerido"),
  privada: z.boolean().default(true),
  etiquetas: z.array(z.string()).default([])
});

export const ArchivoSchema = z.object({
  client_id: z.string().min(1),
  nombre: z.string().min(1),
  url: z.string().url(),
  tipo: z.string()
});

// --- HOOK PRINCIPAL ---

export const useHealth = (orgId = "default_org") => {
  const [expedientes, setExpedientes] = useState([]);
  const [citas, setCitas] = useState([]);
  const [notasSesion, setNotasSesion] = useState([]);
  const [notasGenerales, setNotasGenerales] = useState([]);
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isConfigured = orgId && orgId !== "default_org";

  // -- LISTENERS --
  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // 1. Expedientes
    const expRef = collection(db, `organizations/${orgId}/expedientes`);
    
    // 2. Citas
    const citasRef = collection(db, `organizations/${orgId}/citas`);

    // 3. Notas Generales
    const notesGenRef = collection(db, `organizations/${orgId}/notas_generales`);

    const unsubExp = onSnapshot(expRef, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Manual sort by updated_at
      const sorted = data.sort((a, b) => {
        const dateA = a.updated_at?.toDate ? a.updated_at.toDate() : new Date(a.updated_at || 0);
        const dateB = b.updated_at?.toDate ? b.updated_at.toDate() : new Date(b.updated_at || 0);
        return dateB - dateA;
      });
      setExpedientes(sorted);
      setLoading(false);
    }, (err) => {
      console.error("Error loading expedientes:", err);
      setError(err.message);
      setLoading(false);
    });

    const unsubCitas = onSnapshot(citasRef, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      // Manual sort by fecha_hora
      const sorted = data.sort((a, b) => {
        const dateA = a.fecha_hora?.toDate ? a.fecha_hora.toDate() : new Date(a.fecha_hora || 0);
        const dateB = b.fecha_hora?.toDate ? b.fecha_hora.toDate() : new Date(b.fecha_hora || 0);
        return dateB - dateA;
      });
      setCitas(sorted);
    }, (err) => console.error("Error loading citas:", err));

    const unsubNotesGen = onSnapshot(notesGenRef, (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const sorted = data.sort((a, b) => {
        const dateA = a.created_at?.toDate ? a.created_at.toDate() : new Date(a.created_at || 0);
        const dateB = b.created_at?.toDate ? b.created_at.toDate() : new Date(b.created_at || 0);
        return dateB - dateA;
      });
      setNotasGenerales(sorted);
    }, (err) => console.error("Error loading notas generales:", err));

    return () => {
      unsubExp();
      unsubCitas();
      unsubNotesGen();
    };
  }, [orgId]);

  // Carga de Notas de Sesión
  useEffect(() => {
    if (!isConfigured) return;
    
    const notesSesRef = collection(db, `organizations/${orgId}/notas_sesion`);
    const unsub = onSnapshot(notesSesRef, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const sorted = data.sort((a, b) => {
        const dateA = a.created_at?.toDate ? a.created_at.toDate() : new Date(a.created_at || 0);
        const dateB = b.created_at?.toDate ? b.created_at.toDate() : new Date(b.created_at || 0);
        return dateB - dateA;
      });
      setNotasSesion(sorted);
    }, (err) => console.error("Error loading notas sesión:", err));
    return () => unsub();
  }, [orgId]);

  // Carga de Archivos
  useEffect(() => {
    if (!isConfigured) return;
    const filesRef = collection(db, `organizations/${orgId}/archivos_paciente`);
    const unsub = onSnapshot(filesRef, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const sorted = data.sort((a, b) => {
        const dateA = a.uploaded_at?.toDate ? a.uploaded_at.toDate() : new Date(a.uploaded_at || 0);
        const dateB = b.uploaded_at?.toDate ? b.uploaded_at.toDate() : new Date(b.uploaded_at || 0);
        return dateB - dateA;
      });
      setArchivos(sorted);
    }, (err) => console.error("Error loading archivos:", err));
    return () => unsub();
  }, [orgId]);


  // --- MÉTODOS DE MUTACIÓN ---

  // Expedientes
  const createExpediente = async (data) => {
    const validated = ExpedienteSchema.parse(data);
    // Verificar si ya existe un expediente activo para este cliente
    const q = query(
      collection(db, `organizations/${orgId}/expedientes`),
      where("client_id", "==", validated.client_id),
      where("estado", "==", "activo"),
      limit(1)
    );
    const existing = await getDocs(q);
    if (!existing.empty) {
      throw new Error("El cliente ya posee un expediente activo.");
    }

    const ref = collection(db, `organizations/${orgId}/expedientes`);
    return await addDoc(ref, {
      ...validated,
      fecha_inicio: validated.fecha_inicio || serverTimestamp(),
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
  };

  const updateExpediente = async (id, data) => {
    const validated = ExpedienteSchema.partial().parse(data);
    const ref = doc(db, `organizations/${orgId}/expedientes`, id);
    return await updateDoc(ref, {
      ...validated,
      updated_at: serverTimestamp()
    });
  };

  // Citas
  const createCita = async (data) => {
    const validated = CitaSchema.parse(data);
    const ref = collection(db, `organizations/${orgId}/citas`);
    return await addDoc(ref, {
      ...validated,
      created_at: serverTimestamp()
    });
  };

  const updateCita = async (id, data) => {
    const validated = CitaSchema.partial().parse(data);
    const ref = doc(db, `organizations/${orgId}/citas`, id);
    return await updateDoc(ref, {
      ...validated
    });
  };

  // Notas Sesión
  const createNotaSesion = async (data) => {
    const validated = NotaSesionSchema.parse(data);
    // Las notas de sesión solo deberían crearse si la cita está realizada, pero lo validamos en la UI.
    const ref = collection(db, `organizations/${orgId}/notas_sesion`);
    return await addDoc(ref, {
      ...validated,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
  };

  const updateNotaSesion = async (id, data) => {
    // La UI maneja la restricción de 24h para evitar escritura en el front
    const validated = NotaSesionSchema.partial().parse(data);
    const ref = doc(db, `organizations/${orgId}/notas_sesion`, id);
    return await updateDoc(ref, {
      ...validated,
      updated_at: serverTimestamp()
    });
  };

  // Notas Generales
  const createNotaGeneral = async (data) => {
    const validated = NotaGeneralSchema.parse(data);
    const ref = collection(db, `organizations/${orgId}/notas_generales`);
    return await addDoc(ref, {
      ...validated,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
  };

  const updateNotaGeneral = async (id, data) => {
    const validated = NotaGeneralSchema.partial().parse(data);
    const ref = doc(db, `organizations/${orgId}/notas_generales`, id);
    return await updateDoc(ref, {
      ...validated,
      updated_at: serverTimestamp()
    });
  };

  const deleteNotaGeneral = async (id) => {
    const ref = doc(db, `organizations/${orgId}/notas_generales`, id);
    return await deleteDoc(ref);
  };

  // Archivos
  const addArchivo = async (data) => {
    const validated = ArchivoSchema.parse(data);
    const ref = collection(db, `organizations/${orgId}/archivos_paciente`);
    return await addDoc(ref, {
      ...validated,
      uploaded_at: serverTimestamp()
    });
  };

  const deleteArchivo = async (id) => {
    const ref = doc(db, `organizations/${orgId}/archivos_paciente`, id);
    return await deleteDoc(ref);
  };

  return {
    expedientes,
    citas,
    notasSesion,
    notasGenerales,
    archivos,
    loading,
    error,
    createExpediente,
    updateExpediente,
    createCita,
    updateCita,
    createNotaSesion,
    updateNotaSesion,
    createNotaGeneral,
    updateNotaGeneral,
    deleteNotaGeneral,
    addArchivo,
    deleteArchivo
  };
};
