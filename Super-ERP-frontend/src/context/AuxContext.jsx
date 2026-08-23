import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAuxConfig, fetchMyAuxPlan, fetchTeamAux } from '../store/slices/auxSlice';

// Backward-compatible import surface during the Redux migration.
// AUX state and async operations now live in Redux Toolkit.
export { useAux } from '../store/hooks';
export { AUX_COLORS, AUX_ICONS, DEFAULT_AUX_LIST } from '../store/slices/auxSlice';

export const AuxProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuxConfig());
    dispatch(fetchTeamAux());
    dispatch(fetchMyAuxPlan());
    const interval = setInterval(() => dispatch(fetchTeamAux()), 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return children;
};
