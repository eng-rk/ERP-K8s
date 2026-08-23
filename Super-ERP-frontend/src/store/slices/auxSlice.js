import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import API from '../../services/api';
import { updateCurrentUser } from './authSlice';

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

export const DEFAULT_AUX_LIST = [
  { name: 'Live', color: '#10B981', order: 1, active: true },
  { name: 'Training', color: '#F59E0B', order: 2, active: true },
  { name: 'Coaching', color: '#3B82F6', order: 3, active: true },
  { name: 'Break', color: '#6366F1', order: 4, active: true },
  { name: 'Logged out', color: '#EF4444', order: 5, active: true },
];

export const fetchAuxConfig = createAsyncThunk(
  'aux/fetchConfig',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get('/settings/aux');
      return data.success && Array.isArray(data.data) && data.data.length ? data.data : DEFAULT_AUX_LIST;
    } catch {
      return rejectWithValue('Unable to load AUX configuration');
    }
  }
);

export const fetchTeamAux = createAsyncThunk(
  'aux/fetchTeam',
  async (_, { getState, rejectWithValue }) => {
    const user = getState().auth.user;
    if (!user) return { team: [], userId: null };
    try {
      const { data } = await API.get('/hrm/aux/team');
      return { team: data.data || [], userId: user._id };
    } catch {
      return rejectWithValue('Unable to load team AUX status');
    }
  }
);

export const fetchMyAuxPlan = createAsyncThunk(
  'aux/fetchMyPlan',
  async (_, { getState, rejectWithValue }) => {
    const user = getState().auth.user;
    if (!user) return null;
    try {
      const month = new Date().toISOString().slice(0, 7);
      const { data } = await API.get(`/hrm/aux/schedule?month=${month}&userId=${user._id}`);
      const sched = (data.data || [])[0];
      return sched?.monthlyPlan || null;
    } catch {
      return rejectWithValue('Unable to load AUX plan');
    }
  }
);

export const changeAux = createAsyncThunk(
  'aux/change',
  async (status, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await API.put('/hrm/aux', { auxStatus: status });
      const serverSince = data.data?.statusSince;
      dispatch(updateCurrentUser({ auxStatus: status }));
      return {
        status,
        statusSince: serverSince ? new Date(serverSince).getTime() : Date.now(),
      };
    } catch {
      return rejectWithValue('Unable to change AUX status');
    }
  }
);

const initialState = {
  teamAux: [],
  currentAux: 'Logged out',
  statusSince: Date.now(),
  todayStats: { Live: 0, Break: 0, Training: 0, 'Logged out': 0 },
  myPlan: null,
  auxConfig: DEFAULT_AUX_LIST,
  loading: false,
  error: null,
};

const auxSlice = createSlice({
  name: 'aux',
  initialState,
  reducers: {
    clearAuxError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuxConfig.fulfilled, (state, action) => {
        state.auxConfig = action.payload;
      })
      .addCase(fetchAuxConfig.rejected, (state, action) => {
        state.error = action.payload || null;
      })
      .addCase(fetchTeamAux.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeamAux.fulfilled, (state, action) => {
        state.loading = false;
        state.teamAux = action.payload.team;
        const me = state.teamAux.find((item) => item._id === action.payload.userId || item.userId === action.payload.userId);
        if (me) {
          state.currentAux = me.auxStatus || state.currentAux;
          if (me.todayStats) state.todayStats = me.todayStats;
          if (me.activeStatusSince) state.statusSince = new Date(me.activeStatusSince).getTime();
        }
      })
      .addCase(fetchTeamAux.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || null;
      })
      .addCase(fetchMyAuxPlan.fulfilled, (state, action) => {
        state.myPlan = action.payload;
      })
      .addCase(changeAux.fulfilled, (state, action) => {
        state.currentAux = action.payload.status;
        state.statusSince = action.payload.statusSince;
      })
      .addCase(changeAux.rejected, (state, action) => {
        state.error = action.payload || null;
      });
  },
});

export const { clearAuxError } = auxSlice.actions;
export default auxSlice.reducer;

export const selectAux = (state) => state.aux;
export const selectCurrentAux = (state) => state.aux.currentAux;
export const selectTeamAux = (state) => state.aux.teamAux;
export const selectTodayStats = (state) => state.aux.todayStats;
export const selectMyAuxPlan = (state) => state.aux.myPlan;
export const selectAuxConfig = (state) => state.aux.auxConfig;

export const selectActiveAuxes = (state) =>
  [...(state.aux.auxConfig || DEFAULT_AUX_LIST)]
    .filter((item) => item.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

export const selectAuxColors = (state) => {
  const colors = { ...AUX_COLORS };
  (state.aux.auxConfig || []).forEach((item) => {
    if (item.name && item.color) colors[item.name] = item.color;
  });
  return colors;
};

export const selectAuxCounts = (state) =>
  selectActiveAuxes(state).reduce((counts, item) => {
    counts[item.name] = state.aux.teamAux.filter((user) => user.auxStatus === item.name).length;
    return counts;
  }, {});
