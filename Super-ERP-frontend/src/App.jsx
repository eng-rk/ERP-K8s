import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import AuxTopBar from './components/AuxTopBar';
import DashboardPage from './pages/DashboardPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import DevToolsPage from './pages/DevToolsPage';
import OnboardingModal from './components/OnboardingModal';
import { authRoutes } from './modules/auth/routes';
import { crmRoutes } from './modules/crm/routes';
import { inventoryRoutes } from './modules/inventory/routes';
import { hrmRoutes } from './modules/hrm/routes';
import { hrmExtensionRoutes } from './modules/hrmExtensions/routes';
import { accountingRoutes } from './modules/accounting/routes';
import { essRoutes } from './modules/ess/routes';
import { iamRoutes } from './modules/iam/routes';
import { settingsRoutes } from './modules/settings/routes';
import { paymentRoutes } from './modules/payments/routes';
import { rtmRoutes } from './modules/rtm/routes';
import { productRoutes } from './modules/products/routes';
import { useAuth, useAppSelector } from './store/hooks';
import { selectUser } from './store/slices/authSlice';
import AuxBootstrap from './store/AuxBootstrap';

const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <AuxTopBar />
      <nav aria-label="ERP modules" style={{ display: 'flex', gap: 8, padding: '8px 16px', borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
        <NavLink to="/accounting" style={{ padding: '6px 10px', borderRadius: 6, textDecoration: 'none' }}>Accounting</NavLink>
        <NavLink to="/hrm/extensions" style={{ padding: '6px 10px', borderRadius: 6, textDecoration: 'none' }}>HRM Extensions</NavLink>
      </nav>
      <main className="main-content" style={{ marginTop: 48 }}>{children}</main>
    </div>
  </div>
);

const AppRoutes = () => {
  const { user } = useAuth();
  const currentUser = useAppSelector(selectUser);

  return (
    <Routes>
      {authRoutes({ PublicRoute })}
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
      {crmRoutes({ ProtectedRoute, AppLayout })}
      {inventoryRoutes({ ProtectedRoute, AppLayout })}
      {hrmRoutes({ ProtectedRoute, AppLayout })}
      {hrmExtensionRoutes({ ProtectedRoute, AppLayout })}
      {accountingRoutes({ ProtectedRoute, AppLayout })}
      {essRoutes({ ProtectedRoute, AppLayout })}
      {iamRoutes({ ProtectedRoute, AppLayout })}
      {settingsRoutes({ ProtectedRoute, AppLayout })}
      {paymentRoutes()}
      {rtmRoutes({ ProtectedRoute, AppLayout })}
      {productRoutes({ ProtectedRoute, AppLayout })}
      <Route path="/devtools" element={<ProtectedRoute allowedRoles={['CRM Developer', 'System Architect', 'Super CRM Administrator']}><AppLayout><DevToolsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/unauthorized" element={<AppLayout><UnauthorizedPage /></AppLayout>} />
      <Route path="*" element={<Navigate to={currentUser || user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuxBootstrap />
      <AppRoutes />
      <OnboardingModal />
    </BrowserRouter>
  );
}

export default App;
