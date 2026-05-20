import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AdminLayout from './layouts/admin/AdminLayout';
import ClientLayout from './layouts/client/ClientLayout';
import Login from './modules/Login';
import AdminDashboard from './modules/admin/dashboard/AdminDashboard';
import AdminClients from './modules/admin/clients/AdminClients';
import ClientDashboard from './modules/client/dashboard/ClientDashboard';
import CRMModule from './modules/client/crm/CRMModule';
import InventoryModule from './modules/client/inventory/InventoryModule';
import SalesModule from './modules/client/sales/SalesModule';
import SettingsModule from './modules/settings/SettingsModule';
import FinanceModule from './modules/client/finance/FinanceModule';
import CalendarModule from './modules/client/calendar/CalendarModule';
import ProjectModule from './modules/client/projects/ProjectModule';
import AdminRoute from './components/AdminRoute';
import TeamModule from './modules/client/team/TeamModule';
import PurchasesModule from './modules/client/purchases/PurchasesModule';
import RealEstateModule from './modules/client/realestate/RealEstateModule';
import PayrollModule from './modules/client/payroll/PayrollModule';
import HealthModule from './modules/client/health/HealthModule';
import { MODULE_IDS, MODULE_SLUGS } from './modules/moduleNames';

import SetupPassword from './modules/SetupPassword';
import ActivityLogs from './modules/admin/ActivityLogs';
import ModuleRoute from './components/ModuleRoute';
import AdminBillingModule from './modules/admin/billing/AdminBillingModule';
import FeedbackButton from './components/FeedbackButton';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  useEffect(() => {
    const handleGesture = (e) => {
      // Evitar zoom innecesario
      if (e.scale && e.scale !== 1) {
        e.preventDefault();
      }
    };
    
    const handleContextMenu = (e) => {
      // Bloquear menú contextual nativo del navegador en todos lados EXCEPTO inputs/textareas
      const isInput = 
         e.target.tagName === 'INPUT' || 
         e.target.tagName === 'TEXTAREA' || 
         e.target.isContentEditable ||
         e.target.closest('[contenteditable="true"]');
         
      if (!isInput) {
        e.preventDefault();
        return false;
      }
    };
    
    document.addEventListener('gesturestart', handleGesture);
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('gesturestart', handleGesture);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/setup-password" element={<SetupPassword />} />
            
            {/* Client Routes */}
            <Route path="/client" element={<ClientLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ClientDashboard />} />

              
              {/* Protected Modules */}
              <Route element={<ModuleRoute module={MODULE_IDS.CRM} />}>
                <Route path={MODULE_SLUGS[MODULE_IDS.CRM]} element={<CRMModule />} />
              </Route>
              <Route element={<ModuleRoute module={MODULE_IDS.INVENTORY} />}>
                <Route path={MODULE_SLUGS[MODULE_IDS.INVENTORY]} element={<InventoryModule />} />
              </Route>
              <Route element={<ModuleRoute module={MODULE_IDS.SALES} />}>
                <Route path={MODULE_SLUGS[MODULE_IDS.SALES]} element={<SalesModule />} />
              </Route>
              <Route element={<ModuleRoute module={MODULE_IDS.FINANCE} />}>
                <Route path={MODULE_SLUGS[MODULE_IDS.FINANCE]} element={<FinanceModule />} />
              </Route>
              <Route element={<ModuleRoute module={MODULE_IDS.CALENDAR} />}>
                <Route path={MODULE_SLUGS[MODULE_IDS.CALENDAR]} element={<CalendarModule />} />
              </Route>
              <Route element={<ModuleRoute module={MODULE_IDS.PROJECTS} />}>
                <Route path={MODULE_SLUGS[MODULE_IDS.PROJECTS]} element={<ProjectModule />} />
              </Route>
              <Route element={<ModuleRoute module={MODULE_IDS.PURCHASES} />}>
                <Route path={MODULE_SLUGS[MODULE_IDS.PURCHASES]} element={<PurchasesModule />} />
              </Route>
              <Route element={<ModuleRoute module={MODULE_IDS.REALESTATE} />}>
                <Route path={MODULE_SLUGS[MODULE_IDS.REALESTATE]} element={<RealEstateModule />} />
              </Route>
              <Route element={<ModuleRoute module={MODULE_IDS.PAYROLL} />}>
                <Route path={MODULE_SLUGS[MODULE_IDS.PAYROLL]} element={<PayrollModule />} />
              </Route>

              <Route path={`${MODULE_SLUGS[MODULE_IDS.HEALTH]}/*`} element={<HealthModule />} />
              <Route path="settings" element={<SettingsModule />} />
              <Route element={<AdminRoute />}>
                <Route path="team" element={<TeamModule />} />
              </Route>
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="sales" element={<AdminBillingModule />} />
              <Route path="logs" element={<ActivityLogs />} />
            </Route>
            <Route path="/login" element={<Navigate to="/" replace />} />
            
            {/* Fallback for undefined routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
        <FeedbackButton />
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
