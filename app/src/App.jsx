import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          
          {/* Client Routes */}
          <Route path="/client" element={<ClientLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="crm" element={<CRMModule />} />
            <Route path="inventory" element={<InventoryModule />} />
            <Route path="sales" element={<SalesModule />} />
            <Route path="settings" element={<SettingsModule />} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="clients" element={<AdminClients />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
