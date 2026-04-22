import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente que protege rutas basándose en si el usuario tiene rol administrativo.
 * Permite el acceso a 'admin' y 'superadmin'.
 */
export default function AdminRoute() {
  const { user } = useAuth();
  
  // Si no hay usuario, no hacemos nada aquí (dejar que AuthContext redireccione al login)
  if (!user) return null;

  // Verificar si el usuario tiene permisos administrativos
  const hasAccess = user.role === 'admin' || user.role === 'superadmin';

  if (!hasAccess) {
    console.warn('Intento de acceso no autorizado a ruta administrativa');
    return <Navigate to="/client/dashboard" replace />;
  }

  return <Outlet />;
}
