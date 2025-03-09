import { useMutation } from '@tanstack/react-query';
import { ReserveCredentials, reserveProperty } from '../services/apiReserve';

export const useReserving = () => {

  return useMutation({
    mutationFn: (credentials: ReserveCredentials) => reserveProperty(credentials),
    onSuccess: async (response) => {
      try {
        const { data } = response;
        return data;
        } catch (error) {
        console.error('Error :Reserving', error);
      }
    },
    onError: (error: Error) => {
      console.error('Reserving porperty error:', error.message);
    },
  });
};