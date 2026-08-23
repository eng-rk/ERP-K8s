import { Route } from 'react-router-dom';
import { RtmMonitorPage } from './index';

export const rtmRoutes = ({ ProtectedRoute, AppLayout }) => (
  <Route path="/rtm" element={<ProtectedRoute allowedRoles={['RTM Team Member', 'Super CRM Administrator', 'HRM System Administrator', 'HR Manager']}><AppLayout><RtmMonitorPage /></AppLayout></ProtectedRoute>} />
);
