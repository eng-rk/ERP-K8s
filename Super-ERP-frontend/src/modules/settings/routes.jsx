import { Route } from 'react-router-dom';
import { SettingsPage } from './index';

export const settingsRoutes = ({ ProtectedRoute, AppLayout }) => (
  <Route path="/settings" element={<ProtectedRoute allowedRoles={['Super CRM Administrator']}><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />
);
