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
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../../../services/firebase";
import { z } from "zod";

// --- Esquemas de Validación ---

export const AttendanceSchema = z.object({
  employeeId: z.string().min(1, "ID de empleado requerido"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  status: z.enum(["presente", "tardanza", "falta", "permiso"]).default("presente"),
  notes: z.string().optional()
});

export const LoanSchema = z.object({
  employeeId: z.string().min(1, "ID de empleado requerido"),
  amount: z.number().min(1, "Monto debe ser mayor a 0"),
  installments: z.number().min(1, "Al menos 1 cuota"),
  monthlyInstallment: z.number().min(0),
  remainingBalance: z.number().min(0),
  status: z.enum(["active", "paid", "cancelled"]).default("active"),
  type: z.enum(["adelanto", "prestamo"]).default("prestamo")
});

/**
 * Hook para la gestión de asistencia y préstamos de nómina
 */
export const usePayroll = (orgId) => {
  const [attendances, setAttendances] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState({ attendances: true, loans: true });

  // Suscripción a Asistencias
  useEffect(() => {
    if (!orgId || orgId === "default_org") {
      setLoading(prev => ({ ...prev, attendances: false }));
      return;
    }

    const attendancesRef = collection(db, `organizations/${orgId}/attendances`);
    const q = query(attendancesRef, orderBy("date", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAttendances(data);
      setLoading(prev => ({ ...prev, attendances: false }));
    });

    return () => unsub();
  }, [orgId]);

  // Suscripción a Préstamos
  useEffect(() => {
    if (!orgId || orgId === "default_org") {
      setLoading(prev => ({ ...prev, loans: false }));
      return;
    }

    const loansRef = collection(db, `organizations/${orgId}/loans`);
    const q = query(loansRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLoans(data);
      setLoading(prev => ({ ...prev, loans: false }));
    });

    return () => unsub();
  }, [orgId]);

  // --- Acciones de Asistencia ---

  const addAttendance = async (attendanceData) => {
    const validatedData = AttendanceSchema.parse(attendanceData);
    const attendancesRef = collection(db, `organizations/${orgId}/attendances`);
    return await addDoc(attendancesRef, {
      ...validatedData,
      createdAt: serverTimestamp()
    });
  };

  const updateAttendance = async (id, data) => {
    const validatedData = AttendanceSchema.partial().parse(data);
    const attendanceRef = doc(db, `organizations/${orgId}/attendances`, id);
    return await updateDoc(attendanceRef, {
      ...validatedData,
      updatedAt: serverTimestamp()
    });
  };

  // --- Acciones de Préstamos ---

  const addLoan = async (loanData) => {
    const validatedData = LoanSchema.parse({
      ...loanData,
      amount: Number(loanData.amount),
      installments: Number(loanData.installments),
      monthlyInstallment: Number(loanData.monthlyInstallment),
      remainingBalance: Number(loanData.remainingBalance)
    });
    const loansRef = collection(db, `organizations/${orgId}/loans`);
    return await addDoc(loansRef, {
      ...validatedData,
      createdAt: serverTimestamp()
    });
  };

  const updateLoan = async (id, data) => {
    const loanRef = doc(db, `organizations/${orgId}/loans`, id);
    return await updateDoc(loanRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  };

  const deleteLoan = async (id) => {
    const loanRef = doc(db, `organizations/${orgId}/loans`, id);
    return await deleteDoc(loanRef);
  };

  return {
    attendances,
    loans,
    loading,
    addAttendance,
    updateAttendance,
    addLoan,
    updateLoan,
    deleteLoan
  };
};
