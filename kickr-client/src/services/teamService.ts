import axiosInstance from './axios';
import type { Team } from '../types/Team';

export const teamService = {
  getAll: async (): Promise<Team[]> => {
    try {
      const response = await axiosInstance.get('/teams');
      if (!Array.isArray(response.data)) {
        console.error('Unexpected backend response:', response.data);
        return [];
      }
      return response.data;
    } catch (err) {
      console.error('Error fetching teams:', err);
      return [];
    }
  },

  getById: async (id: string): Promise<Team> => {
    try {
      const response = await axiosInstance.get(`/teams/${id}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching team ${id}:`, err);
      throw err;
    }
  },

  getByCompetitionId: async (competitionId: string, page: number = 0, size: number = 50): Promise<{ content: Team[], totalPages: number, totalElements: number }> => {
    try {
      const response = await axiosInstance.get(`/teams/competition/${competitionId}`, {
        params: { page, size }
      });
      return {
        content: response.data.content || [],
        totalPages: response.data.totalPages || 0,
        totalElements: response.data.totalElements || 0,
      };
    } catch (err) {
      console.error(`Error fetching teams for competition ${competitionId}:`, err);
      return { content: [], totalPages: 0, totalElements: 0 };
    }
  },

  searchTeams: async (search?: string, page: number = 0, size: number = 20): Promise<{ content: Team[], totalPages: number, totalElements: number }> => {
    try {
      const params: any = { page, size };
      if (search) {
        params.search = search;
      }
      const response = await axiosInstance.get('/teams/search', { params });
      return {
        content: response.data.content || [],
        totalPages: response.data.totalPages || 0,
        totalElements: response.data.totalElements || 0,
      };
    } catch (err) {
      console.error('Erreur lors de la recherche d\'équipes :', err);
      return { content: [], totalPages: 0, totalElements: 0 };
    }
  },
};
