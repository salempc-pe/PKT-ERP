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
import MarketplaceModule from './modules/client/marketplace/MarketplaceModule';
import ModuleRoute from './components/ModuleRoute';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          
          {/* Client Routes */}
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="marketplace" element={<MarketplaceModule />} />
            
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
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="clients" element={<AdminClients />} />
            <Route path="sales" element={<SalesModule />} />
          </Route>
        </Routes>
      </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
