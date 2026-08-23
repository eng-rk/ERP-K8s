// Backward-compatible import surface during the Redux migration.
// AUX state and async operations now live in Redux Toolkit.
export { useAux } from '../store/hooks';
export { AUX_COLORS, AUX_ICONS, DEFAULT_AUX_LIST } from '../store/slices/auxSlice';

export const AuxProvider = ({ children }) => children;
