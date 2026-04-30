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
import { sendInvitationEmail } from '../services/mailer';

const AuthContext = createContext();

const SUBSCRIPTION_PLANS = {
  startup: { 
    name: 'Startup', 
    modules: ['crm', 'calendar'], 
    limits: { users: 2 } 
  },
  business: { 
    name: 'Business', 
    modules: ['crm', 'inventory', 'sales', 'projects', 'purchases'], 
    limits: { users: 4 } 
  },
  enterprise: {
    name: 'Enterprise',
    modules: ['crm', 'inventory', 'sales', 'projects', 'purchases', 'finance', 'calendar', 'realestate'],
    limits: { users: 10 }
  }
};

import LoadingScreen from '../components/LoadingScreen';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState([]);
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [allActivityLogs, setAllActivityLogs] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  // Carga reactiva de datos según el rol y organización
  useEffect(() => {
    if (!user) {
      setAllUsers([]);
      setAllOrganizations([]);
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
          
          setAllOrganizations(orgData);
          setAllUsers(userData);
          setAllActivityLogs(logsData);
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
            setAllOrganizations([{ id: orgSnap.id, ...orgSnap.data() }]);
          }
          setAllUsers(teamSnap.docs.map(d => ({ id: d.id, ...d.data() })));
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
      setAllActivityLogs(prev => [logWithId, ...prev]);
    } catch (error) {
      console.error("Error saving audit log:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth ? onAuthStateChanged(auth, async (firebaseUser) => {
      // ... mismo código interior ...
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          
          let userData = null;
          if (userSnap.exists()) {
            userData = { id: userSnap.id, ...userSnap.data() };
          } else {
            try {
              const usersRef = collection(db, 'users');
              const q = query(usersRef, where('email', '==', firebaseUser.email));
              const querySnapshot = await getDocs(q);
              
              if (!querySnapshot.empty) {
                const oldDoc = querySnapshot.docs[0];
                const oldData = oldDoc.data();
                userData = { 
                  ...oldData, 
                  id: firebaseUser.uid,
                  uid: firebaseUser.uid,
                  status: 'active',
                  inviteToken: null,
                  updatedAt: serverTimestamp()
                };
                await setDoc(doc(db, 'users', firebaseUser.uid), userData);
                if (oldDoc.id !== firebaseUser.uid) {
                  await deleteDoc(doc(db, 'users', oldDoc.id));
                }
              }
            } catch (queryError) {
              console.warn('Fallback por email falló:', queryError.message);
            }
          }

          if (userData) {
            let orgSubscription = null;
            let currencySymbol = '$';
            if (userData.organizationId) {
              try {
                const orgSnap = await getDoc(doc(db, 'organizations', userData.organizationId));
                if (orgSnap.exists()) {
                  orgSubscription = orgSnap.data().subscription;
                  currencySymbol = orgSnap.data().currencySymbol || '$';
                }
              } catch (orgError) {
                console.warn('Error al cargar datos de organización:', orgError.message);
              }
            }

            const { password, ...userWithoutPassword } = userData;
            const isSuperAdmin = userData.role === 'superadmin' || 
                               (userData.role === 'admin' && !userData.organizationId);

            const role = isSuperAdmin ? 'superadmin' : (userData.role || 'user');
            const isAdmin = role === 'admin' || role === 'superadmin';

            const userWithSub = {
              ...userWithoutPassword,
              email: firebaseUser.email,
              uid: firebaseUser.uid,
              role: role,
              subscription: orgSubscription || null,
              currencySymbol: currencySymbol,
              isAdmin: isAdmin
            };
            
            setUser(userWithSub);
            sessionStorage.setItem('pkt_user', JSON.stringify(userWithSub));
          } else {
            setUser({ email: firebaseUser.email, uid: firebaseUser.uid, role: 'user', status: 'pending', isAdmin: false });
          }
        } catch (error) {
          console.error('Error cargando sesión desde Firestore:', error);
          setUser({ email: firebaseUser.email, uid: firebaseUser.uid, role: 'user', status: 'pending', isAdmin: false });
        }
      } else {
        setUser(null);
        sessionStorage.removeItem('pkt_user');
      }
      setLoading(false);
    }) : () => {
      console.error("Auth no disponible - cancelando carga");
      setLoading(false);
    };

    return () => { if (auth) unsubscribe(); };
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
        let currencySymbol = '$';
        if (foundUser.organizationId) {
          try {
            const orgDocRef = doc(db, 'organizations', foundUser.organizationId);
            const orgSnap = await getDoc(orgDocRef);
            if (orgSnap.exists()) {
              orgSubscription = orgSnap.data().subscription;
              currencySymbol = orgSnap.data().currencySymbol || '$';
            }
          } catch (orgError) {
            console.warn('Error al cargar datos de organización durante login:', orgError.message);
          }
        }

        const { password: unusedPassword, ...userWithoutPassword } = foundUser;
        
        // SuperAdmin = rol admin/superadmin sin organizaciónId
        const isSuperAdmin = foundUser.role === 'superadmin' || 
          (foundUser.role === 'admin' && !foundUser.organizationId);
        
        const role = isSuperAdmin ? 'superadmin' : (foundUser.role || 'user');
        const isAdmin = isSuperAdmin || role === 'admin' || role === 'client';

        const userWithSub = {
          ...userWithoutPassword,
          uid: firebaseUser.uid,
          role: role,
          subscription: orgSubscription || null,
          currencySymbol: currencySymbol,
          isAdmin: isAdmin
        };

        setUser(userWithSub);
        sessionStorage.setItem('pkt_user', JSON.stringify(userWithSub));
        
        addLog('Login', `Usuario ${foundUser.name} inició sesión`, 'success');

        if (role === 'superadmin') {
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
    const org = targetUser.organizationId ? allOrganizations.find(o => o.id === targetUser.organizationId) : null;
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
    
    // Update also in database
    setAllUsers(prevUsers => 
      prevUsers.map(u => u.id === user.id ? { ...u, ...data } : u)
    );
  };

  // Actualizar módulos de una organización en Firestore
  const adminUpdateOrgModules = async (orgId, modules) => {
    if (user?.role !== 'superadmin') throw new Error("Acción restringida a SuperAdmin");
    try {
      const orgRef = doc(db, 'organizations', orgId);
      await updateDoc(orgRef, {
        "subscription.activeModules": modules
      });

      setAllOrganizations(prev => prev.map(o => 
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
    if (user?.role !== 'superadmin') throw new Error("Acción restringida a SuperAdmin");
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
        maxUsers: Number(orgData.maxUsers) || SUBSCRIPTION_PLANS[planId].limits.users,
        monthlyFee: Number(orgData.monthlyFee) || 0
      },
      logoUrl: orgData.logoUrl || ''
    };

    try {
      // 1. Crear Organización
      const docRef = await addDoc(collection(db, 'organizations'), newOrg);
      const createdOrg = { id: docRef.id, ...newOrg };
      
      setAllOrganizations(prev => [...prev, createdOrg]);
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
    if (user?.role !== 'superadmin') throw new Error("Acción restringida a SuperAdmin");
    try {
      const orgRef = doc(db, 'organizations', orgId);
      
      const updatePayload = {
        name: data.name,
        ruc: data.ruc || '',
        address: data.address || '',
        "subscription.planId": data.planId,
        "subscription.activeModules": data.activeModules,
        "subscription.maxUsers": Number(data.maxUsers),
        "subscription.limits.users": Number(data.maxUsers), // Sincronizar ambos campos por seguridad
        "subscription.monthlyFee": Number(data.monthlyFee) || 0,
        logoUrl: data.logoUrl || ''
      };

      await updateDoc(orgRef, updatePayload);

      // Actualizar estado local
      setAllOrganizations(prev => prev.map(o => 
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
            },
            monthlyFee: Number(data.monthlyFee) || 0
          },
          logoUrl: data.logoUrl || ''
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
      const currentOrg = allOrganizations.find(o => o.id === orgId);
      const activeUsersCount = allUsers.filter(u => u.organizationId === orgId).length;
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
        role: userData.role || 'user', // Default to 'user', not 'client'
        organizationId: orgId,
        organizationName: orgName,
        status: 'pending',
        inviteToken,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'users'), newUser);
      const createdUser = { id: docRef.id, ...newUser };

      // Enviar correo de invitación automáticamente
      const inviteUrl = window.location.origin + '/setup-password?token=' + inviteToken;
      try {
        await sendInvitationEmail(userData.email, userData.name, orgName, inviteUrl);
      } catch (mailError) {
        console.error("No se pudo enviar el correo de invitación:", mailError);
        // No bloqueamos la creación del usuario si el correo falla, 
        // ya que el token aún puede copiarse manualmente.
      }

      setAllUsers(prev => [...prev, createdUser]);
      
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
      // 1. Buscar al usuario directamente en Firestore usando el token
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('inviteToken', '==', token), where('status', '==', 'pending'));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return { success: false, error: 'Token de invitación inválido o expirado' };
      }

      const userDoc = querySnapshot.docs[0];
      const targetUser = { id: userDoc.id, ...userDoc.data() };

      // 2. Manejo de Auth con Reintentos
      let firebaseUser;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, targetUser.email, newPassword);
        firebaseUser = userCredential.user;
      } catch (authError) {
        if (authError.code === 'auth/email-already-in-use') {
          // Si el usuario ya existe en Auth, intentamos loguearlo con la contraseña que acaba de poner
          // Esto soluciona problemas de activaciones interrumpidas a la mitad
          const loginCredential = await signInWithEmailAndPassword(auth, targetUser.email, newPassword);
          firebaseUser = loginCredential.user;
        } else {
          throw authError;
        }
      }

      // 3. Crear el documento oficial con el UID PRIMERO
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      
      // Limpiar y preparar datos finales
      const { id: unusedId, ...cleanTargetUser } = targetUser;
      const updatedData = { 
        ...cleanTargetUser, 
        uid: firebaseUser.uid,
        id: firebaseUser.uid,
        status: 'active', 
        inviteToken: null,
        updatedAt: serverTimestamp() 
      };
      
      await setDoc(userDocRef, updatedData);

      // 4. ELIMINAR el documento temporal
      // Usamos el ID original que encontramos al buscar por token
      if (targetUser.id && targetUser.id !== firebaseUser.uid) {
        try {
          await deleteDoc(doc(db, 'users', targetUser.id));
        } catch (delError) {
          console.warn("No se pudo eliminar el doc temporal (quizás ya no existe):", delError.message);
        }
      }

      // 5. Obtener suscripción/módulos de la organización
      // Ahora getUserOrg() en las reglas pasará porque el doc del usuario ya existe
      let orgSubscription = null;
      if (targetUser.organizationId) {
        const orgDocRef = doc(db, 'organizations', targetUser.organizationId);
        const orgSnap = await getDoc(orgDocRef);
        if (orgSnap.exists()) {
          orgSubscription = orgSnap.data().subscription;
        }
      }

      // 6. Preparar objeto de usuario completo para la sesión inmediata
      const { password: unusedPassword, ...userWithoutPassword } = updatedData;
      const userWithSub = {
        ...userWithoutPassword,
        subscription: orgSubscription || { planId: 'startup', activeModules: [] },
        isAdmin: updatedData.role === 'admin' || updatedData.role === 'superadmin'
      };

      setUser(userWithSub);
      sessionStorage.setItem('pkt_user', JSON.stringify(userWithSub));

      addLog('Password Setup', `Usuario ${targetUser.email} activado con éxito`, 'success', targetUser.organizationId);

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
      setAllUsers(prev => prev.filter(u => u.id !== userId));
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

      setAllOrganizations(prev => prev.map(o => 
        o.id === orgId ? { ...o, ...updateData } : o
      ));

      addLog('Org Updated', `Datos de organización ${orgId} actualizados en DB`, 'info', orgId);
    } catch (error) {
      console.error("Error updating org:", error);
    }
  };

  // Eliminar Organización en Firestore
  const adminRemoveOrg = async (orgId) => {
    if (user?.role !== 'superadmin') throw new Error("Acción restringida a SuperAdmin");
    try {
      await deleteDoc(doc(db, 'organizations', orgId));
      setAllOrganizations(prev => prev.filter(o => o.id !== orgId));
      addLog('Org Removed', `Organización ${orgId} eliminada de la base de datos`, 'danger', orgId);
    } catch (error) {
      console.error("Error removing org:", error);
    }
  };

  // Función para poblar la base de datos con datos de prueba si está vacía
  const seedDatabase = async () => {
    if (user?.role !== 'superadmin') return;
    
    try {
      console.log("🌱 Iniciando seeding de base de datos...");
      
      // 1. Crear algunas organizaciones de prueba
      const demoOrgs = [
        { name: 'Empresa Alpha S.A.C.', ruc: '20123456789', planId: 'business', modules: ['crm', 'inventory', 'sales', 'projects'], users: 3 },
        { name: 'Beta Tech Solutions', ruc: '20987654321', planId: 'startup', modules: ['crm', 'calendar'], users: 1 },
        { name: 'Gamarra Fashion ERP', ruc: '20555555555', planId: 'business', modules: ['crm', 'inventory', 'sales', 'finance', 'purchases'], users: 5 }
      ];

      for (const org of demoOrgs) {
        await adminCreateOrg({
          name: org.name,
          ruc: org.ruc,
          planId: org.planId,
          activeModules: org.modules,
          maxUsers: 10
        });
      }

      // 2. Crear algunos logs de prueba
      const demoLogs = [
        { action: 'Configuración Inicial', details: 'Se activaron módulos base para la organización Alpha', type: 'info' },
        { action: 'Alerta de Inventario', details: 'Stock crítico detectado en Almacén Central', type: 'warning' },
        { action: 'Nueva Venta', details: 'Factura F001-0005 generada satisfactoriamente', type: 'success' }
      ];

      for (const log of demoLogs) {
        await addLog(log.action, log.details, log.type);
      }

      console.log("✅ Seeding completado.");
      window.location.reload(); // Recargar para ver los cambios
    } catch (error) {
      console.error("Error durane el seeding:", error);
    }
  };

  const getClientUsers = () => {
    return allUsers.filter(u => u.role === 'client');
  };

  const formatPrice = (amount) => {
    const symbol = user?.currencySymbol || '$';
    const value = parseFloat(amount) || 0;
    return `${symbol} ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, updateUser, 
      getClientUsers, adminCreateUser, adminUpdateOrgModules,
      allUsers, allOrganizations, adminCreateOrg, adminRemoveUser, adminUpdateOrg, adminRemoveOrg,
      adminUpdateFullOrg, SUBSCRIPTION_PLANS,
      impersonateUser, stopImpersonation, isImpersonating,
      setupUserPassword,
      allActivityLogs, systemAlerts, addLog,
      seedDatabase,
      currencySymbol: user?.currencySymbol || '$',
      formatPrice,
      isAdmin: user?.role === 'superadmin' || user?.role === 'admin'
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
