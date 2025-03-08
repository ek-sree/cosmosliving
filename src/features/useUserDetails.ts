import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../lib/constants';
import { getUserDetails } from '../services/apiUserDetails';

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  property: any[];
  profileImg: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Bookings {
  completed: any[];
  hosting: any[];
  fail: any[];
  pending: any[];
  ConfirmedBookings: any[];
}

interface UserDetailsData {
  user: User;
  watchlist: any[];
  bookings: Bookings;
}

interface ApiResponse {
  statusCode: number;
  data: UserDetailsData;
  message: string;
  _statusCode: number;
}

export const useUserDetails = () => {
  return useQuery<ApiResponse, Error>({
    queryKey: [QUERY_KEYS.USERDETAIL],
    queryFn: () => getUserDetails(),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};