import { Route } from 'react-router-dom';
import { MySchedulePage, MyPayrollPage } from './index';

export const essRoutes = ({ ProtectedRoute, AppLayout }) => (
  <>
    <Route path="/ess/schedule" element={<ProtectedRoute><AppLayout><MySchedulePage /></AppLayout></ProtectedRoute>} />
    <Route path="/ess/payroll" element={<ProtectedRoute><AppLayout><MyPayrollPage /></AppLayout></ProtectedRoute>} />
  </>
);
