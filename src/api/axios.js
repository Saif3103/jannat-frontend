import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 60000,
});

export { BASE_URL };

// Request interceptor – attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jannat_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jannat_token');
      localStorage.removeItem('jannat_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
