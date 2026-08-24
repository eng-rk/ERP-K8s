import { Route } from 'react-router-dom';
import HrmExtensionsPage from '../../pages/hrm/HrmExtensionsPage';

const roles = ['Super CRM Administrator','System Architect','HRM System Administrator','HR Manager','HR Specialist (Generalist)','HR Business Partner','Payroll Specialist','Employee (General User)'];

export const hrmExtensionRoutes = ({ ProtectedRoute, AppLayout }) => (
  <Route path="/hrm/extensions" element={<ProtectedRoute allowedRoles={roles}><AppLayout><HrmExtensionsPage /></AppLayout></ProtectedRoute>} />
);
