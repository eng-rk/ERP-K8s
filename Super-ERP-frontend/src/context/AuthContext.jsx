import { createContext, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction, selectUser, selectHasPermission, selectHasAnyPermission, selectHasAllPermissions, updateCurrentUser } from '../store/slices/authSlice';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const value = useMemo(() => ({
    user,
    hasPermission: (id) => selectHasPermission({ auth: { user } }, id),
    hasAnyPermission: (ids) => selectHasAnyPermission({ auth: { user } }, ids),
    hasAllPermissions: (ids) => selectHasAllPermissions({ auth: { user } }, ids),
    logout: () => dispatch(logoutAction()),
    updateUser: (updates) => dispatch(updateCurrentUser(updates)),
  }), [dispatch, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
