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

// Esquema de Validación para Empleados
const EmployeeSchema = z.object({
  firstName: z.string().min(1, "Nombre requerido"),
  lastName: z.string().min(1, "Apellido requerido"),
  documentId: z.string().min(1, "DNI/CE requerido"),
  position: z.string().min(1, "Cargo requerido"),
  salaryType: z.enum(["fijo", "variable", "mixto"]),
  baseSalary: z.number().min(0),
  variableSalary: z.number().min(0).optional().default(0),
  paymentMethod: z.enum(["efectivo", "deposito"]),
  bankInfo: z.object({
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    cci: z.string().optional()
  }).optional(),
  benefits: z.object({
    asignacionFamiliar: z.boolean().default(false),
    gratificaciones: z.boolean().default(true),
    cts: z.boolean().default(true),
    utilidades: z.boolean().default(true)
  }).optional(),
  status: z.enum(["active", "inactive"]).default("active")
});

/**
 * Hook para la gestión reactiva de colaboradores (nóminas)
 * @param {string} orgId - ID de la organización (tenant)
 */
export const useEmployees = (orgId) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orgId) return;

    const employeesRef = collection(db, `organizations/${orgId}/employees`);
    const q = query(employeesRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(data);
      setLoading(false);
    }, (err) => {
      console.error("[useEmployees] Error:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [orgId]);

  const addEmployee = async (employeeData) => {
    try {
      const validatedData = EmployeeSchema.parse({
        ...employeeData,
        baseSalary: Number(employeeData.baseSalary),
        variableSalary: Number(employeeData.variableSalary || 0)
      });

      const employeesRef = collection(db, `organizations/${orgId}/employees`);
      return await addDoc(employeesRef, {
        ...validatedData,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("[useEmployees] Validation Error:", err);
      throw err;
    }
  };

  const updateEmployee = async (employeeId, employeeData) => {
    try {
      const validatedData = EmployeeSchema.partial().parse({
        ...employeeData,
        baseSalary: employeeData.baseSalary !== undefined ? Number(employeeData.baseSalary) : undefined,
        variableSalary: employeeData.variableSalary !== undefined ? Number(employeeData.variableSalary) : undefined
      });

      const employeeRef = doc(db, `organizations/${orgId}/employees`, employeeId);
      return await updateDoc(employeeRef, {
        ...validatedData,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("[useEmployees] Update Error:", err);
      throw err;
    }
  };

  const deleteEmployee = async (employeeId) => {
    try {
      const employeeRef = doc(db, `organizations/${orgId}/employees`, employeeId);
      return await deleteDoc(employeeRef);
    } catch (err) {
      console.error("[useEmployees] Delete Error:", err);
      throw err;
    }
  };

  return {
    employees,
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee
  };
};
