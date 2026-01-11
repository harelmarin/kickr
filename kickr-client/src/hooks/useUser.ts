import { useQuery } from '@tanstack/react-query';
import { userService } from '../services/userService';

export const useUser = (id?: string) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => id ? userService.getById(id) : Promise.reject('No ID provided'),
        enabled: !!id,
        staleTime: 60 * 1000,
    });
};

export const useUsers = (page: number = 0, size: number = 20) => {
    return useQuery({
        queryKey: ['users', page, size],
        queryFn: () => userService.getAll(page, size),
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
};
