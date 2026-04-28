import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Componente que protege rutas basándose en si el módulo está activo para el usuario.
 * @param {string} module - El ID del módulo a verificar (e.g., 'crm', 'inventory')
 */
export default function ModuleRoute({ module }) {
  const { user } = useAuth();
  
  // Si no hay usuario, no hacemos nada aquí (dejar que AuthContext redireccione al login)
  if (!user) return null;

  // Si tiene el módulo activo
  const isModuleActive = user?.subscription?.activeModules?.includes(module);

  if (!isModuleActive) {
    console.warn(`Intento de acceso a módulo no activo: ${module}`);
    return <Navigate to="/client/marketplace" replace />;
  }

  return <Outlet />;
}
