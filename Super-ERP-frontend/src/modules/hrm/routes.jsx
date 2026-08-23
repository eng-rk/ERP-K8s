import { Route } from 'react-router-dom';
import {
  HrmDashboardPage,
  PersonalPage,
  PayrollPage,
  TrainingPage,
  TalentAcquisitionPage,
  PartnershipsPage,
  AuxSchedulePage,
} from './index';

export const hrmRoutes = ({ ProtectedRoute, AppLayout }) => (
  <>
    <Route path="/hrm" element={<ProtectedRoute><AppLayout><HrmDashboardPage /></AppLayout></ProtectedRoute>} />
    <Route path="/hrm/personal" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'HRM System Administrator', 'HR Manager', 'HR Specialist (Generalist)', 'HR Business Partner', 'Employee (General User)']}><AppLayout><PersonalPage /></AppLayout></ProtectedRoute>} />
    <Route path="/hrm/payroll" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'HRM System Administrator', 'HR Manager', 'Payroll Specialist', 'Employee (General User)']}><AppLayout><PayrollPage /></AppLayout></ProtectedRoute>} />
    <Route path="/hrm/training" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'HRM System Administrator', 'HR Manager', 'Training and Development Specialist', 'Employee (General User)']}><AppLayout><TrainingPage /></AppLayout></ProtectedRoute>} />
    <Route path="/hrm/talent" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'HRM System Administrator', 'HR Manager', 'Recruitment Specialist (Talent Acquisition)']}><AppLayout><TalentAcquisitionPage /></AppLayout></ProtectedRoute>} />
    <Route path="/hrm/partnerships" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'HRM System Administrator', 'HR Manager', 'HR Business Partner', 'Employee (General User)']}><AppLayout><PartnershipsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/hrm/aux-schedule" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'HRM System Administrator', 'HR Manager']}><AppLayout><AuxSchedulePage /></AppLayout></ProtectedRoute>} />
  </>
);
