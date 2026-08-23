import { Route } from 'react-router-dom';
import {
  LeadsPage,
  LeadDistributionPage,
  LeadDetailsPage,
  OfferDetailPage,
  BookingLookupPage,
  TicketsPage,
  AnalyticsPage,
  SalesKanbanPage,
  ExecutiveDashboardPage,
  CampaignsPage,
  CampaignFormPage,
  EmailsPage,
  SentEmailsPage,
} from './index';

const analyticsRoles = [
  'Super CRM Administrator',
  'Executive User',
  'Business Analyst',
  'System Architect',
];

export const crmRoutes = ({ ProtectedRoute, AppLayout }) => (
  <>
    <Route path="/leads" element={<ProtectedRoute><AppLayout><LeadsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/leads/distribution" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'System Architect', 'Sales Manager']}><AppLayout><LeadDistributionPage /></AppLayout></ProtectedRoute>} />
    <Route path="/leads/:id" element={<ProtectedRoute><AppLayout><LeadDetailsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/offers/:id" element={<ProtectedRoute><AppLayout><OfferDetailPage /></AppLayout></ProtectedRoute>} />
    <Route path="/bookings" element={<ProtectedRoute allowedRoles={['Sales Agent', 'Sales Manager', 'Customer Support Agent', 'Customer Support Manager', 'CRM Developer', 'CRM Consultant', 'System Architect', 'Super CRM Administrator']}><AppLayout><BookingLookupPage /></AppLayout></ProtectedRoute>} />
    <Route path="/tickets" element={<ProtectedRoute><AppLayout><TicketsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/analytics" element={<ProtectedRoute allowedRoles={analyticsRoles}><AppLayout><AnalyticsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/kanban" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'Sales Agent', 'Sales Manager', 'Executive User', 'System Architect', 'Business Analyst']}><AppLayout><SalesKanbanPage /></AppLayout></ProtectedRoute>} />
    <Route path="/executive" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'Executive User', 'Business Analyst', 'System Architect']}><AppLayout><ExecutiveDashboardPage /></AppLayout></ProtectedRoute>} />
    <Route path="/campaigns" element={<ProtectedRoute allowedRoles={['Super CRM Administrator', 'Marketing Specialist', 'Marketing Manager', 'Executive User', 'Business Analyst', 'System Architect']}><AppLayout><CampaignsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/emails" element={<ProtectedRoute><AppLayout><EmailsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/emails/sent" element={<ProtectedRoute><AppLayout><SentEmailsPage /></AppLayout></ProtectedRoute>} />
    <Route path="/form/:slug" element={<CampaignFormPage />} />
  </>
);
