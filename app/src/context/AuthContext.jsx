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
  serverTimestamp,
  deleteDoc
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
    limits: { users: 4 } 
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [mockUsers, setMockUsers] = useState([]);
  const [mockOrganizations, setMockOrganizations] = useState([]);
  const [mockActivityLogs, setMockActivityLogs] = useState([]);
  const [mockSystemAlerts, setMockSystemAlerts] = useState([]);

  // Carga reactiva de datos según el rol y organización
  useEffect(() => {
    if (!user) {
      setMockUsers([]);
      setMockOrganizations([]);
      return;
    }

    const loadData = async () => {
      try {
        const isSuperAdmin = user.role === 'superadmin';
        
        if (isSuperAdmin) {
          // SUPER ADMIN: Cargar todas las organizaciones, usuarios y LOGS
          const [orgsSnap, usersSnap] = await Promise.all([
            getDocs(collection(db, 'organizations')),
            getDocs(collection(db, 'users'))
          ]);
          
          let logsData = [];
          try {
            const logsSnap = await getDocs(collection(db, 'audit_logs'));
            logsData = logsSnap.docs.map(d => ({ 
              id: d.id, 
              ...d.data(),
              timestamp: d.data().timestamp?.toDate().toISOString() || new Date().toISOString()
            })).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
          } catch (logError) {
            console.warn("Could not load audit logs (permissions?):", logError);
          }
          
          const orgData = orgsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          const userData = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          
          setMockOrganizations(orgData);
          setMockUsers(userData);
          setMockActivityLogs(logsData);
          console.log("SuperAdmin data loaded:", orgData.length, "orgs,", logsData.length, "logs");
        } else if (user.organizationId) {
          // CLIENTE: Cargar solo su organización y su equipo
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('organizationId', '==', user.organizationId));
          
          const [orgSnap, teamSnap] = await Promise.all([
            getDoc(doc(db, 'organizations', user.organizationId)),
            getDocs(q)
          ]);

          if (orgSnap.exists()) {
            setMockOrganizations([{ id: orgSnap.id, ...orgSnap.data() }]);
          }
          setMockUsers(teamSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (error) {
        console.error("Error loading scoped data:", error);
      }
    };

    loadData();
  }, [user]);


  const addLog = async (action, details, type = 'info', orgId = null) => {
    const newLog = {
      timestamp: serverTimestamp(),
      user: user?.name || 'Sistema',
      userId: user?.id || 'system',
      orgId: orgId || user?.organizationId || null,
      action,
      details,
      type
    };

    try {
      // 1. Guardar en Firestore para persistencia real
      const docRef = await addDoc(collection(db, 'audit_logs'), newLog);
      
      // 2. Actualizar estado local para UI inmediata
      const logWithId = { id: docRef.id, ...newLog, timestamp: new Date().toISOString() };
      setMockActivityLogs(prev => [logWithId, ...prev]);
    } catch (error) {
      console.error("Error saving audit log:", error);
    }
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
            // AUTO-SEED ADMIN: Si el correo es el del dueño, lo creamos como admin por ser el primer login
            if (firebaseUser.email === 'paulosalem8@gmail.com') {
              userData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: 'Paulo Salem (Super Admin)',
                role: 'superadmin',
                status: 'active',
                createdAt: serverTimestamp()
              };
              await setDoc(userDocRef, userData);
              console.log("Super Admin profile auto-created in Firestore!");
            } else {
              // Fallback: buscar por email si el ID no es el UID (usuarios antiguos o pendientes)
              try {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('email', '==', firebaseUser.email));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                  userData = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
                  // OPCIONAL: Migrar el documento para que use el UID como ID
                  await setDoc(doc(db, 'users', firebaseUser.uid), { ...userData, uid: firebaseUser.uid });
                }
              } catch (queryError) {
                console.warn("No se pudo realizar la búsqueda por email en AuthStateChanged:", queryError.message);
              }
            }
          }

          if (userData) {
            let orgSubscription = null;
            if (userData.organizationId) {
              // Obtener organización de Firestore
              const orgDocRef = doc(db, 'organizations', userData.organizationId);
              const orgSnap = await getDoc(orgDocRef);
              if (orgSnap.exists()) {
                orgSubscription = orgSnap.data().subscription;
              }
            }

            const { password, ...userWithoutPassword } = userData;
            const userWithSub = {
              ...userWithoutPassword,
              uid: firebaseUser.uid,
              subscription: orgSubscription || null,
              isAdmin: userData.role === 'superadmin' || userData.role === 'admin' || userData.role === 'user'
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

      // 2. Buscar metadata en Firestore por UID (evita problemas de permisos con queries)
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userDocRef);
      
      let foundUser = null;
      if (userSnap.exists()) {
        foundUser = { id: userSnap.id, ...userSnap.data() };
      } else {
        // Fallback: tratar de buscar por email (esto puede fallar con las reglas estrictas si no se usa el UID)
        // pero incluimos un try/catch para que no rompa el login
        try {
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', email));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            foundUser = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
          }
        } catch (e) {
          console.warn("No se pudo realizar la búsqueda por email debido a restricciones de seguridad.");
        }

      }
      
      if (foundUser) {
        let orgSubscription = null;
        if (foundUser.organizationId) {
          const orgDocRef = doc(db, 'organizations', foundUser.organizationId);
          const orgSnap = await getDoc(orgDocRef);
          if (orgSnap.exists()) {
            orgSubscription = orgSnap.data().subscription;
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
        if (foundUser.role === 'superadmin') {
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
    // Solo permitir si el usuario actual es superadmin y no está ya suplantando
    if (user?.role !== 'superadmin') return;

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
    
    addLog('Impersonation Start', `Administrador inició suplantación de ${targetUser.name} (Org: ${targetUser.organizationName || 'N/A'})`, 'warning', targetUser.organizationId);

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
      
      addLog('Modules Updated', `Módulos actualizados para organización ${orgId}`, 'info', orgId);
    } catch (error) {
      console.error("Error updating org modules:", error);
    }
  };

  // Crear Organización COMPLETA en Firestore (con opción de primer admin)
  const adminCreateOrg = async (orgData) => {
    const planId = orgData.planId || 'startup';
    const newOrg = {
      name: orgData.name,
      ruc: orgData.ruc || '',
      address: orgData.address || '',
      status: 'active',
      industry: 'Tecnología', // Fallback
      createdAt: serverTimestamp(),
      subscription: {
        planId,
        activeModules: orgData.activeModules && orgData.activeModules.length > 0 
          ? orgData.activeModules 
          : SUBSCRIPTION_PLANS[planId].modules,
        limits: SUBSCRIPTION_PLANS[planId].limits,
        maxUsers: Number(orgData.maxUsers) || SUBSCRIPTION_PLANS[planId].limits.users
      }
    };

    try {
      // 1. Crear Organización
      const docRef = await addDoc(collection(db, 'organizations'), newOrg);
      const createdOrg = { id: docRef.id, ...newOrg };
      
      setMockOrganizations(prev => [...prev, createdOrg]);
      addLog('Org Created', `Nueva organización creada: ${newOrg.name}`, 'success', docRef.id);

      // 2. Si se proporcionó email de admin, crearlo automáticamente
      if (orgData.adminEmail && orgData.adminName) {
        await adminCreateUser(docRef.id, orgData.name, {
          email: orgData.adminEmail,
          name: orgData.adminName,
          role: 'admin'
        });
      }

      return createdOrg;
    } catch (error) {
      console.error("Error creating org in Firestore:", error);
      throw error;
    }
  };

  // Actualizar Organización COMPLETA en Firestore (Unificado)
  const adminUpdateFullOrg = async (orgId, data) => {
    try {
      const orgRef = doc(db, 'organizations', orgId);
      
      // Construimos el payload de actualización
      const updatePayload = {
        name: data.name,
        ruc: data.ruc || '',
        address: data.address || '',
        "subscription.planId": data.planId,
        "subscription.activeModules": data.activeModules,
        "subscription.maxUsers": Number(data.maxUsers),
        "subscription.limits.users": Number(data.maxUsers) // Sincronizar ambos campos por seguridad
      };

      await updateDoc(orgRef, updatePayload);

      // Actualizar estado local
      setMockOrganizations(prev => prev.map(o => 
        o.id === orgId ? { 
          ...o, 
          name: data.name,
          ruc: data.ruc,
          address: data.address,
          subscription: {
            ...o.subscription,
            planId: data.planId,
            activeModules: data.activeModules,
            maxUsers: Number(data.maxUsers),
            limits: {
              ...o.subscription?.limits,
              users: Number(data.maxUsers)
            }
          }
        } : o
      ));

      addLog('Org Updated', `Organización ${data.name} actualizada completamente en DB`, 'success', orgId);
      return { success: true };
    } catch (error) {
      console.error("Error updating full org in Firestore:", error);
      return { success: false, error: error.message };
    }
  };

  // Crear Usuario en Organización Real en Firestore
  const adminCreateUser = async (orgId, orgName, userData) => {
    try {
      // 1. Verificar límites de cuota (maxUsers)
      const currentOrg = mockOrganizations.find(o => o.id === orgId);
      const activeUsersCount = mockUsers.filter(u => u.organizationId === orgId).length;
      const limit = currentOrg?.subscription?.maxUsers || 5;

      if (activeUsersCount >= limit) {
        return { 
          success: false, 
          error: `Límite de usuarios alcanzado (${activeUsersCount}/${limit}). Actualiza tu plan para invitar a más colaboradores.` 
        };
      }
      
      const inviteToken = crypto.randomUUID();
      
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
      
      addLog('User Invited', `Usuario invitado en DB a ${orgName}: ${userData.email}`, 'info', orgId);

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
      
      // Eliminar el documento anterior si el ID era temporal (antes del Auth)
      if (targetUser.id && targetUser.id !== firebaseUser.uid) {
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

      addLog('Password Setup', `Usuario ${targetUser.email} configuró su cuenta correctamente en Auth y DB.`, 'success', targetUser.organizationId);

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

  const adminRemoveUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
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

      addLog('Org Updated', `Datos de organización ${orgId} actualizados en DB`, 'info', orgId);
    } catch (error) {
      console.error("Error updating org:", error);
    }
  };

  // Eliminar Organización en Firestore y mock local
  const adminRemoveOrg = async (orgId) => {
    try {
      await deleteDoc(doc(db, 'organizations', orgId));
      setMockOrganizations(prev => prev.filter(o => o.id !== orgId));
      addLog('Org Removed', `Organización ${orgId} eliminada de la base de datos`, 'danger', orgId);
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
      adminUpdateFullOrg, SUBSCRIPTION_PLANS,
      impersonateUser, stopImpersonation, isImpersonating,
      setupUserPassword,
      mockActivityLogs, mockSystemAlerts, addLog,
      isAdmin: user?.role === 'superadmin' || user?.role === 'admin' || user?.role === 'user'
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
