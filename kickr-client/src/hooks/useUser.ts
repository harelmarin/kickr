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

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: userService.getAll,
        staleTime: 5 * 60 * 1000,
    });
};
