import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
