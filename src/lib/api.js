import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401, refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get('refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });
          const { access } = res.data;
          Cookies.set('access_token', access, { expires: 1 });
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        } catch {
          // Refresh failed — redirect to login
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      } else {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// ── Auth API ──
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  verifyEmail: (data) => api.post('/auth/verify-email/', data),
  verifyPhone: (data) => api.post('/auth/verify-phone/', data),
  forgotPassword: (data) => api.post('/auth/forgot-password/', data),
  resetPassword: (data) => api.post('/auth/reset-password/', data),
  profile: () => api.get('/auth/profile/'),
};

// ── Shipments API ──
export const shipmentsAPI = {
  list: (params) => api.get('/shipments/', { params }),
  create: (data) => api.post('/shipments/', data),
  detail: (id) => api.get(`/shipments/${id}/`),
  cancel: (id) => api.post(`/shipments/${id}/cancel/`),
  track: (id) => api.get(`/shipments/${id}/track/`),
};

// ── Wallet API ──
export const walletAPI = {
  balance: () => api.get('/wallet/balance/'),
  recharge: (data) => api.post('/wallet/recharge/', data),
  transactions: (params) => api.get('/wallet/transactions/', { params }),
};

// ── Rates API ──
export const ratesAPI = {
  calculate: (data) => api.post('/rates/calculate/', data),
  serviceability: (params) => api.get('/rates/serviceability/', { params }),
};

// ── Dashboard API ──
export const dashboardAPI = {
  overview: (params) => api.get('/dashboard/overview/', { params }),
};

export default api;
