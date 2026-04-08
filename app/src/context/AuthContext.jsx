import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Mock Database of users
  const MOCK_USERS = [
    {
      id: 'usr_admin1',
      email: 'test@admin.com',
      password: '1234',
      name: 'Super Admin',
      role: 'admin',
      organization: null, // Admins manage the platform
    },
    {
      id: 'usr_client1',
      email: 'test@cliente.com',
      password: '1234',
      name: 'Juan Cliente',
      role: 'client',
      organizationId: 'org_001',
      organizationName: 'TechCorp Solutions',
    },
    {
      id: 'usr_client2',
      email: 'alex.smith@global.com',
      password: '1234',
      name: 'Alex Smith',
      role: 'client',
      organizationId: 'org_002',
      organizationName: 'Global Industries',
    }
  ];

  useEffect(() => {
    // Check if user is stored in session
    const storedUser = sessionStorage.getItem('pkt_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Remove password before storing
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      sessionStorage.setItem('pkt_user', JSON.stringify(userWithoutPassword));
      
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
    setUser(null);
    sessionStorage.removeItem('pkt_user');
    navigate('/');
  };

  if (loading) return null; // Or a fancy spinner

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
