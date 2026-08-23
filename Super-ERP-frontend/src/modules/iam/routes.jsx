import { Route } from 'react-router-dom';
import { UsersPage, UserProfilePage, TeamsPage } from './index';

export const iamRoutes = ({ ProtectedRoute, AppLayout }) => (
  <>
    <Route path="/teams" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'System Architect', 'Sales Manager', 'Sales Agent', 'Customer Support Manager', 'Customer Support Agent', 'Marketing Manager', 'Marketing Specialist']}><AppLayout><TeamsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/users" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'System Architect']}><AppLayout><UsersPage /></AppLayout></ProtectedRoute>} />
    <Route path="/users/:id" element={<ProtectedRoute><AppLayout><UserProfilePage /></AppLayout></ProtectedRoute>} />
  </>
);
