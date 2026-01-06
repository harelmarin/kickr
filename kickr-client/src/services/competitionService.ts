import axiosInstance from './axios';
import type { Competition } from '../types/Competition';

export const competitionService = {
  getAll: async (): Promise<Competition[]> => {
    try {
      const response = await axiosInstance.get('/competitions');
      if (!Array.isArray(response.data)) {
        console.error('Unexpected backend response:', response.data);
        return [];
      }
      return response.data;
    } catch (err) {
      console.error('Error fetching competitions:', err);
      return [];
    }
  },

  getById: async (id: string): Promise<Competition> => {
    try {
      const response = await axiosInstance.get(`/competitions/${id}`);
      return response.data;
    } catch (err) {
      console.error(`Error fetching competition ${id}:`, err);
      throw err;
    }
  },
};
