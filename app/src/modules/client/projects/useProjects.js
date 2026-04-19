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

const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY;

export const useProjects = (orgId = "default_org") => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeProjectId, setActiveProjectId] = useState(null);

  // -- Suscripción a PROYECTOS --
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setTimeout(() => {
        setProjects([
          { id: "mp1", name: "Lanzamiento Web v2", description: "Rediseño completo del sitio corporativo", status: "active", color: "#85adff", createdAt: new Date() },
          { id: "mp2", name: "App Móvil Delivery", description: "Fase de prototipado para cliente X", status: "paused", color: "#fbabff", createdAt: new Date() }
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

  // -- Suscripción a TAREAS --
  useEffect(() => {
    if (!activeProjectId) {
      setTasks([]);
      return;
    }

    if (!isFirebaseConfigured) {
      setTasks([
        { id: "mt1", projectId: activeProjectId, title: "Definir arquitectura", status: "done", priority: "high", createdAt: new Date() },
        { id: "mt2", projectId: activeProjectId, title: "Diseñar UI Kanban", status: "in_progress", priority: "medium", createdAt: new Date() },
        { id: "mt3", projectId: activeProjectId, title: "Testear persistencia", status: "todo", priority: "low", createdAt: new Date() }
      ]);
      return;
    }

    const tasksRef = collection(db, `organizations/${orgId}/tasks`);
    const q = query(tasksRef, where("projectId", "==", activeProjectId), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(data);
    });

    return () => unsub();
  }, [orgId, activeProjectId]);

  // -- Métodos MUTADORES --

  const addProject = async (projectData) => {
    if (!isFirebaseConfigured) {
      const newProject = { id: "p_" + Date.now(), ...projectData, status: "active", createdAt: new Date() };
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    }
    const projectsRef = collection(db, `organizations/${orgId}/projects`);
    return await addDoc(projectsRef, { ...projectData, status: "active", createdAt: new Date() });
  };

  const updateProjectStatus = async (projectId, newStatus) => {
    if (!isFirebaseConfigured) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
      return;
    }
    const projectRef = doc(db, `organizations/${orgId}/projects`, projectId);
    return await updateDoc(projectRef, { status: newStatus, updatedAt: new Date() });
  };

  const deleteProject = async (projectId) => {
    if (!isFirebaseConfigured) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      return;
    }
    const projectRef = doc(db, `organizations/${orgId}/projects`, projectId);
    return await deleteDoc(projectRef);
  };

  const addTask = async (taskData) => {
    if (!isFirebaseConfigured) {
      const newTask = { id: "t_" + Date.now(), ...taskData, status: taskData.status || "todo", createdAt: new Date() };
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    }
    const tasksRef = collection(db, `organizations/${orgId}/tasks`);
    return await addDoc(tasksRef, { ...taskData, orgId, status: taskData.status || "todo", createdAt: new Date() });
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    if (!isFirebaseConfigured) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      return;
    }
    const taskRef = doc(db, `organizations/${orgId}/tasks`, taskId);
    return await updateDoc(taskRef, { status: newStatus, updatedAt: new Date() });
  };

  const updateTask = async (taskId, taskData) => {
    if (!isFirebaseConfigured) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...taskData } : t));
      return;
    }
    const taskRef = doc(db, `organizations/${orgId}/tasks`, taskId);
    return await updateDoc(taskRef, { ...taskData, updatedAt: new Date() });
  };

  return {
    projects,
    tasks,
    loading,
    error,
    setActiveProjectId,
    addProject,
    updateProjectStatus,
    deleteProject,
    addTask,
    updateTaskStatus,
    updateTask
  };
};
