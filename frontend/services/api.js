import axios from 'axios';

// Normalize Base URL so it always points to the /api endpoint
const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const trimmed = envUrl.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

/**
 * Retrieve stored JWT authentication token from localStorage, sessionStorage, or cookies
 */
export const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  try {
    const token =
      localStorage.getItem('byk_token') ||
      sessionStorage.getItem('byk_token') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('token');
    if (token) return token;

    // Check if byk_user in storage contains a token property
    const userStr = sessionStorage.getItem('byk_user') || localStorage.getItem('byk_user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        if (parsed?.token) return parsed.token;
      } catch {}
    }

    // Check document.cookie as fallback
    if (typeof document !== 'undefined' && document.cookie) {
      const match = document.cookie.match(/(?:^|;\s*)(?:byk_token|token)=([^;]+)/);
      if (match) return decodeURIComponent(match[1]);
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Retrieve stored Refresh Token from localStorage or sessionStorage
 */
export const getStoredRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  try {
    return (
      localStorage.getItem('byk_refresh_token') ||
      sessionStorage.getItem('byk_refresh_token') ||
      localStorage.getItem('refreshToken') ||
      sessionStorage.getItem('refreshToken') ||
      null
    );
  } catch {
    return null;
  }
};

/**
 * Save auth tokens to local/session storage
 */
export const setAuthTokens = (accessToken, refreshToken) => {
  if (typeof window === 'undefined') return;
  try {
    if (accessToken) {
      localStorage.setItem('byk_token', accessToken);
      sessionStorage.setItem('byk_token', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('byk_refresh_token', refreshToken);
      sessionStorage.setItem('byk_refresh_token', refreshToken);
    }
  } catch (e) {
    console.warn('Storage set tokens error:', e);
  }
};

/**
 * Clear all auth tokens from storage
 */
export const clearAuthTokens = () => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem('byk_user');
    localStorage.removeItem('byk_user');
    sessionStorage.removeItem('byk_token');
    localStorage.removeItem('byk_token');
    sessionStorage.removeItem('byk_refresh_token');
    localStorage.removeItem('byk_refresh_token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
  } catch (e) {
    console.warn('Storage clear tokens error:', e);
  }
};

// Create base Axios instance with credentials enabled for HTTP-only cookies
const api = axios.create({
  baseURL: getApiBaseUrl(),
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
    config.withCredentials = true;

    // Prevent accidental double /api/ prefix if baseURL already contains /api
    if (config.url && config.url.startsWith('/api/') && config.baseURL?.endsWith('/api')) {
      config.url = config.url.replace(/^\/api/, '');
    }

    if (typeof window !== 'undefined') {
      const token = getStoredToken();
      if (token && !config.headers['Authorization'] && !config.headers['authorization']) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      // Automatically pass admin secret key if saved in storage or environment
      const adminSecret =
        localStorage.getItem('iyf_admin_secret_key') ||
        sessionStorage.getItem('iyf_admin_secret_key') ||
        process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY;
      if (adminSecret && !config.headers['x-admin-secret-key'] && !config.headers['X-Admin-Secret-Key']) {
        config.headers['x-admin-secret-key'] = adminSecret;
      }
    }

    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Flag to avoid multiple concurrent refresh requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ==========================================
// RESPONSE INTERCEPTOR: Dynamic 401 / Refresh Token Handler
// ==========================================
api.interceptors.response.use(
  (response) => {
    // Automatically capture and persist tokens if returned by backend API
    if (typeof window !== 'undefined') {
      const { token, accessToken, refreshToken } = response?.data || {};
      const activeAccess = accessToken || token;
      if (activeAccess || refreshToken) {
        setAuthTokens(activeAccess, refreshToken);
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 received, attempt refresh if we have a refresh token and haven't retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const isAuthEndpoint =
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/register');

      const refreshToken = getStoredRefreshToken();

      if (!isAuthEndpoint && refreshToken) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshRes = await axios.post(
            `${getApiBaseUrl()}/auth/refresh`,
            { refreshToken },
            { withCredentials: true }
          );

          const newAccess = refreshRes.data?.accessToken || refreshRes.data?.token;
          const newRefresh = refreshRes.data?.refreshToken;

          if (newAccess) {
            setAuthTokens(newAccess, newRefresh);
            processQueue(null, newAccess);
            originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
            return api(originalRequest);
          }
        } catch (refreshErr) {
          processQueue(refreshErr, null);
          clearAuthTokens();

          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('byk_auth_unauthorized'));
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/dashboard') || currentPath.startsWith('/profile')) {
              window.location.href = '/login?expired=true';
            }
          }
          return Promise.reject(refreshErr);
        } finally {
          isRefreshing = false;
        }
      } else if (!isAuthEndpoint) {
        // No refresh token available, clear session
        clearAuthTokens();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('byk_auth_unauthorized'));
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
