import axios from 'axios';

// Create base Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ==========================================
// REQUEST INTERCEPTOR: Inject JWT Bearer Token
// ==========================================
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('byk_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR: Global Error & 401 Handler
// ==========================================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 401 Unauthorized: Session Expired or Invalid Token
      if (error.response.status === 401) {
        if (typeof window !== 'undefined') {
          // If token was invalid, clear local storage
          const currentPath = window.location.pathname;
          if (currentPath.startsWith('/dashboard') || currentPath.startsWith('/profile')) {
            localStorage.removeItem('byk_token');
            localStorage.removeItem('byk_user');
            // Allow user to redirect or re-login
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
