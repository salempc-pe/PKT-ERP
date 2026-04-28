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

export function useProjects(orgId = "default_org") {
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
    const q = query(tasksRef, where("projectId", "==", activeProjectId));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedData = data.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
      setTasks(sortedData);
    }, (err) => {
      setError(err.message);
    });

    return () => unsub();
  }, [orgId, activeProjectId]);

  // -- Métodos MUTADORES --

  async function addProject(projectData) {
    if (!isFirebaseConfigured) {
      const newProject = { id: "p_" + Date.now(), ...projectData, status: "active", createdAt: new Date() };
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    }
    const projectsRef = collection(db, `organizations/${orgId}/projects`);
    return await addDoc(projectsRef, { ...projectData, status: "active", createdAt: new Date() });
  }

  async function updateProjectStatus(projectId, newStatus) {
    if (!isFirebaseConfigured) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
      return;
    }
    const projectRef = doc(db, `organizations/${orgId}/projects`, projectId);
    return await updateDoc(projectRef, { status: newStatus, updatedAt: new Date() });
  }

  async function deleteProject(projectId) {
    if (!isFirebaseConfigured) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
      return;
    }
    const projectRef = doc(db, `organizations/${orgId}/projects`, projectId);
    return await deleteDoc(projectRef);
  }

  async function addTask(taskData) {
    if (!isFirebaseConfigured) {
      const newTask = { id: "t_" + Date.now(), ...taskData, status: taskData.status || "todo", createdAt: new Date() };
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    }
    const tasksRef = collection(db, `organizations/${orgId}/tasks`);
    return await addDoc(tasksRef, { 
      ...taskData, 
      orgId, 
      status: taskData.status || "todo", 
      createdAt: serverTimestamp() 
    });
  }

  async function updateTaskStatus(taskId, newStatus) {
    if (!isFirebaseConfigured) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      return;
    }
    const taskRef = doc(db, `organizations/${orgId}/tasks`, taskId);
    return await updateDoc(taskRef, { 
      status: newStatus, 
      updatedAt: serverTimestamp() 
    });
  }

  async function updateProject(projectId, projectData) {
    if (!isFirebaseConfigured) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...projectData } : p));
      return;
    }
    const projectRef = doc(db, `organizations/${orgId}/projects`, projectId);
    return await updateDoc(projectRef, { ...projectData, updatedAt: serverTimestamp() });
  }

  async function updateTask(taskId, taskData) {
    if (!isFirebaseConfigured) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...taskData } : t));
      return;
    }
    const taskRef = doc(db, `organizations/${orgId}/tasks`, taskId);
    return await updateDoc(taskRef, { ...taskData, updatedAt: serverTimestamp() });
  }

  return {
    projects,
    tasks,
    loading,
    error,
    setActiveProjectId,
    addProject,
    updateProject,
    updateProjectStatus,
    deleteProject,
    addTask,
    updateTaskStatus,
    updateTask
  };
}
