import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Default to backend port 5000 (matching server configuration) with automatic port 5001 failover
const DEFAULT_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: DEFAULT_API_BASE_URL,
  timeout: 30000,
});

// Request interceptor to attach JWT token if present
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('overturn_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor with dual-port failover (5000 <-> 5001) and consistent error extraction
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ error?: string; message?: string }>) => {
    const originalRequest = error.config as (InternalAxiosRequestConfig & { _retriedPort?: boolean }) | undefined;

    // If network error (backend unreachable / port discrepancy) and not yet retried
    if (!error.response && originalRequest && !originalRequest._retriedPort) {
      originalRequest._retriedPort = true;
      const currentBase = originalRequest.baseURL || apiClient.defaults.baseURL || '';

      let alternateBase = '';
      if (currentBase.includes(':5000')) {
        alternateBase = currentBase.replace(':5000', ':5001');
      } else if (currentBase.includes(':5001')) {
        alternateBase = currentBase.replace(':5001', ':5000');
      }

      if (alternateBase) {
        try {
          originalRequest.baseURL = alternateBase;
          const retryRes = await axios(originalRequest);
          // Persist working base URL for subsequent requests
          apiClient.defaults.baseURL = alternateBase;
          return retryRes;
        } catch {
          // If alternate port also fails, continue to formatted error below
        }
      }
    }

    const errorMsg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED' ? 'Request timed out' : error.message) ||
      'Network communication error. Please ensure the backend server is running on port 5000 or 5001.';
    
    return Promise.reject(new Error(errorMsg));
  }
);

export default apiClient;
