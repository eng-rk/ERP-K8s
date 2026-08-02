import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const AuxContext = createContext(null);

export const AUX_COLORS = {
  Live: '#10B981',
  Training: '#F59E0B',
  Break: '#6366F1',
  Coaching: '#3B82F6',
  'Logged out': '#EF4444',
};

export const AUX_ICONS = {
  Live: '🟢',
  Training: '🟡',
  Break: '🟣',
  Coaching: '🔵',
  'Logged out': '🔴',
};

const DEFAULT_AUX_LIST = [
  { name: 'Live', color: '#10B981', order: 1, active: true },
  { name: 'Training', color: '#F59E0B', order: 2, active: true },
  { name: 'Coaching', color: '#3B82F6', order: 3, active: true },
  { name: 'Break', color: '#6366F1', order: 4, active: true },
  { name: 'Logged out', color: '#EF4444', order: 5, active: true },
];

export const AuxProvider = ({ children }) => {
  const { user, updateCurrentUser } = useAuth();
  const [teamAux, setTeamAux] = useState([]);
  const [currentAux, setCurrentAux] = useState(user?.auxStatus || 'Logged out');
  const [statusSince, setStatusSince] = useState(Date.now());
  const [todayStats, setTodayStats] = useState({ Live: 0, Break: 0, Training: 0, 'Logged out': 0 });
  const [myPlan, setMyPlan] = useState(null);
  const [auxConfig, setAuxConfig] = useState(DEFAULT_AUX_LIST);
  const intervalRef = useRef(null);

  const fetchAuxConfig = useCallback(async () => {
    try {
      const { data } = await API.get('/settings/aux');
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setAuxConfig(data.data);
      }
    } catch {
      // Fallback to existing defaults if API fails
    }
  }, []);

  const fetchTeam = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await API.get('/hrm/aux/team');
      const team = data.data || [];
      setTeamAux(team);
      const me = team.find(u => u._id === user._id);
      if (me) {
        setCurrentAux(me.auxStatus);
        if (me.todayStats) setTodayStats(me.todayStats);
        if (me.activeStatusSince) {
          setStatusSince(new Date(me.activeStatusSince).getTime());
        }
      }
    } catch { /* silent */ }
  }, [user]);

  const fetchMyPlan = useCallback(async () => {
    if (!user) return;
    try {
      const month = new Date().toISOString().slice(0, 7);
      const { data } = await API.get(`/hrm/aux/schedule?month=${month}&userId=${user._id}`);
      const sched = (data.data || [])[0];
      if (sched) setMyPlan(sched.monthlyPlan);
    } catch { /* silent */ }
  }, [user]);

  useEffect(() => {
    fetchAuxConfig();
    fetchTeam();
    fetchMyPlan();
    intervalRef.current = setInterval(fetchTeam, 30000);
    return () => clearInterval(intervalRef.current);
  }, [fetchAuxConfig, fetchTeam, fetchMyPlan]);

  const changeAux = async (status) => {
    try {
      const { data } = await API.put('/hrm/aux', { auxStatus: status });
      setCurrentAux(status);
      const serverSince = data.data?.statusSince;
      setStatusSince(serverSince ? new Date(serverSince).getTime() : Date.now());
      updateCurrentUser({ auxStatus: status });
      fetchTeam();
    } catch { /* silent */ }
  };

  const activeAuxes = (auxConfig || DEFAULT_AUX_LIST)
    .filter(a => a.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const auxColors = { ...AUX_COLORS };
  (auxConfig || []).forEach(a => {
    if (a.name && a.color) auxColors[a.name] = a.color;
  });

  const counts = {};
  activeAuxes.forEach(a => {
    counts[a.name] = teamAux.filter(u => u.auxStatus === a.name).length;
  });

  return (
    <AuxContext.Provider value={{
      currentAux,
      statusSince,
      todayStats,
      myPlan,
      teamAux,
      counts,
      auxConfig,
      activeAuxes,
      auxColors,
      fetchAuxConfig,
      changeAux,
      fetchTeam
    }}>
      {children}
    </AuxContext.Provider>
  );
};

export const useAux = () => useContext(AuxContext);
