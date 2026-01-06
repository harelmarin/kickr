import axios from 'axios';

// Configuration de base pour Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête (pour ajouter des tokens, etc.)
axiosInstance.interceptors.request.use(
  (config) => {
    // Vous pouvez ajouter un token d'authentification ici
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse (pour gérer les erreurs globalement)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Gestion globale des erreurs
    if (error.response) {
      // Erreur de réponse du serveur
      console.error('Erreur serveur:', error.response.status, error.response.data);
      
      // Vous pouvez gérer des cas spécifiques ici
      if (error.response.status === 401) {
        // Redirection vers login, par exemple
        console.error('Non autorisé - redirection nécessaire');
      }
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      console.error('Pas de réponse du serveur:', error.request);
    } else {
      // Erreur lors de la configuration de la requête
      console.error('Erreur de configuration:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
