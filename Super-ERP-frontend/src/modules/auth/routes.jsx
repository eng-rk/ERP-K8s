import { Route } from 'react-router-dom';
import LoginPage from '../../pages/LoginPage';

export const authRoutes = ({ PublicRoute }) => [
  <Route key="login" path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />,
];
