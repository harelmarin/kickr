import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

// Configuration de base pour Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Variable pour éviter les boucles infinies lors du refresh
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

// Intercepteur de requête - Ajoute automatiquement le token JWT
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse - Gère le refresh automatique du token
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si erreur 401 et que ce n'est pas déjà une tentative de retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Si c'est une route d'auth, on ne tente pas de refresh
      if (originalRequest.url?.includes('/auth/')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Si un refresh est déjà en cours, on met la requête en attente
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

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // Pas de refresh token, on déconnecte l'utilisateur
        localStorage.clear();
        toast.error('Session expired. Please log in again.');
        window.location.href = '/';
        return Promise.reject(error);
      }

      try {
        // Tentative de refresh du token
        const response = await axios.post('http://localhost:8080/api/auth/refresh', {
          refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Mise à jour des tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Mise à jour du header de la requête originale
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);

        // Le refresh a échoué, on déconnecte l'utilisateur
        localStorage.clear();
        toast.error('Session expired. Please log in again.');
        window.location.href = '/';

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Gestion globale des autres erreurs
    if (error.response) {
      console.error('Erreur serveur:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Pas de réponse du serveur:', error.request);
    } else {
      console.error('Erreur de configuration:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
