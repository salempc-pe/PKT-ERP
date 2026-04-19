import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where,
  setDoc,
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext();

const SUBSCRIPTION_PLANS = {
  startup: { 
    name: 'Startup', 
    modules: ['crm', 'calendar'], 
    limits: { users: 2 } 
  },
  business: { 
    name: 'Business', 
    modules: ['crm', 'inventory', 'sales', 'projects'], 
    limits: { users: 10 } 
  },
  enterprise: { 
    name: 'Enterprise', 
    modules: ['crm', 'inventory', 'sales', 'projects', 'finance', 'calendar'], 
    limits: { users: 100 } 
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initial Mock Database
  const INITIAL_MOCK_USERS = [
    {
      id: 'usr_admin1',
      email: 'test@admin.com',
      password: '1234',
      name: 'Super Admin',
      role: 'admin',
      status: 'active',
      organization: null, // Admins manage the platform
    },
    {
      id: 'usr_client1',
      email: 'test@cliente.com',
      password: '1234',
      name: 'Juan Cliente',
      role: 'client',
      status: 'active',
      organizationId: 'org_001',
      organizationName: 'TechCorp Solutions',
      activeModules: ['crm', 'inventory'],
    },
    {
      id: 'usr_client2',
      email: 'alex.smith@global.com',
      password: '1234',
      name: 'Alex Smith',
      role: 'client',
      status: 'active',
      organizationId: 'org_002',
      organizationName: 'Global Industries',
      activeModules: ['crm', 'inventory', 'sales', 'finance', 'calendar', 'projects'],
    }
  ];

  const [mockUsers, setMockUsers] = useState(() => {
    try {
      const storedMockUsers = localStorage.getItem('pkt_mock_users');
      return storedMockUsers ? JSON.parse(storedMockUsers) : INITIAL_MOCK_USERS;
    } catch (e) {
      console.error("Error parsing mock users", e);
      return INITIAL_MOCK_USERS;
    }
  });

  const [mockOrganizations, setMockOrganizations] = useState(() => {
    try {
      const saved = localStorage.getItem('pkt_mock_organizations');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing mock organizations", e);
    }
    
    const initialOrgs = Array.from(new Set(INITIAL_MOCK_USERS.map(u => u.organizationId))).filter(Boolean).map(id => {
      const u = INITIAL_MOCK_USERS.find(user => user.organizationId === id);
      const planId = 'business'; // Defecto para seeders
      return {
        id,
        name: u?.organizationName || 'Empresa Nueva',
        status: 'active',
        industry: 'Tecnología',
        subscription: {
          planId,
          activeModules: SUBSCRIPTION_PLANS[planId].modules,
          limits: SUBSCRIPTION_PLANS[planId].limits
        }
      };
    });
    return initialOrgs;
  });

  const [mockActivityLogs, setMockActivityLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('pkt_activity_logs');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error parsing logs", e);
      return [];
    }
  });

  const [mockSystemAlerts, setMockSystemAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem('pkt_system_alerts');
      return saved ? JSON.parse(saved) : [
        { id: 1, type: 'warning', message: 'Mantenimiento programado para el domingo 20 de mayo.', date: new Date().toISOString() }
      ];
    } catch (e) {
      console.error("Error parsing alerts", e);
      return [];
    }
  });

  // Cargar Organizaciones y Usuarios desde Firestore al iniciar
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar Orgs reales
        const orgsSnapshot = await getDocs(collection(db, 'organizations'));
        const realOrgs = orgsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Unir con mocks (opcional, para no perder los datos de prueba mientras migras)
        setMockOrganizations(prev => {
          const combined = [...prev, ...realOrgs];
          // Eliminar duplicados por ID
          return Array.from(new Map(combined.map(item => [item.id, item])).values());
        });

        // Cargar Usuarios reales
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const realUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setMockUsers(prev => {
          const combined = [...prev, ...realUsers];
          return Array.from(new Map(combined.map(item => [item.id, item])).values());
        });

      } catch (error) {
        console.error("Error fetching Firestore data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem('pkt_mock_users', JSON.stringify(mockUsers));
  }, [mockUsers]);

  useEffect(() => {
    localStorage.setItem('pkt_mock_organizations', JSON.stringify(mockOrganizations));
  }, [mockOrganizations]);

  useEffect(() => {
    localStorage.setItem('pkt_activity_logs', JSON.stringify(mockActivityLogs.slice(-100))); // Limit to last 100
  }, [mockActivityLogs]);

  useEffect(() => {
    localStorage.setItem('pkt_system_alerts', JSON.stringify(mockSystemAlerts));
  }, [mockSystemAlerts]);

  const addLog = (action, details, type = 'info') => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      user: user?.name || 'Sistema',
      userId: user?.id,
      action,
      details,
      type
    };
    setMockActivityLogs(prev => [newLog, ...prev]);
  };

  useEffect(() => {
    // Escuchar cambios en la autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // 1. Obtener usuario de Firestore por UID (recomendado para reglas de seguridad)
          let userDocRef = doc(db, 'users', firebaseUser.uid);
          let userSnap = await getDoc(userDocRef);
          
          let userData = null;
          if (userSnap.exists()) {
            userData = { id: userSnap.id, ...userSnap.data() };
          } else {
            // Fallback: buscar por email si el ID no es el UID (usuarios antiguos o pendientes)
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', firebaseUser.email));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              userData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
              // OPCIONAL: Migrar el documento para que use el UID como ID
              await setDoc(doc(db, 'users', firebaseUser.uid), { ...userData, uid: firebaseUser.uid });
            } else {
              // Fallback MOCK
              const storedMockUsers = localStorage.getItem('pkt_mock_users');
              const currentMockUsers = storedMockUsers ? JSON.parse(storedMockUsers) : INITIAL_MOCK_USERS;
              userData = currentMockUsers.find(u => u.email === firebaseUser.email);
            }
          }

          if (userData) {
            let orgSubscription = null;
            if (userData.organizationId) {
              if (userData.organizationId.startsWith('org_')) {
                // Fallback MOCK org
                const storedOrgs = localStorage.getItem('pkt_mock_organizations');
                const orgs = storedOrgs ? JSON.parse(storedOrgs) : INITIAL_MOCK_USERS.map(u => ({ id: u.organizationId })); 
                const org = mockOrganizations.find(o => o.id === userData.organizationId) || orgs.find(o => o.id === userData.organizationId);
                orgSubscription = org?.subscription || null;
              } else {
                // Obtener organización de Firestore
                const orgDocRef = doc(db, 'organizations', userData.organizationId);
                const orgSnap = await getDoc(orgDocRef);
                if (orgSnap.exists()) {
                  orgSubscription = orgSnap.data().subscription;
                }
              }
            }

            const { password, ...userWithoutPassword } = userData;
            const userWithSub = {
              ...userWithoutPassword,
              uid: firebaseUser.uid,
              subscription: orgSubscription || null,
              isAdmin: userData.role === 'admin' || userData.role === 'client'
            };
            
            setUser(userWithSub);
            sessionStorage.setItem('pkt_user', JSON.stringify(userWithSub));
          } else {
            setUser({ email: firebaseUser.email, role: 'client', status: 'pending' });
          }
        } catch (error) {
          console.error("Error fetching user session from Firestore:", error);
          setUser({ email: firebaseUser.email, role: 'client', status: 'pending' });
        }
      } else {
        // No hay sesión
        setUser(null);
        sessionStorage.removeItem('pkt_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Impersonation feature state
  const isImpersonating = !!sessionStorage.getItem('pkt_original_admin');

  const login = async (email, password) => {
    try {
      // 1. Intentar login en Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. Buscar metadata en Firestore
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      let foundUser = null;
      if (!querySnapshot.empty) {
        foundUser = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
      } else {
        // Fallback MOCK
        const storedMockUsers = localStorage.getItem('pkt_mock_users');
        const currentMockUsers = storedMockUsers ? JSON.parse(storedMockUsers) : mockUsers;
        foundUser = currentMockUsers.find(u => u.email === email);
      }
      
      if (foundUser) {
        let orgSubscription = null;
        if (foundUser.organizationId) {
          if (foundUser.organizationId.startsWith('org_')) {
            const org = mockOrganizations.find(o => o.id === foundUser.organizationId);
            orgSubscription = org?.subscription || null;
          } else {
            // Server fetch
            const orgDocRef = doc(db, 'organizations', foundUser.organizationId);
            const orgSnap = await getDoc(orgDocRef);
            if (orgSnap.exists()) {
              orgSubscription = orgSnap.data().subscription;
            }
          }
        }

        const { password: _, ...userWithoutPassword } = foundUser;
        
        const userWithSub = {
          ...userWithoutPassword,
          uid: firebaseUser.uid,
          subscription: orgSubscription || null
        };

        setUser(userWithSub);
        sessionStorage.setItem('pkt_user', JSON.stringify(userWithSub));
        
        addLog('Login', `Usuario ${foundUser.name} inició sesión (Auth Real)`, 'success');

        // Redirección
        if (foundUser.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/client/dashboard');
        }
        return { success: true };
      }
      
      return { success: false, error: 'Usuario autenticado pero no encontrado en la base de datos de la plataforma.' };
    } catch (error) {
      console.error("Login Error:", error);
      let message = 'Error al iniciar sesión';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        message = 'Credenciales inválidas';
      }
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    if (isImpersonating) {
      stopImpersonation();
      return;
    }

    try {
      await signOut(auth);
      setUser(null);
      sessionStorage.removeItem('pkt_user');
      navigate('/');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const impersonateUser = (targetUser) => {
    // Solo permitir si el usuario actual es admin y no está ya suplantando
    if (user?.role !== 'admin') return;

    // Guardar admin original
    sessionStorage.setItem('pkt_original_admin', JSON.stringify(user));

    // Preparar cliente con suscripción
    const org = targetUser.organizationId ? mockOrganizations.find(o => o.id === targetUser.organizationId) : null;
    const userWithSub = {
      ...targetUser,
      subscription: org?.subscription || null
    };

    // Cambiar sesión
    setUser(userWithSub);
    sessionStorage.setItem('pkt_user', JSON.stringify(userWithSub));
    
    addLog('Impersonation Start', `Administrador inició suplantación de ${targetUser.name} (Org: ${targetUser.organizationName || 'N/A'})`, 'warning');

    // Redirigir al dashboard cliente
    navigate('/client/dashboard');
  };

  const stopImpersonation = () => {
    const originalAdmin = sessionStorage.getItem('pkt_original_admin');
    if (originalAdmin) {
      const parsedAdmin = JSON.parse(originalAdmin);
      setUser(parsedAdmin);
      sessionStorage.setItem('pkt_user', originalAdmin);
      sessionStorage.removeItem('pkt_original_admin');
      
      addLog('Impersonation Stop', `Suplantación finalizada. Admin regresó a su cuenta.`, 'info');

      navigate('/admin/clients'); // Volver a la vista de clientes
    }
  };

  const updateUser = (data) => {
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    sessionStorage.setItem('pkt_user', JSON.stringify(updatedUser));
    
    // Update also in mock database
    setMockUsers(prevUsers => 
      prevUsers.map(u => u.id === user.id ? { ...u, ...data } : u)
    );
  };

  // Actualizar módulos de una organización en Firestore
  const adminUpdateOrgModules = async (orgId, modules) => {
    try {
      const orgRef = doc(db, 'organizations', orgId);
      await updateDoc(orgRef, {
        "subscription.activeModules": modules
      });

      setMockOrganizations(prev => prev.map(o => 
        o.id === orgId ? { 
          ...o, 
          subscription: {
            ...o.subscription,
            activeModules: modules
          }
        } : o
      ));
      
      addLog('Modules Updated', `Módulos actualizados para organización ${orgId}`, 'info');
    } catch (error) {
      console.error("Error updating org modules:", error);
    }
  };

  // Crear Organización Real en Firestore
  const adminCreateOrg = async (orgData) => {
    const planId = 'startup'; // Por defecto para nuevas orgs
    const newOrg = {
      name: orgData.name,
      ruc: orgData.ruc || '',
      address: orgData.address || '',
      status: 'active',
      industry: 'Tecnología',
      createdAt: serverTimestamp(),
      subscription: {
        planId,
        activeModules: SUBSCRIPTION_PLANS[planId].modules,
        limits: SUBSCRIPTION_PLANS[planId].limits,
        maxUsers: orgData.maxUsers || SUBSCRIPTION_PLANS[planId].limits.users
      }
    };

    try {
      const docRef = await addDoc(collection(db, 'organizations'), newOrg);
      const createdOrg = { id: docRef.id, ...newOrg };
      
      // Actualizamos localmente para feedback inmediato (opcional, mejor con listeners)
      setMockOrganizations(prev => [...prev, createdOrg]);
      
      addLog('Org Created', `Nueva organización creada en DB: ${newOrg.name}`, 'success');
      return createdOrg;
    } catch (error) {
      console.error("Error creating org in Firestore:", error);
      throw error;
    }
  };

  // Actualizar Plan de Organización en Firestore
  const adminUpdateOrgPlan = async (orgId, planId) => {
    const planConfig = SUBSCRIPTION_PLANS[planId];
    if (!planConfig) return;

    try {
      const orgRef = doc(db, 'organizations', orgId);
      await updateDoc(orgRef, {
        "subscription.planId": planId,
        "subscription.activeModules": planConfig.modules,
        "subscription.limits": planConfig.limits,
        "subscription.maxUsers": planConfig.limits.users
      });

      setMockOrganizations(prev => prev.map(o => 
        o.id === orgId ? { 
          ...o, 
          subscription: {
            planId,
            activeModules: planConfig.modules,
            limits: planConfig.limits,
            maxUsers: planConfig.limits.users
          }
        } : o
      ));

      addLog('Plan Update', `Plan de organización ${orgId} actualizado a ${planId} en DB`, 'warning');
    } catch (error) {
      console.error("Error updating plan in Firestore:", error);
    }
  };

  // Crear Usuario en Organización Real en Firestore
  const adminCreateUser = async (orgId, orgName, userData) => {
    try {
      // 1. Verificar límites de cuota (maxUsers)
      const currentOrg = mockOrganizations.find(o => o.id === orgId);
      const activeUsersCount = mockUsers.filter(u => u.organizationId === orgId).length;
      const limit = currentOrg?.subscription?.maxUsers || currentOrg?.maxUsers || 5;

      if (activeUsersCount >= limit) {
        return { 
          success: false, 
          error: `Límite de usuarios alcanzado (${activeUsersCount}/${limit}). Actualiza tu plan para invitar a más colaboradores.` 
        };
      }
      
      const inviteToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
      
      const newUser = {
        email: userData.email,
        name: userData.name,
        role: userData.role || 'client',
        organizationId: orgId,
        organizationName: orgName,
        status: 'pending',
        inviteToken,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'users'), newUser);
      const createdUser = { id: docRef.id, ...newUser };

      setMockUsers(prev => [...prev, createdUser]);
      
      addLog('User Invited', `Usuario invitado en DB a ${orgName}: ${userData.email}`, 'info');

      return { success: true, inviteToken };
    } catch (error) {
      console.error("Error creating user in Firestore:", error);
      return { success: false, error: 'Error al guardar el usuario en la base de datos' };
    }
  };

  // Configurar contraseña de usuario (Onboarding)
  const setupUserPassword = async (token, newPassword) => {
    try {
      const targetUser = mockUsers.find(u => u.inviteToken === token);
      
      if (!targetUser) {
        return { success: false, error: 'Token de invitación inválido o expirado' };
      }

      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, targetUser.email, newPassword);
      const firebaseUser = userCredential.user;

      // 2. Persistir en Firestore usando UID como ID (para aislamiento de reglas)
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const updatedData = { 
        ...targetUser, 
        uid: firebaseUser.uid,
        status: 'active', 
        inviteToken: null,
        updatedAt: serverTimestamp() 
      };
      
      // Eliminar el ID anterior si venía de un doc con ID aleatorio
      if (targetUser.id && !targetUser.id.startsWith('usr_')) {
        const { deleteDoc } = await import('firebase/firestore');
        try {
          await deleteDoc(doc(db, 'users', targetUser.id));
        } catch(e) { console.warn("Could not delete old user doc", e); }
      }

      await setDoc(userDocRef, updatedData);

      // 3. Actualizar estado local (Simulando DB)
      setMockUsers(prev => prev.map(u => 
        u.inviteToken === token ? { 
          ...updatedData,
          password: 'ENC'
        } : u
      ));

      addLog('Password Setup', `Usuario ${targetUser.email} configuró su cuenta correctamente en Auth y DB.`, 'success');

      return { success: true };
    } catch (error) {
      console.error("Setup Password Error:", error);
      let message = 'Error al crear la cuenta';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Este correo electrónico ya está registrado.';
      } else if (error.code === 'auth/weak-password') {
        message = 'La contraseña debe tener al menos 6 caracteres.';
      }
      return { success: false, error: message };
    }
  };

  // Eliminar Usuario en Firestore (Opcional: puedes preferir cambiar estado a 'inactive')
  const adminRemoveUser = async (userId) => {
    try {
      // Si el ID es un doc id de Firestore (no empieza con usr_)
      if (!userId.startsWith('usr_')) {
        const { deleteDoc } = await import('firebase/firestore'); // Carga dinámica
        await deleteDoc(doc(db, 'users', userId));
      }
      setMockUsers(prev => prev.filter(u => u.id !== userId));
      addLog('User Removed', `Usuario ${userId} eliminado de la base de datos`, 'danger');
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  // Actualizar Organización Completa en Firestore
  const adminUpdateOrg = async (orgId, updateData) => {
    try {
      const orgRef = doc(db, 'organizations', orgId);
      await updateDoc(orgRef, updateData);

      setMockOrganizations(prev => prev.map(o => 
        o.id === orgId ? { ...o, ...updateData } : o
      ));

      addLog('Org Updated', `Datos de organización ${orgId} actualizados en DB`, 'info');
    } catch (error) {
      console.error("Error updating org:", error);
    }
  };

  // Eliminar Organización en Firestore y mock local
  const adminRemoveOrg = async (orgId) => {
    try {
      if (!orgId.startsWith('org_')) {
        const { deleteDoc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'organizations', orgId));
      }
      setMockOrganizations(prev => prev.filter(o => o.id !== orgId));
      addLog('Org Removed', `Organización ${orgId} eliminada de la base de datos`, 'danger');
    } catch (error) {
      console.error("Error removing org:", error);
    }
  };

  const getClientUsers = () => {
    return mockUsers.filter(u => u.role === 'client');
  };

  if (loading) return null; // Or a fancy spinner

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, updateUser, 
      adminUpdateOrgModules, getClientUsers, adminCreateUser,
      mockUsers, mockOrganizations, adminCreateOrg, adminRemoveUser, adminUpdateOrg, adminRemoveOrg,
      adminUpdateOrgPlan, SUBSCRIPTION_PLANS,
      impersonateUser, stopImpersonation, isImpersonating,
      setupUserPassword,
      mockActivityLogs, mockSystemAlerts, addLog,
      isAdmin: user?.role === 'admin' || user?.role === 'client'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
