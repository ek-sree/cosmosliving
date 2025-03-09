import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../lib/constants';
import { getBookings } from '../services/apiBookings';


export const useBookings = (id:string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOOKINGS,id],
    queryFn: () => getBookings(id),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};