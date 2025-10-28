import axios from 'axios';
import type { Competition } from '../types/Competition';


const API_BASE = 'http://localhost:8080/api/competitions';

export const competitionService = {
  getAll: async (): Promise<Competition[]> => {
    try {
      const response = await axios.get(API_BASE);
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
      const response = await axios.get(`${API_BASE}/${id}`);
      return response.data;
    } catch (err) {
      console.error(`Erreur lors de la récupération de la compétition ${id} :`, err);
      throw err;
    }
  },
};
