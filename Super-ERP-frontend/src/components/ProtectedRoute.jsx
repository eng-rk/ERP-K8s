import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route Protection Guard
 * 
 * Supports both legacy role-based checks and modern atomic permission checks:
 * 
 * Legacy usage:
 * <ProtectedRoute allowedRoles={['Super CRM Administrator', 'Sales Manager']}>
 * 
 * Modern permission usage:
 * <ProtectedRoute requiredPermissions={['payroll.engine.approve_run']}>
 * <ProtectedRoute requiredPermissions={['crm.leads.view', 'crm.offers.view']} permissionMode="ANY">
 */
export const ProtectedRoute = ({ children, allowedRoles, requiredPermissions, permissionMode = 'ALL' }) => {
  const { user, hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 1. Legacy Allowed Roles Check
  if (allowedRoles && Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 2. Modern Required Permissions Check
  if (requiredPermissions) {
    const perms = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    if (perms.length > 0) {
      const isAuthorized = permissionMode === 'ANY'
        ? hasAnyPermission(perms)
        : hasAllPermissions(perms);

      if (!isAuthorized) {
        return <Navigate to="/unauthorized" replace />;
      }
    }
  }

  return children;
};

// Redirects already-authenticated users away from /login
export const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};
