import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('crmUser')) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      
      // Ensure user object has normalized permission fields
      const userPayload = {
        ...data,
        roles: data.roles || [],
        customPermissionClaims: data.customPermissionClaims || [],
        effectivePermissions: data.effectivePermissions || {},
        permissionVersion: data.permissionVersion || 1
      };

      localStorage.setItem('crmUser', JSON.stringify(userPayload));
      setUser(userPayload);
      return userPayload;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('crmUser');
    setUser(null);
  };

  const updateCurrentUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    localStorage.setItem('crmUser', JSON.stringify(merged));
    setUser(merged);
  };

  const setBusinessModel = (businessModel, onboarded = true) => {
    updateCurrentUser({ businessModel, onboarded });
  };

  /**
   * Helper: Check if current user possesses a specific permission claim
   */
  const hasPermission = (permissionId) => {
    if (!user) return false;

    // Super Admin & System Architect Root Bypass
    if (user.role === 'Super CRM Administrator' || user.role === 'System Architect') {
      return true;
    }

    // Check effectivePermissions object map if present
    if (user.effectivePermissions && user.effectivePermissions[permissionId]) {
      const claim = user.effectivePermissions[permissionId];
      return claim.granted === true && !claim.isExplicitDeny;
    }

    // Fallback: Check boolean flags on legacy permissions object
    if (user.permissions) {
      if (permissionId === 'crm.leads.view' && user.permissions.canViewLeads) return true;
      if (permissionId === 'crm.leads.edit' && user.permissions.canEditLeads) return true;
      if (permissionId === 'crm.leads.delete' && user.permissions.canDeleteLeads) return true;
      if (permissionId === 'tickets.desk.view' && user.permissions.canViewTickets) return true;
      if (permissionId === 'tickets.desk.edit' && user.permissions.canEditTickets) return true;
      if (permissionId === 'tickets.desk.delete' && user.permissions.canDeleteTickets) return true;
      if (permissionId === 'marketing.campaigns.view' && user.permissions.canManageCampaigns) return true;
      if (permissionId === 'iam.users.view' && user.permissions.canManageUsers) return true;
    }

    return false;
  };

  /**
   * Helper: Check if user has AT LEAST ONE of the listed permissions
   */
  const hasAnyPermission = (permissionIds = []) => {
    if (!permissionIds || permissionIds.length === 0) return true;
    return permissionIds.some(permId => hasPermission(permId));
  };

  /**
   * Helper: Check if user has ALL of the listed permissions
   */
  const hasAllPermissions = (permissionIds = []) => {
    if (!permissionIds || permissionIds.length === 0) return true;
    return permissionIds.every(permId => hasPermission(permId));
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      logout,
      updateCurrentUser,
      setBusinessModel,
      clearError,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
