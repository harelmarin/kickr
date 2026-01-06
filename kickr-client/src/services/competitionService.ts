import axiosInstance from './axios';
import type { Competition } from '../types/Competition';

export const competitionService = {
  getAll: async (): Promise<Competition[]> => {
    try {
      const response = await axiosInstance.get('/competitions');
      if (!Array.isArray(response.data)) {
        console.error('Réponse inattendue du backend :', response.data);
        return [];
      }
      return response.data;
    } catch (err) {
      console.error('Erreur lors de la récupération des compétitions :', err);
      return [];
    }
  },

  getById: async (id: string): Promise<Competition> => {
    try {
      const response = await axiosInstance.get(`/competitions/${id}`);
      return response.data;
    } catch (err) {
      console.error(`Erreur lors de la récupération de la compétition ${id} :`, err);
      throw err;
    }
  },
};
