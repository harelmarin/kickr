import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

// Configuration de base pour Axios
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8080/api'),
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable to avoid infinite loops during token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

// Request interceptor - Automatically adds JWT token (Not needed for cookies, but good for custom headers if any)
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handles automatic token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 error and not already a retry attempt
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If it's an auth route, don't attempt refresh
      if (originalRequest.url?.includes('/auth/')) {
        return Promise.reject(error);
      }


      if (isRefreshing) {
        // If a refresh is already in progress, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token via cookie
        const refreshUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:8080/api');

        // Ensure withCredentials is true for the refresh request too
        await axios.post(`${refreshUrl}/auth/refresh`, {}, { withCredentials: true });

        // Queue processing
        processQueue(null);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);

        // Refresh failed: session definitively expired.
        // localStorage.clear(); // Only clear user data if needed, but not tokens since they are cookies
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Global error handling for other errors
    if (error.response) {
      if (error.response.status === 403) {
        toast.error('Access denied. You do not have the necessary permissions.');
      }
      console.error('Server error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No server response:', error.request);
    } else {
      console.error('Configuration error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
