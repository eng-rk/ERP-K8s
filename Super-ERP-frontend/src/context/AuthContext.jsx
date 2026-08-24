import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser, updateCurrentUser, hasPermission } from '../store/slices/authSlice';

// Compatibility adapter for legacy components during the Context -> Redux migration.
// No React Context provider is created; all auth state comes from Redux.
export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const signOut = useCallback(() => dispatch(logout()), [dispatch]);
  const updateUser = useCallback((updates) => dispatch(updateCurrentUser(updates)), [dispatch]);
  const can = useCallback((permissionId) => hasPermission(user, permissionId), [user]);

  return {
    user,
    isAuthenticated: Boolean(user),
    loading: false,
    logout: signOut,
    signOut,
    updateUser,
    hasPermission: can,
    can,
  };
}

export default useAuth;
