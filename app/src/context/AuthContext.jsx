import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    const storedMockUsers = localStorage.getItem('pkt_mock_users');
    return storedMockUsers ? JSON.parse(storedMockUsers) : INITIAL_MOCK_USERS;
  });

  const [mockOrganizations, setMockOrganizations] = useState(() => {
    const saved = localStorage.getItem('pkt_mock_organizations');
    if (saved) return JSON.parse(saved);
    
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

  useEffect(() => {
    localStorage.setItem('pkt_mock_users', JSON.stringify(mockUsers));
  }, [mockUsers]);

  useEffect(() => {
    localStorage.setItem('pkt_mock_organizations', JSON.stringify(mockOrganizations));
  }, [mockOrganizations]);

  useEffect(() => {
    // Check if user is stored in session
    const storedUser = sessionStorage.getItem('pkt_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Impersonation feature state
  const isImpersonating = !!sessionStorage.getItem('pkt_original_admin');

  const login = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Refresh mockUsers on login to make sure we have the latest
    const storedMockUsers = localStorage.getItem('pkt_mock_users');
    const currentMockUsers = storedMockUsers ? JSON.parse(storedMockUsers) : mockUsers;
    
    const foundUser = currentMockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Buscar información de la organización si aplica
      const org = foundUser.organizationId ? mockOrganizations.find(o => o.id === foundUser.organizationId) : null;
      
      // Remove password before storing
      const { password, ...userWithoutPassword } = foundUser;
      
      // Adjuntar suscripción
      const userWithSub = {
        ...userWithoutPassword,
        subscription: org?.subscription || null
      };

      setUser(userWithSub);
      sessionStorage.setItem('pkt_user', JSON.stringify(userWithSub));
      
      // Redirect based on role
      if (foundUser.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/client/dashboard');
      }
      return { success: true };
    }
    
    return { success: false, error: 'Credenciales inválidas' };
  };

  const logout = () => {
    // Prevent standard logout if impersonating, forces to use stopImpersonation
    if (isImpersonating) {
      stopImpersonation();
      return;
    }

    setUser(null);
    sessionStorage.removeItem('pkt_user');
    navigate('/');
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

  // Actualizar módulos de un usuario (Deprecado a favor de adminUpdateOrgPlan pero mantenido por compatibilidad)
  const adminUpdateUserModules = (userEmail, modules) => {
    setMockUsers(prev => prev.map(u => 
      u.email === userEmail ? { ...u, activeModules: modules } : u
    ));
  };

  // Crear Organización
  const adminCreateOrg = (orgData) => {
    const planId = 'startup'; // Por defecto para nuevas orgs
    const newOrg = {
      id: `org_${Math.floor(Math.random() * 10000)}`,
      name: orgData.name,
      ruc: orgData.ruc || '',
      address: orgData.address || '',
      status: 'active',
      industry: 'Tecnología',
      subscription: {
        planId,
        activeModules: SUBSCRIPTION_PLANS[planId].modules,
        limits: SUBSCRIPTION_PLANS[planId].limits
      }
    };
    setMockOrganizations(prev => [...prev, newOrg]);
    return newOrg;
  };

  // Actualizar Plan de Organización
  const adminUpdateOrgPlan = (orgId, planId) => {
    const planConfig = SUBSCRIPTION_PLANS[planId];
    if (!planConfig) return;

    setMockOrganizations(prev => prev.map(o => 
      o.id === orgId ? { 
        ...o, 
        subscription: {
          planId,
          activeModules: planConfig.modules,
          limits: planConfig.limits
        }
      } : o
    ));

    // Sincronizar módulos activos en todos los usuarios de esa organización
    setMockUsers(prev => prev.map(u => 
      u.organizationId === orgId ? { ...u, activeModules: planConfig.modules } : u
    ));
  };

  // Crear Usuario en Organización
  const adminCreateUser = (orgId, orgName, userData) => {
    // Verificar límites del plan
    const org = mockOrganizations.find(o => o.id === orgId);
    const usersInOrg = mockUsers.filter(u => u.organizationId === orgId);
    
    if (org && org.subscription.limits.users <= usersInOrg.length) {
      return { success: false, error: 'Límite de usuarios del plan alcanzado' };
    }

    const userId = `usr_c${Math.floor(Math.random() * 1000)}`;
    const inviteToken = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
    const newUser = {
      id: userId,
      role: userData.role || 'client',
      organizationId: orgId,
      organizationName: orgName,
      activeModules: org ? org.subscription.activeModules : ['crm'],
      status: 'pending',
      inviteToken,
      ...userData
    };
    setMockUsers(prev => [...prev, newUser]);
    return { success: true, inviteToken };
  };

  // Configurar contraseña de usuario (Onboarding)
  const setupUserPassword = async (token, newPassword) => {
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const targetUser = mockUsers.find(u => u.inviteToken === token);
    
    if (!targetUser) {
      return { success: false, error: 'Token de invitación inválido o expirado' };
    }

    setMockUsers(prev => prev.map(u => 
      u.inviteToken === token ? { 
        ...u, 
        password: newPassword, 
        status: 'active', 
        inviteToken: null 
      } : u
    ));

    return { success: true };
  };

  // Eliminar Usuario
  const adminRemoveUser = (userId) => {
    setMockUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Actualizar Organización Completa
  const adminUpdateOrg = (orgId, updateData) => {
    setMockOrganizations(prev => prev.map(o => 
      o.id === orgId ? { ...o, ...updateData } : o
    ));
    // Sincronizar nombre en usuarios vinculados si cambió
    if (updateData.name) {
      setMockUsers(prev => prev.map(u => 
        u.organizationId === orgId ? { ...u, organizationName: updateData.name } : u
      ));
    }
  };

  const getClientUsers = () => {
    return mockUsers.filter(u => u.role === 'client');
  };

  if (loading) return null; // Or a fancy spinner

  return (
    <AuthContext.Provider value={{ 
      user, login, logout, updateUser, 
      adminUpdateUserModules, getClientUsers, adminCreateUser,
      mockOrganizations, adminCreateOrg, adminRemoveUser, adminUpdateOrg,
      adminUpdateOrgPlan, SUBSCRIPTION_PLANS,
      impersonateUser, stopImpersonation, isImpersonating,
      setupUserPassword
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
