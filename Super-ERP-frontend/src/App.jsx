import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuxProvider } from './context/AuxContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import AuxTopBar from './components/AuxTopBar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import UsersPage from './pages/UsersPage';
import UserProfilePage from './pages/UserProfilePage';
import TeamsPage from './pages/TeamsPage';
import SettingsPage from './pages/SettingsPage';
import DevToolsPage from './pages/DevToolsPage';
import RtmMonitorPage from './pages/RtmMonitorPage';
import HrmDashboardPage from './pages/hrm/HrmDashboardPage';
import PersonalPage from './pages/hrm/PersonalPage';
import PayrollPage from './pages/hrm/PayrollPage';
import TrainingPage from './pages/hrm/TrainingPage';
import TalentAcquisitionPage from './pages/hrm/TalentAcquisitionPage';
import PartnershipsPage from './pages/hrm/PartnershipsPage';
import MySchedulePage from './pages/ess/MySchedulePage';
import MyPayrollPage from './pages/ess/MyPayrollPage';
import PaymentPage from './pages/PaymentPage';
import ProductsPage from './pages/ProductsPage';
import OnboardingModal from './components/OnboardingModal';
import InventoryDashboard from './pages/InventoryDashboard';
import InventoryItemsPage from './pages/InventoryItemsPage';
import InventoryItemDetail from './pages/InventoryItemDetail';
import StockOverviewPage from './pages/StockOverviewPage';
import TransactionsPage from './pages/TransactionsPage';
import ReceivingPage from './pages/ReceivingPage';
import ShippingPage from './pages/ShippingPage';
import TransfersPage from './pages/TransfersPage';
import AdjustmentsPage from './pages/AdjustmentsPage';
import CycleCountPage from './pages/CycleCountPage';
import PhysicalInventoryPage from './pages/PhysicalInventoryPage';
import WarehousesPage from './pages/WarehousesPage';
import PickTaskPage from './pages/PickTaskPage';
import InventoryReportsPage from './pages/InventoryReportsPage';
import SupplyChainPage from './pages/SupplyChainPage';
import { crmRoutes } from './modules/crm/routes';
import { useAuth } from './context/AuthContext';

const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <AuxTopBar />
      <main className="main-content" style={{ marginTop: 48 }}>{children}</main>
    </div>
  </div>
);

const inventoryRoles = [
  'Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager',
  'Receiving Clerk', 'Shipping Clerk', 'Warehouse Operator', 'Inventory Clerk', 'Quality Inspector'
];

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />

      {/* CRM owns all CRM feature routes. */}
      {crmRoutes({ ProtectedRoute, AppLayout })}

      <Route path="/products" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'System Architect', 'Sales Agent', 'Sales Manager', 'Executive User']}><AppLayout><ProductsPage /></AppLayout></ProtectedRoute>} />

      <Route path="/inventory" element={<ProtectedRoute allowedRoles={inventoryRoles}><AppLayout><InventoryDashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/inventory/items" element={<ProtectedRoute allowedRoles={inventoryRoles}><AppLayout><InventoryItemsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/inventory/items/:id" element={<ProtectedRoute allowedRoles={inventoryRoles}><AppLayout><InventoryItemDetail /></AppLayout></ProtectedRoute>} />
      <Route path="/inventory/stock" element={<ProtectedRoute allowedRoles={inventoryRoles}><AppLayout><StockOverviewPage /></AppLayout></ProtectedRoute>} />
      <Route path="/inventory/transactions" element={<ProtectedRoute allowedRoles={inventoryRoles}><AppLayout><TransactionsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/inventory/receiving" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager', 'Receiving Clerk', 'Quality Inspector']}><AppLayout><ReceivingPage /></AppLayout></ProtectedRoute>} />
      <Route path="/inventory/shipping" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager', 'Shipping Clerk', 'Warehouse Operator']}><AppLayout><ShippingPage /></AppLayout></ProtectedRoute>} />
      <Route path="/inventory/transfers" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager', 'Warehouse Operator']}><AppLayout><TransfersPage /></AppLayout></ProtectedRoute>} />
      <Route path="/inventory/adjustments" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager', 'Inventory Clerk']}><AppLayout><AdjustmentsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/inventory/cycle-counts" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager', 'Warehouse Operator', 'Quality Inspector']}><AppLayout><CycleCountPage /></AppLayout></ProtectedRoute>} />
      <Route path="/inventory/physical-inventories" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager', 'Warehouse Operator']}><AppLayout><PhysicalInventoryPage /></AppLayout></ProtectedRoute>} />
      <Route path="/inventory/warehouses" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager']}><AppLayout><WarehousesPage /></AppLayout></ProtectedRoute>} />
      <Route path="/inventory/pick-tasks" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager', 'Shipping Clerk', 'Warehouse Operator']}><AppLayout><PickTaskPage /></AppLayout></ProtectedRoute>} />
      <Route path="/inventory/reports" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager', 'Inventory Clerk']}><AppLayout><InventoryReportsPage /></AppLayout></ProtectedRoute>} />

      <Route path="/supply-chain" element={<ProtectedRoute allowedRoles={inventoryRoles}><AppLayout><SupplyChainPage /></AppLayout></ProtectedRoute>} />
      <Route path="/supply-chain/:section" element={<ProtectedRoute allowedRoles={inventoryRoles}><AppLayout><SupplyChainPage /></AppLayout></ProtectedRoute>} />

      <Route path="/teams" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'System Architect', 'Sales Manager', 'Sales Agent', 'Customer Support Manager', 'Customer Support Agent', 'Marketing Manager', 'Marketing Specialist']}><AppLayout><TeamsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'System Architect']}><AppLayout><UsersPage /></AppLayout></ProtectedRoute>} />
      <Route path="/users/:id" element={<ProtectedRoute><AppLayout><UserProfilePage /></AppLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute allowedRoles={['Super CRM Administrator']}><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/rtm" element={<ProtectedRoute allowedRoles={['RTM Team Member', 'Super CRM Administrator', 'HRM System Administrator', 'HR Manager']}><AppLayout><RtmMonitorPage /></AppLayout></ProtectedRoute>} />

      <Route path="/hrm" element={<ProtectedRoute><AppLayout><HrmDashboardPage /></AppLayout></ProtectedRoute>} />
      <Route path="/hrm/personal" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'HRM System Administrator', 'HR Manager', 'HR Specialist (Generalist)', 'HR Business Partner', 'Employee (General User)']}><AppLayout><PersonalPage /></AppLayout></ProtectedRoute>} />
      <Route path="/hrm/payroll" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'HRM System Administrator', 'HR Manager', 'Payroll Specialist', 'Employee (General User)']}><AppLayout><PayrollPage /></AppLayout></ProtectedRoute>} />
      <Route path="/hrm/training" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'HRM System Administrator', 'HR Manager', 'Training and Development Specialist', 'Employee (General User)']}><AppLayout><TrainingPage /></AppLayout></ProtectedRoute>} />
      <Route path="/hrm/talent" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'HRM System Administrator', 'HR Manager', 'Recruitment Specialist (Talent Acquisition)']}><AppLayout><TalentAcquisitionPage /></AppLayout></ProtectedRoute>} />
      <Route path="/hrm/partnerships" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'HRM System Administrator', 'HR Manager', 'HR Business Partner', 'Employee (General User)']}><AppLayout><PartnershipsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/ess/schedule" element={<ProtectedRoute><AppLayout><MySchedulePage /></AppLayout></ProtectedRoute>} />
      <Route path="/ess/payroll" element={<ProtectedRoute><AppLayout><MyPayrollPage /></AppLayout></ProtectedRoute>} />

      <Route path="/devtools" element={<ProtectedRoute allowedRoles={['CRM Developer', 'System Architect', 'Super CRM Administrator']}><AppLayout><DevToolsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/pay/:token" element={<PublicRoute><PaymentPage /></PublicRoute>} />
      <Route path="/unauthorized" element={<AppLayout><UnauthorizedPage /></AppLayout>} />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuxProvider>
          <AppRoutes />
          <OnboardingModal />
        </AuxProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
