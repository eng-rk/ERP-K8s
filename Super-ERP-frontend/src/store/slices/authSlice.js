import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../services/api';

const loadUser = () => {
  try {
    return JSON.parse(localStorage.getItem('crmUser')) || null;
  } catch {
    return null;
  }
};

const normalizeUser = (data) => ({
  ...data,
  roles: data.roles || [],
  customPermissionClaims: data.customPermissionClaims || [],
  effectivePermissions: data.effectivePermissions || {},
  permissionVersion: data.permissionVersion || 1,
});

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/auth/login', { email, password });
      const user = normalizeUser(data);
      localStorage.setItem('crmUser', JSON.stringify(user));
      return user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

const initialState = {
  user: loadUser(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      localStorage.removeItem('crmUser');
    },
    updateCurrentUser(state, action) {
      const merged = { ...(state.user || {}), ...action.payload };
      state.user = merged;
      localStorage.setItem('crmUser', JSON.stringify(merged));
    },
    setBusinessModel(state, action) {
      const { businessModel, onboarded = true } = action.payload;
      const merged = { ...(state.user || {}), businessModel, onboarded };
      state.user = merged;
      localStorage.setItem('crmUser', JSON.stringify(merged));
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });
  },
});

export const { logout, updateCurrentUser, setBusinessModel, clearAuthError } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export const hasPermission = (user, permissionId) => {
  if (!user) return false;

  if (user.role === 'Super CRM Administrator' || user.role === 'System Architect') {
    return true;
  }

  const claim = user.effectivePermissions?.[permissionId];
  if (claim) {
    return claim.granted === true && !claim.isExplicitDeny;
  }

  const permissions = user.permissions;
  if (!permissions) return false;

  const legacyMap = {
    'crm.leads.view': 'canViewLeads',
    'crm.leads.edit': 'canEditLeads',
    'crm.leads.delete': 'canDeleteLeads',
    'tickets.desk.view': 'canViewTickets',
    'tickets.desk.edit': 'canEditTickets',
    'tickets.desk.delete': 'canDeleteTickets',
    'marketing.campaigns.view': 'canManageCampaigns',
    'iam.users.view': 'canManageUsers',
  };

  return Boolean(legacyMap[permissionId] && permissions[legacyMap[permissionId]]);
};

export const selectHasPermission = (state, permissionId) =>
  hasPermission(state.auth.user, permissionId);

export const selectHasAnyPermission = (state, permissionIds = []) =>
  !permissionIds?.length || permissionIds.some((id) => hasPermission(state.auth.user, id));

export const selectHasAllPermissions = (state, permissionIds = []) =>
  !permissionIds?.length || permissionIds.every((id) => hasPermission(state.auth.user, id));
