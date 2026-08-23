import { Route } from 'react-router-dom';
import { ProductsPage } from './index';

export const productRoutes = ({ ProtectedRoute, AppLayout }) => (
  <Route path="/products" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'System Architect', 'Sales Agent', 'Sales Manager', 'Executive User']}><AppLayout><ProductsPage /></AppLayout></ProtectedRoute>} />
);
