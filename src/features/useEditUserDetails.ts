import { useMutation } from '@tanstack/react-query';
import { editUserDetails } from '../services/apiEditUserDetails';


interface UserDetails {
  email:string;
  fullName:string;
  image:string | null;
  profileImg:string | null;
  location:string | "";
  phone:string;
}

interface ApiResponse {
  _statusCode: number;
  data: UserDetails;
  message: string;
  statusCode: number;
}

export const useEditUserDetails = () => {

  return useMutation({
    mutationFn: (credentials: UserDetails) => editUserDetails(credentials),
    onSuccess: async (response: ApiResponse) => {
      try {
        const { data } = response;
        return data;
        } catch (error) {
        console.error('Error :updating', error);
      }
    },
    onError: (error: Error) => {
      console.error('Updating details error:', error.message);
    },
  });
};