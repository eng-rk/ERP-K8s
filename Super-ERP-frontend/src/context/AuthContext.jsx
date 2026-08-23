// Backward-compatible import surface during the Redux migration.
// State and business logic now live in Redux Toolkit; no React Context state is kept here.
export { useAuth } from '../store/hooks';

export const AuthProvider = ({ children }) => children;
