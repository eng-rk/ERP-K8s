import { Route } from 'react-router-dom';
import { PaymentPage } from './index';

export const paymentRoutes = () => (
  <Route path="/pay/:token" element={<PaymentPage />} />
);
