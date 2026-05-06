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
  const [timesheets, setTimesheets] = useState([]);
  const [projectDocuments, setProjectDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeProjectId, setActiveProjectId] = useState(null);

  // -- Suscripción a PROYECTOS --
  useEffect(() => {
    if (!orgId || orgId === "default_org") {
      setLoading(false);
      return;
    }
    if (!isFirebaseConfigured) {
      setTimeout(() => {
        setProjects([
          { id: "mp1", name: "Lanzamiento Web v2", description: "Rediseño completo del sitio corporativo", status: "active", color: "#6B4FD8", createdAt: new Date() },
          { id: "mp2", name: "App Móvil Delivery", description: "Fase de prototipado para cliente X", status: "paused", color: "#2E8B57", createdAt: new Date() }
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

  // -- Suscripción a TAREAS, TIMESHEETS y DOCUMENTOS --
  useEffect(() => {
    if (!orgId || orgId === "default_org") {
      return;
    }
    if (!activeProjectId) {
      setTasks([]);
      setTimesheets([]);
      setProjectDocuments([]);
      return;
    }

    if (!isFirebaseConfigured) {
      setTasks([
        { id: "mt1", projectId: activeProjectId, title: "Definir arquitectura", status: "done", priority: "high", startDate: "2026-05-01", dueDate: "2026-05-05", progress: 100, dependencies: [], createdAt: new Date() },
        { id: "mt2", projectId: activeProjectId, title: "Diseñar UI Gantt", status: "in_progress", priority: "medium", startDate: "2026-05-05", dueDate: "2026-05-10", progress: 30, dependencies: ["mt1"], createdAt: new Date() },
        { id: "mt3", projectId: activeProjectId, title: "Gestión Documental", status: "todo", priority: "low", startDate: "2026-05-10", dueDate: "2026-05-15", progress: 0, dependencies: ["mt2"], createdAt: new Date() }
      ]);
      setTimesheets([
        { id: "ts1", projectId: activeProjectId, taskId: "mt1", userId: "demo", date: "2026-05-02", hours: 4, description: "Setup inicial" }
      ]);
      setProjectDocuments([
        { id: "doc1", projectId: activeProjectId, name: "Planos_Base.pdf", type: "pdf", url: "#", size: 2048, uploadedBy: "Admin", createdAt: new Date() }
      ]);
      return;
    }

    // Suscripción Tareas
    const tasksRef = collection(db, `organizations/${orgId}/tasks`);
    const qTasks = query(tasksRef, where("projectId", "==", activeProjectId));
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    });

    // Suscripción Timesheets
    const tsRef = collection(db, `organizations/${orgId}/projects/${activeProjectId}/timesheets`);
    const unsubTS = onSnapshot(tsRef, (snapshot) => {
      setTimesheets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Suscripción Documentos
    const docRef = collection(db, `organizations/${orgId}/project_documents`);
    const qDocs = query(docRef, where("projectId", "==", activeProjectId));
    const unsubDocs = onSnapshot(qDocs, (snapshot) => {
      setProjectDocuments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubTasks();
      unsubTS();
      unsubDocs();
    };
  }, [orgId, activeProjectId]);

  // -- Métodos MUTADORES --

  async function addProject(projectData) {
    if (!isFirebaseConfigured) {
      const newProject = { id: "p_" + Date.now(), ...projectData, status: "active", createdAt: new Date() };
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    }
    const projectsRef = collection(db, `organizations/${orgId}/projects`);
    return await addDoc(projectsRef, { ...projectData, status: "active", createdAt: serverTimestamp() });
  }

  async function updateProject(projectId, projectData) {
    if (!isFirebaseConfigured) {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...projectData } : p));
      return;
    }
    const projectRef = doc(db, `organizations/${orgId}/projects`, projectId);
    return await updateDoc(projectRef, { ...projectData, updatedAt: serverTimestamp() });
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
    const defaultData = {
      status: "todo",
      progress: 0,
      dependencies: [],
      startDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    if (!isFirebaseConfigured) {
      const newTask = { id: "t_" + Date.now(), ...defaultData, ...taskData, createdAt: new Date() };
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    }
    const tasksRef = collection(db, `organizations/${orgId}/tasks`);
    return await addDoc(tasksRef, { 
      ...defaultData,
      ...taskData, 
      orgId, 
      createdAt: serverTimestamp() 
    });
  }

  async function updateTask(taskId, taskData) {
    if (!isFirebaseConfigured) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...taskData } : t));
      return;
    }
    const taskRef = doc(db, `organizations/${orgId}/tasks`, taskId);
    return await updateDoc(taskRef, { ...taskData, updatedAt: serverTimestamp() });
  }

  async function updateTaskStatus(taskId, newStatus) {
    return await updateTask(taskId, { status: newStatus });
  }

  // -- Timesheet Methods --
  async function addTimesheetEntry(entryData) {
    if (!isFirebaseConfigured) {
      const newEntry = { id: "ts_" + Date.now(), ...entryData, createdAt: new Date() };
      setTimesheets(prev => [...prev, newEntry]);
      return newEntry;
    }
    const tsRef = collection(db, `organizations/${orgId}/projects/${activeProjectId}/timesheets`);
    return await addDoc(tsRef, { ...entryData, createdAt: serverTimestamp() });
  }

  async function deleteTimesheetEntry(entryId) {
    if (!isFirebaseConfigured) {
      setTimesheets(prev => prev.filter(ts => ts.id !== entryId));
      return;
    }
    const tsRef = doc(db, `organizations/${orgId}/projects/${activeProjectId}/timesheets`, entryId);
    return await deleteDoc(tsRef);
  }

  // -- Document Methods --
  async function addProjectDocument(docData) {
    if (!isFirebaseConfigured) {
      const newDoc = { id: "doc_" + Date.now(), ...docData, projectId: activeProjectId, createdAt: new Date() };
      setProjectDocuments(prev => [...prev, newDoc]);
      return newDoc;
    }
    const docRef = collection(db, `organizations/${orgId}/project_documents`);
    return await addDoc(docRef, { ...docData, projectId: activeProjectId, createdAt: serverTimestamp() });
  }

  async function deleteProjectDocument(docId) {
    if (!isFirebaseConfigured) {
      setProjectDocuments(prev => prev.filter(d => d.id !== docId));
      return;
    }
    const docRef = doc(db, `organizations/${orgId}/project_documents`, docId);
    return await deleteDoc(docRef);
  }

  return {
    projects,
    tasks,
    timesheets,
    projectDocuments,
    loading,
    error,
    setActiveProjectId,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    updateTaskStatus,
    addTimesheetEntry,
    deleteTimesheetEntry,
    addProjectDocument,
    deleteProjectDocument
  };
}

