import axios from 'axios';

// Create base Axios instance with credentials enabled for HTTP-only cookies
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 25000,
  withCredentials: true, // Automatically sends HTTP-Only secure cookies with every request
  headers: {
    'Content-Type': 'application/json'
  }
});

// ==========================================
// REQUEST INTERCEPTOR: Dynamic Request Handler
// ==========================================
api.interceptors.request.use(
  (config) => {
    // Note: Tokens are stored in secure HTTP-Only cookies, eliminating local storage exposure
    config.withCredentials = true;
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR: Dynamic 401 / Session Revocation Handler
// ==========================================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 401 Unauthorized: Session Expired, Revoked, or Blacklisted
      if (error.response.status === 401) {
        if (typeof window !== 'undefined') {
          // Dispatch a custom event so Context/Redux can dynamically reset state
          window.dispatchEvent(new CustomEvent('byk_auth_unauthorized'));
          sessionStorage.removeItem('byk_user');

          const currentPath = window.location.pathname;
          if (currentPath.startsWith('/dashboard') || currentPath.startsWith('/profile')) {
            window.location.href = '/login?expired=true';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
