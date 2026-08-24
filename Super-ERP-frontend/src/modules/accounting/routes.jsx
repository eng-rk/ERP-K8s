import { Route } from 'react-router-dom';
import AccountingPage from './AccountingPage';

const accountingRoles = [
  'Super CRM Administrator',
  'System Architect',
  'Executive User',
  'Business Analyst',
  'Finance Manager',
  'Accountant',
  'Accounting Manager',
];

export const accountingRoutes = ({ ProtectedRoute, AppLayout }) => (
  <Route path="/accounting" element={<ProtectedRoute allowedRoles={accountingRoles}><AppLayout><AccountingPage /></AppLayout></ProtectedRoute>} />
);
