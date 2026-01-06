import axiosInstance from './axios';
import type { Team } from '../types/Team';

export const teamService = {
  getAll: async (): Promise<Team[]> => {
    try {
      const response = await axiosInstance.get('/teams');
      if (!Array.isArray(response.data)) {
        console.error('Réponse inattendue du backend :', response.data);
        return [];
      }
      return response.data;
    } catch (err) {
      console.error('Erreur lors de la récupération des équipes :', err);
      return [];
    }
  },

  getById: async (id: string): Promise<Team> => {
    try {
      const response = await axiosInstance.get(`/teams/${id}`);
      return response.data;
    } catch (err) {
      console.error(`Erreur lors de la récupération de l'équipe ${id} :`, err);
      throw err;
    }
  },

  getByCompetitionId: async (competitionId: string): Promise<Team[]> => {
    try {
      const response = await axiosInstance.get(`/teams/competition/${competitionId}`);
      if (!Array.isArray(response.data)) {
        console.error('Réponse inattendue du backend :', response.data);
        return [];
      }
      return response.data;
    } catch (err) {
      console.error(`Erreur lors de la récupération des équipes de la compétition ${competitionId} :`, err);
      return [];
    }
  },
};
