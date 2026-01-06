import axiosInstance from './axios';
import type { UserMatchResponseApi } from '../types/UserMatchResponseApi';

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

    // Ton backend renvoie déjà un tableau
    if (!Array.isArray(response.data)) {
      console.error('Réponse inattendue du backend :', response.data);
      return [];
    }

    return response.data; // ✅ pas besoin de mapper
  } catch (err) {
    console.error('Erreur lors du fetch du feed preview :', err);
    return [];
  }
};
