import axiosInstance from './axios';
import type { UserMatchResponseApi } from '../types/usermatchresponseapi';

export const fetchPreviewFeed = async (
  userId: string,
  page = 0,
  size = 10,
): Promise<UserMatchResponseApi[]> => {
  try {
    const response = await axiosInstance.get(
      `/feed/preview/${userId}`,
      {
        params: { page, size },
      },
    );

    // Backend already returns an array
    if (!Array.isArray(response.data)) {
      console.error('Unexpected response from backend:', response.data);
      return [];
    }

    return response.data; // ✅ pas besoin de mapper
  } catch (err) {
    console.error('Erreur lors du fetch du feed preview :', err);
    return [];
  }
};

export const fetchGlobalFeed = async (limit = 20): Promise<UserMatchResponseApi[]> => {
  try {
    const response = await axiosInstance.get('/feed/global', {
      params: { limit },
    });
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error('Erreur lors du fetch du feed global :', err);
    return [];
  }
};
