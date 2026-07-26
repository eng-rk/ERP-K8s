import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
export const API_HOST = API_BASE.endsWith('/api') ? API_BASE.slice(0, -4) : API_BASE;

const API = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('crmUser'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;
