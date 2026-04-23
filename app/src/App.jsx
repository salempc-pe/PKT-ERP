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

import SetupPassword from './modules/SetupPassword';
import ActivityLogs from './modules/admin/ActivityLogs';
import ModuleRoute from './components/ModuleRoute';
import AdminBillingModule from './modules/admin/billing/AdminBillingModule';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/setup-password" element={<SetupPassword />} />
          
          {/* Client Routes */}
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboard />} />

            
            {/* Protected Modules */}
            <Route element={<ModuleRoute module="crm" />}>
              <Route path="crm" element={<CRMModule />} />
            </Route>
            <Route element={<ModuleRoute module="inventory" />}>
              <Route path="inventory" element={<InventoryModule />} />
            </Route>
            <Route element={<ModuleRoute module="sales" />}>
              <Route path="sales" element={<SalesModule />} />
            </Route>
            <Route element={<ModuleRoute module="finance" />}>
              <Route path="finance" element={<FinanceModule />} />
            </Route>
            <Route element={<ModuleRoute module="calendar" />}>
              <Route path="calendar" element={<CalendarModule />} />
            </Route>
            <Route element={<ModuleRoute module="projects" />}>
              <Route path="projects" element={<ProjectModule />} />
            </Route>

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
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
