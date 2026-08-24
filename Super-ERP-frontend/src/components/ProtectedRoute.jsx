import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, hasPermission, selectHasAnyPermission, selectHasAllPermissions } from '../store/slices/authSlice';

export const ProtectedRoute = ({ children, allowedRoles, requiredPermissions, permissionMode = 'ALL' }) => {
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (allowedRoles?.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermissions) {
    const perms = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    const authorized = permissionMode === 'ANY'
      ? perms.some((id) => hasPermission(user, id))
      : perms.every((id) => hasPermission(user, id));
    if (perms.length > 0 && !authorized) return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const user = useSelector(selectUser);
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};
