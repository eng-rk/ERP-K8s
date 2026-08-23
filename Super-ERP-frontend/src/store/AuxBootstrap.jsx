import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAuxConfig, fetchMyAuxPlan, fetchTeamAux } from './slices/auxSlice';

/** Bootstraps global AUX data without React Context. */
export default function AuxBootstrap() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuxConfig());
    dispatch(fetchTeamAux());
    dispatch(fetchMyAuxPlan());

    const interval = setInterval(() => {
      dispatch(fetchTeamAux());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
}
