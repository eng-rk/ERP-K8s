import { useDispatch, useSelector } from 'react-redux';
import {
  clearAuthError,
  hasPermission,
  login,
  logout,
  selectAuthError,
  selectAuthLoading,
  selectUser,
  setBusinessModel,
  updateCurrentUser,
} from './slices/authSlice';
import {
  changeAux,
  clearAuxError,
  fetchAuxConfig,
  fetchMyAuxPlan,
  fetchTeamAux,
  selectActiveAuxes,
  selectAux,
  selectAuxColors,
  selectAuxCounts,
} from './slices/auxSlice';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  return {
    user,
    loading,
    error,
    login: (email, password) => dispatch(login({ email, password })).unwrap(),
    logout: () => dispatch(logout()),
    updateCurrentUser: (data) => dispatch(updateCurrentUser(data)),
    setBusinessModel: (businessModel, onboarded = true) =>
      dispatch(setBusinessModel({ businessModel, onboarded })),
    clearError: () => dispatch(clearAuthError()),
    hasPermission: (permissionId) => hasPermission(user, permissionId),
    hasAnyPermission: (permissionIds = []) =>
      !permissionIds.length || permissionIds.some((id) => hasPermission(user, id)),
    hasAllPermissions: (permissionIds = []) =>
      !permissionIds.length || permissionIds.every((id) => hasPermission(user, id)),
  };
};

export const useAux = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const aux = useAppSelector(selectAux);
  const counts = useAppSelector(selectAuxCounts);
  const activeAuxes = useAppSelector(selectActiveAuxes);
  const auxColors = useAppSelector(selectAuxColors);

  return {
    currentAux: aux.currentAux || user?.auxStatus || 'Logged out',
    statusSince: aux.statusSince,
    todayStats: aux.todayStats,
    myPlan: aux.myPlan,
    teamAux: aux.teamAux,
    counts,
    auxConfig: aux.auxConfig,
    activeAuxes,
    auxColors,
    fetchAuxConfig: () => dispatch(fetchAuxConfig()),
    changeAux: (status) => dispatch(changeAux(status)).unwrap(),
    fetchTeam: () => dispatch(fetchTeamAux()),
    fetchMyPlan: () => dispatch(fetchMyAuxPlan()),
    clearError: () => dispatch(clearAuxError()),
  };
};
