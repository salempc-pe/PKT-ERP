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
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../../../services/firebase";

// Constante para verificar si Firebase está configurado
const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

export const useProjects = (orgId = "default_org") => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -- Suscripción a PROYECTOS --
  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Mock Data inicial
      setTimeout(() => {
        setProjects([
          { 
            id: "mp1", 
            name: "Lanzamiento Web v2", 
            description: "Rediseño completo del sitio corporativo", 
            status: "active", 
            color: "#85adff",
            createdAt: new Date() 
          },
          { 
            id: "mp2", 
            name: "App Móvil Delivery", 
            description: "Fase de prototipado para cliente X", 
            status: "paused", 
            color: "#fbabff",
            createdAt: new Date() 
          }
        ]);
        setLoading(false);
      }, 800);
      return;
    }

    const projectsRef = collection(db, `organizations/${orgId}/projects`);
    const q = query(projectsRef, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
      setLoading(false);
    }, (err) => {
      setError(err.message);
      setLoading(false);
    });

    return () => unsub();
  }, [orgId]);

  // -- Métodos MUTADORES --

  const addProject = async (projectData) => {
    if (!isFirebaseConfigured) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const newProject = { 
            id: "p_" + Date.now(), 
            ...projectData, 
            status: "active", 
            createdAt: new Date() 
          };
          setProjects(prev => [newProject, ...prev]);
          resolve(newProject);
        }, 600);
      });
    }

    const projectsRef = collection(db, `organizations/${orgId}/projects`);
    return await addDoc(projectsRef, {
      ...projectData,
      status: "active",
      createdAt: serverTimestamp()
    });
  };

  const updateProjectStatus = async (projectId, newStatus) => {
    if (!isFirebaseConfigured) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
      return;
    }

    const projectRef = doc(db, `organizations/${orgId}/projects`, projectId);
    return await updateDoc(projectRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
  };

  const deleteProject = async (projectId) => {
    if (!isFirebaseConfigured) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      return;
    }

    const projectRef = doc(db, `organizations/${orgId}/projects`, projectId);
    return await deleteDoc(projectRef);
  };

  return {
    projects,
    loading,
    error,
    addProject,
    updateProjectStatus,
    deleteProject
  };
};
