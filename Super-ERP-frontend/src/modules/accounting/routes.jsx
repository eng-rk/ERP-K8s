import { Route } from 'react-router-dom';
import AccountingPage from './AccountingPage';

export const accountingRoutes = ({ ProtectedRoute, AppLayout }) => (
  <Route path="/accounting" element={<ProtectedRoute><AppLayout><AccountingPage /></AppLayout></ProtectedRoute>} />
);
